import React, { useState } from "react";

const ClassmatesPage = () => {
  const initialClassmates = [
    "Ambadas", "Arun", "Bhimu", "Bhimashankar",
    "Hrutik", "Jattappa", "Ningappa", "Mallikarjun", "Marilinga",
    "Ravi", "Vinod", "Viresh", "Chandrashekar", "Gollalappa", "Sunil",
    "Ambika", "Bheembai", "Chaitra", "Ganga", "Mallamma", "Ningamma",
    "Parvati", "Prema", "Roopa", "Savita", "Sharanamma",
    "Shweta", "Shweta H", "Suvarna", "Umashree",
    "Mahesh", "Praveen", "Suchitra", "Shreedevi",
    "Mamtha", "Archana",
  ];

  const gradients = [
    "linear-gradient(135deg, #9f1440ff, #e36dc0ff)",
    "linear-gradient(135deg, #fceabb, #f8b500)",
    "linear-gradient(135deg, #d4fc79, #96e6a1)",
    "linear-gradient(135deg, #a1c4fd, #c2e9fb)",
    "linear-gradient(135deg, #fbc2eb, #a6c1ee)",
    "linear-gradient(135deg, #5cce1eff, #fcb69f)",
    "linear-gradient(135deg, #f3800eff, #e2d1c3)",
    "linear-gradient(135deg, #d9afd9, #11c1d5ff)"
  ];

  const [classmates, setClassmates] = useState(initialClassmates);
  const [isShuffling, setIsShuffling] = useState(false);

  const shuffleClassmates = () => {
    setIsShuffling(true);
    setTimeout(() => {
      setClassmates([...classmates].sort(() => Math.random() - 0.5));
      setIsShuffling(false);
    }, 300);
  };

  return (
    <div className="page-wrap classmates-page">
      <div className="section-inner">
      <div className="section-title-wrap classmates-header">
        <h2 className="section-title classmates-title">SSLC 2015–2016 Batch Students</h2>
        <div className="section-title-accent" aria-hidden="true" />
        <p className="section-subtitle">Our batch — the faces and names that made school memorable.</p>
        <div className="shuffle-btn-wrap">
          <button
            onClick={shuffleClassmates}
            className="shuffle-btn"
            type="button"
          >
            Shuffle
          </button>
        </div>
      </div>

      <div className="classmates-grid">
        {classmates.map((name, index) => (
          <div
            key={`${name}-${index}`}
            className="classmate-card reveal-card"
            style={{
              background: gradients[index % gradients.length],
              transform: isShuffling
                ? `scale(0.9) rotate(${Math.random() * 10 - 5}deg)`
                : "rotate(0deg)",
              opacity: isShuffling ? 0.6 : 1,
              animation: isShuffling
                ? "none"
                : `float ${3 + Math.random()}s ease-in-out infinite alternate`,
            }}
          >
            {name}
          </div>
        ))}
      </div>

      </div>

      <style>{`
        .classmates-page {
          background: var(--bg-section, #f1f5f9);
          padding-bottom: 24px;
          font-family: var(--font-body, 'Poppins', sans-serif);
        }
        .classmates-header {
          text-align: center;
          padding: 24px 20px 28px;
        }
        .classmates-title {
          font-size: clamp(1.75rem, 4vw, 2.25rem);
          font-family: var(--font-heading, 'Poppins', sans-serif);
          font-weight: 800;
          color: var(--text, #0f172a);
          margin: 0 0 8px;
          letter-spacing: 0.02em;
          line-height: 1.2;
        }
        .shuffle-btn-wrap {
          display: flex;
          justify-content: center;
          margin-top: 16px;
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
        }
        
        @media (min-width: 1200px) {
          .shuffle-btn {
            padding: 9px 24px;
            font-size: 1rem;
            border-radius: 22px;
            min-width: 120px;
          }
        }

        .classmates-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
          max-width: 100%;
          margin: 0 auto;
          padding: 8px clamp(12px, 4vw, 24px) 24px;
        }
        @media (max-width: 480px) {
          .classmates-grid { padding: 8px 12px 20px; gap: 12px; }
        }
        @media (max-width: 360px) {
          .classmates-grid { padding: 6px 10px 16px; gap: 10px; }
        }

        @media (min-width: 900px) {
          .classmates-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 20px;
            max-width: 920px;
          }
        }

        .classmate-card {
          min-height: 72px;
          padding: 14px 12px;
          border-radius: var(--radius-lg, 16px);
          box-shadow: var(--shadow, 0 2px 12px rgba(0,0,0,0.06));
          border: 1px solid var(--border, rgba(0,0,0,0.06));
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: #111827;
          font-size: clamp(0.95rem, 2.4vw, 1.05rem);
          text-align: center;
          transition: transform 0.22s ease, box-shadow 0.22s ease;
        }

        .classmate-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 28px rgba(0,0,0,0.1), 0 4px 8px rgba(0,0,0,0.06);
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


        @keyframes float {
          from { transform: translateY(0); }
          to { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
};

export default ClassmatesPage;
