import React from "react";

/**
 * Footer “water balloons” — rainbow spectrum, slow drift, z-index 0, pointer-events: none.
 * Spectrum order: red → orange → yellow → green → cyan → blue → indigo → violet (repeats).
 */
const BUBBLES = [
  { size: "lg", left: "2%", tint: "red", delay: "-8s", duration: "42s", drift: "14px", soft: false },
  { size: "md", left: "10%", tint: "orange", delay: "-22s", duration: "36s", drift: "-10px", soft: false },
  { size: "sm", left: "18%", tint: "yellow", delay: "-5s", duration: "48s", drift: "8px", soft: false },
  { size: "md", left: "26%", tint: "green", delay: "-30s", duration: "40s", drift: "-16px", soft: true },
  { size: "sm", left: "38%", tint: "cyan", delay: "-12s", duration: "34s", drift: "6px", soft: true },
  { size: "lg", left: "46%", tint: "blue", delay: "-25s", duration: "44s", drift: "-8px", soft: true },
  { size: "sm", left: "54%", tint: "indigo", delay: "-18s", duration: "38s", drift: "12px", soft: true },
  { size: "md", left: "64%", tint: "violet", delay: "-3s", duration: "46s", drift: "-12px", soft: false },
  { size: "lg", left: "72%", tint: "red", delay: "-35s", duration: "32s", drift: "10px", soft: false },
  { size: "sm", left: "80%", tint: "orange", delay: "-40s", duration: "50s", drift: "-6px", soft: false },
  { size: "md", left: "88%", tint: "yellow", delay: "-15s", duration: "39s", drift: "16px", soft: false },
  { size: "sm", left: "94%", tint: "green", delay: "-28s", duration: "43s", drift: "-14px", soft: false },
];

