import React from "react";
import { useNavigate } from "react-router-dom";
import "./VotingPreview.css";

const VOTING_PATH = "/voting";

/**
 * Compact homepage teaser linking to the full Class Voting page.
 * Uses <a href> + navigate() so taps always trigger client routing (Link-only was flaky
 * when the block sat in a scroll-reveal wrapper with opacity:0 before "in-view").
 */
export default function VotingPreview() {
  const navigate = useNavigate();

  const goVoting = (e) => {
    if (e.defaultPrevented) return;
    if (typeof e.button === "number" && e.button !== 0) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    navigate(VOTING_PATH);
  };

  return (
    <div className="voting-preview-wrap">
      <a
        href={VOTING_PATH}
        className="voting-preview"
        onClick={goVoting}
        aria-label="Go to Class Voting"
      >
        <div className="voting-preview__inner">
          <div className="voting-preview__copy">
            <h2 className="voting-preview__title" id="voting-preview-title">
              🗳️ Class Voting
            </h2>
            <p className="voting-preview__subtitle">Vote for your friends in fun categories!</p>
          </div>
          <div className="voting-preview__cards">
            <div className="voting-preview__card">😂 Class Comedian</div>
            <div className="voting-preview__card">🎭 Drama Queen</div>
          </div>
          <div className="voting-preview__actions">
            <span className="voting-preview__btn">Go to Voting →</span>
          </div>
        </div>
      </a>
    </div>
  );
}
