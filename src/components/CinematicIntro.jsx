import React, { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import "./CinematicIntro.css";

export default function CinematicIntro({ onFinish }) {
  const title = "MDRS SCHOOL";
  const doneRef = useRef(false);
  const timerRef = useRef(null);
  const audioRef = useRef(null);

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    if (timerRef.current != null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    const audio = audioRef.current;
    if (audio) {
      try {
        audio.pause();
        audio.removeAttribute("src");
        audio.load();
      } catch {
        // ignore
      }
      audioRef.current = null;
    }
    document.documentElement.classList.remove("cinematic-intro-open");
    onFinish();
  }, [onFinish]);

  useEffect(() => {
    document.documentElement.classList.add("cinematic-intro-open");

    const reduceMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!reduceMotion) {
      const audio = new Audio("/sounds/intro.mp3");
      audio.volume = 0.6;
      audioRef.current = audio;
      audio.play().catch(() => {});

      if (navigator.vibrate) {
        try {
          navigator.vibrate([200, 100, 200]);
        } catch {
          // ignore
        }
      }
    }

    const delayMs = reduceMotion ? 420 : 4800;
    timerRef.current = setTimeout(() => finish(), delayMs);

    return () => {
      if (timerRef.current != null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      const audio = audioRef.current;
      if (audio) {
        try {
          audio.pause();
          audio.removeAttribute("src");
          audio.load();
        } catch {
          // ignore
        }
        audioRef.current = null;
      }
      document.documentElement.classList.remove("cinematic-intro-open");
    };
  }, [finish]);

  const node = (
    <div
      className="cinematic-root cinematic-root--interactive"
      role="presentation"
      tabIndex={-1}
      onPointerDown={(e) => {
        if (doneRef.current) return;
        if (e.pointerType === "mouse" && e.button !== 0) return;
        finish();
      }}
      onKeyDown={(e) => {
        if (doneRef.current) return;
        if (e.key === "Escape" || e.key === " " || e.key === "Enter") {
          e.preventDefault();
          finish();
        }
      }}
    >
      <div className="cinematic-bg" />

      <div className="cinematic-particles">
        {Array.from({ length: 12 }).map((_, i) => (
          <span key={i} style={{ "--i": i }} />
        ))}
      </div>

      <h1 className="cinematic-title">
        {title.split("").map((char, i) => (
          <span key={i} style={{ "--i": i }}>
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </h1>
    </div>
  );

  return createPortal(node, document.body);
}