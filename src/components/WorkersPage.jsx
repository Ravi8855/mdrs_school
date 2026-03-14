import React, { useEffect, useRef, useState } from "react";

const WorkersPage = () => {
  const workers = [
    "Raju Anna",
    "Laxami Aunty",
    "Laxmi N Aunty",
    "Madhu Anna",
    "Manjula D Aunty",
    "Rekha Aunty",
    "Suma Aunty",
    "Bheembai Aunty",
    "Roopa Aunty",
    "Sujatha Aunty",
    "Manjula Shapur",
  ];

  const ribbonRef = useRef(null);
  const [showRibbon, setShowRibbon] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowRibbon(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (ribbonRef.current) observer.observe(ribbonRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="workers-section">
      <div className="section-inner">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&display=swap');

        .workers-section {
          min-height: 10vh;
          padding: 0 0 24px;
          display: flex;
          justify-content: center;
        }

        .workers-container {
          width: 100%;
          max-width: 1200px;
        }

        .workers-section {
          font-family: var(--font-body, 'Poppins', sans-serif);
          background: var(--bg-section, #f1f5f9);
        }
        .workers-title {
          text-align: center;
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 700;
          margin-bottom: 20px;
          background: linear-gradient(135deg, #1e3c72, #2a5298);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-family: 'Poppins', sans-serif;
          letter-spacing: 0.02em;
        }

        .appreciation-ribbon {
          position: relative;
          margin: 24px auto 48px;
          padding: clamp(16px, 4vw, 24px) clamp(20px, 5vw, 28px);
          max-width: 780px;
          text-align: center;
          background: #ffffff;
          color: #334155;
          font-weight: 600;
          font-size: clamp(0.95rem, 2.2vw, 1.05rem);
          border-radius: 16px;
          opacity: 0;
          border: 1px solid rgba(46, 204, 113, 0.25);
          box-shadow: 0 4px 20px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04);
          z-index: 1;
        }

        .appreciation-ribbon.show {
          animation: fadeUp 0.9s ease-out forwards,
                     innerGlowPulse 2.4s ease-in-out infinite;
        }

        @keyframes innerGlowPulse {
          0% {
            box-shadow:
              inset 0 0 0 2px rgba(46, 204, 113, 0.5),
              inset 0 0 18px rgba(46, 204, 113, 0.25),
              0 12px 28px rgba(0,0,0,0.08);
          }
          50% {
            box-shadow:
              inset 0 0 0 2px rgba(46, 204, 113, 1),
              inset 0 0 32px rgba(46, 204, 113, 0.55),
              0 16px 36px rgba(0,0,0,0.12);
          }
          100% {
            box-shadow:
              inset 0 0 0 2px rgba(46, 204, 113, 0.5),
              inset 0 0 18px rgba(46, 204, 113, 0.25),
              0 12px 28px rgba(0,0,0,0.08);
          }
        }

        .highlight-text {
          color: #2ecc71;
          font-weight: 700;
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* 🔥 ONLY CHANGE: 2 NAMES PER ROW EVERYWHERE */
        .workers-names {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 28px;
          text-align: center;
          font-size: 1.5rem;
          font-weight: 650;
          color: #050809ff;
          font-family: 'Poppins', sans-serif;
          line-height: 1.4;
          letter-spacing: 0.3px;
        }

        .workers-names div {
          background: #ffffff;
          padding: clamp(14px, 3vw, 18px) clamp(12px, 2.5vw, 14px);
          border-radius: 14px;
          border: 1px solid rgba(0,0,0,0.06);
          box-shadow: 0 2px 12px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04);
          transition: transform 0.22s ease, box-shadow 0.22s ease;
        }
        
        .workers-names div:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.08);
        }

        /* Keep same on all devices */
        @media (max-width: 900px) {
          .workers-names {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .workers-title { font-size: 2.2rem; }
          .workers-names {
            grid-template-columns: repeat(2, 1fr);
            font-size: 1.15rem;
            gap: 20px;
          }
        }
        
        @media (max-width: 480px) {
          .workers-title { font-size: 2rem; }
          .workers-names {
            grid-template-columns: repeat(2, 1fr);
            font-size: 1.05rem;
            gap: 15px;
          }
        }
        
        @media (max-width: 360px) {
          .workers-title { font-size: 1.8rem; }
          .workers-names {
            font-size: 1rem;
            gap: 12px;
          }
        }
      `}</style>

      <div className="workers-container">
        <div className="section-title-wrap">
          <h2 className="section-title">The Helping Hands</h2>
          <div className="section-title-accent" aria-hidden="true" />
          <p className="section-subtitle">Staff who keep our school running with care and dedication.</p>
        </div>

        <div
          ref={ribbonRef}
          className={`appreciation-ribbon reveal-card ${showRibbon ? "show" : ""}`}
        >
          “The silent heroes who work tirelessly behind the scenes to keep our
          school running smoothly.
          <span className="highlight-text"> We respect you</span>”         </div>

        <div className="workers-names">
          {workers.map((name, index) => (
            <div key={index} className="reveal-card">{name}</div>
          ))}
        </div>
      </div>
      </div>
    </section>
  );
};

export default WorkersPage;
