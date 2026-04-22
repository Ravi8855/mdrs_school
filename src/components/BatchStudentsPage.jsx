import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import Navbar from "./Navbar";
import AnimatedSection from "./AnimatedSection";
import ClassmatesPage from "./ClassmatesPage";

/**
 * Full SSLC batch student list at /batch-students (same UI as the former homepage section).
 */
export default function BatchStudentsPage({ onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  const handleNavigate = (target) => {
    const scrollToTarget = () => {
      const element = document.getElementById(target);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(scrollToTarget, 80);
      return;
    }
    scrollToTarget();
  };

  return (
    <div className="app-wrapper" style={{ width: "100%", overflowX: "hidden" }}>
      <style>{`
        .batch-students-page-main {
          padding-top: 0.75rem;
          padding-bottom: max(1.5rem, calc(env(safe-area-inset-bottom, 0px) + 1rem));
          font-family: var(--font-body, "Poppins", sans-serif);
        }
        .batch-students-back-row {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          width: 100%;
          box-sizing: border-box;
          padding-top: 0.25rem;
          padding-bottom: 0.25rem;
        }
        .batch-students-back {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          margin: 0;
          padding: 0;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          background: #fff;
          color: #4338ca;
          cursor: pointer;
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.08);
          transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
        }
        .batch-students-back:hover {
          background: #eef2ff;
          border-color: #c7d2fe;
        }
        .batch-students-back:focus-visible {
          outline: 3px solid #6366f1;
          outline-offset: 2px;
        }
      `}</style>
      <Navbar onNavigate={handleNavigate} onLogout={onLogout} />
      <main className="page-section batch-students-page-main">
        <div className="section-inner batch-students-back-row">
          <button type="button" className="batch-students-back" onClick={goBack} aria-label="Go back">
            <FaArrowLeft aria-hidden />
          </button>
        </div>
        <AnimatedSection>
          <ClassmatesPage variant="full" />
        </AnimatedSection>
      </main>
    </div>
  );
}
