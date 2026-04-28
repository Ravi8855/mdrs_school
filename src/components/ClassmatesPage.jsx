import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const PREVIEW_COUNT = 6;

function mulberry32(seed) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let x = t;
    x = Math.imul(x ^ (x >>> 15), x | 1);
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

/** Deterministic shuffle using seed (Fisher–Yates). */
function shuffledOrder(count, rng) {
  const order = Array.from({ length: count }, (_, i) => i);
  for (let i = order.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

const ClassmatesPage = ({ variant = "full" }) => {
  const classmates = useMemo(
    () => [
    "Ambadas", "Arun", "Bhimu", "Bhimashankar",
    "Hrutik", "Jattappa", "Ningappa", "Mallikarjun", "Marilinga",
    "Ravi", "Vinod", "Viresh", "Chandrashekar", "Gollalappa", "Sunil",
    "Ambika", "Bheembai", "Chaitra", "Ganga", "Mallamma", "Ningamma",
    "Parvati", "Prema", "Roopa", "Savita", "Sharanamma",
    "Shweta", "Shweta H", "Suvarna", "Umashree",
    "Mahesh", "Praveen", "Suchitra", "Shreedevi",
    "Mamtha", "Archana",
    ],
    []
  );

  const isPreview = variant === "preview";
  const displayedClassmates = isPreview ? classmates.slice(0, PREVIEW_COUNT) : classmates;

  const aquariumRef = useRef(null);
  const [tankSize, setTankSize] = useState({ w: 0, h: 0 });
  const [layout, setLayout] = useState({ positions: [], cols: 0, rows: 0, minH: 0 });
  const [layoutSeed, setLayoutSeed] = useState(1);
  // internal timer holder for burst reset (avoids reflow/jitter)
  // eslint-disable-next-line no-underscore-dangle
  ClassmatesPage.__shuffleTimer ??= 0;

  /** Cool accent per student (cycles); drives card tint + glow. */
  const palette = useMemo(
    () => [
      "#22d3ee",
      "#38bdf8",
      "#60a5fa",
      "#818cf8",
      "#a78bfa",
      "#c084fc",
      "#e879f9",
      "#14b8a6",
      "#5eead4",
      "#34d399",
      "#4ade80",
      "#7dd3fc",
      "#93c5fd",
      "#67e8f9",
      "#a5f3fc",
      "#7c3aed",
      "#6366f1",
      "#0ea5e9",
      "#06b6d4",
      "#2dd4bf",
      "#10b981",
      "#8b5cf6",
      "#d946ef",
      "#0891b2",
      "#2563eb",
    ],
    []
  );

  useEffect(() => {
    const el = aquariumRef.current;
    if (!el) return undefined;
    const ro = new ResizeObserver((entries) => {
      const cr = entries[0]?.contentRect;
      if (!cr) return;
      setTankSize({ w: Math.floor(cr.width), h: Math.floor(cr.height) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /**
   * Collision-safe grid: each card lives in a fixed cell. Cell size = card + static gap +
   * 2×(float envelope + hover slack). Float motion is strictly ≤ floatMax so neighbors never overlap.
   */
  const buildLayout = (w, count, seed) => {
    const isNarrow = w > 0 && w < 400;
    const isMobile = w < 768;

    const pad = isNarrow ? 10 : isMobile ? 12 : 20;
    const inner = Math.max(0, w - pad * 2);

    let cardW = isNarrow ? 108 : isMobile ? 118 : 156;
    let cardH = isNarrow ? 34 : isMobile ? 36 : 40;

    /** Exactly two names per row (two columns) whenever there is more than one student. */
    const cols = count <= 1 ? 1 : 2;

    const hoverSlack = () => Math.ceil(cardW * 0.03) + 4; // whileHover 1.05 + blur slack

    let gapVisual = isNarrow ? 16 : isMobile ? 18 : 22;
    let floatMax = isNarrow ? 8 : isMobile ? 10 : 16;
    floatMax = clamp(floatMax, 6, 22);

    const cellSize = () => ({
      cellW: cardW + gapVisual + 2 * (floatMax + hoverSlack()),
      cellH: cardH + gapVisual + 2 * (floatMax + hoverSlack()),
    });

    let { cellW, cellH } = cellSize();

    // Tighten until two columns fit (never reduce below 2 cols when count > 1).
    let guard = 0;
    while (cols * cellW > inner && guard < 36) {
      if (floatMax > 4) floatMax -= 1;
      else if (gapVisual > 12) gapVisual -= 1;
      else if (cardW > 92) {
        cardW -= 4;
        cardH = Math.max(30, cardH - 1);
      } else break;
      ({ cellW, cellH } = cellSize());
      guard += 1;
    }

    const rows = Math.ceil(count / cols);
    const minH = pad * 2 + rows * cellH;

    const slotRng = mulberry32(seed >>> 0);
    const order = shuffledOrder(count, slotRng);
    const animRng = mulberry32((seed ^ 0x9e3779b9) >>> 0);

    const positions = Array.from({ length: count }, () => null);
    order.forEach((studentIndex, slotIndex) => {
      const r = Math.floor(slotIndex / cols);
      const c = slotIndex % cols;
      const cellLeft = pad + c * cellW;
      const cellTop = pad + r * cellH;
      const left = cellLeft + (cellW - cardW) / 2;
      const top = cellTop + (cellH - cardH) / 2;

      /* ~2–3.6s per cycle (faster drift; layout/gap unchanged). */
      const duration = 2 + animRng() * 1.6;
      const floatX = (animRng() * 2 - 1) * floatMax;
      const floatY = (animRng() * 2 - 1) * floatMax;

      positions[studentIndex] = {
        left,
        top,
        floatX,
        floatY,
        floatMax,
        duration,
        hue: palette[studentIndex % palette.length],
        cardW,
        cardH,
        cellW,
        cellH,
      };
    });

    return { positions, cols, rows, minH, cardW, cardH, cellW, cellH, gapVisual, floatMax, pad };
  };

  useEffect(() => {
    if (!tankSize.w) return;
    setLayout(buildLayout(tankSize.w, displayedClassmates.length, layoutSeed));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tankSize.w, displayedClassmates.length, layoutSeed]);

  return (
    <motion.div
      className="page-wrap classmates-page classmates-page--aquarium"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="section-inner">
        <div className="classmates-shell">
          <header className="classmates-shell__head">
            <h2 className="classmates-shell__title">Classmates</h2>
            <p className="classmates-shell__subtitle">All students in your class</p>
            {!isPreview ? (
              <div className="classmates-shell__cta">
                <motion.button
                  type="button"
                  className="mode-btn mode-btn--premium"
                  onClick={() => {
                    if (!tankSize.w) return;
                    setLayoutSeed((s) => s + 1);
                  }}
                  whileTap={{ scale: 0.96 }}
                >
                  <span className="mode-btn__label">Click Me</span>
                  <span className="mode-btn__shimmer" aria-hidden />
                </motion.button>
              </div>
            ) : null}
          </header>

          <section className={`classmates-aquarium${isPreview ? " classmates-aquarium--preview" : ""}`}>
            <div
              className="classmates-aquarium__tank"
              ref={aquariumRef}
              aria-label="Classmates tank"
              style={{
                ["--classmates-tank-min-h"]: `${Math.max(layout.minH || 0, 320)}px`,
              }}
            >
              <div className="classmates-aquarium__water" aria-hidden />
              {displayedClassmates.map((name, index) => {
                const p =
                  layout.positions[index] ??
                  ({
                    left: 20,
                    top: 20,
                    floatX: 0,
                    floatY: 0,
                    floatMax: 0,
                    duration: 2.8,
                    hue: palette[index % palette.length],
                    cardW: 156,
                    cardH: 40,
                    cellW: 156,
                    cellH: 40,
                  });
                return (
                  <motion.div
                    key={`${name}-${index}`}
                    className="classmates-fish"
                    style={{
                      ["--fishHue"]: p.hue,
                      ["--cardW"]: `${p.cardW}px`,
                      ["--cardH"]: `${p.cardH}px`,
                    }}
                    animate={{
                      left: p.left,
                      top: p.top,
                    }}
                    transition={{
                      duration: 0.65,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    whileHover={{
                      scale: 1.05,
                      transition: { duration: 0.32, ease: [0.45, 0, 0.55, 1] },
                    }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <motion.div
                      className="classmates-fish__motion"
                      animate={{
                        x: [0, p.floatX, 0, -p.floatX * 0.82, 0],
                        y: [0, -p.floatY, 0, p.floatY * 0.78, 0],
                      }}
                      transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        ease: [0.45, 0, 0.55, 1],
                      }}
                    >
                      <div className="classmates-fish__body">{name}</div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </section>

          {isPreview ? (
            <div className="shuffle-btn-wrap shuffle-btn-wrap--after-grid">
              <Link to="/batch-students" className="shuffle-btn">
                View all students
              </Link>
            </div>
          ) : null}
        </div>

      </div>

      <style>{`
        .classmates-page {
          background: #f1f5f9;
          padding-bottom: calc(24px + env(safe-area-inset-bottom, 0px));
          font-family: var(--font-body, 'Poppins', sans-serif);
          transition: background 0.45s ease;
          overflow-x: hidden;
          box-sizing: border-box;
        }

        .classmates-page--aquarium {
          background: radial-gradient(1200px 700px at 20% 0%, rgba(56, 189, 248, 0.18) 0%, transparent 55%),
            radial-gradient(1000px 700px at 80% 18%, rgba(167, 139, 250, 0.14) 0%, transparent 52%),
            linear-gradient(165deg, #0b1220 0%, #0f172a 55%, #070b14 100%);
        }

        .classmates-shell {
          width: 100%;
          max-width: 980px;
          margin: 0 auto;
          box-sizing: border-box;
        }

        .classmates-shell__head {
          text-align: center;
          padding: calc(14px + env(safe-area-inset-top, 0px) * 0.35) 14px 16px;
          border-radius: 18px;
          margin: 8px auto 8px;
          box-sizing: border-box;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: 0 10px 30px rgba(0,0,0,0.35);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }

        .classmates-shell__title {
          font-size: clamp(1.6rem, 5vw, 2.1rem);
          font-family: var(--font-heading, 'Poppins', sans-serif);
          font-weight: 800;
          color: #f8fafc;
          margin: 0 0 6px;
          letter-spacing: 0.02em;
          line-height: 1.15;
        }

        .classmates-shell__title {
          text-shadow: 0 10px 30px rgba(0,0,0,0.35);
        }

        .classmates-shell__subtitle {
          margin: 0;
          font-size: clamp(0.82rem, 3.5vw, 0.95rem);
          font-weight: 600;
          color: rgba(248,250,252,0.72);
          letter-spacing: 0.02em;
          padding: 0 4px;
        }

        .classmates-shell__cta {
          display: flex;
          justify-content: center;
          margin-top: 14px;
        }

        .mode-btn {
          position: relative;
          isolation: isolate;
          padding: 10px 18px;
          font-size: 0.95rem;
          background: linear-gradient(135deg, rgba(251, 191, 36, 0.92), rgba(59, 130, 246, 0.9));
          color: #0b1220;
          border: 1px solid rgba(255,255,255,0.16);
          border-radius: 16px;
          cursor: pointer;
          font-weight: 700;
          min-width: 120px;
          width: auto;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          text-align: center;
          text-decoration: none;
          box-sizing: border-box;
          transition: all 0.25s ease;
          box-shadow:
            0 10px 28px rgba(0,0,0,0.42),
            0 0 0 1px rgba(251,191,36,0.18),
            0 0 26px rgba(251,191,36,0.22);
        }

        .mode-btn:hover {
          transform: translateY(-1px);
          box-shadow:
            0 14px 34px rgba(0,0,0,0.5),
            0 0 0 1px rgba(251,191,36,0.22),
            0 0 34px rgba(251,191,36,0.24);
        }

        .mode-btn__label {
          position: relative;
          z-index: 2;
          letter-spacing: 0.02em;
        }

        .mode-btn__shimmer {
          position: absolute;
          inset: 0;
          z-index: 1;
          background: linear-gradient(110deg, transparent 0%, rgba(255,255,255,0.25) 45%, transparent 55%);
          background-size: 200% 100%;
          animation: mode-shimmer 1.6s ease-in-out infinite;
          mix-blend-mode: soft-light;
        }

        @keyframes mode-shimmer {
          0% { background-position: 120% 0; }
          100% { background-position: -20% 0; }
        }

        .shuffle-btn-wrap {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 16px;
          width: 100%;
          box-sizing: border-box;
        }

        .shuffle-btn-wrap--after-grid {
          margin-top: clamp(18px, 4vw, 28px);
          margin-bottom: 4px;
          padding-left: clamp(12px, 4vw, 24px);
          padding-right: clamp(12px, 4vw, 24px);
        }
        @media (max-width: 480px) {
          .shuffle-btn-wrap--after-grid {
            padding-left: 12px;
            padding-right: 12px;
          }
        }
        @media (max-width: 360px) {
          .shuffle-btn-wrap--after-grid {
            padding-left: 10px;
            padding-right: 10px;
          }
        }

        .shuffle-btn {
          padding: 8px 22px;
          font-size: 0.95rem;
          background: #2d3436;
          color: #fff;
          border: none;
          border-radius: 20px;
          cursor: pointer;
          font-weight: 600;
          min-width: 110px;
          width: auto;
          display: inline-block;
          text-align: center;
          text-decoration: none;
          box-sizing: border-box;
        }
        
        @media (min-width: 1200px) {
          .shuffle-btn {
            padding: 9px 24px;
            font-size: 1rem;
            border-radius: 22px;
            min-width: 120px;
          }
        }

        .classmates-aquarium {
          width: 100%;
          padding: 8px clamp(8px, 3.2vw, 24px) calc(14px + env(safe-area-inset-bottom, 0px));
          box-sizing: border-box;
        }

        .classmates-aquarium__tank {
          position: relative;
          width: 100%;
          max-width: min(980px, 100%);
          height: min(78vh, 720px);
          min-height: var(--classmates-tank-min-h, 620px);
          margin: 0 auto;
          border-radius: 24px;
          overflow: hidden;
          box-sizing: border-box;
          background:
            radial-gradient(900px 420px at 20% 0%, rgba(56, 189, 248, 0.14) 0%, transparent 58%),
            radial-gradient(700px 420px at 88% 22%, rgba(251, 191, 36, 0.12) 0%, transparent 60%),
            linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03));
          border: 1px solid rgba(255,255,255,0.12);
          box-shadow:
            0 18px 55px rgba(0,0,0,0.55),
            inset 0 1px 0 rgba(255,255,255,0.08);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }

        .classmates-aquarium__water {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.9;
          background:
            radial-gradient(1200px 420px at 50% -40%, rgba(255,255,255,0.22) 0%, transparent 52%),
            linear-gradient(180deg, rgba(56, 189, 248, 0.10), rgba(15, 23, 42, 0.10));
          mix-blend-mode: screen;
        }

        .classmates-fish {
          position: absolute;
          left: 0;
          top: 0;
          width: var(--cardW, 156px);
          height: var(--cardH, 40px);
          transform-origin: center center;
          will-change: left, top, transform;
          filter: drop-shadow(0 12px 24px rgba(0,0,0,0.38));
        }

        .classmates-fish__motion {
          width: var(--cardW, 156px);
          height: var(--cardH, 40px);
          will-change: transform;
          transform-origin: center center;
        }

        .classmates-fish__body {
          width: 100%;
          height: 100%;
          max-width: none;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 10px 12px;
          border-radius: 16px;
          font-family: var(--font-heading, 'Poppins', sans-serif);
          font-weight: 800;
          font-size: 0.94rem;
          color: rgba(248,250,252,0.98);
          letter-spacing: 0.01em;
          background:
            linear-gradient(155deg,
              color-mix(in srgb, var(--fishHue) 52%, rgba(15, 23, 42, 0.35)) 0%,
              color-mix(in srgb, var(--fishHue) 28%, rgba(15, 23, 42, 0.55)) 48%,
              color-mix(in srgb, var(--fishHue) 14%, rgba(15, 23, 42, 0.72)) 100%),
            linear-gradient(180deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.04) 100%);
          border: 1px solid color-mix(in srgb, var(--fishHue) 42%, rgba(255,255,255,0.22));
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow:
            0 0 0 1px color-mix(in srgb, var(--fishHue) 25%, transparent) inset,
            0 14px 32px rgba(0,0,0,0.42),
            0 0 22px color-mix(in srgb, var(--fishHue) 20%, transparent);
          text-shadow: 0 1px 2px rgba(0,0,0,0.45), 0 0 18px color-mix(in srgb, var(--fishHue) 32%, transparent);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          position: relative;
          transition: box-shadow 0.35s cubic-bezier(0.45, 0, 0.55, 1), border-color 0.35s ease, filter 0.35s ease;
        }

        .classmates-fish:hover .classmates-fish__body,
        .classmates-fish:focus-within .classmates-fish__body {
          box-shadow:
            0 0 0 1px color-mix(in srgb, var(--fishHue) 35%, transparent) inset,
            0 18px 40px rgba(0,0,0,0.48),
            0 0 32px color-mix(in srgb, var(--fishHue) 28%, transparent);
        }

        .classmates-fish__body::before {
          content: "";
          position: absolute;
          inset: -3px;
          border-radius: 20px;
          background:
            radial-gradient(70% 85% at 18% 12%, color-mix(in srgb, var(--fishHue) 55%, transparent) 0%, transparent 55%),
            radial-gradient(65% 80% at 92% 88%, color-mix(in srgb, var(--fishHue) 40%, transparent) 0%, transparent 58%);
          filter: blur(14px);
          opacity: 0.85;
          pointer-events: none;
        }

        @media (max-width: 520px) {
          .classmates-aquarium__tank {
            height: min(74vh, 760px);
            min-height: var(--classmates-tank-min-h, 560px);
            border-radius: 18px;
          }

          .classmates-fish__body {
            font-size: clamp(0.8rem, 3.6vw, 0.92rem);
            padding: 8px 10px;
            border-radius: 14px;
          }

          .classmates-fish__body::before {
            border-radius: 16px;
          }

          .classmates-shell__head {
            margin-left: 0;
            margin-right: 0;
            border-radius: 16px;
            padding-left: max(12px, env(safe-area-inset-left, 0px));
            padding-right: max(12px, env(safe-area-inset-right, 0px));
          }

          .mode-btn {
            min-height: 44px;
            padding: 10px 20px;
            touch-action: manipulation;
          }
        }

        @media (max-width: 380px) {
          .classmates-aquarium__tank {
            height: min(72vh, 720px);
            border-radius: 14px;
          }

          .classmates-fish__body {
            padding: 7px 9px;
          }
        }

        @media (max-width: 768px) {
          .shuffle-btn {
            padding: 7px 20px;
            font-size: 0.9rem;
            border-radius: 18px;
            min-width: 100px;
          }
        }
        
        @media (max-width: 480px) {
          .shuffle-btn {
            padding: 5px 16px;
            font-size: 0.8rem;
            border-radius: 14px;
            min-width: 85px;
          }
        }
        
        @media (max-width: 360px) {
          .shuffle-btn {
            padding: 4px 14px;
            font-size: 0.75rem;
            border-radius: 12px;
            min-width: 75px;
          }
        }


      `}</style>
    </motion.div>
  );
};

export default ClassmatesPage;
