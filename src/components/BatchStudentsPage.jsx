import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import AnimatedSection from "./AnimatedSection";
import {
  BATCH_2014_STUDENTS,
  BATCH_2014_CLASS_NAMES,
  batch2014Slug,
} from "../data/batch2014Students";
import { handleImgError } from "../utils/imageFallback";
import Batch2014NameAquarium from "./Batch2014NameAquarium";
import "./Alumni.css";

/**
 * 2014 batch at /batch-students — same card grid pattern as Alumni (static data).
 */
export default function BatchStudentsPage({ onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [lightboxSrc, setLightboxSrc] = useState(null);

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
          max-width: min(100%, 1536px);
          width: 100%;
          margin-left: auto;
          margin-right: auto;
        }
        .batch-2014-top {
          width: 100%;
          max-width: 1536px;
          margin: 0 auto;
          padding: 0 clamp(8px, 2vw, 24px);
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
        /* Global .section-title uses a large min size — here we scale so the line fits typical phone widths */
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
        /* Wider / taller student grid + name block on 2014 batch page only */
        .batch-2014-page .batch-2014-student-names {
          max-width: min(100%, 1536px);
          width: 100%;
          gap: clamp(16px, 3.2vw, 28px);
          padding-left: clamp(12px, 2.8vw, 28px);
          padding-right: clamp(12px, 2.8vw, 28px);
        }
        .batch-2014-page .batch-2014-student-names a.alumni-item {
          padding: 26px 20px;
        }
        .batch-2014-page .batch-2014-student-names .alumni-meta {
          width: 100%;
          min-height: 4.85rem;
          padding: 12px 10px 10px;
          box-sizing: border-box;
        }
        .batch-2014-page .batch-2014-aquarium-root {
          max-width: min(100%, 1536px);
        }
        .batch-2014-page .batch-2014-aquarium {
          height: clamp(312px, 44vh, 480px);
          max-height: min(480px, 60vh);
        }
        @supports (height: 1dvh) {
          .batch-2014-page .batch-2014-aquarium {
            max-height: min(480px, 60dvh);
          }
        }
        /* Tablet / phone: use width for content, safe areas for notches (PWA-friendly) */
        @media (max-width: 900px) {
          .batch-2014-page.alumni-section.container {
            padding-left: max(10px, env(safe-area-inset-left, 0px));
            padding-right: max(10px, env(safe-area-inset-right, 0px));
          }
          .batch-2014-page .batch-2014-student-names {
            padding-left: max(4px, env(safe-area-inset-left, 0px));
            padding-right: max(4px, env(safe-area-inset-right, 0px));
          }
          .batch-2014-page .batch-2014-aquarium-root {
            padding-left: max(4px, env(safe-area-inset-left, 0px));
            padding-right: max(4px, env(safe-area-inset-right, 0px));
          }
          .batch-page-gallery-extra {
            padding-left: max(8px, env(safe-area-inset-left, 0px));
            padding-right: max(8px, env(safe-area-inset-right, 0px));
          }
        }
        /* Mobile: larger vertical rhythm + taller hero blocks */
        @media (max-width: 768px) {
          .batch-students-page-main {
            padding-top: max(1rem, env(safe-area-inset-top, 0px));
            padding-bottom: max(2.35rem, calc(env(safe-area-inset-bottom, 0px) + 1.5rem));
          }
          .batch-2014-page.alumni-section.container {
            padding-top: clamp(26px, 6.5vw, 40px);
            padding-bottom: clamp(28px, 7vw, 44px);
          }
          .batch-2014-top {
            padding-top: 4px;
            padding-bottom: 8px;
          }
          .batch-2014-back {
            margin-bottom: clamp(16px, 4vw, 22px);
            padding: 8px 0;
            min-height: 44px;
            box-sizing: border-box;
          }
          .batch-2014-page .section-title-wrap {
            margin-bottom: clamp(22px, 5vw, 32px);
            padding-top: 6px;
          }
          .batch-2014-page .section-title {
            margin-bottom: clamp(12px, 3vw, 16px);
          }
          .batch-2014-page .batch-2014-student-names {
            max-width: 100%;
            row-gap: clamp(20px, 5vw, 30px);
            column-gap: clamp(12px, 3.2vw, 16px);
            padding-top: 6px;
            padding-bottom: 12px;
          }
          .batch-2014-page .batch-2014-student-names a.alumni-item {
            padding: 28px 16px;
            border-radius: 16px;
          }
          .batch-2014-page .batch-2014-student-names .alumni-thumb-wrap {
            width: clamp(72px, 32vw, 96px);
            height: clamp(72px, 32vw, 96px);
          }
          .batch-2014-page .batch-2014-student-names .alumni-meta {
            min-height: 5rem;
            padding: 14px 10px 12px;
          }
          .batch-2014-page .batch-2014-aquarium-root {
            margin-top: clamp(28px, 7vw, 42px);
            margin-bottom: 8px;
          }
          .batch-2014-page .batch-2014-aquarium {
            height: clamp(328px, 52vh, 580px);
            max-height: min(580px, 68vh);
            border-radius: 22px;
          }
          @supports (height: 1dvh) {
            .batch-2014-page .batch-2014-aquarium {
              height: clamp(328px, 52dvh, 580px);
              max-height: min(580px, 68dvh);
            }
          }
          .batch-page-gallery-extra {
            margin-top: clamp(1.5rem, 5vw, 2.35rem);
            padding-bottom: max(14px, env(safe-area-inset-bottom, 0px));
          }
          .batch-page-gallery-extra__thumb {
            max-width: 100%;
          }
        }
        @media (max-width: 480px) {
          .batch-students-page-main {
            padding-bottom: max(2.5rem, calc(env(safe-area-inset-bottom, 0px) + 1.65rem));
          }
          .batch-2014-page.alumni-section.container {
            padding-top: clamp(24px, 6vw, 34px);
            padding-bottom: clamp(26px, 6.5vw, 38px);
          }
          .batch-2014-page .batch-2014-student-names {
            row-gap: clamp(18px, 4.8vw, 26px);
            column-gap: clamp(10px, 2.8vw, 14px);
          }
          .batch-2014-page .batch-2014-student-names a.alumni-item {
            padding: 26px 14px;
          }
          .batch-2014-page .batch-2014-student-names .alumni-meta {
            min-height: 4.75rem;
            padding: 12px 8px 10px;
          }
          .batch-2014-page .batch-2014-student-names .alumni-thumb-wrap {
            width: clamp(68px, 30vw, 92px);
            height: clamp(68px, 30vw, 92px);
          }
          .batch-2014-page .batch-2014-aquarium {
            height: clamp(308px, 54vh, 560px);
            max-height: min(560px, 72vh);
          }
          @supports (height: 1dvh) {
            .batch-2014-page .batch-2014-aquarium {
              height: clamp(308px, 54dvh, 560px);
              max-height: min(560px, 72dvh);
            }
          }
        }
        .batch-page-gallery-extra {
          width: 100%;
          max-width: 1536px;
          margin: clamp(1rem, 3vw, 1.75rem) auto 0;
          padding: 0 clamp(8px, 2vw, 16px);
          box-sizing: border-box;
        }
        .batch-page-gallery-extra__thumbs {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: clamp(10px, 2vw, 16px);
          width: 100%;
          max-width: min(100%, 1536px);
          margin: 0 auto;
          box-sizing: border-box;
        }
        .batch-page-gallery-extra__thumb {
          margin: 0;
          padding: 0;
          border: none;
          background: transparent;
          cursor: pointer;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(15, 23, 42, 0.12);
          max-width: 100%;
          min-width: 0;
        }
        .batch-page-gallery-extra__thumb:focus-visible {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }
        .batch-page-gallery-extra__thumb img {
          display: block;
          width: 100%;
          height: auto;
          vertical-align: middle;
        }
        .batch-gallery-lightbox {
          position: fixed;
          inset: 0;
          z-index: 1100;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: max(12px, env(safe-area-inset-top)) max(12px, env(safe-area-inset-right))
            max(12px, env(safe-area-inset-bottom)) max(12px, env(safe-area-inset-left));
          box-sizing: border-box;
        }
        .batch-gallery-lightbox__backdrop {
          position: absolute;
          inset: 0;
          background: rgba(15, 23, 42, 0.72);
        }
        .batch-gallery-lightbox__panel {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
          max-width: min(96vw, 920px);
          max-height: 100%;
        }
        .batch-gallery-lightbox__panel img {
          max-width: 100%;
          max-height: min(78vh, 860px);
          width: auto;
          height: auto;
          object-fit: contain;
          border-radius: 8px;
        }
        .batch-gallery-lightbox__cancel {
          flex-shrink: 0;
          padding: 10px 22px;
          font-size: 0.95rem;
          font-weight: 600;
          font-family: var(--font-body, "Poppins", sans-serif);
          color: #f8fafc;
          background: #334155;
          border: none;
          border-radius: 10px;
          cursor: pointer;
        }
        .batch-gallery-lightbox__cancel:hover {
          background: #475569;
        }
        .batch-gallery-lightbox__cancel:active {
          transform: scale(0.98);
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
              <h2 className="section-title">2014 batch students</h2>
              <div className="section-title-accent" aria-hidden="true" />
            </div>

            <div className="alumni-grid batch-2014-student-names">
              {BATCH_2014_STUDENTS.map((s, i) => (
                <Link
                  key={s.name}
                  to={`/batch-students/${batch2014Slug(s.name)}`}
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
              names={BATCH_2014_CLASS_NAMES}
              aquariumAriaLabel="Animated aquarium of 2014 batch names"
            />
          </div>

          <div className="batch-page-gallery-extra">
            <div className="batch-page-gallery-extra__thumbs">
              <button
                type="button"
                className="batch-page-gallery-extra__thumb"
                onClick={() => setLightboxSrc("/gallery/m7.jpg")}
                aria-label="Open gallery image larger"
              >
                <img src="/gallery/m7.jpg" alt="2014 batch gallery" decoding="async" onError={handleImgError} />
              </button>
              <button
                type="button"
                className="batch-page-gallery-extra__thumb"
                onClick={() => setLightboxSrc("/gallery/img17.jpg")}
                aria-label="Open gallery image img17 larger"
              >
                <img src="/gallery/img17.jpg" alt="2014 batch gallery photo 2" decoding="async" onError={handleImgError} />
              </button>
            </div>
          </div>

          {lightboxSrc ? (
            <div className="batch-gallery-lightbox" role="dialog" aria-modal="true" aria-label="Gallery image">
              <div className="batch-gallery-lightbox__backdrop" aria-hidden="true" />
              <div className="batch-gallery-lightbox__panel">
                <img src={lightboxSrc} alt="" decoding="async" />
                <button type="button" className="batch-gallery-lightbox__cancel" onClick={() => setLightboxSrc(null)}>
                  Cancel
                </button>
              </div>
            </div>
          ) : null}
        </AnimatedSection>
      </main>
    </div>
  );
}
