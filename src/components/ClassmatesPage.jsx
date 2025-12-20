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
    <div
      style={{
        background: "#fff",
        backgroundImage: "radial-gradient(#ddd 1px, transparent 1px)",
        backgroundSize: "20px 20px",
        paddingBottom: "24px",
        fontFamily: "'Poppins', sans-serif",
      }}
      className="page-wrap"
    >
      <div style={{ textAlign: "center", padding: "20px 20px" }}>
        <h1
          style={{
            fontSize: "2.8rem",
            fontFamily: "'Cinzel', serif",
            fontWeight: "80",
            background: "linear-gradient(45deg, #FF416C, #FF4B2B)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          SSLC 2015–2016 Batch Student's 🎓
        </h1>

        {/* ✅ BUTTON WRAPPER FOR PERFECT CENTERING */}
        <div className="shuffle-btn-wrap">
          <button
            onClick={shuffleClassmates}
            className="shuffle-btn"
          >
            Click Me
          </button>
        </div>
      </div>

      <div className="classmates-grid">
        {classmates.map((name, index) => (
          <div
            key={`${name}-${index}`}
            className="classmate-card"
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

      <footer
        style={{
          textAlign: "center",
          marginTop: "90px",
          padding: "40px 20px",
          background: "#000",
        }}
      >
        <p className="batch-text">
          The batch that teachers will never forget (for wrong reason) 😂
        </p>
      </footer>

      <style>{`
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
          padding: 8px 16px 24px;
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
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(16,24,40,0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: #111827;
          font-size: clamp(0.95rem, 2.4vw, 1.05rem);
          text-align: center;
          transition: transform 160ms ease, box-shadow 160ms ease;
        }

        .classmate-card:hover {
          transform: translateY(-6px) scale(1.02);
          box-shadow: 0 20px 40px rgba(2,6,23,0.12);
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

        .batch-text {
          font-size: 1.4rem;
          font-weight: 800;
          color: #FFD700;
          text-shadow: 0 0 10px rgba(255,215,0,0.6);
          margin: 0;
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
