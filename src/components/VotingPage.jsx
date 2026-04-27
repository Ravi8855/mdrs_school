import React, { useCallback, useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { VOTING_CATEGORIES } from "../data/votingCategories";
import {
  pickNominee,
  readSelections,
  selectionCountForNominee,
} from "../lib/votingStorage";
import {
  fetchClassVotingTotals,
  getOrCreateClassVotingVoterKey,
  isSupabaseConfigured,
  subscribeClassVotingTotals,
  submitClassVotingBallot,
} from "../lib/classVotingSupabase";
import "./VotingPage.css";

const TOAST_MS = 2200;

/** Winner = your single pick in this category (max 1 vote on this device). */
function winnerForCategory(selections, cat) {
  const pick = selections[cat.id];
  if (!pick) return { names: [], maxVotes: 0 };
  const n = cat.nominees.find((x) => x.id === pick);
  if (!n) return { names: [], maxVotes: 0 };
  return { names: [n.name], maxVotes: 1 };
}

/** Class-wide totals from Supabase (same for every visitor). */
function winnerForCategoryFromTotals(totals, cat) {
  const perNom = totals[cat.id] || {};
  let maxVotes = 0;
  const names = [];
  for (const n of cat.nominees) {
    const v = perNom[n.id] || 0;
    if (v > maxVotes) {
      maxVotes = v;
      names.length = 0;
      names.push(n.name);
    } else if (v === maxVotes && v > 0) {
      names.push(n.name);
    }
  }
  return { names, maxVotes };
}

/**
 * Ranked rows for one category (ties share the same rank, next rank skips).
 * @param {Record<string, Record<string, number>>} totals
 * @param {{ id: string, nominees: Array<{ id: string, name: string }> }} cat
 * @returns {Array<{ id: string, name: string, votes: number, rank: number, isWinner: boolean, votePercent: number }>}
 */
function leaderboardRowsForCategory(totals, cat) {
  const perNom = totals[cat.id] || {};
  const rows = cat.nominees.map((n) => ({
    id: n.id,
    name: n.name,
    votes: Math.max(0, Math.floor(Number(perNom[n.id]) || 0)),
  }));
  rows.sort((a, b) => {
    if (b.votes !== a.votes) return b.votes - a.votes;
    return a.name.localeCompare(b.name);
  });
  const categorySum = rows.reduce((acc, r) => acc + r.votes, 0);
  const topVotes = rows.length > 0 ? rows[0].votes : 0;
  let rank = 1;
  return rows.map((row, i) => {
    if (i > 0 && row.votes < rows[i - 1].votes) {
      rank = i + 1;
    }
    const votePercent =
      categorySum > 0 ? Math.min(100, Math.round((row.votes / categorySum) * 100)) : 0;
    return {
      ...row,
      rank,
      isWinner: topVotes > 0 && row.votes === topVotes,
      votePercent,
    };
  });
}

export default function VotingPage({ onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [selections, setSelections] = useState(() => readSelections());
  /** When non-null, badge + results + live leaderboard use these counts (from class_voting_ballots). */
  const [remoteTotals, setRemoteTotals] = useState(
    /** @type {Record<string, Record<string, number>> | null} */ (null)
  );
  /** True until first successful ballot fetch when Supabase is configured. */
  const [liveTotalsLoading, setLiveTotalsLoading] = useState(() => isSupabaseConfigured());
  const voterKeyRef = useRef(/** @type {string | null} */ (null));
  const [toastMsg, setToastMsg] = useState(/** @type {string | null} */ (null));
  const [showResults, setShowResults] = useState(false);
  const toastTimer = useRef(null);
  const resultsPanelRef = useRef(null);

  const useSharedTotals = remoteTotals !== null;
  const showLiveLeaderboard = isSupabaseConfigured();
  const liveBoardFetchFailed = showLiveLeaderboard && !liveTotalsLoading && !useSharedTotals;

  const refreshLiveTotals = useCallback(async () => {
    const { totals, error } = await fetchClassVotingTotals();
    if (error || !totals) {
      return { ok: false, error };
    }
    setRemoteTotals(totals);
    return { ok: true, error: null };
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
    };
  }, []);

  useEffect(() => {
    if (showResults && resultsPanelRef.current) {
      resultsPanelRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [showResults]);

  useEffect(() => {
    if (!isSupabaseConfigured()) return undefined;

    if (!voterKeyRef.current) {
      voterKeyRef.current = getOrCreateClassVotingVoterKey();
    }
    const voterKey = voterKeyRef.current;

    let cancelled = false;

    const pull = async () => {
      setLiveTotalsLoading(true);
      try {
        const { totals, error } = await fetchClassVotingTotals();
        if (cancelled) return;
        if (error || !totals) {
          if (error && typeof console !== "undefined" && console.warn) {
            console.warn("[mdrs-school] Class voting totals:", error.message);
          }
          return;
        }
        setRemoteTotals(totals);
        const initial = readSelections();
        for (const cat of VOTING_CATEGORIES) {
          const pick = initial[cat.id];
          if (typeof pick === "string" && pick) {
            const syncResult = await submitClassVotingBallot(voterKey, cat.id, pick);
            if (
              !syncResult.success &&
              !syncResult.duplicateVote &&
              syncResult.error &&
              typeof console !== "undefined" &&
              console.warn
            ) {
              console.warn("[mdrs-school] Class voting sync:", syncResult.error.message);
            }
          }
        }
        if (!cancelled) {
          const again = await fetchClassVotingTotals();
          if (!cancelled && !again.error && again.totals) {
            setRemoteTotals(again.totals);
          }
        }
      } finally {
        if (!cancelled) {
          setLiveTotalsLoading(false);
        }
      }
    };

    void pull();

    const unsub = subscribeClassVotingTotals((totals) => {
      if (!cancelled) setRemoteTotals(totals);
    });

    return () => {
      cancelled = true;
      unsub();
    };
  }, []);

  const showToast = useCallback((msg = "Choice saved ✓") => {
    setToastMsg(msg);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => {
      setToastMsg(null);
      toastTimer.current = null;
    }, TOAST_MS);
  }, []);

  const handleNavigate = (target) => {
    const scrollToTarget = () => {
      const element = document.getElementById(target);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    if (location.pathname !== "/home") {
      navigate("/home");
      window.setTimeout(scrollToTarget, 80);
      return;
    }
    scrollToTarget();
  };

  const onVote = async (categoryId, nomineeId) => {
    if (selections[categoryId] === nomineeId) {
      showToast("You already voted in this category");
      return;
    }

    if (!isSupabaseConfigured()) {
      const next = pickNominee(selections, categoryId, nomineeId);
      setSelections(next);
      showToast("Your vote is saved — one pick per category on this device.");
      void confetti({
        particleCount: 22,
        spread: 62,
        startVelocity: 18,
        scalar: 0.85,
        origin: { y: 0.72 },
        colors: ["#6366f1", "#a855f7", "#22c55e", "#fbbf24"],
      });
      return;
    }

    if (!voterKeyRef.current) {
      voterKeyRef.current = getOrCreateClassVotingVoterKey();
    }
    const voterKey = voterKeyRef.current;

    const result = await submitClassVotingBallot(voterKey, categoryId, nomineeId);
    console.log("[class-voting] onVote submit result", result);

    if (result.duplicateVote) {
      const aligned = pickNominee(selections, categoryId, nomineeId);
      setSelections(aligned);
      void refreshLiveTotals();
      showToast("You already voted in this category");
      return;
    }

    if (!result.success || result.error) {
      showToast("Failed to submit vote");
      return;
    }

    const next = pickNominee(selections, categoryId, nomineeId);
    setSelections(next);
    showToast("Vote submitted successfully!");
    void refreshLiveTotals();
    void confetti({
      particleCount: 22,
      spread: 62,
      startVelocity: 18,
      scalar: 0.85,
      origin: { y: 0.72 },
      colors: ["#6366f1", "#a855f7", "#22c55e", "#fbbf24"],
    });
  };

  return (
    <div
      className="app-wrapper voting-page-cq"
      style={{ width: "100%", overflowX: "hidden" }}
    >
      <Navbar onNavigate={handleNavigate} onLogout={onLogout} />
      <main className="page-section voting-page-main">
        <div className="section-inner voting-page-body">
          <div className="voting-page-intro">
            <h1>🗳️ Class Voting</h1>
            <p>
              Choose <strong>one person per category</strong> on this device. Tap another name to
              change your pick.
              {useSharedTotals
                ? " Vote counts below are the same for everyone (saved in Supabase)."
                : " Totals are 1 or 0 per name here until Supabase is configured."}
            </p>
          </div>

          <div className="voting-page-toolbar voting-page-toolbar--single">
            {toastMsg ? (
              <p className="voting-page-toast" role="status">
                {toastMsg}
              </p>
            ) : null}
            <button
              type="button"
              className="voting-page-results-btn"
              onClick={() => setShowResults((s) => !s)}
              aria-expanded={showResults}
              aria-controls="voting-results-panel"
            >
              {showResults ? "Hide results" : "See results"}
            </button>
          </div>

          {showResults ? (
            <div
              ref={resultsPanelRef}
              id="voting-results-panel"
              className="voting-results"
              role="region"
              aria-label="Winners by category"
            >
              <h2 className="voting-results__title">
                {useSharedTotals ? "Winners (class totals)" : "Winners (your picks)"}
              </h2>
              <p className="voting-results__hint">
                {useSharedTotals
                  ? "Live counts from class voting — updates when anyone votes."
                  : "One vote per category on this phone or computer. The name with the most votes here is always your selected winner (1 vote max)."}
              </p>
              {showLiveLeaderboard && liveTotalsLoading && !useSharedTotals ? (
                <p className="voting-results__loading" role="status">
                  Loading…
                </p>
              ) : null}
              <ul className="voting-results__list">
                {VOTING_CATEGORIES.map((cat) => {
                  const { names, maxVotes } = useSharedTotals
                    ? winnerForCategoryFromTotals(remoteTotals, cat)
                    : winnerForCategory(selections, cat);
                  return (
                    <li key={cat.id} className="voting-results__row">
                      <span className="voting-results__cat">
                        <span aria-hidden="true">{cat.emoji} </span>
                        {cat.title}
                      </span>
                      <span className="voting-results__lead">
                        {names.length === 0 ? (
                          <span className="voting-results__none">
                            {useSharedTotals ? "No votes yet" : "No vote yet — pick someone below"}
                          </span>
                        ) : (
                          <>
                            <span className="voting-results__winner">{names.join(" · ")}</span>
                            <span className="voting-results__meta">
                              {" "}
                              · {maxVotes} {maxVotes === 1 ? "vote" : "votes"}
                            </span>
                          </>
                        )}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}

          <ul className="voting-page-grid">
            {VOTING_CATEGORIES.map((cat) => (
              <li key={cat.id} className="voting-category">
                <header className="voting-category__head">
                  <h2 className="voting-category__title">
                    <span aria-hidden="true">{cat.emoji} </span>
                    {cat.title}
                  </h2>
                  <p className="voting-category__subtitle">{cat.subtitle}</p>
                </header>
                {showLiveLeaderboard ? (
                  <div className="voting-category-leaderboard" aria-label={`${cat.title} live leaderboard`}>
                    <h3 className="voting-category-leaderboard__title">Live leaderboard</h3>
                    {liveTotalsLoading && !useSharedTotals ? (
                      <p className="voting-category-leaderboard__loading" role="status">
                        Loading…
                      </p>
                    ) : useSharedTotals ? (
                      (() => {
                        const rows = leaderboardRowsForCategory(remoteTotals, cat);
                        const categoryVoteSum = rows.reduce((acc, r) => acc + r.votes, 0);
                        if (categoryVoteSum === 0) {
                          return (
                            <p className="voting-category-leaderboard__empty" role="status">
                              No votes yet
                            </p>
                          );
                        }
                        return (
                          <ol className="voting-category-leaderboard__list">
                            {rows.map((row) => {
                              const isYourPick = selections[cat.id] === row.id;
                              const rowClass = [
                                "voting-leaderboard-row",
                                isYourPick ? "voting-leaderboard-row--yours" : "",
                                row.isWinner ? "voting-leaderboard-row--winner" : "",
                              ]
                                .filter(Boolean)
                                .join(" ");
                              return (
                                <li
                                  key={row.id}
                                  className={rowClass}
                                  style={{ "--lb-pct": `${row.votePercent}%` }}
                                >
                                  <span className="voting-leaderboard-row__rank" aria-hidden="true">
                                    #{row.rank}
                                  </span>
                                  <div className="voting-leaderboard-row__namecell">
                                    {row.isWinner ? (
                                      <span
                                        className="voting-leaderboard-row__crown"
                                        title="Top in this category"
                                        aria-label="Top in this category"
                                      >
                                        👑
                                      </span>
                                    ) : null}
                                    <span className="voting-leaderboard-row__name">{row.name}</span>
                                  </div>
                                  <div className="voting-leaderboard-row__meta">
                                    <div className="voting-leaderboard-row__counts">
                                      <span
                                        className="voting-leaderboard-row__votes"
                                        title={`${row.votes} votes · ${row.votePercent}% of category`}
                                      >
                                        <span className="voting-leaderboard-row__votes-num">{row.votes}</span>
                                        <span className="voting-leaderboard-row__votes-label">
                                          {row.votes === 1 ? "vote" : "votes"}
                                        </span>
                                      </span>
                                      <span className="voting-leaderboard-row__pct">{row.votePercent}%</span>
                                    </div>
                                    {isYourPick ? (
                                      <span className="voting-leaderboard-row__you">Your pick</span>
                                    ) : null}
                                  </div>
                                  <div className="voting-leaderboard-row__bar-track" aria-hidden="true">
                                    <div
                                      key={`${row.id}-${row.votes}-${row.votePercent}`}
                                      className="voting-leaderboard-row__bar-fill"
                                    />
                                  </div>
                                </li>
                              );
                            })}
                          </ol>
                        );
                      })()
                    ) : liveBoardFetchFailed ? (
                      <p className="voting-category-leaderboard__empty voting-category-leaderboard__empty--muted">
                        Could not load live results. Refresh the page or check Supabase access.
                      </p>
                    ) : null}
                  </div>
                ) : null}
                <ul className="voting-nominee-list">
                  {cat.nominees.map((n) => {
                    const count = useSharedTotals
                      ? remoteTotals[cat.id]?.[n.id] ?? 0
                      : selectionCountForNominee(selections, cat.id, n.id);
                    const selected = selections[cat.id] === n.id;
                    const voteLabel = count === 1 ? "vote" : "votes";
                    return (
                      <li key={n.id} className={`voting-nominee${selected ? " voting-nominee--picked" : ""}`}>
                        <div className="voting-nominee__top">
                          <span className="voting-nominee__name">{n.name}</span>
                          <span className="voting-nominee__badge" title={`${count} ${voteLabel}`}>
                            <span className="voting-nominee__badge-num">{count}</span>
                            <span className="voting-nominee__badge-text">{voteLabel}</span>
                          </span>
                        </div>
                        <button
                          type="button"
                          className={`voting-nominee__vote${selected ? " voting-nominee__vote--selected" : ""}`}
                          onClick={() => onVote(cat.id, n.id)}
                          aria-pressed={selected}
                        >
                          {selected ? "Your pick" : "Vote"}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}
          </ul>

          <p className="voting-page-footnote">
            Edit names in <code style={{ fontSize: "0.85em" }}>src/data/votingCategories.js</code>.
            {useSharedTotals
              ? " Your pick is still stored in this browser; everyone shares the same vote totals via Supabase."
              : " Choices are stored only in this browser until Supabase is configured."}
          </p>
        </div>
      </main>
    </div>
  );
}
