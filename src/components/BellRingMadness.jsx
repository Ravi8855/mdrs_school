import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  isSupabaseConfigured,
  fetchBellRingLeaderboard,
  addBellRingScore,
} from "../lib/supabaseClient";

const LEADERBOARD_KEY = "bell-ring-madness-leaderboard";
const LEADERBOARD_DISPLAY_TOP = 10;
const LEADERBOARD_STORAGE_MAX = 100;
const GAME_DURATION = 10;
/** Points added for each successful bell tap (flat; reaction time is not used). */
const BELL_CLICK_POINTS = 10;
const BELL_VISIBLE_MIN = 1200;
const BELL_VISIBLE_MAX = 1800;
const SPAWN_INTERVAL_MIN = 1000;
const SPAWN_INTERVAL_MAX = 2000;
const allowedStudents = [
  "Ambadas", "Arun", "Bhimu", "Bhimashankar", "Hrutik", "Jattappa", "Ningappa",
  "Mallikarjun", "Marilinga", "Ravi", "Vinod", "Viresh", "Chandrashekar", "Gollalappa",
  "Sunil", "Ambika", "Bheembai", "Chaitra", "Ganga", "Mallamma", "Ningamma",
  "Parvati", "Prema", "Roopa", "Savita", "Sharanamma", "Shweta", "Shweta H",
  "Suvarna", "Umashree", "Mahesh", "Praveen", "Suchitra", "Shreedevi", "Mamtha", "Archana",
];

/** Case-insensitive key; empty name → "anonymous" */
function playerKeyFromName(name) {
  const t = (name || "").trim();
  return t ? t.toLowerCase() : "anonymous";
}

/** One row per player; sums scores for the same name (case-insensitive); prefers longer display name */
function mergeCumulativeLeaderboard(list) {
  const map = new Map();
  for (const e of list) {
    if (!e || typeof e.score !== "number" || !Number.isFinite(e.score)) continue;
    const key = playerKeyFromName(e.name);
    const display = (e.name || "").trim() || "Anonymous";
    const cur = map.get(key);
    if (!cur) {
      map.set(key, { name: display, score: e.score });
    } else {
      map.set(key, {
        name: display.length >= cur.name.length ? display : cur.name,
        score: cur.score + e.score,
      });
    }
  }
  return Array.from(map.values()).sort((a, b) => b.score - a.score);
}

function getLeaderboard() {
  try {
    const raw = localStorage.getItem(LEADERBOARD_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return mergeCumulativeLeaderboard(Array.isArray(parsed) ? parsed : []);
  } catch {
    return [];
  }
}

function saveLeaderboard(list) {
  try {
    const full = mergeCumulativeLeaderboard(Array.isArray(list) ? list : []).slice(
      0,
      LEADERBOARD_STORAGE_MAX
    );
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(full));
  } catch {
    /* ignore quota / private mode */
  }
}

/** Add session score to existing player total, or create a new entry; returns sorted list */
function upsertLeaderboardScore(list, rawName, sessionScore) {
  const name = (rawName || "").trim() || "Anonymous";
  const add =
    typeof sessionScore === "number" && Number.isFinite(sessionScore) ? sessionScore : 0;
  const key = playerKeyFromName(name);
  const merged = mergeCumulativeLeaderboard(Array.isArray(list) ? list : []);
  const idx = merged.findIndex((e) => playerKeyFromName(e.name) === key);
  if (idx === -1) {
    return [...merged, { name, score: add }].sort((a, b) => b.score - a.score);
  }
  const next = [...merged];
  const prev = next[idx];
  next[idx] = {
    name: name.length >= (prev.name || "").length ? name : prev.name,
    score: prev.score + add,
  };
  return next.sort((a, b) => b.score - a.score);
}


function getOrdinal(n) {
  const v = n % 100;
  if (v >= 11 && v <= 13) return `${n}th`;
  switch (v % 10) {
    case 1: return `${n}st`;
    case 2: return `${n}nd`;
    case 3: return `${n}rd`;
    default: return `${n}th`;
  }
}

