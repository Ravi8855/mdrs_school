import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import AnimatedSection from "./AnimatedSection";
import ClassmatesPage from "./ClassmatesPage";

/**
 * Full SSLC batch student list at /batch-students (same UI as the former homepage section).
 */
export default function BatchStudentsPage({ onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigate = (target) => {
    const scrollToTarget = () => {
      const element = document.getElementById(target);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    if (location.pathname !== "/home") {
      navigate("/home");
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
      `}</style>
      <Navbar onNavigate={handleNavigate} onLogout={onLogout} />
      <main className="page-section batch-students-page-main">
        <AnimatedSection>
          <ClassmatesPage variant="full" />
        </AnimatedSection>
      </main>
    </div>
  );
}
