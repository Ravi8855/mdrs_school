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
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&display=swap');

        .workers-section {
          min-height: 100vh;
          padding: 80px 20px;
          font-family: 'Poppins', sans-serif;
          background: linear-gradient(135deg, #eef2f7, #dbe6f6);
          display: flex;
          justify-content: center;
        }

        .workers-container {
          width: 100%;
          max-width: 1200px;
        }

        .workers-title {
          text-align: center;
          font-size: 3rem;
          font-weight: 800;
          margin-bottom: 14px;
          background: linear-gradient(90deg, #1e3c72, #2a5298);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .appreciation-ribbon {
          position: relative;
          margin: 20px auto 50px;
          padding: 18px 30px;
          max-width: 780px;
          text-align: center;
          background: #ffffff;
          color: #444;
          font-weight: 600;
          font-size: 1.05rem;
          border-radius: 14px;
          opacity: 0;
          box-shadow:
            inset 0 0 0 2px rgba(46, 204, 113, 0.6),
            0 10px 30px rgba(0,0,0,0.08);
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
          font-size: 1.25rem;
          font-weight: 700;
          color: #2d3436;
          font-family: 'Poppins', sans-serif;
          line-height: 1.4;
          letter-spacing: 0.3px;
        }

        .workers-names div {
          background: rgba(255,255,255,0.7);
          padding: 18px 10px;
          border-radius: 14px;
          box-shadow: 0 12px 30px rgba(0,0,0,0.06);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .workers-names div:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 35px rgba(0,0,0,0.1);
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
        <h1 className="workers-title">The Helping Hands 🤝</h1>

        <div
          ref={ribbonRef}
          className={`appreciation-ribbon ${showRibbon ? "show" : ""}`}
        >
          “The silent heroes who work tirelessly behind the scenes to keep our
          school running smoothly.
          <span className="highlight-text"> We respect you</span>” 🤍
        </div>

        <div className="workers-names">
          {workers.map((name, index) => (
            <div key={index}>{name}</div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkersPage;
