import React from "react";

const TeachersPage = () => {
  const principal = "Eranna Arkera Sir";

  const teachers = [
    "Jattappa sir",
    "Bhagamma Mam",
    "Subhas Sir",
    "Somangowda Sir",
    "Chandru Sir",
    "Madivalappa Sir",
    "Rajakumar Sir",
    "Ramesh Sir",
    "Renuka Mam",
    "Shantlingappa Sir",
    "Basavaraja Sir",
    "Ashwini mam",
    "Mallappa Malikeri Sir",
    "Shilpa Mam",
    "Yamuna Mam",
    "Revan Siddappa Sir",
    "Mamtha Mam",
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "70px 20px",
        fontFamily: "Poppins, sans-serif",
        background: "linear-gradient(135deg, #f7f9fc 0%, #e3edf7 100%)",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&display=swap');

        /* =========================
           🔥 STRONG GOLD GLOW 🔥
        ========================== */
        @keyframes superGlow {
          0% {
            box-shadow:
              0 0 25px rgba(255,193,7,0.6),
              0 0 50px rgba(255,193,7,0.4),
              0 0 80px rgba(255,193,7,0.25);
          }
          50% {
            box-shadow:
              0 0 45px rgba(255,193,7,0.9),
              0 0 90px rgba(255,193,7,0.6),
              0 0 140px rgba(255,193,7,0.35);
          }
          100% {
            box-shadow:
              0 0 25px rgba(255,193,7,0.6),
              0 0 50px rgba(255,193,7,0.4),
              0 0 80px rgba(255,193,7,0.25);
          }
        }

        .appreciation-card {
          max-width: 850px;
          margin: 0 auto 28px;
          padding: 30px 36px;
          text-align: center;
          font-weight: 700;
          color: #2d3436;
          border-radius: 18px;
          background: linear-gradient(
            135deg,
            #fff6d8,
            #ffffff,
            #fff6d8
          );
          border: 3px solid #f4b400;
          animation: superGlow 2.8s ease-in-out infinite;
        }

        /* ===== Principal Card ===== */
        .principal-card {
          max-width: 420px;
          margin: 0 auto 50px;
          padding: 22px 20px;
          border-radius: 16px;
          text-align: center;
          background: linear-gradient(135deg, #fff8e1, #ffffff);
          border: 2px solid #f4b400;
          box-shadow:
            0 0 30px rgba(244,180,0,0.5),
            0 10px 30px rgba(0,0,0,0.12);
        }

        .principal-title {
          font-size: 0.9rem;
          font-weight: 800;
          color: #6b4f00;
          letter-spacing: 1px;
          margin-bottom: 8px;
          text-transform: uppercase;
        }

        .principal-name {
          font-size: 1.45rem;
          font-weight: 800;
          color: #2d3436;
        }

        /* ===== Teachers Grid ===== */
        .teachers-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 22px;
          max-width: 1100px;
          margin: 0 auto;
          text-align: center;
        }

        .teacher-pill {
          background: #ffffff;
          padding: 14px 18px;
          border-radius: 14px;
          font-weight: 700;
          color: #2d3436;
          box-shadow: 0 8px 20px rgba(0,0,0,0.08);
        }

        /* Tablet */
        @media (max-width: 900px) {
          .teachers-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        /* Mobile */
        @media (max-width: 600px) {
          .teachers-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>

      <h1
        style={{
          textAlign: "center",
          fontSize: "2.8rem",
          fontWeight: 800,
          marginBottom: "20px",
          color: "#1f2933",
        }}
      >
        Our Respected Teacher's
      </h1>

      {/* 🔥 STRONGLY GLOWING CARD */}
      <div className="appreciation-card">
       "You saw potential in us when we saw nothing."
        <span style={{ color: "#b88700", fontWeight: 900 }}>
          {" "}We truly appreciate you.
        </span>” 🤍
      </div>

      {/* Principal */}
      <div className="principal-card">
        <div className="principal-title">Principal</div>
        <div className="principal-name">{principal}</div>
      </div>

      {/* Teachers */}
      <div className="teachers-grid">
        {teachers.map((name, index) => (
          <div key={index} className="teacher-pill">
            🎓 {name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeachersPage;
