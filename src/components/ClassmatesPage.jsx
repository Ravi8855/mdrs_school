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
    "Mamtha", "Archana"
  ];

  /* 🌈 Soft lovable gradients */
  const gradients = [
    "linear-gradient(135deg, #fdfbfb, #ebedee)",
    "linear-gradient(135deg, #fceabb, #f8b500)",
    "linear-gradient(135deg, #d4fc79, #96e6a1)",
    "linear-gradient(135deg, #a1c4fd, #c2e9fb)",
    "linear-gradient(135deg, #fbc2eb, #a6c1ee)",
    "linear-gradient(135deg, #ffecd2, #fcb69f)",
    "linear-gradient(135deg, #fdfcfb, #e2d1c3)",
    "linear-gradient(135deg, #d9afd9, #97d9e1)"
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
        minHeight: "100vh",
        paddingBottom: "80px",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/* HEADER */}
      <div style={{ textAlign: "center", padding: "60px 20px" }}>
        <h1
          style={{
            fontSize: "2.8rem",
            fontFamily: "'Cinzel', serif",
            fontWeight: "800",
            background: "linear-gradient(45deg, #FF416C, #FF4B2B)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "1px",
          }}
        >
          SSLC 2015–2016 Batch Student's 🎓
        </h1>

        {/* 🔘 Button font matches name cards */}
        <button
          onClick={shuffleClassmates}
          style={{
            marginTop: "20px",
            padding: "12px 38px",
            fontSize: "1.1rem",
            background: "#2d3436",
            color: "#fff",
            border: "none",
            borderRadius: "50px",
            cursor: "pointer",
            fontWeight: "700",
            fontFamily: "'Poppins', sans-serif",
            letterSpacing: "0.5px",
          }}
        >
          Click me
        </button>
      </div>

      {/* NAMES GRID */}
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

      {/* FOOTER */}
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

      {/* STYLES */}
      <style>{`
        .classmates-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 25px;
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px 40px;
        }

        .classmate-card {
          width: 100%;
          box-sizing: border-box;
          padding: 16px 10px;
          border-radius: 20px;
          font-size: 1.2rem;
          font-weight: 700;
          color: #2d3436;
          text-align: center;
          box-shadow: 0 10px 25px rgba(0,0,0,0.12);
          transition: transform 0.3s ease;
        }

        @media (max-width: 900px) {
          .classmates-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 600px) {
          .classmates-grid {
            grid-template-columns: repeat(2, 1fr);
            padding: 20px;
          }
        }

        .batch-text {
          font-size: 1.6rem;
          font-weight: 800;
          color: #FFD700;
          animation: batchGlow 2s ease-in-out infinite;
          text-shadow: 0 0 15px rgba(255,215,0,0.8);
        }

        @keyframes batchGlow {
          0% { transform: scale(1); }
          50% { transform: scale(1.08); }
          100% { transform: scale(1); }
        }

        @keyframes float {
          from { transform: translateY(0); }
          to { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
};

export default ClassmatesPage;
