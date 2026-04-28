import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import "./CinematicIntro.css";

export default function CinematicIntro({ onFinish }) {
  const title = "MDRS SCHOOL";

  useEffect(() => {
    document.documentElement.classList.add("cinematic-intro-open");

    // 🔊 Play sound
    const audio = new Audio("/sounds/intro.mp3");
    audio.volume = 0.6;
    audio.play().catch(() => {});

    // 📳 Vibration (mobile only)
    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200]);
    }

    // ⏳ End intro
    const timer = setTimeout(() => {
      onFinish();
    }, 4800);

    return () => {
      clearTimeout(timer);
      document.documentElement.classList.remove("cinematic-intro-open");
    };
  }, [onFinish]);

  const node = (
    <div className="cinematic-root">
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