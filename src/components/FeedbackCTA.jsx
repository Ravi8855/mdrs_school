import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const FEEDBACK_HASH = "#feedback-form";

/**
 * Responsive feedback call-to-action at the end of the homepage.
 */
const FeedbackCTA = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const openFeedbackForm = () => {
    if (location.pathname === "/feedback") {
      const el = document.getElementById("feedback-form");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        window.setTimeout(() => {
          const first = el.querySelector("input, textarea");
          first?.focus?.();
        }, 350);
      }
      if (location.hash !== FEEDBACK_HASH) {
        navigate(`/feedback${FEEDBACK_HASH}`, { replace: true });
      }
      return;
    }
    navigate(`/feedback${FEEDBACK_HASH}`);
  };

  return (
    <aside className="feedback-cta" aria-labelledby="feedback-cta-title">
      <style>{`
        .feedback-cta {
          --feedback-cta-text: #0f172a;
          --feedback-cta-muted: #334155;
          --feedback-cta-btn-bg: #ffffff;
          --feedback-cta-btn-text: #4338ca;
          --feedback-cta-btn-border: rgba(99, 102, 241, 0.35);
          font-family: var(--font-body, "Poppins", sans-serif);
          max-width: 1000px;
          margin: 0 auto;
          width: 100%;
          padding: 0 clamp(16px, 4vw, 24px) max(28px, calc(env(safe-area-inset-bottom, 0px) + 16px));
          box-sizing: border-box;
        }

        .feedback-cta__card {
          background: linear-gradient(135deg, #e8f0ff 0%, #ede9fe 45%, #f0e7ff 100%);
          border-radius: 16px;
          box-shadow:
            0 4px 6px -1px rgba(15, 23, 42, 0.06),
            0 10px 24px -4px rgba(99, 102, 241, 0.12);
          border: 1px solid rgba(255, 255, 255, 0.85);
          padding: clamp(16px, 3vw, 24px) clamp(18px, 3.5vw, 24px);
          margin-bottom: clamp(12px, 2vw, 20px);
        }

        .feedback-cta__inner {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 1rem;
        }

        .feedback-cta__text {
          color: var(--feedback-cta-text);
        }

        .feedback-cta__title {
          margin: 0 0 0.35rem;
          font-size: clamp(1.05rem, 2.4vw, 1.25rem);
          font-weight: 700;
          line-height: 1.35;
          letter-spacing: -0.02em;
        }

        .feedback-cta__subtitle {
          margin: 0;
          font-size: clamp(0.9rem, 2vw, 1rem);
          line-height: 1.5;
          color: var(--feedback-cta-muted);
          max-width: 36ch;
        }

        .feedback-cta__btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          max-width: 100%;
          min-height: 48px;
          padding: 0.65rem 1.35rem;
          font-size: 1rem;
          font-weight: 600;
          font-family: inherit;
          color: var(--feedback-cta-btn-text);
          background: var(--feedback-cta-btn-bg);
          border: 2px solid var(--feedback-cta-btn-border);
          border-radius: 12px;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(67, 56, 202, 0.12);
          transition:
            transform 0.2s ease,
            background 0.2s ease,
            color 0.2s ease,
            box-shadow 0.2s ease,
            border-color 0.2s ease;
        }

        .feedback-cta__btn:hover {
          background: linear-gradient(135deg, #6366f1 0%, #7c3aed 100%);
          color: #ffffff;
          border-color: transparent;
          box-shadow: 0 6px 20px rgba(99, 102, 241, 0.35);
          transform: translateY(-1px) scale(1.02);
        }

        .feedback-cta__btn:focus-visible {
          outline: 3px solid #6366f1;
          outline-offset: 3px;
        }

        .feedback-cta__btn:active {
          transform: translateY(0) scale(0.99);
        }

        @media (min-width: 640px) and (max-width: 899px) {
          .feedback-cta__inner {
            flex-direction: column;
            align-items: stretch;
            text-align: center;
            gap: 1.125rem;
            max-width: 520px;
            margin: 0 auto;
          }

          .feedback-cta__text {
            text-align: center;
          }

          .feedback-cta__subtitle {
            max-width: none;
          }

          .feedback-cta__btn {
            width: 100%;
            max-width: 320px;
            margin-left: auto;
            margin-right: auto;
          }
        }

        @media (min-width: 900px) {
          .feedback-cta__inner {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            text-align: left;
            gap: 1.5rem;
          }

          .feedback-cta__text {
            text-align: left;
            flex: 1;
            min-width: 0;
          }

          .feedback-cta__subtitle {
            max-width: 42ch;
          }

          .feedback-cta__btn {
            width: auto;
            flex-shrink: 0;
            min-width: 200px;
          }
        }
      `}</style>

      <div className="feedback-cta__card">
        <div className="feedback-cta__inner">
          <div className="feedback-cta__text">
            <h2 id="feedback-cta-title" className="feedback-cta__title">
              <span aria-hidden="true">💬 </span>
              Help us improve our school website!
            </h2>
            <p className="feedback-cta__subtitle">
              Share your valuable feedback or ideas with us.
            </p>
          </div>
          <button
            type="button"
            className="feedback-cta__btn"
            onClick={openFeedbackForm}
            aria-label={
              location.pathname === "/feedback"
                ? "Scroll to feedback form"
                : "Submit feedback — go to feedback form"
            }
          >
            Submit Feedback<span aria-hidden="true"> →</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default FeedbackCTA;
