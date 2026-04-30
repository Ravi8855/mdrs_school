import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { BATCH_2014_CLASS_NAMES } from "../data/batch2014Students";

/** Cap for perf on low-end devices */
const MAX_NAMES = 48;

/** “Click Me” reshuffle duration — slightly longer = calmer flight (all batch pages). */
const SHUFFLE_MS = 1040;
const EPS = 0.5;

/** Smooth deceleration for shuffle flight */
function easeOutCubic(t) {
  const u = 1 - Math.max(0, Math.min(1, t));
  return 1 - u * u * u;
}

/** Gentle “pop” mid-flight (1 → ~1.07 → 1) */
function shuffleScale(ti) {
  if (ti <= 0 || ti >= 1) return 1;
  return 1 + Math.sin(ti * Math.PI) * 0.075;
}

function pickDistantTarget(b, w, h, fromX, fromY) {
  const minSq = 55 * 55;
  for (let tries = 0; tries < 18; tries++) {
    const tx = Math.random() * Math.max(EPS, w - b.w);
    const ty = Math.random() * Math.max(EPS, h - b.h);
    const dx = tx + b.w / 2 - (fromX + b.w / 2);
    const dy = ty + b.h / 2 - (fromY + b.h / 2);
    if (dx * dx + dy * dy >= minSq) return { tx, ty };
  }
  return {
    tx: Math.random() * Math.max(EPS, w - b.w),
    ty: Math.random() * Math.max(EPS, h - b.h),
  };
}

/**
 * @typedef {{ name: string, x: number, y: number, vx: number, vy: number, w: number, h: number, tx: number, ty: number }} Bubble
 */

function bubbleStyle(i, n) {
  const hue = Math.round((360 * i) / Math.max(n, 1));
  const hue2 = (hue + 38) % 360;
  return {
    background: `linear-gradient(145deg, hsl(${hue2}, 62%, 88%), hsl(${hue}, 58%, 76%))`,
    color: `hsl(${(hue + 160) % 360}, 42%, 18%)`,
    border: `1px solid hsla(${hue}, 55%, 38%, 0.38)`,
    boxShadow: `0 2px 8px hsla(${hue}, 40%, 30%, 0.18), 0 1px 2px rgba(0,0,0,0.06)`,
  };
}

/** Cruise speeds — a bit slower than before for calmer, still lively motion (~58–132 px/s). */
function randSpeed() {
  const pxPerSec = 58 + Math.random() * 74;
  const th = Math.random() * Math.PI * 2;
  return { vx: Math.cos(th) * pxPerSec, vy: Math.sin(th) * pxPerSec };
}

function placeRandom(b, cw, ch) {
  b.x = Math.random() * Math.max(EPS, cw - b.w);
  b.y = Math.random() * Math.max(EPS, ch - b.h);
}

/**
 * Interactive “aquarium” — continuous rAF physics, translate3d only, no layout thrash.
 */
