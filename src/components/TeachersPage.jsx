import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";

// ✅ IMPORT IMAGES (ONLY AVAILABLE TEACHER FILES)
import subhasImg from "../assets/Subhas sir.jpg";
import bhagamma from "../assets/Bhagamma mam.jpg";
import sumanthImg from "../assets/Sumanth sir.jpg";
import principalImg from "../assets/principal.jpg";
import madivalappaImg from "../assets/Madivalappa sir.jpg";
import rameshImg from "../assets/Ramesh sir.jpg";
import malluImg from "../assets/Mallu sir.jpg";
import rajkumarImg from "../assets/Rajkumar sir.jpg";
import shantalingappaImg from "../assets/Shantalingappa sir.jpg";
import chandruImg from "../assets/Chandru sir.jpg";
import RenukaImg from "../assets/Renuka mam.jpg";
import AshwiniImg from "../assets/Ashwini mam.jpg";

/** Public gallery — 3 per row; opened in memory viewer */
const TEACHER_GALLERY_IMAGES = [
  "/gallery/s1.jpg",
  "/gallery/s2.jpg",
  "/gallery/s3.jpg",
  "/gallery/s4.jpg",
  "/gallery/s5.jpg",
  "/gallery/s6.jpg",
  "/gallery/s7.jpg",
];

const MEMORY_BOOKMARK_STORAGE_KEY = "mdrs-teachers-gallery-bookmarks";

function readMemoryBookmarks() {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(MEMORY_BOOKMARK_STORAGE_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    return new Set(Array.isArray(arr) ? arr.filter((x) => typeof x === "string") : []);
  } catch {
    return new Set();
  }
}

