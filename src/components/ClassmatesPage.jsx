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

  const palette = useMemo(
    () => ["#38bdf8", "#a78bfa", "#fb7185", "#34d399", "#fbbf24", "#22c55e", "#60a5fa", "#f472b6"],
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

  const buildLayout = (w, count, seed) => {
    const isMobile = w < 520;
    const cardW = isMobile ? 132 : 160;
    const cardH = isMobile ? 40 : 44;
    const gap = isMobile ? 32 : 52; // large enough to allow safe floating without overlap
    const pad = isMobile ? 16 : 20;

    const cols = clamp(Math.floor((w - pad * 2) / (cardW + gap)), 2, isMobile ? 3 : 6);
    const rows = Math.ceil(count / cols);
    const minH = pad * 2 + rows * cardH + Math.max(0, rows - 1) * gap;

    const rng = mulberry32(seed);
    const order = Array.from({ length: count }, (_, i) => i);
    for (let i = order.length - 1; i > 0; i -= 1) {
      const j = Math.floor(rng() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }

    // Collision-safe: movement stays inside the gap budget, even if two neighbors drift toward each other.
    // Effective "free space" between cards is `gap`; allow max drift < gap/2 minus safety.
    const safety = isMobile ? 10 : 12; // includes hover scale allowance
    const floatMax = clamp(Math.floor((gap - safety) / 2), 14, 26); // bounded, smooth, and safe

    const positions = Array.from({ length: count }, () => null);
    order.forEach((originalIndex, slotIndex) => {
      const r = Math.floor(slotIndex / cols);
      const c = slotIndex % cols;

      const left = pad + c * (cardW + gap);
      const top = pad + r * (cardH + gap);

      const phaseX = (rng() * 2 - 1) * floatMax;
      const phaseY = (rng() * 2 - 1) * floatMax;
      const duration = 3 + rng() * 3; // 3s–6s
      const rotate = (rng() * 2 - 1) * 2.2;
      const scale = 0.985 + rng() * 0.045;

      positions[originalIndex] = {
        left,
        top,
        floatX: phaseX,
        floatY: phaseY,
        duration,
        rotate,
        scale,
        hue: palette[originalIndex % palette.length],
        cardW,
        cardH,
      };
    });

    return { positions, cols, rows, minH, cardW, cardH, gap, pad };
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
            <div className="classmates-aquarium__tank" ref={aquariumRef} aria-label="Classmates tank">
              <div className="classmates-aquarium__water" aria-hidden />
              {displayedClassmates.map((name, index) => {
                const p =
                  layout.positions[index] ??
                  ({
                    left: 20,
                    top: 20,
                    floatX: 0,
                    floatY: 0,
                    duration: 4.5,
                    rotate: 0,
                    scale: 1,
                    hue: palette[index % palette.length],
                    cardW: 160,
                    cardH: 44,
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
                    whileHover={{ scale: 1.05 }}
                  >
                    <motion.div
                      className="classmates-fish__motion"
                      animate={{
                        rotate: p.rotate,
                        scale: p.scale,
                        x: [0, p.floatX, 0, -p.floatX * 0.7, 0],
                        y: [0, -p.floatY, 0, p.floatY * 0.7, 0],
                      }}
                      transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <motion.div
                      className="classmates-fish__body"
                      animate={{
                        y: [0, -6, 0],
                        x: [0, 3, 0, -2, 0],
                        rotate: [0, 1.4, 0, -1.2, 0],
                      }}
                      transition={{
                        duration: 3.6 + (index % 7) * 0.22,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      {name}
                    </motion.div>
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
          padding-bottom: 24px;
          font-family: var(--font-body, 'Poppins', sans-serif);
          transition: background 0.45s ease;
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
        }

        .classmates-shell__head {
          text-align: center;
          padding: 18px 14px 18px;
          border-radius: 18px;
          margin: 8px auto 8px;
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
          font-size: 0.95rem;
          font-weight: 600;
          color: rgba(248,250,252,0.72);
          letter-spacing: 0.02em;
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
          padding: 10px clamp(12px, 4vw, 24px) 18px;
          box-sizing: border-box;
        }

        .classmates-aquarium__tank {
          position: relative;
          width: 100%;
          max-width: min(980px, 100%);
          height: min(78vh, 720px);
          min-height: max(620px, ${layout.minH}px);
          margin: 0 auto;
          border-radius: 24px;
          overflow: hidden;
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
          will-change: left, top, transform;
          filter: drop-shadow(0 14px 26px rgba(0,0,0,0.35));
        }

        .classmates-fish__motion {
          width: var(--cardW, 160px);
          height: var(--cardH, 44px);
          will-change: transform;
        }

        .classmates-fish__body {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 10px 12px;
          border-radius: 18px;
          font-family: var(--font-heading, 'Poppins', sans-serif);
          font-weight: 800;
          font-size: 0.94rem;
          color: rgba(248,250,252,0.96);
          letter-spacing: 0.01em;
          background: linear-gradient(180deg, rgba(255,255,255,0.18), rgba(255,255,255,0.10));
          border: 1px solid rgba(255,255,255,0.20);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          box-shadow:
            0 16px 36px rgba(0,0,0,0.42),
            0 0 0 1px rgba(0,0,0,0.18);
          text-shadow: 0 2px 10px rgba(0,0,0,0.55);
          max-width: 190px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          position: relative;
          transition: transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease;
        }

        .classmates-fish__body::before {
          content: "";
          position: absolute;
          inset: -2px;
          border-radius: 18px;
          background: radial-gradient(60% 80% at 20% 20%, color-mix(in srgb, var(--fishHue) 45%, transparent) 0%, transparent 60%),
            radial-gradient(70% 90% at 80% 90%, color-mix(in srgb, var(--fishHue) 35%, transparent) 0%, transparent 62%);
          filter: blur(10px);
          opacity: 0.9;
          pointer-events: none;
        }

        @media (max-width: 480px) {
          .classmates-aquarium__tank {
            min-height: 640px;
            height: min(80vh, 740px);
            border-radius: 20px;
          }

          .classmates-fish__body {
            font-size: 0.92rem;
            padding: 9px 11px;
            max-width: 170px;
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
