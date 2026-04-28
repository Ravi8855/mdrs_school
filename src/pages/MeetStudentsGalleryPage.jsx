import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import "./MeetStudentsGalleryPage.css";

const M_GALLERY_IMAGES = Array.from({ length: 12 }, (_, i) => `/gallery/m${i + 1}.jpg`);
const GALLERY_LEN = M_GALLERY_IMAGES.length;

const PAGE_TITLE = "Meet our seniors & juniors";
const PAGE_SUBTITLE =
  "Older and younger schoolmates in one place — tap any photo to view it full screen.";

export default function MeetStudentsGalleryPage() {
  const [viewerIndex, setViewerIndex] = useState(null);
  const [thumbLoaded, setThumbLoaded] = useState(() => new Set());

  const closeViewer = useCallback(() => setViewerIndex(null), []);

  const showPrev = useCallback(() => {
    setViewerIndex((i) => (i === null ? null : (i - 1 + GALLERY_LEN) % GALLERY_LEN));
  }, []);

  const showNext = useCallback(() => {
    setViewerIndex((i) => (i === null ? null : (i + 1) % GALLERY_LEN));
  }, []);

  useEffect(() => {
    if (viewerIndex === null) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeViewer();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        showPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        showNext();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [viewerIndex, closeViewer, showPrev, showNext]);

  useEffect(() => {
    if (viewerIndex === null) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [viewerIndex]);

  const markThumbLoaded = useCallback((index) => {
    setThumbLoaded((prev) => {
      if (prev.has(index)) return prev;
      const next = new Set(prev);
      next.add(index);
      return next;
    });
  }, []);

  return (
    <div className="page-wrap meet-students-gallery">
      <header className="meet-students-gallery__header">
        <h1 className="meet-students-gallery__title">{PAGE_TITLE}</h1>
        <div className="meet-students-gallery__title-rule" aria-hidden />
        <p className="meet-students-gallery__subtitle">{PAGE_SUBTITLE}</p>
      </header>
      <div className="meet-students-gallery__grid" role="list">
        {M_GALLERY_IMAGES.map((src, i) => (
          <button
            key={src}
            type="button"
            className={`meet-students-gallery__tile${thumbLoaded.has(i) ? " meet-students-gallery__tile--thumb-ready" : ""}`}
            role="listitem"
            onClick={() => setViewerIndex(i)}
            aria-label={`Open photo ${i + 1} of ${GALLERY_LEN}`}
          >
            <span className="meet-students-gallery__skeleton" aria-hidden />
            <span className="meet-students-gallery__media">
              <img
                src={src}
                alt=""
                loading="lazy"
                decoding="async"
                className={`meet-students-gallery__thumb${thumbLoaded.has(i) ? " meet-students-gallery__thumb--loaded" : ""}`}
                onLoad={() => markThumbLoaded(i)}
              />
              <span className="meet-students-gallery__gradient" aria-hidden />
            </span>
          </button>
        ))}
      </div>

      {typeof document !== "undefined" &&
        viewerIndex !== null &&
        createPortal(
          <div
            className="meet-gallery-lightbox"
            role="dialog"
            aria-modal="true"
            aria-label="Photo viewer"
            onClick={closeViewer}
          >
            <div className="meet-gallery-lightbox__panel" onClick={(e) => e.stopPropagation()}>
              <header className="meet-gallery-lightbox__header">
                <span className="meet-gallery-lightbox__brand">{PAGE_TITLE}</span>
                <span className="meet-gallery-lightbox__count" aria-live="polite">
                  {viewerIndex + 1} / {GALLERY_LEN}
                </span>
                <button
                  type="button"
                  className="meet-gallery-lightbox__close"
                  onClick={closeViewer}
                  aria-label="Close"
                >
                  ×
                </button>
              </header>
              <div className="meet-gallery-lightbox__stage">
                <button
                  type="button"
                  className="meet-gallery-lightbox__nav meet-gallery-lightbox__nav--prev"
                  onClick={(e) => {
                    e.stopPropagation();
                    showPrev();
                  }}
                  aria-label="Previous photo"
                >
                  ‹
                </button>
                <div className="meet-gallery-lightbox__img-wrap">
                  <img
                    key={viewerIndex}
                    src={M_GALLERY_IMAGES[viewerIndex]}
                    alt={`Photo ${viewerIndex + 1} of ${GALLERY_LEN}`}
                    className="meet-gallery-lightbox__img"
                  />
                </div>
                <button
                  type="button"
                  className="meet-gallery-lightbox__nav meet-gallery-lightbox__nav--next"
                  onClick={(e) => {
                    e.stopPropagation();
                    showNext();
                  }}
                  aria-label="Next photo"
                >
                  ›
                </button>
              </div>
              <footer className="meet-gallery-lightbox__footer">
                <p className="meet-gallery-lightbox__hint">
                  Swipe or use arrows · tap outside or × to close
                </p>
              </footer>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