const TeachersPage = () => {
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [expandedImage, setExpandedImage] = useState(null);
  const [memoryIndex, setMemoryIndex] = useState(null);
  const [memoryBookmarks, setMemoryBookmarks] = useState(readMemoryBookmarks);

  const closeMemoryViewer = useCallback(() => setMemoryIndex(null), []);

  const toggleMemoryBookmark = useCallback(() => {
    if (memoryIndex === null) return;
    const src = TEACHER_GALLERY_IMAGES[memoryIndex];
    setMemoryBookmarks((prev) => {
      const next = new Set(prev);
      if (next.has(src)) next.delete(src);
      else next.add(src);
      try {
        window.localStorage.setItem(
          MEMORY_BOOKMARK_STORAGE_KEY,
          JSON.stringify([...next])
        );
      } catch {
        /* ignore quota / private mode */
      }
      return next;
    });
  }, [memoryIndex]);

  useEffect(() => {
    if (memoryIndex === null) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeMemoryViewer();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [memoryIndex, closeMemoryViewer]);

  useEffect(() => {
    if (memoryIndex === null) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [memoryIndex]);

  const principal = {
    name: "Eranna Arkera Sir",
    img: principalImg,
  };

  const teacherGradients = [
    "linear-gradient(145deg, #e7f5ff 0%, #a5d8ff 100%)",
    "linear-gradient(145deg, #d3f9d8 0%, #b2f2bb 100%)",
    "linear-gradient(145deg, #e5dbff 0%, #d0bfff 100%)",
    "linear-gradient(145deg, #fff9db 0%, #ffe066 100%)",
    "linear-gradient(145deg, #fff4e6 0%, #ffd8a8 100%)",
  ];

  // ✅ UPDATED TEACHER DATA WITH AVAILABLE IMAGES AND SUBJECTS
  const teachers = [
    { name: "Subhas Sir", img: subhasImg, subject: "Science" },
    { name: "Bhagamma Mam", img: bhagamma, subject: "Social Science" },
    { name: "Sumanth Sir", img: sumanthImg, subject: "English" },
    { name: "Madivalappa Sir", img: madivalappaImg, subject: "Kannada" },
    { name: "Mallu Sir", img: malluImg, subject: "Health Care" },
    { name: "Rajkumar Sir", img: rajkumarImg, subject: "Physical Education" },
    { name: "Shantalingappa Sir", img: shantalingappaImg, subject: "Kannada" },
    { name: "Chandru Sir", img: chandruImg, subject: "hindi" },
    { name: "Renuka Mam", img: RenukaImg, subject: "English" },
    { name: "Ashwini Mam", img: AshwiniImg, subject: "Computer Science" },
    { name: "Ramesh Sir", img: rameshImg, subject: "Singing" },
  ];

  return (
    <div className="page-wrap teachers-page">
      <div className="section-inner">

      <style>{`
        .page-wrap.teachers-page {
          width: 100%;
          max-width: 100%;
          padding: var(--space-6);
          background: var(--bg);
          box-sizing: border-box;
          overflow-x: hidden;
        }

        .section-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding-left: clamp(14px, 4vw, 24px);
          padding-right: clamp(14px, 4vw, 24px);
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
        }

        .section-title-wrap {
          text-align: center;
          margin-bottom: var(--space-8);
          max-width: min(720px, 100%);
          margin-left: auto;
          margin-right: auto;
        }

        .section-title {
          font-family: var(--font-heading);
          font-size: clamp(1.75rem, 3.5vw, 2.25rem);
          font-weight: 800;
          color: var(--text);
          margin: 0 0 var(--space-2);
          line-height: 1.2;
        }

        .section-title-accent {
          display: inline-block;
          width: 56px;
          height: 4px;
          background: linear-gradient(90deg, var(--primary), var(--accent));
          border-radius: 2px;
          margin: var(--space-2) 0;
        }

        .section-subtitle {
          font-size: 1rem;
          color: var(--text-muted);
          margin-top: var(--space-3);
          max-width: 560px;
          margin-left: auto;
          margin-right: auto;
          line-height: 1.5;
        }

        /* Principal Card */
        .principal-card {
          text-align: center;
          background: linear-gradient(135deg, #ffe66d 0%, #ffb347 100%);
          border-radius: 20px;
          padding: 40px 30px;
          margin: var(--space-8) auto;
          max-width: min(520px, 100%);
          box-shadow: 0 12px 36px rgba(0,0,0,0.12);
          box-sizing: border-box;
        }

        .principal-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: #8B4513;
          text-transform: uppercase;
          letter-spacing: 1.2px;
          margin: 0 0 var(--space-2);
        }

        .principal-name {
          font-family: var(--font-heading);
          font-size: 1.75rem;
          font-weight: 800;
          color: #2c2c2c;
          margin: var(--space-2) 0;
        }

        .principal-card img {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          margin-top: var(--space-4);
          border: 4px solid white;
          object-fit: cover;
          box-shadow: 0 8px 20px rgba(0,0,0,0.2);
          cursor: pointer;
          transition: transform 0.2s ease;
        }

        .principal-card img:hover {
          transform: scale(1.08);
        }

        /* Teachers Grid — two cards per row (readable on narrow shells) */
        .teachers-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 20px;
          width: 100%;
          max-width: min(720px, 100%);
          margin: 0 auto;
          align-items: stretch;
          justify-items: stretch;
          box-sizing: border-box;
        }

        .teacher-pill {
          cursor: pointer;
          border-radius: 16px;
          padding: 16px 12px;
          text-align: center;
          box-shadow: 0 6px 18px rgba(0,0,0,0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          background: white;
          width: 100%;
          min-width: 0;
          min-height: 148px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .teacher-pill:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 28px rgba(0,0,0,0.15);
        }

        .teacher-pill:focus-visible {
          outline: 2px solid rgba(71, 85, 105, 0.45);
          outline-offset: 3px;
        }

        .teacher-pill .teacher-img {
          flex-shrink: 0;
        }

        .teacher-pill__name {
          font-weight: 700;
          font-size: 1rem;
          color: var(--text);
          margin: 0;
          width: 100%;
          min-width: 0;
          max-width: 100%;
          flex-shrink: 0;
          text-align: center;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          word-break: break-word;
          line-height: 1.25;
        }

        .teacher-img {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          object-fit: cover;
          margin: 0 auto;
          border: 3px solid white;
          box-shadow: 0 4px 10px rgba(0,0,0,0.2);
          display: block;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          flex-shrink: 0;
        }

        .teacher-img:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 16px rgba(0,0,0,0.3);
        }

        /* School memories — 3-column grid below teacher cards */
        .school-memories {
          width: 100%;
          max-width: min(640px, 100%);
          margin: clamp(28px, 5vw, 44px) auto 0;
          padding: 0;
          box-sizing: border-box;
        }

        .school-memories__head {
          margin-bottom: 14px;
          padding: 0 2px;
        }

        .school-memories__title {
          font-family: var(--font-heading);
          font-size: clamp(1.05rem, 3.2vw, 1.2rem);
          font-weight: 800;
          color: var(--text);
          margin: 0;
          letter-spacing: -0.02em;
          line-height: 1.2;
        }

        .school-memories__subtitle {
          font-size: 0.8125rem;
          color: var(--text-muted);
          margin: 6px 0 0;
          font-weight: 500;
          line-height: 1.4;
        }

        .school-memories__grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 8px;
          width: 100%;
        }

        .school-memories__tile {
          position: relative;
          aspect-ratio: 1;
          border: none;
          padding: 0;
          margin: 0;
          width: 100%;
          border-radius: 14px;
          overflow: hidden;
          cursor: pointer;
          background: linear-gradient(145deg, #e2e8f0, #cbd5e1);
          box-shadow:
            0 1px 0 rgba(255, 255, 255, 0.6) inset,
            0 2px 10px rgba(15, 23, 42, 0.08),
            0 0 0 1px rgba(15, 23, 42, 0.06);
          transition: transform 0.22s ease, box-shadow 0.22s ease;
          -webkit-tap-highlight-color: transparent;
        }

        .school-memories__tile:hover {
          transform: translateY(-3px);
          box-shadow:
            0 1px 0 rgba(255, 255, 255, 0.5) inset,
            0 10px 28px rgba(15, 23, 42, 0.14),
            0 0 0 1px rgba(15, 23, 42, 0.08);
        }

        .school-memories__tile:active {
          transform: scale(0.97);
        }

        .school-memories__tile:focus-visible {
          outline: 2px solid rgba(59, 130, 246, 0.9);
          outline-offset: 3px;
        }

        .school-memories__tile img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          display: block;
        }

        .school-memories__tile-shine {
          pointer-events: none;
          position: absolute;
          inset: 0;
          background: linear-gradient(
            165deg,
            rgba(255, 255, 255, 0.2) 0%,
            transparent 42%,
            transparent 100%
          );
          opacity: 0.55;
        }

        /* Memory photo viewer — single image, overlay chrome only */
        @keyframes memoryViewerBackdropIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes memoryViewerImgIn {
          from {
            opacity: 0;
            transform: scale(0.96);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .memory-viewer {
          position: fixed;
          inset: 0;
          z-index: 3600;
          display: flex;
          align-items: stretch;
          justify-content: center;
          padding: max(10px, env(safe-area-inset-top, 0px)) max(10px, env(safe-area-inset-right, 0px))
            max(14px, env(safe-area-inset-bottom, 0px)) max(10px, env(safe-area-inset-left, 0px));
          box-sizing: border-box;
          background: rgba(9, 11, 18, 0.94);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          animation: memoryViewerBackdropIn 0.28s ease forwards;
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
          overscroll-behavior: contain;
        }

        .memory-viewer__inner {
          position: relative;
          flex: 1;
          min-height: 0;
          min-width: 0;
          width: 100%;
          max-width: 100%;
          display: flex;
          flex-direction: column;
        }

        .memory-viewer__chrome {
          position: absolute;
          top: max(4px, env(safe-area-inset-top, 0px));
          right: max(4px, env(safe-area-inset-right, 0px));
          z-index: 5;
          display: flex;
          align-items: center;
          gap: 10px;
          pointer-events: none;
          padding: 4px;
        }

        .memory-viewer__bookmark,
        .memory-viewer__close {
          pointer-events: auto;
          flex-shrink: 0;
          width: 44px;
          height: 44px;
          min-width: 44px;
          min-height: 44px;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.14);
          background: rgba(22, 26, 36, 0.55);
          color: #f8fafc;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s ease, transform 0.2s ease, border-color 0.2s ease;
        }

        .memory-viewer__bookmark:hover,
        .memory-viewer__close:hover {
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(255, 255, 255, 0.22);
        }

        .memory-viewer__bookmark:active,
        .memory-viewer__close:active {
          transform: scale(0.94);
        }

        .memory-viewer__bookmark--on {
          background: rgba(251, 191, 36, 0.22);
          border-color: rgba(251, 191, 36, 0.5);
          color: #fde68a;
        }

        .memory-viewer__bookmark svg {
          width: 22px;
          height: 22px;
          display: block;
        }

        .memory-viewer__close {
          font-size: 1.45rem;
          line-height: 1;
          font-weight: 300;
        }

        .memory-viewer__stage {
          position: relative;
          flex: 1;
          min-height: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 56px 6px 12px;
          touch-action: manipulation;
        }

        .memory-viewer__img-wrap {
          max-width: min(100%, 960px);
          max-height: 100%;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .memory-viewer__img {
          max-width: 100%;
          max-height: min(calc(100vh - 120px), calc(100dvh - 120px), 78vh, 78dvh, 820px);
          width: auto;
          height: auto;
          object-fit: contain;
          object-position: center;
          border-radius: 12px;
          box-shadow:
            0 8px 40px rgba(0, 0, 0, 0.45),
            0 0 0 1px rgba(255, 255, 255, 0.05);
          animation: memoryViewerImgIn 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        @media (max-width: 480px) {
          .memory-viewer__img {
            max-height: min(calc(100vh - 108px), calc(100dvh - 108px), 72vh, 72dvh, 640px);
            border-radius: 10px;
          }

          .memory-viewer__stage {
            padding-top: 52px;
          }
        }

        @media (min-width: 480px) {
          .school-memories__grid {
            gap: 12px;
          }

          .school-memories__tile {
            border-radius: 16px;
          }
        }

        @media (max-width: 380px) {
          .school-memories__grid {
            gap: 6px;
          }

          .school-memories__tile {
            border-radius: 12px;
          }

          .memory-viewer__img {
            max-height: min(calc(100vh - 100px), calc(100dvh - 100px), 68vh, 68dvh, 560px);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .school-memories__tile,
          .school-memories__tile:hover,
          .school-memories__tile:active {
            transition: none;
            transform: none;
          }

          .memory-viewer {
            animation: none;
          }

          .memory-viewer__img {
            animation: none;
          }

          .expanded-image-modal {
            animation: none;
          }

          .expanded-image-modal img {
            animation: none;
          }
        }

        /* Responsive */
        @media (max-width: 1400px) {
          .teachers-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 20px;
          }
        }

        @media (max-width: 1200px) {
          .teachers-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 18px;
          }
        }

        @media (max-width: 1024px) {
          .page-wrap.teachers-page {
            padding: var(--space-5);
          }

          .section-inner {
            padding-left: clamp(12px, 3vw, 20px);
            padding-right: clamp(12px, 3vw, 20px);
          }

          .teachers-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 16px;
          }

          .teacher-pill {
            padding: 14px 10px;
            gap: 8px;
            min-height: 138px;
          }

          .teacher-img {
            width: 68px;
            height: 68px;
          }
        }

        @media (max-width: 768px) {
          .page-wrap.teachers-page {
            padding: var(--space-5);
          }

          .section-inner {
            padding-left: clamp(12px, 3vw, 20px);
            padding-right: clamp(12px, 3vw, 20px);
          }

          .teachers-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 15px;
          }

          .principal-card {
            padding: 30px 20px;
          }

          .section-title {
            font-size: 1.75rem;
          }

          .teacher-pill {
            padding: 12px 8px;
            gap: 8px;
            min-height: 132px;
          }

          .teacher-img {
            width: 64px;
            height: 64px;
          }

          .teacher-pill__name {
            font-size: 0.9rem;
            -webkit-line-clamp: 2;
            line-clamp: 2;
          }
        }

        @media (max-width: 600px) {
          .page-wrap.teachers-page {
            padding: var(--space-4);
          }

          .section-inner {
            padding-left: clamp(10px, 2.5vw, 16px);
            padding-right: clamp(10px, 2.5vw, 16px);
          }

          .teachers-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 12px;
          }

          .teacher-pill {
            padding: 10px 6px;
            border-radius: 12px;
            gap: 6px;
            min-height: 124px;
          }

          .teacher-pill__name {
            font-size: 0.85rem;
            -webkit-line-clamp: 2;
            line-clamp: 2;
          }

          .teacher-img {
            width: 58px;
            height: 58px;
            border: 2px solid white;
          }

          .principal-card {
            padding: 25px 15px;
            margin: 15px auto;
          }

          .principal-title {
            font-size: 0.85rem;
          }

          .principal-name {
            font-size: 1.3rem;
            margin: 8px 0;
          }

          .principal-card img {
            width: 100px;
            height: 100px;
            margin-top: 12px;
            border: 3px solid white;
          }

          .section-title {
            font-size: 1.5rem;
          }

          .section-subtitle {
            font-size: 0.9rem;
          }
        }

        @media (max-width: 480px) {
          .page-wrap.teachers-page {
            padding: var(--space-4);
          }

          .section-inner {
            padding-left: clamp(10px, 2.5vw, 16px);
            padding-right: clamp(10px, 2.5vw, 16px);
          }

          .teachers-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 10px;
            width: 100%;
            padding: 0;
          }

          .teacher-pill {
            padding: 8px 5px;
            border-radius: 12px;
            gap: 6px;
            min-height: 118px;
          }

          .teacher-pill__name {
            font-size: 0.8rem;
            font-weight: 700;
            -webkit-line-clamp: 2;
            line-clamp: 2;
          }

          .teacher-img {
            width: 54px;
            height: 54px;
            border: 2px solid white;
          }

          .principal-card {
            padding: 20px 15px;
            margin: 15px auto;
          }

          .principal-title {
            font-size: 0.8rem;
          }

          .principal-name {
            font-size: 1.25rem;
            margin: 8px 0;
          }

          .principal-card img {
            width: 95px;
            height: 95px;
            margin-top: 12px;
            border: 3px solid white;
          }

          .section-title {
            font-size: 1.4rem;
          }

          .section-subtitle {
            font-size: 0.85rem;
          }
        }

        /* Extra small devices */
        @media (max-width: 380px) {
          .page-wrap.teachers-page {
            padding: var(--space-3);
          }

          .section-inner {
            padding-left: clamp(8px, 2vw, 14px);
            padding-right: clamp(8px, 2vw, 14px);
          }

          .teachers-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 8px;
            padding: 0;
          }

          .teacher-pill {
            padding: 7px 4px;
            border-radius: 10px;
            gap: 5px;
            min-height: 112px;
          }

          .teacher-pill__name {
            font-size: 0.75rem;
            -webkit-line-clamp: 2;
            line-clamp: 2;
          }

          .teacher-img {
            width: 50px;
            height: 50px;
            border: 2px solid white;
          }

          .principal-card {
            padding: 15px 12px;
            margin: 10px auto;
          }

          .principal-name {
            font-size: 1.1rem;
            margin: 6px 0;
          }

          .principal-card img {
            width: 85px;
            height: 85px;
            margin-top: 10px;
          }

          .section-title {
            font-size: 1.3rem;
          }

          .section-subtitle {
            font-size: 0.8rem;
          }
        }

        @media (max-width: 360px) {
          .page-wrap.teachers-page {
            padding: var(--space-3);
          }

          .section-inner {
            padding-left: clamp(8px, 2vw, 12px);
            padding-right: clamp(8px, 2vw, 12px);
          }

          .teachers-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 6px;
            padding: 0;
          }

          .teacher-pill {
            padding: 6px 3px;
            border-radius: 10px;
            gap: 4px;
            min-height: 108px;
          }

          .teacher-pill__name {
            font-size: 0.7rem;
            line-height: 1.2;
            -webkit-line-clamp: 2;
            line-clamp: 2;
          }

          .teacher-img {
            width: 46px;
            height: 46px;
            border: 2px solid white;
          }

          .principal-card {
            padding: 12px 10px;
            margin: 8px auto;
          }

          .principal-title {
            font-size: 0.75rem;
            margin-bottom: 4px;
          }

          .principal-name {
            font-size: 1rem;
            margin: 4px 0;
          }

          .principal-card img {
            width: 80px;
            height: 80px;
            margin-top: 8px;
            border: 2px solid white;
          }

          .section-title {
            font-size: 1.2rem;
          }

          .section-subtitle {
            font-size: 0.75rem;
            margin-top: 8px;
          }
        }

        /* Principal Image Modal */
        .principal-image-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          animation: fadeIn 0.3s ease;
          padding: 16px;
          box-sizing: border-box;
        }

        .principal-image-modal-content {
          position: relative;
          width: min(92vw, 420px);
          max-width: 420px;
          max-height: calc(100vh - 32px);
          height: auto;
          box-sizing: border-box;
          animation: slideUp 0.3s ease;
          background: white;
          border-radius: 18px;
          padding: 18px 16px 16px;
          padding-top: 52px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          gap: 10px;
          overflow: auto;
          z-index: 2100;
        }

        .principal-image-modal img {
          flex: 0 0 auto;
          align-self: center;
          width: clamp(88px, 28vw, 124px);
          height: clamp(88px, 28vw, 124px);
          aspect-ratio: 1 / 1;
          object-fit: cover;
          object-position: center;
          border-radius: 50%;
          border: 4px solid #fff;
          margin: 0;
          box-sizing: border-box;
          box-shadow:
            0 12px 32px rgba(0, 0, 0, 0.2),
            0 4px 12px rgba(0, 0, 0, 0.1),
            0 0 0 1px rgba(0, 0, 0, 0.06);
        }

        .modal-teacher-name {
          font-size: clamp(1.05rem, 4.4vw, 1.35rem);
          font-weight: 800;
          color: #1a1a1a;
          margin: 0;
          width: 100%;
          max-width: 100%;
          padding: 0 44px;
          box-sizing: border-box;
          text-align: center;
          font-family: var(--font-heading);
          line-height: 1.2;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: normal;
          word-break: break-word;
        }

        .modal-teacher-subject {
          font-size: clamp(0.9rem, 3.8vw, 1.05rem);
          color: #555;
          text-align: center;
          margin: 0;
          font-weight: 600;
          letter-spacing: 0.3px;
          width: 100%;
          max-width: 100%;
          padding: 0 16px;
          box-sizing: border-box;
          line-height: 1.25;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: normal;
          word-break: break-word;
        }

        .principal-close-btn {
          position: absolute;
          top: 8px;
          right: 8px;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          font-size: 24px;
          cursor: pointer;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          z-index: 2001;
        }

        .principal-close-btn:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
          background: rgba(0, 0, 0, 0.9);
        }

        .principal-card img {
          cursor: pointer;
          transition: transform 0.2s ease;
        }

        .principal-card img:hover {
          transform: scale(1.05);
        }

        /* Expanded teacher portrait — same minimal lightbox (close only, no bookmark) */
        .expanded-image-modal {
          position: fixed;
          inset: 0;
          z-index: 3700;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: max(10px, env(safe-area-inset-top, 0px)) max(10px, env(safe-area-inset-right, 0px))
            max(14px, env(safe-area-inset-bottom, 0px)) max(10px, env(safe-area-inset-left, 0px));
          box-sizing: border-box;
          background: rgba(9, 11, 18, 0.94);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          animation: memoryViewerBackdropIn 0.28s ease forwards;
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
          overscroll-behavior: contain;
          overflow: hidden;
        }

        .expanded-image-content {
          position: relative;
          flex: 1;
          min-height: 0;
          min-width: 0;
          width: 100%;
          max-width: min(100%, 960px);
          max-height: 100%;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          box-sizing: border-box;
          padding: 56px 8px 16px;
        }

        .expanded-image-modal img {
          max-width: 100%;
          max-height: min(calc(100vh - 120px), calc(100dvh - 120px), 78vh, 78dvh, 820px);
          width: auto;
          height: auto;
          object-fit: contain;
          object-position: center;
          border-radius: 12px;
          display: block;
          box-shadow:
            0 8px 40px rgba(0, 0, 0, 0.45),
            0 0 0 1px rgba(255, 255, 255, 0.05);
          animation: memoryViewerImgIn 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        .expanded-image-close-btn {
          position: absolute;
          top: max(4px, env(safe-area-inset-top, 0px));
          right: max(4px, env(safe-area-inset-right, 0px));
          width: 44px;
          height: 44px;
          min-width: 44px;
          min-height: 44px;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.14);
          background: rgba(22, 26, 36, 0.55);
          color: #f8fafc;
          font-size: 1.45rem;
          line-height: 1;
          font-weight: 300;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s ease, transform 0.2s ease, border-color 0.2s ease;
          z-index: 5;
          padding: 0;
          box-sizing: border-box;
        }

        .expanded-image-close-btn:hover {
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(255, 255, 255, 0.22);
        }

        .expanded-image-close-btn:active {
          transform: scale(0.94);
        }

        @media (max-width: 480px) {
          .expanded-image-modal img {
            max-height: min(calc(100vh - 108px), calc(100dvh - 108px), 72vh, 72dvh, 640px);
            border-radius: 10px;
          }

          .expanded-image-content {
            padding-top: 52px;
          }
        }

        @media (max-width: 380px) {
          .expanded-image-modal img {
            max-height: min(calc(100vh - 100px), calc(100dvh - 100px), 68vh, 68dvh, 560px);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        /* Modal Responsive Styles — square card, laptop / tablet / mobile */
        @media (max-width: 1024px) {
          .principal-image-modal img {
            width: clamp(84px, 26vw, 116px);
            height: clamp(84px, 26vw, 116px);
            border: 4px solid #fff;
          }

          .principal-close-btn {
            width: 38px;
            height: 38px;
            font-size: 22px;
            top: 6px;
            right: 6px;
          }
        }

        @media (max-width: 768px) {
          .principal-image-modal img {
            width: clamp(80px, 25vw, 112px);
            height: clamp(80px, 25vw, 112px);
            border: 4px solid #fff;
          }

          .principal-close-btn {
            width: 36px;
            height: 36px;
            font-size: 20px;
            top: 6px;
            right: 6px;
          }
        }

        @media (max-width: 600px) {
          .principal-image-modal {
            padding: 0 12px;
          }

          .principal-image-modal-content {
            width: min(94vw, 380px);
            max-width: 380px;
            border-radius: 14px;
            padding: 16px 14px 14px;
            padding-top: 48px;
          }

          .principal-image-modal img {
            width: clamp(76px, 24vw, 106px);
            height: clamp(76px, 24vw, 106px);
            border: 3.5px solid #fff;
          }

          .modal-teacher-name {
            padding: 0 40px;
          }

          .principal-close-btn {
            width: 34px;
            height: 34px;
            font-size: 18px;
            top: 5px;
            right: 5px;
          }
        }

        @media (max-width: 480px) {
          .principal-image-modal {
            padding: 0 8px;
          }

          .principal-image-modal-content {
            width: min(96vw, 360px);
            max-width: 360px;
            border-radius: 12px;
            padding-top: 46px;
          }

          .principal-image-modal img {
            width: clamp(72px, 24vw, 98px);
            height: clamp(72px, 24vw, 98px);
            border: 3px solid #fff;
          }

          .modal-teacher-name {
            padding: 0 38px;
          }

          .modal-teacher-subject {
            padding: 0 12px;
          }

          .principal-close-btn {
            width: 32px;
            height: 32px;
            font-size: 16px;
            top: 5px;
            right: 5px;
          }
        }

        @media (max-width: 380px) {
          .principal-image-modal img {
            width: clamp(68px, 23vw, 92px);
            height: clamp(68px, 23vw, 92px);
            border: 3px solid #fff;
          }

          .principal-close-btn {
            width: 30px;
            height: 30px;
            font-size: 14px;
          }
        }

        @media (max-width: 360px) {
          .principal-image-modal img {
            width: clamp(64px, 22vw, 88px);
            height: clamp(64px, 22vw, 88px);
            border: 2.5px solid #fff;
          }

          .principal-close-btn {
            width: 28px;
            height: 28px;
            font-size: 12px;
            top: 4px;
            right: 4px;
          }
        }

        @supports (height: 100dvh) {
          .principal-image-modal-content {
            max-height: calc(100dvh - 32px);
          }
        }
      `}</style>

      {/* TITLE */}
      <div className="section-title-wrap">
        <h2 className="section-title">Our Respected Teachers</h2>
        <p className="section-subtitle">
          The people who shaped our batch with dedication and care.
        </p>
      </div>

      {/* PRINCIPAL */}
      <div className="principal-card">
        <div className="principal-title">Principal</div>
        <div className="principal-name">{principal.name}</div>
        <img 
          src={principal.img} 
          alt="Principal" 
          onClick={() => setSelectedTeacher({ ...principal, subject: "Principal" })}
        />
      </div>

      {/* TEACHERS GRID */}
      <div className="teachers-grid">
        {teachers.map((t, index) => (
          <div
            key={index}
            className="teacher-pill"
            style={{ background: teacherGradients[index % teacherGradients.length] }}
            role="button"
            tabIndex={0}
            aria-label={`Open details for ${t.name}`}
            onClick={() => setSelectedTeacher(t)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setSelectedTeacher(t);
              }
            }}
          >
            <img
              src={t.img}
              alt={t.name}
              className="teacher-img"
            />
            <div className="teacher-pill__name">{t.name}</div>
          </div>
        ))}
      </div>

      <section className="school-memories" aria-label="School memories gallery">
        <div className="school-memories__head">
          <h3 className="school-memories__title">School memories</h3>
          <p className="school-memories__subtitle">
            Tap a photo to view it full screen. Tap outside or close when you are done.
          </p>
        </div>
        <div className="school-memories__grid" role="list">
          {TEACHER_GALLERY_IMAGES.map((src, i) => (
            <button
              key={src}
              type="button"
              className="school-memories__tile"
              role="listitem"
              onClick={() => setMemoryIndex(i)}
              aria-label="Open school memory full screen"
            >
              <img src={src} alt="" loading="lazy" decoding="async" />
              <span className="school-memories__tile-shine" aria-hidden />
            </button>
          ))}
        </div>
      </section>

      {typeof document !== "undefined" &&
        memoryIndex !== null &&
        createPortal(
          <div
            className="memory-viewer"
            role="dialog"
            aria-modal="true"
            aria-label="School memory"
            onClick={closeMemoryViewer}
          >
            <div className="memory-viewer__inner" onClick={(e) => e.stopPropagation()}>
              <div className="memory-viewer__chrome">
                <button
                  type="button"
                  className={
                    "memory-viewer__bookmark" +
                    (memoryBookmarks.has(TEACHER_GALLERY_IMAGES[memoryIndex])
                      ? " memory-viewer__bookmark--on"
                      : "")
                  }
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMemoryBookmark();
                  }}
                  aria-pressed={
                    memoryBookmarks.has(TEACHER_GALLERY_IMAGES[memoryIndex])
                  }
                  aria-label={
                    memoryBookmarks.has(TEACHER_GALLERY_IMAGES[memoryIndex])
                      ? "Remove bookmark"
                      : "Bookmark this photo"
                  }
                >
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path
                      d="M6 4.5h12v15l-6-3.5-6 3.5v-15z"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinejoin="round"
                      fill={
                        memoryBookmarks.has(TEACHER_GALLERY_IMAGES[memoryIndex])
                          ? "currentColor"
                          : "none"
                      }
                      fillOpacity={
                        memoryBookmarks.has(TEACHER_GALLERY_IMAGES[memoryIndex])
                          ? 0.35
                          : undefined
                      }
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  className="memory-viewer__close"
                  onClick={closeMemoryViewer}
                  aria-label="Close viewer"
                >
                  ×
                </button>
              </div>
              <div className="memory-viewer__stage">
                <div className="memory-viewer__img-wrap">
                  <img
                    key={TEACHER_GALLERY_IMAGES[memoryIndex]}
                    src={TEACHER_GALLERY_IMAGES[memoryIndex]}
                    alt="School memory"
                    className="memory-viewer__img"
                    decoding="async"
                  />
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* IMAGE MODAL - For Principal and Teachers (portal: fixed positioning vs AnimatedSection transform) */}
      {typeof document !== "undefined" &&
        selectedTeacher &&
        createPortal(
          <div className="principal-image-modal" onClick={() => setSelectedTeacher(null)}>
            <div className="principal-image-modal-content" onClick={(e) => e.stopPropagation()}>
              <button
                className="principal-close-btn"
                onClick={() => setSelectedTeacher(null)}
                title="Close"
              >
                ✕
              </button>
              <img
                src={selectedTeacher.img}
                alt={selectedTeacher.name}
                onClick={(e) => {
                  e.stopPropagation();
                  setExpandedImage(selectedTeacher.img);
                }}
                style={{ cursor: "pointer" }}
                title="Click to view larger"
              />
              <div className="modal-teacher-name">{selectedTeacher.name}</div>
              {selectedTeacher.subject !== "Principal" && (
                <div className="modal-teacher-subject">Sub: {selectedTeacher.subject}</div>
              )}
            </div>
          </div>,
          document.body
        )}

      {/* EXPANDED IMAGE MODAL */}
      {typeof document !== "undefined" &&
        expandedImage &&
        createPortal(
          <div className="expanded-image-modal" onClick={() => setExpandedImage(null)}>
            <div className="expanded-image-content" onClick={(e) => e.stopPropagation()}>
              <button
                className="expanded-image-close-btn"
                onClick={() => setExpandedImage(null)}
                title="Close"
              >
                ✕
              </button>
              <img src={expandedImage} alt="Expanded view" />
            </div>
          </div>,
          document.body
        )}

      </div>
    </div>
  );
};

export default TeachersPage;