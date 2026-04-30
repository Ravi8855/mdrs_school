import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import AnimatedSection from "./AnimatedSection";
import {
  BATCH_2013_STUDENTS,
  BATCH_2013_CLASS_NAMES,
  batch2013Slug,
} from "../data/batch2013Students";
import { handleImgError } from "../utils/imageFallback";
import Batch2014NameAquarium from "./Batch2014NameAquarium";
import "./Alumni.css";

/**
 * 2013 batch at /batch-2013-students — same layout pattern as 2014 batch page.
 */
export default function Batch2013StudentsPage({ onLogout }) {
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
        .batch-2014-page {
          display: flex;
          flex-direction: column;
          align-items: stretch;
        }
        .batch-2014-top {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 clamp(8px, 2vw, 16px);
          box-sizing: border-box;
        }
        .batch-2014-back {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          margin: 0 0 12px;
          font-size: 0.9rem;
          font-weight: 600;
          color: #475569;
          text-decoration: none;
        }
        .batch-2014-back:hover {
          color: #0f172a;
        }
        .batch-2014-page .section-title-wrap {
          margin-bottom: clamp(14px, 3vw, 22px);
          padding-top: 0;
          padding-left: clamp(6px, 2.5vw, 14px);
          padding-right: clamp(6px, 2.5vw, 14px);
          box-sizing: border-box;
        }
        .batch-2014-page .section-title {
          margin: 0 auto 8px;
          max-width: min(100%, 20.5rem);
          font-size: clamp(0.94rem, 3.65vw + 0.38rem, 1.55rem);
          line-height: 1.12;
          letter-spacing: -0.035em;
          font-weight: 800;
          text-align: center;
          text-wrap: balance;
        }
        .batch-2014-page .section-title-accent {
          margin-top: 0;
        }
        .batch-2014-page .alumni-grid {
          margin-top: 0;
        }
      `}</style>
      <Navbar onNavigate={handleNavigate} onLogout={onLogout} />
      <main className="page-section batch-students-page-main">
        <AnimatedSection>
          <div className="alumni-section container batch-2014-page">
            <div className="batch-2014-top">
              <Link to="/batches" className="batch-2014-back">
                ← Batches
              </Link>
            </div>
            <div className="section-title-wrap">
              <h2 className="section-title">2013 batch students</h2>
              <div className="section-title-accent" aria-hidden="true" />
            </div>

            <div className="alumni-grid">
              {BATCH_2013_STUDENTS.map((s, i) => (
                <Link
                  key={s.name}
                  to={`/batch-2013-students/${batch2013Slug(s.name)}`}
                  className="alumni-item glass-card reveal-card"
                  aria-label={`Open profile for ${s.name}`}
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <div className="alumni-thumb-wrap">
                    <div className="alumni-thumb-inner">
                      <img src={s.image} alt={s.name} className="alumni-thumb" decoding="async" onError={handleImgError} />
                    </div>
                  </div>
                  <div className="alumni-meta">
                    <span className="alumni-name">{s.name}</span>
                    {s.qualification ? (
                      <span className="alumni-qual-short">{s.qualification}</span>
                    ) : null}
                    {s.location ? <span className="alumni-loc-short">{s.location}</span> : null}
                  </div>
                </Link>
              ))}
            </div>

            <Batch2014NameAquarium
              names={BATCH_2013_CLASS_NAMES}
              aquariumAriaLabel="Animated aquarium of 2013 batch names"
            />
          </div>
        </AnimatedSection>
      </main>
    </div>
  );
}
