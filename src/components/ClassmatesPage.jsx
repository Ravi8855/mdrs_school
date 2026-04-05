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
    "linear-gradient(145deg, #fef3c7 0%, #fde68a 100%)",
    "linear-gradient(145deg, #e0f2fe 0%, #bae6fd 100%)",
    "linear-gradient(145deg, #fce7f3 0%, #fbcfe8 100%)",
    "linear-gradient(145deg, #d1fae5 0%, #a7f3d0 100%)",
    "linear-gradient(145deg, #ede9fe 0%, #ddd6fe 100%)",
    "linear-gradient(145deg, #fef9c3 0%, #fef08a 100%)",
    "linear-gradient(145deg, #e0e7ff 0%, #c7d2fe 100%)",
    "linear-gradient(145deg, #fce4ec 0%, #f8bbd9 100%)",
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
              transform: isShuffling ? `scale(0.96)` : undefined,
              opacity: isShuffling ? 0.7 : 1,
              animation: isShuffling ? "none" : undefined,
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
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: clamp(14px, 3vw, 22px);
          max-width: 100%;
          margin: 0 auto;
          padding: 8px clamp(12px, 4vw, 24px) 24px;
        }
        @media (max-width: 480px) {
          .classmates-grid { padding: 8px 12px 20px; gap: 14px; }
        }
        @media (max-width: 360px) {
          .classmates-grid { padding: 6px 10px 16px; gap: 12px; }
        }

        @media (min-width: 900px) {
          .classmates-grid {
            gap: 20px;
            max-width: 920px;
          }
        }

        .classmate-card {
          min-height: 76px;
          padding: 18px;
          border-radius: 16px;
          box-shadow: 0 8px 20px rgba(0,0,0,0.08);
          border: 1px solid rgba(255,255,255,0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Poppins', var(--font-body, sans-serif);
          font-weight: 600;
          font-size: 16px;
          color: #1f2937;
          text-align: center;
          transition: all 0.3s ease;
        }

        .classmate-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 28px rgba(0,0,0,0.15), 0 0 0 2px rgba(56, 189, 248, 0.35);
        }

        @media (max-width: 480px) {
          .classmate-card {
            font-size: 15px;
            padding: 16px;
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
    </div>
  );
};

export default ClassmatesPage;
