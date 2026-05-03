import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import AnimatedSection from "./AnimatedSection";
import {
  BATCH_2017_STUDENTS,
  BATCH_2017_CLASS_NAMES,
  batch2017Slug,
} from "../data/batch2017Students";
import { handleImgError } from "../utils/imageFallback";
import Batch2014NameAquarium from "./Batch2014NameAquarium";
import "./Alumni.css";

const BATCH_2017_GALLERY_IMAGES = [
  { src: "/gallery/01.jpg", alt: "2017 batch photo 1" },
  { src: "/gallery/02.jpg", alt: "2017 batch photo 2" },
  { src: "/gallery/03.jpg", alt: "2017 batch photo 3" },
  { src: "/gallery/04.jpg", alt: "2017 batch photo 4" },
  { src: "/gallery/05.jpg", alt: "2017 batch photo 5" },
  { src: "/gallery/06.jpg", alt: "2017 batch photo 6" },
  { src: "/gallery/m5.jpg", alt: "2017 batch photo 7" },
  { src: "/gallery/m4.jpg", alt: "2017 batch photo 8" },
];

/**
 * 2017 batch at /batch-2017-students — same layout pattern as other batch pages.
 */
export default function Batch2017StudentsPage({ onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [lightbox, setLightbox] = useState(null);

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
        /* 2017 only: wider content + taller aquarium (same idea as 2015 batch page). */
        .batch-2017-students-page.alumni-section.container {
          padding-top: clamp(22px, 4.5vw, 28px);
          padding-bottom: clamp(22px, 4.5vw, 28px);
          padding-left: max(10px, env(safe-area-inset-left, 0px));
          padding-right: max(10px, env(safe-area-inset-right, 0px));
          box-sizing: border-box;
        }
        @media (max-width: 768px) {
          .batch-2017-students-page.alumni-section.container {
            padding-left: max(8px, env(safe-area-inset-left, 0px));
            padding-right: max(8px, env(safe-area-inset-right, 0px));
          }
        }
        @media (max-width: 480px) {
          .batch-2017-students-page.alumni-section.container {
            padding-left: max(6px, env(safe-area-inset-left, 0px));
            padding-right: max(6px, env(safe-area-inset-right, 0px));
          }
        }
        .batch-2017-students-page .batch-2014-top {
          max-width: min(1520px, 100%);
          padding-left: clamp(6px, 1.5vw, 14px);
          padding-right: clamp(6px, 1.5vw, 14px);
        }
        .batch-2017-students-page .alumni-grid {
          max-width: min(1520px, 100%);
          padding-left: clamp(6px, 1.5vw, 14px);
          padding-right: clamp(6px, 1.5vw, 14px);
        }
        .batch-2017-students-page .batch-2014-aquarium-root--large {
          max-width: min(1520px, 100%);
        }
        .batch-2017-students-page .batch-2014-aquarium--large {
          height: clamp(460px, 70vh, 820px);
          max-height: min(820px, 85vh);
        }
        @supports (height: 1dvh) {
          .batch-2017-students-page .batch-2014-aquarium--large {
            height: clamp(460px, 70dvh, 820px);
            max-height: min(820px, 85dvh);
          }
        }
        .batch-2017-gallery {
          width: 100%;
          max-width: min(1520px, 100%);
          margin: clamp(1rem, 3vw, 1.75rem) auto 0;
          padding: 0 clamp(8px, 2vw, 16px);
          padding-bottom: max(12px, env(safe-area-inset-bottom, 0px));
          box-sizing: border-box;
        }
        .batch-2017-gallery__grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: clamp(10px, 2vw, 16px);
          width: 100%;
          max-width: min(100%, 960px);
          margin: 0 auto;
          box-sizing: border-box;
        }
        .batch-2017-gallery__thumb {
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
          -webkit-tap-highlight-color: transparent;
        }
        .batch-2017-gallery__thumb:focus-visible {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }
        .batch-2017-gallery__thumb img {
          display: block;
          width: 100%;
          height: auto;
          vertical-align: middle;
        }
        .batch-2017-gallery-lightbox {
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
        .batch-2017-gallery-lightbox__backdrop {
          position: absolute;
          inset: 0;
          background: rgba(15, 23, 42, 0.72);
        }
        .batch-2017-gallery-lightbox__panel {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
          max-width: min(96vw, 920px);
          max-height: 100%;
          width: 100%;
        }
        .batch-2017-gallery-lightbox__panel img {
          max-width: 100%;
          max-height: min(65vh, 720px);
          width: auto;
          height: auto;
          object-fit: contain;
          border-radius: 8px;
        }
        @supports (height: 1dvh) {
          .batch-2017-gallery-lightbox__panel img {
            max-height: min(65dvh, 720px);
          }
        }
        .batch-2017-gallery-lightbox__cancel {
          flex-shrink: 0;
          min-height: 44px;
          min-width: 120px;
          padding: 12px 24px;
          font-size: 1rem;
          font-weight: 600;
          font-family: var(--font-body, "Poppins", sans-serif);
          color: #f8fafc;
          background: #334155;
          border: none;
          border-radius: 10px;
          cursor: pointer;
        }
        .batch-2017-gallery-lightbox__cancel:hover {
          background: #475569;
        }
        .batch-2017-gallery-lightbox__cancel:active {
          transform: scale(0.98);
        }
      `}</style>
      <Navbar onNavigate={handleNavigate} onLogout={onLogout} />
      <main className="page-section batch-students-page-main">
        <AnimatedSection>
          <div className="alumni-section container batch-2014-page batch-2017-students-page">
            <div className="batch-2014-top">
              <Link to="/batches" className="batch-2014-back">
                ← Batches
              </Link>
            </div>
            <div className="section-title-wrap">
              <h2 className="section-title">2017 batch students</h2>
              <div className="section-title-accent" aria-hidden="true" />
            </div>

            <div className="alumni-grid">
              {BATCH_2017_STUDENTS.map((s, i) => (
                <Link
                  key={s.name}
                  to={`/batch-2017-students/${batch2017Slug(s.name)}`}
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
              names={BATCH_2017_CLASS_NAMES}
              aquariumAriaLabel="Animated aquarium of 2017 batch names"
              aquariumSize="large"
            />
          </div>

          <div className="batch-2017-gallery">
            <div className="batch-2017-gallery__grid" role="list">
              {BATCH_2017_GALLERY_IMAGES.map(({ src, alt }) => (
                <button
                  key={src}
                  type="button"
                  className="batch-2017-gallery__thumb"
                  onClick={() => setLightbox({ src, alt })}
                  aria-label={`Open larger: ${alt}`}
                >
                  <img src={src} alt={alt} decoding="async" loading="lazy" onError={handleImgError} />
                </button>
              ))}
            </div>
          </div>

          {lightbox ? (
            <div
              className="batch-2017-gallery-lightbox"
              role="dialog"
              aria-modal="true"
              aria-label="Gallery photo"
              onClick={() => setLightbox(null)}
            >
              <div className="batch-2017-gallery-lightbox__backdrop" aria-hidden="true" />
              <div className="batch-2017-gallery-lightbox__panel" onClick={(e) => e.stopPropagation()}>
                <img src={lightbox.src} alt={lightbox.alt} decoding="async" onError={handleImgError} />
                <button
                  type="button"
                  className="batch-2017-gallery-lightbox__cancel"
                  onClick={() => setLightbox(null)}
                >
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