export default function Batch2014NameAquarium({
  names = BATCH_2014_CLASS_NAMES,
  aquariumAriaLabel = "Animated aquarium of 2014 batch names",
  /** Use `"large"` for long class lists (e.g. 2015 batch) — taller tank only. */
  aquariumSize = "default",
}) {
  const list = useMemo(() => names.slice(0, MAX_NAMES), [names]);
  const n = list.length;

  const wrapRef = useRef(null);
  const itemRefs = useRef([]);
  const measureAndInitRef = useRef(() => {});
  const sim = useRef({
    /** @type {Bubble[]} */
    bubbles: [],
    cw: 320,
    ch: 320,
    lastT: 0,
    raf: 0,
    shuffleFrom: /** @type {{x:number,y:number}[] | null} */ (null),
    shuffleUntil: 0,
    /** True once the main physics loop has been started (avoids duplicate loops). */
    loopRunning: false,
  });

  const colors = useMemo(() => list.map((_, i) => bubbleStyle(i, n)), [list, n]);

  const applyTransforms = useCallback(() => {
    const { bubbles } = sim.current;
    const refs = itemRefs.current;
    for (let i = 0; i < bubbles.length; i++) {
      const el = refs[i];
      if (el) el.style.transform = `translate3d(${bubbles[i].x}px, ${bubbles[i].y}px, 0)`;
    }
  }, []);

  const measureAndInit = useCallback(() => {
    const root = wrapRef.current;
    if (!root || list.length === 0) return;
    const cw = root.clientWidth;
    const ch = root.clientHeight;
    if (cw < 8 || ch < 8) return;
    const refs = itemRefs.current;
    const bubbles = list.map((name, i) => {
      const el = refs[i];
      const w = el ? el.offsetWidth : 72;
      const h = el ? el.offsetHeight : 28;
      const b = { name, x: 0, y: 0, vx: 0, vy: 0, w, h, tx: 0, ty: 0 };
      placeRandom(b, cw, ch);
      const sp = randSpeed();
      b.vx = sp.vx;
      b.vy = sp.vy;
      b.tx = b.x;
      b.ty = b.y;
      return b;
    });
    sim.current.bubbles = bubbles;
    sim.current.cw = cw;
    sim.current.ch = ch;
    sim.current.lastT = performance.now();
    sim.current.shuffleUntil = 0;
    sim.current.shuffleFrom = null;
    applyTransforms();
  }, [list, applyTransforms]);

  measureAndInitRef.current = measureAndInit;

  const clampToAquarium = useCallback(() => {
    const root = wrapRef.current;
    const { bubbles } = sim.current;
    if (!root || bubbles.length === 0) return;
    const cw = root.clientWidth;
    const ch = root.clientHeight;
    if (cw < 8 || ch < 8) return;
    sim.current.cw = cw;
    sim.current.ch = ch;
    const refs = itemRefs.current;
    for (let i = 0; i < bubbles.length; i++) {
      const b = bubbles[i];
      const el = refs[i];
      if (el) {
        b.w = el.offsetWidth;
        b.h = el.offsetHeight;
      }
      b.x = Math.max(0, Math.min(b.x, cw - b.w));
      b.y = Math.max(0, Math.min(b.y, ch - b.h));
      b.tx = Math.max(0, Math.min(b.tx, cw - b.w));
      b.ty = Math.max(0, Math.min(b.ty, ch - b.h));
    }
    applyTransforms();
  }, [applyTransforms]);

  /** Synchronous init after DOM + refs exist (avoids rAF race with physics loop). */
  useLayoutEffect(() => {
    measureAndInit();
    const root = wrapRef.current;
    const ro =
      typeof ResizeObserver !== "undefined" && root
        ? new ResizeObserver(() => {
            clampToAquarium();
          })
        : null;
    ro?.observe(root);
    return () => ro?.disconnect();
  }, [measureAndInit, clampToAquarium]);

  useEffect(() => {
    if (list.length === 0) return undefined;
    const s = sim.current;
    if (s.loopRunning) return undefined;
    s.loopRunning = true;

    const step = (now) => {
      const sc = sim.current;
      let { bubbles } = sc;

      if (!wrapRef.current) {
        sc.raf = requestAnimationFrame(step);
        return;
      }

      if (!bubbles.length) {
        measureAndInitRef.current();
        bubbles = sc.bubbles;
        if (!bubbles.length) {
          sc.raf = requestAnimationFrame(step);
          return;
        }
      }

      let cw = wrapRef.current.clientWidth;
      let ch = wrapRef.current.clientHeight;
      if (cw < 24 || ch < 24) {
        measureAndInitRef.current();
        sc.raf = requestAnimationFrame(step);
        return;
      }
      sc.cw = cw;
      sc.ch = ch;

      const last = sc.lastT || now;
      const rawDt = (now - last) / 1000;
      const dt = Math.min(0.05, Math.max(0.001, rawDt));
      sc.lastT = now;

      const refs = itemRefs.current;

      if (sc.shuffleUntil > 0 && sc.shuffleFrom) {
        const elapsed = SHUFFLE_MS - Math.max(0, sc.shuffleUntil - now);
        const nB = bubbles.length;
        const stagger = Math.min(16, Math.max(6, Math.floor(220 / Math.max(1, nB))));
        const totalStagger = stagger * Math.max(0, nB - 1);
        const travelMs = Math.max(280, SHUFFLE_MS - totalStagger);
        for (let i = 0; i < bubbles.length; i++) {
          const b = bubbles[i];
          const f = sc.shuffleFrom[i];
          const te = elapsed - i * stagger;
          const ti = te <= 0 ? 0 : Math.min(1, te / travelMs);
          const k = ti >= 1 ? 1 : easeOutCubic(ti);
          b.x = f.x + (b.tx - f.x) * k;
          b.y = f.y + (b.ty - f.y) * k;
        }
        if (now >= sc.shuffleUntil) {
          sc.shuffleUntil = 0;
          sc.shuffleFrom = null;
          for (const b of bubbles) {
            const sp = randSpeed();
            b.vx = sp.vx;
            b.vy = sp.vy;
          }
        }
      } else {
        for (const b of bubbles) {
          b.x += b.vx * dt;
          b.y += b.vy * dt;
        }

        for (const b of bubbles) {
          if (b.x < 0) {
            b.x = 0;
            b.vx *= -1;
          } else if (b.x + b.w > cw) {
            b.x = cw - b.w;
            b.vx *= -1;
          }
          if (b.y < 0) {
            b.y = 0;
            b.vy *= -1;
          } else if (b.y + b.h > ch) {
            b.y = ch - b.h;
            b.vy *= -1;
          }
        }

        for (let pass = 0; pass < 2; pass++) {
          for (let i = 0; i < bubbles.length; i++) {
            for (let j = i + 1; j < bubbles.length; j++) {
              const a = bubbles[i];
              const b = bubbles[j];
              const ox = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
              const oy = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
              if (ox <= 0 || oy <= 0) continue;

              const cxA = a.x + a.w / 2;
              const cyA = a.y + a.h / 2;
              const cxB = b.x + b.w / 2;
              const cyB = b.y + b.h / 2;

              if (ox < oy) {
                const push = ox / 2 + 0.01;
                if (cxA < cxB) {
                  a.x -= push;
                  b.x += push;
                } else {
                  a.x += push;
                  b.x -= push;
                }
                const t = a.vx;
                a.vx = b.vx;
                b.vx = t;
              } else {
                const push = oy / 2 + 0.01;
                if (cyA < cyB) {
                  a.y -= push;
                  b.y += push;
                } else {
                  a.y += push;
                  b.y -= push;
                }
                const t = a.vy;
                a.vy = b.vy;
                b.vy = t;
              }

              a.x = Math.max(0, Math.min(a.x, cw - a.w));
              a.y = Math.max(0, Math.min(a.y, ch - a.h));
              b.x = Math.max(0, Math.min(b.x, cw - b.w));
              b.y = Math.max(0, Math.min(b.y, ch - b.h));
            }
          }
        }
      }

      const shuffling = sc.shuffleUntil > 0 && sc.shuffleFrom;
      const nB2 = bubbles.length;
      const stagger2 = Math.min(16, Math.max(6, Math.floor(220 / Math.max(1, nB2))));
      const travelMs2 = Math.max(280, SHUFFLE_MS - stagger2 * Math.max(0, nB2 - 1));
      const elapsed2 = shuffling ? SHUFFLE_MS - Math.max(0, sc.shuffleUntil - now) : 0;

      for (let i = 0; i < bubbles.length; i++) {
        const el = refs[i];
        const b = bubbles[i];
        if (!el) continue;
        let scale = 1;
        if (shuffling) {
          const te = elapsed2 - i * stagger2;
          const ti = te <= 0 ? 0 : Math.min(1, te / travelMs2);
          scale = shuffleScale(ti);
        }
        el.style.transform = `translate3d(${b.x}px, ${b.y}px, 0) scale(${scale})`;
      }

      sc.raf = requestAnimationFrame(step);
    };

    sim.current.lastT = performance.now();
    sim.current.raf = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(sim.current.raf);
      sim.current.loopRunning = false;
    };
  }, [list]);

  const onClickMe = useCallback(() => {
    const sc = sim.current;
    let { bubbles } = sc;
    if (!wrapRef.current) return;
    if (!bubbles.length) {
      measureAndInitRef.current();
      bubbles = sc.bubbles;
    }
    if (!bubbles.length) return;
    const w = wrapRef.current.clientWidth;
    const h = wrapRef.current.clientHeight;
    if (w < 24 || h < 24) return;
    sc.cw = w;
    sc.ch = h;
    sc.shuffleFrom = bubbles.map((b) => ({ x: b.x, y: b.y }));
    for (const b of bubbles) {
      const { tx, ty } = pickDistantTarget(b, w, h, b.x, b.y);
      b.tx = tx;
      b.ty = ty;
    }
    sc.shuffleUntil = performance.now() + SHUFFLE_MS;
    sc.lastT = performance.now();
  }, []);

  const rootLarge = aquariumSize === "large";

  return (
    <div
      className={`batch-2014-aquarium-root${rootLarge ? " batch-2014-aquarium-root--large" : ""}`}
    >
      <style>{`
        .batch-2014-aquarium-root {
          width: 100%;
          max-width: 1200px;
          margin: clamp(18px, 4vw, 28px) auto 0;
          padding: 0 clamp(8px, 2vw, 16px);
          box-sizing: border-box;
        }
        /* 2015-style: use almost full column width on phones + more vertical room */
        .batch-2014-aquarium-root--large {
          max-width: min(1200px, 100%);
          padding-left: clamp(0px, 1vw, 6px);
          padding-right: clamp(0px, 1vw, 6px);
        }
        .batch-2014-aquarium__btn {
          display: block;
          width: 100%;
          max-width: 200px;
          margin: 0 auto 12px;
          padding: 10px 18px;
          font-family: var(--font-body, "Poppins", sans-serif);
          font-size: 0.95rem;
          font-weight: 700;
          color: #0f172a;
          background: linear-gradient(180deg, #e0f2fe, #bae6fd);
          border: 1px solid rgba(14, 116, 144, 0.25);
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(14, 116, 144, 0.12);
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
        }
        .batch-2014-aquarium__btn:active {
          transform: scale(0.98);
        }
        .batch-2014-aquarium {
          position: relative;
          width: 100%;
          height: clamp(280px, 38vh, 400px);
          max-height: min(400px, 52vh);
          border-radius: 20px;
          overflow: hidden;
          border: 2px solid rgba(56, 189, 248, 0.35);
          background: linear-gradient(
            180deg,
            #ecfeff 0%,
            #cffafe 22%,
            #a5f3fc 55%,
            #67e8f9 78%,
            #22d3ee 100%
          );
          box-shadow:
            inset 0 0 40px rgba(255, 255, 255, 0.45),
            0 8px 28px rgba(8, 145, 178, 0.15);
        }
        .batch-2014-aquarium--large {
          width: 100%;
          height: clamp(380px, 58vh, 640px);
          max-height: min(640px, 76vh);
        }
        @supports (height: 1dvh) {
          .batch-2014-aquarium--large {
            height: clamp(380px, 58dvh, 640px);
            max-height: min(640px, 76dvh);
          }
        }
        .batch-2014-aquarium::before {
          content: "";
          position: absolute;
          inset: -35%;
          z-index: 0;
          pointer-events: none;
          background:
            radial-gradient(ellipse 70% 55% at 22% 28%, rgba(255, 255, 255, 0.42), transparent 58%),
            radial-gradient(ellipse 60% 50% at 78% 72%, rgba(255, 255, 255, 0.22), transparent 52%),
            radial-gradient(ellipse 45% 40% at 50% 50%, rgba(165, 243, 252, 0.35), transparent 65%);
          animation: batch-2014-aquarium-drift 20s ease-in-out infinite alternate;
        }
        @keyframes batch-2014-aquarium-drift {
          0% {
            transform: translate(-5%, -4%) rotate(-1.5deg);
            opacity: 0.92;
          }
          100% {
            transform: translate(5%, 4%) rotate(1.5deg);
            opacity: 1;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .batch-2014-aquarium::before {
            animation: none;
            transform: none;
            opacity: 0.85;
          }
        }
        .batch-2014-aquarium__bubble {
          position: absolute;
          left: 0;
          top: 0;
          z-index: 1;
          will-change: transform;
          padding: 6px 12px;
          border-radius: 999px;
          font-family: var(--font-body, "Poppins", sans-serif);
          font-size: clamp(0.72rem, 2.1vw, 0.88rem);
          font-weight: 700;
          white-space: nowrap;
          user-select: none;
          pointer-events: none;
        }
      `}</style>

      <button type="button" className="batch-2014-aquarium__btn" onClick={onClickMe}>
        Click Me
      </button>

      <div
        ref={wrapRef}
        className={`batch-2014-aquarium${aquariumSize === "large" ? " batch-2014-aquarium--large" : ""}`}
        aria-label={aquariumAriaLabel}
      >
        {list.map((name, i) => (
          <div
            key={name}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            className="batch-2014-aquarium__bubble"
            style={colors[i]}
          >
            {name}
          </div>
        ))}
      </div>
    </div>
  );
}