export default function BellRingMadness() {
  const [playerName, setPlayerName] = useState("");
  const [gameStarted, setGameStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [score, setScore] = useState(0);
  const [bellVisible, setBellVisible] = useState(false);
  const [bellHiding, setBellHiding] = useState(false);
  const [bellPosition, setBellPosition] = useState({ x: 50, y: 50 });
  const [bellShownAt, setBellShownAt] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [leaderboard, setLeaderboard] = useState(() =>
    isSupabaseConfigured() ? [] : getLeaderboard()
  );
  const [leaderboardLoading, setLeaderboardLoading] = useState(() => isSupabaseConfigured());
  const [leaderboardFetchFailed, setLeaderboardFetchFailed] = useState(false);
  const [finalRank, setFinalRank] = useState(null);
  const [nameError, setNameError] = useState("");

  const gameAreaRef = useRef(null);
  const spawnTimerRef = useRef(null);
  const hideBellTimerRef = useRef(null);
  const gameTimerRef = useRef(null);
  /** Prevents duplicate end-game save (e.g. React Strict Mode double effect). */
  const endGameHandledRef = useRef(false);
  /** Sync guard so bell taps stop as soon as time hits 0 (before gameOver state flushes). */
  const gameEndedRef = useRef(false);
  const scheduleNextBellRef = useRef(null);

  const hideBell = useCallback(() => {
    if (hideBellTimerRef.current) clearTimeout(hideBellTimerRef.current);
    hideBellTimerRef.current = null;
    setBellHiding(true);
    setTimeout(() => {
      setBellHiding(false);
      setBellVisible(false);
    }, 220);
  }, []);

  const showBell = useCallback(() => {
    // Safe zone so bell stays fully visible on all screen sizes (min 60px tap target)
    const x = 22 + Math.random() * 56;
    const y = 30 + Math.random() * 40;
    setBellPosition({ x, y });
    setBellShownAt(Date.now());
    setBellHiding(false);
    setBellVisible(true);
    const visibleTime = BELL_VISIBLE_MIN + Math.random() * (BELL_VISIBLE_MAX - BELL_VISIBLE_MIN);
    hideBellTimerRef.current = setTimeout(hideBell, visibleTime);
  }, [hideBell]);

  const scheduleNextBell = useCallback(() => {
    if (!gameStarted || gameOver) return;
    const delay = SPAWN_INTERVAL_MIN + Math.random() * (SPAWN_INTERVAL_MAX - SPAWN_INTERVAL_MIN);
    spawnTimerRef.current = setTimeout(() => {
      showBell();
      scheduleNextBellRef.current?.();
    }, delay);
  }, [gameStarted, gameOver, showBell]);

  useEffect(() => {
    scheduleNextBellRef.current = scheduleNextBell;
  }, [scheduleNextBell]);

  useEffect(() => {
    if (!isSupabaseConfigured()) return undefined;
    let cancelled = false;
    setLeaderboardLoading(true);
    (async () => {
      const { data, error } = await fetchBellRingLeaderboard();
      if (cancelled) return;
      setLeaderboardLoading(false);
      if (!error && data != null) {
        const merged = mergeCumulativeLeaderboard(data);
        setLeaderboard(merged);
        saveLeaderboard(merged);
        setLeaderboardFetchFailed(false);
      } else {
        console.warn(
          "[Bell Ring] Global leaderboard fetch failed:",
          error?.message ?? error ?? "unknown error"
        );
        setLeaderboard([]);
        setLeaderboardFetchFailed(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!gameStarted || gameOver) return;
    if (timeLeft <= 0) {
      if (endGameHandledRef.current) return;
      endGameHandledRef.current = true;
      gameEndedRef.current = true;

      const name = playerName.trim() || "Anonymous";
      const key = playerKeyFromName(name);
      const sessionScore =
        typeof score === "number" && Number.isFinite(score) ? score : 0;

      setGameOver(true);

      const finalizeBoard = (list) => {
        const merged = mergeCumulativeLeaderboard(list);
        saveLeaderboard(merged);
        setLeaderboard(merged);
        const entry = merged.find((e) => playerKeyFromName(e.name) === key);
        const totalScore = entry ? entry.score : sessionScore;
        const rank = 1 + merged.filter((e) => e.score > totalScore).length;
        setFinalRank(rank);
      };

      if (isSupabaseConfigured()) {
        (async () => {
          const { error: rpcErr } = await addBellRingScore(key, name, sessionScore);
          if (!rpcErr) {
            const { data, error: fetchErr } = await fetchBellRingLeaderboard({
              limit: LEADERBOARD_STORAGE_MAX,
            });
            if (!fetchErr && data != null) {
              finalizeBoard(data);
              return;
            }
          }
          const list = upsertLeaderboardScore(getLeaderboard(), name, sessionScore);
          finalizeBoard(list);
        })();
      } else {
        const list = upsertLeaderboardScore(getLeaderboard(), name, sessionScore);
        finalizeBoard(list);
      }
      return;
    }
    gameTimerRef.current = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => {
      if (gameTimerRef.current) clearInterval(gameTimerRef.current);
    };
  }, [gameStarted, gameOver, timeLeft, playerName, score]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;
    scheduleNextBell();
    return () => {
      if (spawnTimerRef.current) clearTimeout(spawnTimerRef.current);
      if (hideBellTimerRef.current) clearTimeout(hideBellTimerRef.current);
    };
  }, [gameStarted, gameOver, scheduleNextBell]);

  /** Returns true if a new round starts (name allowed). */
  const beginGameIfValid = useCallback(() => {
    const name = playerName.trim();
    if (!name) return false;
    const allowedLower = allowedStudents.map((s) => s.toLowerCase());
    if (!allowedLower.includes(name.toLowerCase())) {
      setNameError("Enter your original name.");
      return false;
    }
    setNameError("");
    endGameHandledRef.current = false;
    gameEndedRef.current = false;
    setGameStarted(true);
    setTimeLeft(GAME_DURATION);
    setScore(0);
    setGameOver(false);
    setBellVisible(false);
    setFinalRank(null);
    return true;
  }, [playerName]);

  const handleStartGame = () => {
    beginGameIfValid();
  };

  const refreshBellLeaderboard = useCallback(() => {
    if (!isSupabaseConfigured()) {
      setLeaderboard(getLeaderboard());
      return;
    }
    (async () => {
      const { data, error } = await fetchBellRingLeaderboard();
      if (!error && data != null) {
        const merged = mergeCumulativeLeaderboard(data);
        setLeaderboard(merged);
        saveLeaderboard(merged);
        setLeaderboardFetchFailed(false);
      } else {
        console.warn(
          "[Bell Ring] Leaderboard refresh failed:",
          error?.message ?? error ?? "unknown error"
        );
      }
    })();
  }, []);

  const exitGameOverToMenu = useCallback(() => {
    endGameHandledRef.current = false;
    gameEndedRef.current = false;
    setGameStarted(false);
    setGameOver(false);
    setTimeLeft(GAME_DURATION);
    setScore(0);
    setBellVisible(false);
    setFinalRank(null);
  }, []);

  const handleBellClick = () => {
    if (gameEndedRef.current || !bellShownAt || bellHiding) return;
    setScore((s) => s + BELL_CLICK_POINTS);
    hideBell();
  };

  /** Return to the name screen without starting a new round. */
  const handleCancelAfterGame = useCallback(() => {
    exitGameOverToMenu();
    refreshBellLeaderboard();
  }, [exitGameOverToMenu, refreshBellLeaderboard]);

  /** Same player: immediate rematch (falls back to menu if name is invalid). */
  const handlePlayAgain = useCallback(() => {
    exitGameOverToMenu();
    refreshBellLeaderboard();
    beginGameIfValid();
  }, [beginGameIfValid, exitGameOverToMenu, refreshBellLeaderboard]);

  const sortedLeaderboard = mergeCumulativeLeaderboard(leaderboard);
  const visiblePlayers = sortedLeaderboard.slice(0, LEADERBOARD_DISPLAY_TOP);
  const champion = sortedLeaderboard[0];
  const showLeaderboardPanel = isSupabaseConfigured() || leaderboard.length > 0;

  return (
    <div className="bell-madness-page">
      <style>{`
        .bell-madness-page {
          min-height: 0;
          padding: clamp(12px, 3vw, 20px) clamp(12px, 4vw, 24px) 20px;
          background: linear-gradient(180deg, #fef3c7 0%, #fde68a 30%, #fcd34d 70%, #fbbf24 100%);
          font-family: var(--font-body, 'Poppins', sans-serif);
          position: relative;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          align-items: stretch;
        }
        .bell-madness-page h2 {
          text-align: center;
          font-size: clamp(1.5rem, 4vw, 2.5rem);
          color: #92400e;
          margin: 0 0 6px 0;
          font-weight: 800;
          line-height: 1.2;
        }
        .bell-madness-tagline {
          text-align: center;
          font-size: clamp(0.95rem, 2.2vw, 1.2rem);
          color: #b45309;
          margin: 0 0 clamp(16px, 4vw, 24px) 0;
          font-weight: 600;
        }
        .bell-game-header {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: clamp(16px, 3vw, 32px);
          flex-wrap: wrap;
          margin-bottom: clamp(12px, 3vw, 16px);
        }
        .bell-stat {
          background: rgba(255,255,255,0.95);
          padding: clamp(10px, 2.5vw, 14px) clamp(16px, 3vw, 24px);
          border-radius: 14px;
          box-shadow: 0 4px 16px rgba(146, 64, 14, 0.2);
          font-weight: 700;
          font-size: clamp(1.1rem, 2.5vw, 1.25rem);
          color: #78350f;
        }
        .bell-leaderboard {
          position: absolute;
          top: clamp(12px, 2vw, 20px);
          right: clamp(12px, 2vw, 20px);
          background: rgba(255,255,255,0.98);
          border-radius: 16px;
          padding: clamp(10px, 2vw, 14px) clamp(12px, 2vw, 18px);
          box-shadow: 0 6px 24px rgba(146, 64, 14, 0.28);
          min-width: 180px;
          max-width: 260px;
        }
        .bell-leaderboard-champion {
          font-size: clamp(0.8rem, 1.8vw, 0.85rem);
          font-weight: 700;
          color: #92400e;
          margin: 0 0 10px 0;
          padding-bottom: 8px;
          border-bottom: 2px solid rgba(251, 191, 36, 0.5);
        }
        .bell-leaderboard h3 {
          font-size: clamp(0.9rem, 2vw, 0.95rem);
          color: #92400e;
          margin: 0 0 8px 0;
          font-weight: 700;
        }
        .bell-leaderboard-source {
          font-size: clamp(0.7rem, 1.5vw, 0.78rem);
          color: #a16207;
          margin: -4px 0 8px 0;
          font-weight: 600;
        }
        .bell-leaderboard-loading,
        .bell-leaderboard-empty,
        .bell-leaderboard-warn {
          font-size: clamp(0.78rem, 1.7vw, 0.88rem);
          color: #92400e;
          margin: 0 0 10px 0;
          font-weight: 600;
          line-height: 1.45;
        }
        .bell-leaderboard-warn { color: #b45309; }
        .bell-leaderboard-list {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .bell-leaderboard-row {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: clamp(5px, 1.2vw, 6px) clamp(8px, 1.5vw, 10px);
          margin-bottom: 3px;
          border-radius: 10px;
          font-size: clamp(0.8rem, 1.8vw, 0.9rem);
          font-weight: 600;
          color: #78350f;
        }
        .bell-leaderboard-row.rank-1 {
          background: linear-gradient(135deg, rgba(251, 191, 36, 0.35) 0%, rgba(245, 158, 11, 0.25) 100%);
          font-size: 1.05rem;
          padding: 8px 10px;
          font-weight: 700;
        }
        .bell-leaderboard-row.rank-2 {
          background: linear-gradient(135deg, rgba(203, 213, 225, 0.6) 0%, rgba(148, 163, 184, 0.4) 100%);
          font-size: 1rem;
          padding: 7px 10px;
          font-weight: 700;
        }
        .bell-leaderboard-row.rank-3 {
          background: linear-gradient(135deg, rgba(180, 83, 9, 0.2) 0%, rgba(146, 64, 14, 0.15) 100%);
          font-size: 0.98rem;
          padding: 7px 10px;
          font-weight: 700;
        }
        .bell-leaderboard-row.rank-rest {
          background: rgba(255, 255, 255, 0.55);
          font-weight: 600;
        }
        .bell-leaderboard-rank {
          flex-shrink: 0;
          min-width: 28px;
          font-weight: 800;
        }
        .bell-leaderboard-row.rank-1 .bell-leaderboard-rank { color: #b45309; }
        .bell-leaderboard-row.rank-2 .bell-leaderboard-rank { color: #475569; }
        .bell-leaderboard-row.rank-3 .bell-leaderboard-rank { color: #92400e; }
        .bell-leaderboard-name { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .bell-leaderboard-score { flex-shrink: 0; font-weight: 800; color: #78350f; }
        .bell-form-wrap {
          max-width: min(360px, 100%);
          margin: 0 auto clamp(20px, 4vw, 24px);
          background: rgba(255,255,255,0.95);
          padding: clamp(20px, 5vw, 28px) clamp(20px, 4vw, 24px);
          border-radius: 20px;
          box-shadow: 0 8px 32px rgba(146, 64, 14, 0.2);
        }
        .bell-form-wrap label {
          display: block;
          font-weight: 600;
          color: #78350f;
          margin-bottom: 8px;
          font-size: clamp(0.95rem, 2vw, 1rem);
        }
        .bell-form-wrap input {
          width: 100%;
          padding: clamp(12px, 3vw, 14px) 16px;
          min-height: 48px;
          border: 2px solid #fcd34d;
          border-radius: 12px;
          font-size: 16px;
          margin-bottom: 20px;
          box-sizing: border-box;
        }
        .bell-form-wrap input:focus {
          outline: none;
          border-color: #f59e0b;
        }
        .bell-start-btn {
          width: 100%;
          min-height: 52px;
          padding: clamp(14px, 3vw, 16px) 24px;
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: #fff;
          border: none;
          border-radius: 14px;
          font-size: clamp(1.05rem, 2.5vw, 1.15rem);
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .bell-start-btn:hover { transform: scale(1.02); box-shadow: 0 6px 20px rgba(217, 119, 6, 0.4); }
        .bell-start-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
        .bell-game-area {
          position: relative;
          width: 100%;
          max-width: 900px;
          margin: 0 auto;
          min-height: min(50vh, 320px);
          border-radius: clamp(16px, 4vw, 24px);
          background: rgba(255,255,255,0.4);
          border: 3px dashed rgba(146, 64, 14, 0.3);
          flex: 1 1 auto;
        }
        .bell-icon-btn {
          position: absolute;
          width: 80px;
          height: 80px;
          min-width: 60px;
          min-height: 60px;
          left: 0;
          top: 0;
          transform: translate(-50%, -50%);
          border: none;
          background: transparent;
          cursor: pointer;
          padding: 0;
          font-size: 64px;
          line-height: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: bellPop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          transition: transform 0.15s ease;
        }
        .bell-icon-btn:hover { transform: translate(-50%, -50%) scale(1.12); }
        .bell-icon-btn:active { transform: translate(-50%, -50%) scale(0.95); }
        @keyframes bellPop {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
          60% { transform: translate(-50%, -50%) scale(1.12); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }
        .bell-icon-btn.hiding {
          animation: bellFade 0.25s ease-in forwards;
        }
        @keyframes bellFade {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
        }
        .bell-game-over {
          max-width: min(400px, 100%);
          margin: clamp(20px, 4vw, 24px) auto;
          background: rgba(255,255,255,0.98);
          padding: clamp(24px, 5vw, 32px) clamp(20px, 4vw, 28px);
          border-radius: 20px;
          box-shadow: 0 12px 40px rgba(146, 64, 14, 0.3);
          text-align: center;
        }
        .bell-game-over h3 {
          font-size: clamp(1.5rem, 4vw, 1.75rem);
          color: #92400e;
          margin: 0 0 14px 0;
        }
        .bell-game-over .final-score { font-size: clamp(1.75rem, 5vw, 2rem); font-weight: 800; color: #b45309; margin: 8px 0; }
        .bell-game-over .final-rank { font-size: clamp(1rem, 2.2vw, 1.1rem); color: #78350f; margin: 0 0 22px 0; }
        .bell-game-over-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(10px, 2.5vw, 14px);
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
          margin: 0 auto;
        }
        .bell-game-over-actions button {
          min-height: 52px;
          padding: clamp(14px, 3vw, 16px) clamp(16px, 4vw, 24px);
          border-radius: 12px;
          font-size: clamp(0.95rem, 2.4vw, 1.05rem);
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s, background 0.2s;
          box-sizing: border-box;
          width: 100%;
        }
        .bell-play-again {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: #fff;
          border: none;
          box-shadow: 0 2px 8px rgba(217, 119, 6, 0.25);
        }
        .bell-play-again:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(217, 119, 6, 0.35);
        }
        .bell-play-again:active { transform: translateY(0); }
        .bell-cancel-game {
          background: rgba(255, 255, 255, 0.95);
          color: #78350f;
          border: 2px solid rgba(217, 119, 6, 0.55);
        }
        .bell-cancel-game:hover {
          transform: translateY(-1px);
          border-color: #d97706;
          background: #fffbeb;
          box-shadow: 0 4px 14px rgba(146, 64, 14, 0.12);
        }
        .bell-cancel-game:active { transform: translateY(0); }

        /* 320px - small phones */
        @media (max-width: 380px) {
          .bell-madness-page { padding: 12px 10px 24px; }
          .bell-leaderboard { min-width: 0; padding: 10px 12px; }
          .bell-leaderboard-row { font-size: 0.78rem; padding: 5px 8px; }
          .bell-stat { padding: 10px 14px; font-size: 1rem; }
          .bell-game-over { padding: clamp(20px, 5vw, 24px) clamp(14px, 4vw, 18px); }
          .bell-game-over-actions {
            grid-template-columns: 1fr;
            max-width: 280px;
            margin-left: auto;
            margin-right: auto;
          }
        }

        /* 768px - tablets: leaderboard below title, compact */
        @media (max-width: 768px) {
          .bell-game-over { max-width: min(400px, calc(100% - 8px)); }
          .bell-game-over-actions { gap: 12px; }
          .bell-leaderboard {
            position: static;
            margin: 0 auto clamp(16px, 3vw, 20px);
            max-width: min(320px, 100%);
            z-index: 2;
          }
          .bell-game-header { gap: 12px; }
          .bell-icon-btn {
            width: 72px;
            height: 72px;
            min-width: 60px;
            min-height: 60px;
            font-size: 58px;
          }
          .bell-game-area { min-height: min(45vh, 280px); }
        }

        /* 480px - large phones: 60px min tap target */
        @media (max-width: 480px) {
          .bell-icon-btn {
            width: 68px;
            height: 68px;
            min-width: 60px;
            min-height: 60px;
            font-size: 54px;
          }
          .bell-game-area { min-height: min(42vh, 260px); }
        }

        /* 1200px+ desktop: ensure leaderboard stays top-right */
        @media (min-width: 769px) {
          .bell-leaderboard { position: absolute; }
          .bell-game-over-actions {
            max-width: 360px;
            margin-left: auto;
            margin-right: auto;
          }
        }
      `}</style>

      <h2>🔔 Bell Ring Madness</h2>
      <p className="bell-madness-tagline">Ring the bell before the class ends!</p>

      {gameStarted && !gameOver && (
        <div className="bell-game-header">
          <span className="bell-stat">Score: {score}</span>
          <span className="bell-stat">Time: {timeLeft}s</span>
        </div>
      )}

      {showLeaderboardPanel && (
        <div className="bell-leaderboard">
          {champion && !leaderboardLoading && leaderboard.length > 0 && (
            <p className="bell-leaderboard-champion">
              🏆 Current Champion: {champion.name}
            </p>
          )}
          <h3>Leaderboard</h3>
          <p className="bell-leaderboard-source">
            {isSupabaseConfigured() ? "Global Leaderboard" : "Local Leaderboard"}
          </p>
          {leaderboardFetchFailed && isSupabaseConfigured() && (
            <p className="bell-leaderboard-warn" role="status">
              Could not load live scores. Check the browser console and that this deployment has
              VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY set at build time.
            </p>
          )}
          {leaderboardLoading ? (
            <p className="bell-leaderboard-loading" aria-live="polite">
              Loading scores…
            </p>
          ) : leaderboard.length === 0 ? (
            !leaderboardFetchFailed && (
              <p className="bell-leaderboard-empty">
                No scores yet. Play a round to appear on the board.
              </p>
            )
          ) : (
            <ul className="bell-leaderboard-list">
              {visiblePlayers.map((e, i) => {
                const rank = i + 1;
                const rankClass =
                  rank <= 3 ? `rank-${rank}` : rank <= LEADERBOARD_DISPLAY_TOP ? "rank-rest" : "";
                return (
                  <li
                    key={playerKeyFromName(e.name)}
                    className={`bell-leaderboard-row ${rankClass}`}
                  >
                    <span className="bell-leaderboard-rank">
                      {rank === 1 && "👑 "}
                      {getOrdinal(rank)}.
                    </span>
                    <span className="bell-leaderboard-name" title={e.name}>{e.name}</span>
                    <span className="bell-leaderboard-score">— {e.score}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}

      {!gameStarted && (
        <div className="bell-form-wrap">
          <label htmlFor="bell-player-name">Your name</label>
          <input
            id="bell-player-name"
            type="text"
            placeholder="Enter your name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleStartGame()}
          />
          {nameError && (
            <p className="bell-name-error" role="alert" style={{ color: "#ff2d2d", fontSize: "14px", marginTop: "6px", fontWeight: 500 }}>
              {nameError}
            </p>
          )}
          <button
            type="button"
            className="bell-start-btn"
            onClick={handleStartGame}
            disabled={!playerName.trim()}
          >
            Start Game
          </button>
        </div>
      )}

      {gameStarted && (
        <div
          ref={gameAreaRef}
          className="bell-game-area"
          style={{ minHeight: gameOver ? "auto" : "50vh" }}
        >
          {bellVisible && (
            <button
              type="button"
              className={`bell-icon-btn ${bellHiding ? "hiding" : ""}`}
              style={{
                left: `${bellPosition.x}%`,
                top: `${bellPosition.y}%`,
              }}
              onClick={handleBellClick}
              aria-label="Ring the bell"
            >
              🔔
            </button>
          )}
        </div>
      )}

      {gameOver && (
        <div className="bell-game-over">
          <h3>Game Over!</h3>
          <p className="final-score">Score: {score}</p>
          <p className="final-rank">
            {finalRank != null
              ? `You ranked #${finalRank} on the leaderboard!`
              : "Your score has been saved."}
          </p>
          <div className="bell-game-over-actions" role="group" aria-label="Game over actions">
            <button type="button" className="bell-play-again" onClick={handlePlayAgain}>
              Play Again
            </button>
            <button type="button" className="bell-cancel-game" onClick={handleCancelAfterGame}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