const FloatingBubbles = () => {
  return (
    <>
      <style>{`
        .floating-bubbles-layer {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          overflow: hidden;
          isolation: isolate;
        }

        .floating-bubbles-layer .fb-bubble {
          position: absolute;
          top: 108%;
          bottom: auto;
          border-radius: 50%;
          transform: translate3d(0, 0, 0);
          will-change: top, transform, opacity;
          isolation: isolate;
          --fb-drift: 0px;
          border: 1.5px solid rgba(255, 255, 255, 0.55);
        }

        .floating-bubbles-layer .fb-bubble::after {
          content: "";
          position: absolute;
          inset: -32%;
          border-radius: 50%;
          filter: blur(16px);
          opacity: 0.55;
          z-index: -1;
          pointer-events: none;
        }

        .floating-bubbles-layer .fb-bubble.fb-tint-red {
          background:
            radial-gradient(circle at 28% 24%, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0.12) 28%, transparent 45%),
            radial-gradient(circle at 50% 55%, rgba(248, 113, 113, 0.78) 0%, rgba(220, 38, 38, 0.58) 55%, rgba(153, 27, 27, 0.45) 100%);
          box-shadow:
            inset 2px 4px 14px rgba(255, 255, 255, 0.45),
            inset -6px -10px 18px rgba(153, 27, 27, 0.22),
            0 0 14px rgba(239, 68, 68, 0.45),
            0 0 32px rgba(248, 113, 113, 0.35);
        }
        .floating-bubbles-layer .fb-bubble.fb-tint-red::after {
          background: radial-gradient(circle, rgba(220, 38, 38, 0.5) 0%, rgba(248, 113, 113, 0.25) 45%, transparent 70%);
        }

        .floating-bubbles-layer .fb-bubble.fb-tint-orange {
          background:
            radial-gradient(circle at 28% 24%, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0.12) 28%, transparent 45%),
            radial-gradient(circle at 50% 55%, rgba(251, 146, 60, 0.78) 0%, rgba(234, 88, 12, 0.58) 55%, rgba(194, 65, 12, 0.45) 100%);
          box-shadow:
            inset 2px 4px 14px rgba(255, 255, 255, 0.45),
            inset -6px -10px 18px rgba(194, 65, 12, 0.2),
            0 0 14px rgba(249, 115, 22, 0.45),
            0 0 32px rgba(251, 146, 60, 0.35);
        }
        .floating-bubbles-layer .fb-bubble.fb-tint-orange::after {
          background: radial-gradient(circle, rgba(234, 88, 12, 0.5) 0%, rgba(251, 146, 60, 0.25) 45%, transparent 70%);
        }

        .floating-bubbles-layer .fb-bubble.fb-tint-yellow {
          background:
            radial-gradient(circle at 28% 24%, rgba(255, 255, 255, 0.88) 0%, rgba(255, 255, 255, 0.18) 28%, transparent 45%),
            radial-gradient(circle at 50% 55%, rgba(250, 204, 21, 0.82) 0%, rgba(202, 138, 4, 0.58) 55%, rgba(161, 98, 7, 0.42) 100%);
          box-shadow:
            inset 2px 4px 14px rgba(255, 255, 255, 0.5),
            inset -6px -10px 18px rgba(161, 98, 7, 0.18),
            0 0 14px rgba(234, 179, 8, 0.48),
            0 0 32px rgba(250, 204, 21, 0.38);
        }
        .floating-bubbles-layer .fb-bubble.fb-tint-yellow::after {
          background: radial-gradient(circle, rgba(202, 138, 4, 0.48) 0%, rgba(250, 204, 21, 0.28) 45%, transparent 70%);
        }

        .floating-bubbles-layer .fb-bubble.fb-tint-green {
          background:
            radial-gradient(circle at 28% 24%, rgba(255, 255, 255, 0.82) 0%, rgba(255, 255, 255, 0.12) 28%, transparent 45%),
            radial-gradient(circle at 50% 55%, rgba(74, 222, 128, 0.75) 0%, rgba(22, 163, 74, 0.55) 55%, rgba(21, 128, 61, 0.42) 100%);
          box-shadow:
            inset 2px 4px 14px rgba(255, 255, 255, 0.42),
            inset -6px -10px 18px rgba(21, 128, 61, 0.2),
            0 0 14px rgba(34, 197, 94, 0.45),
            0 0 32px rgba(74, 222, 128, 0.32);
        }
        .floating-bubbles-layer .fb-bubble.fb-tint-green::after {
          background: radial-gradient(circle, rgba(22, 163, 74, 0.48) 0%, rgba(74, 222, 128, 0.25) 45%, transparent 70%);
        }

        .floating-bubbles-layer .fb-bubble.fb-tint-cyan {
          background:
            radial-gradient(circle at 28% 24%, rgba(255, 255, 255, 0.82) 0%, rgba(255, 255, 255, 0.12) 28%, transparent 45%),
            radial-gradient(circle at 50% 55%, rgba(34, 211, 238, 0.72) 0%, rgba(8, 145, 178, 0.55) 55%, rgba(14, 116, 144, 0.42) 100%);
          box-shadow:
            inset 2px 4px 14px rgba(255, 255, 255, 0.42),
            inset -6px -10px 18px rgba(8, 145, 178, 0.18),
            0 0 14px rgba(6, 182, 212, 0.42),
            0 0 34px rgba(34, 211, 238, 0.32);
        }
        .floating-bubbles-layer .fb-bubble.fb-tint-cyan::after {
          background: radial-gradient(circle, rgba(6, 182, 212, 0.48) 0%, rgba(34, 211, 238, 0.22) 45%, transparent 70%);
        }

        .floating-bubbles-layer .fb-bubble.fb-tint-blue {
          background:
            radial-gradient(circle at 28% 24%, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0.15) 28%, transparent 45%),
            radial-gradient(circle at 50% 55%, rgba(59, 130, 246, 0.75) 0%, rgba(29, 78, 216, 0.55) 55%, rgba(30, 64, 175, 0.45) 100%);
          box-shadow:
            inset 2px 4px 14px rgba(255, 255, 255, 0.45),
            inset -6px -10px 18px rgba(30, 64, 175, 0.2),
            0 0 14px rgba(59, 130, 246, 0.45),
            0 0 32px rgba(96, 165, 250, 0.35);
        }
        .floating-bubbles-layer .fb-bubble.fb-tint-blue::after {
          background: radial-gradient(circle, rgba(37, 99, 235, 0.5) 0%, rgba(59, 130, 246, 0.25) 45%, transparent 70%);
        }

        .floating-bubbles-layer .fb-bubble.fb-tint-indigo {
          background:
            radial-gradient(circle at 28% 24%, rgba(255, 255, 255, 0.82) 0%, rgba(255, 255, 255, 0.12) 28%, transparent 45%),
            radial-gradient(circle at 50% 55%, rgba(129, 140, 248, 0.76) 0%, rgba(67, 56, 202, 0.56) 55%, rgba(55, 48, 163, 0.42) 100%);
          box-shadow:
            inset 2px 4px 14px rgba(255, 255, 255, 0.42),
            inset -6px -10px 18px rgba(55, 48, 163, 0.2),
            0 0 14px rgba(99, 102, 241, 0.45),
            0 0 34px rgba(129, 140, 248, 0.32);
        }
        .floating-bubbles-layer .fb-bubble.fb-tint-indigo::after {
          background: radial-gradient(circle, rgba(67, 56, 202, 0.5) 0%, rgba(129, 140, 248, 0.25) 45%, transparent 70%);
        }

        .floating-bubbles-layer .fb-bubble.fb-tint-violet {
          background:
            radial-gradient(circle at 28% 24%, rgba(255, 255, 255, 0.82) 0%, rgba(255, 255, 255, 0.12) 28%, transparent 45%),
            radial-gradient(circle at 50% 55%, rgba(192, 132, 252, 0.76) 0%, rgba(147, 51, 234, 0.55) 55%, rgba(107, 33, 168, 0.42) 100%);
          box-shadow:
            inset 2px 4px 14px rgba(255, 255, 255, 0.4),
            inset -6px -10px 18px rgba(107, 33, 168, 0.2),
            0 0 14px rgba(168, 85, 247, 0.45),
            0 0 34px rgba(192, 132, 252, 0.32);
        }
        .floating-bubbles-layer .fb-bubble.fb-tint-violet::after {
          background: radial-gradient(circle, rgba(147, 51, 234, 0.48) 0%, rgba(192, 132, 252, 0.22) 45%, transparent 70%);
        }

        .floating-bubbles-layer .fb-bubble--sm {
          width: clamp(18px, 2.8vw, 28px);
          height: clamp(18px, 2.8vw, 28px);
          --fb-base-op: 0.38;
          --fb-peak-op: 0.58;
        }

        .floating-bubbles-layer .fb-bubble--md {
          width: clamp(30px, 4.5vw, 50px);
          height: clamp(30px, 4.5vw, 50px);
          --fb-base-op: 0.4;
          --fb-peak-op: 0.62;
        }

        .floating-bubbles-layer .fb-bubble--lg {
          width: clamp(48px, 7vw, 78px);
          height: clamp(48px, 7vw, 78px);
          --fb-base-op: 0.42;
          --fb-peak-op: 0.68;
        }

        .floating-bubbles-layer .fb-bubble.fb-bubble--soft {
          --fb-base-op: 0.3;
          --fb-peak-op: 0.48;
        }

        @keyframes floatingBubbleRise {
          0% {
            top: 104%;
            transform: translate3d(0, 0, 0);
            opacity: var(--fb-base-op, 0.4);
          }
          10% {
            opacity: var(--fb-peak-op, 0.55);
          }
          90% {
            opacity: var(--fb-peak-op, 0.55);
          }
          100% {
            top: -32%;
            transform: translate3d(var(--fb-drift, 0px), 0, 0);
            opacity: var(--fb-base-op, 0.4);
          }
        }

        .floating-bubbles-layer .fb-bubble {
          animation-name: floatingBubbleRise;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .floating-bubbles-layer .fb-bubble {
            animation: none !important;
            top: 40%;
            transform: translate3d(0, 0, 0);
            opacity: 0.45;
          }
        }
      `}</style>
      <div className="floating-bubbles-layer" aria-hidden="true">
        {BUBBLES.map((b, i) => (
          <span
            key={i}
            className={[
              "fb-bubble",
              `fb-bubble--${b.size}`,
              `fb-tint-${b.tint}`,
              b.soft ? "fb-bubble--soft" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            style={{
              left: b.left,
              animationDuration: b.duration,
              animationDelay: b.delay,
              "--fb-drift": b.drift,
            }}
          />
        ))}
      </div>
    </>
  );
};

export default FloatingBubbles;
