import React, { useState, useEffect, useRef, useCallback } from "react";

const LEADERBOARD_KEY = "bell-ring-madness-leaderboard";
const GAME_DURATION = 15;
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

/** One row per player; keeps highest score; prefers display name from the best run */
function dedupeAndSortLeaderboard(list) {
  const map = new Map();
  for (const e of list) {
    if (!e || typeof e.score !== "number" || !Number.isFinite(e.score)) continue;
    const key = playerKeyFromName(e.name);
    const display = (e.name || "").trim() || "Anonymous";
    const cur = map.get(key);
    if (!cur) {
      map.set(key, { name: display, score: e.score });
    } else if (e.score > cur.score) {
      map.set(key, { name: display, score: e.score });
    } else if (e.score === cur.score) {
      map.set(key, { name: display.length >= cur.name.length ? display : cur.name, score: cur.score });
    }
  }
  return Array.from(map.values()).sort((a, b) => b.score - a.score);
}

function getLeaderboard() {
  try {
    const raw = localStorage.getItem(LEADERBOARD_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return dedupeAndSortLeaderboard(Array.isArray(parsed) ? parsed : []);
  } catch {
    return [];
  }
}

function saveLeaderboard(list) {
  try {
    const top = dedupeAndSortLeaderboard(list).slice(0, 20);
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(top));
  } catch (_) {}
}

/** Add or update one player: merge by name (trim + case-insensitive), keep max score */
function upsertLeaderboardScore(list, rawName, newScore) {
  const name = (rawName || "").trim() || "Anonymous";
  return dedupeAndSortLeaderboard([...list, { name, score: newScore }]);
}


function getPointsForSpeed(msSinceShow) {
  if (msSinceShow <= 300) return 150;
  if (msSinceShow <= 600) return 100;
  if (msSinceShow <= 1200) return 75;
  return 50;
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
  const [leaderboard, setLeaderboard] = useState(getLeaderboard);
  const [finalRank, setFinalRank] = useState(null);
  const [nameError, setNameError] = useState("");

  const gameAreaRef = useRef(null);
  const spawnTimerRef = useRef(null);
  const hideBellTimerRef = useRef(null);
  const gameTimerRef = useRef(null);

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
      scheduleNextBell();
    }, delay);
  }, [gameStarted, gameOver, showBell]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;
    if (timeLeft <= 0) {
      const name = playerName.trim() || "Anonymous";
      const list = upsertLeaderboardScore(getLeaderboard(), name, score);
      const top = list.slice(0, 20);
      saveLeaderboard(top);
      setLeaderboard(top);
      const rank = 1 + top.filter((e) => e.score > score).length;
      setFinalRank(rank);
      setGameOver(true);
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

  const handleStartGame = () => {
    const name = playerName.trim();
    if (!name) return;
    const allowedLower = allowedStudents.map((s) => s.toLowerCase());
    if (!allowedLower.includes(name.toLowerCase())) {
      setNameError("Enter your original name.");
      return;
    }
    setNameError("");
    setGameStarted(true);
    setTimeLeft(GAME_DURATION);
    setScore(0);
    setGameOver(false);
    setBellVisible(false);
    setFinalRank(null);
  };

  const handleBellClick = () => {
    if (!bellShownAt || bellHiding) return;
    const points = getPointsForSpeed(Date.now() - bellShownAt);
    setScore((s) => s + points);
    hideBell();
  };

  const handlePlayAgain = () => {
    setGameStarted(false);
    setGameOver(false);
    setTimeLeft(GAME_DURATION);
    setScore(0);
    setBellVisible(false);
    setLeaderboard(getLeaderboard());
    setFinalRank(null);
  };

  const sortedLeaderboard = dedupeAndSortLeaderboard(leaderboard);
  const visiblePlayers = sortedLeaderboard.slice(0, 3);
  const champion = sortedLeaderboard[0];

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
        .bell-game-over .final-rank { font-size: clamp(1rem, 2.2vw, 1.1rem); color: #78350f; margin-bottom: 20px; }
        .bell-play-again {
          min-height: 52px;
          padding: clamp(14px, 3vw, 16px) clamp(24px, 5vw, 32px);
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: #fff;
          border: none;
          border-radius: 12px;
          font-size: clamp(1.05rem, 2.5vw, 1.1rem);
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .bell-play-again:hover { transform: scale(1.03); box-shadow: 0 6px 20px rgba(217, 119, 6, 0.4); }

        /* 320px - small phones */
        @media (max-width: 380px) {
          .bell-madness-page { padding: 12px 10px 24px; }
          .bell-leaderboard { min-width: 0; padding: 10px 12px; }
          .bell-leaderboard-row { font-size: 0.78rem; padding: 5px 8px; }
          .bell-stat { padding: 10px 14px; font-size: 1rem; }
        }

        /* 768px - tablets: leaderboard below title, compact */
        @media (max-width: 768px) {
          .bell-leaderboard {
            position: static;
            margin: 0 auto clamp(16px, 3vw, 20px);
            max-width: min(320px, 100%);
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

      {leaderboard.length > 0 && (
        <div className="bell-leaderboard">
          {champion && (
            <p className="bell-leaderboard-champion">
              🏆 Current Champion: {champion.name}
            </p>
          )}
          <h3>Leaderboard</h3>
          <ul className="bell-leaderboard-list">
            {visiblePlayers.map((e, i) => {
              const rank = i + 1;
              const rankClass = rank <= 3 ? `rank-${rank}` : "";
              return (
                <li key={`${e.name}-${e.score}-${i}`} className={`bell-leaderboard-row ${rankClass}`}>
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
          <button type="button" className="bell-play-again" onClick={handlePlayAgain}>
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}
