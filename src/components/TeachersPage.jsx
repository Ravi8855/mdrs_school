import React from "react";

const TeachersPage = () => {
  const principal = "Eranna Arkera Sir";

  const teachers = [
    "Jattappa Sir",
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
    "Ashwini Mam",
    "Mallappa Malikeri Sir",
    "Shilpa Mam",
    "Yamuna Mam",
    "Revan Siddappa Sir",
    "Mamtha Mam",
    "Sharanu Naykodi Sir",
  ];

  return (
    <div
      style={{
        padding: "40px 20px",
        fontFamily: "Poppins, sans-serif",
        background: "linear-gradient(135deg, #f7f9fc 0%, #e3edf7 100%)",
      }}
      className="page-wrap"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&display=swap');

        @keyframes superGlow {
          0% {
            box-shadow: 0 0 25px rgba(255,193,7,0.6);
          }
          50% {
            box-shadow: 0 0 60px rgba(255,193,7,0.9);
          }
          100% {
            box-shadow: 0 0 25px rgba(255,193,7,0.6);
          }
        }

        .appreciation-card {
          max-width: 830px;
          margin: 0 auto 28px;
          padding: 30px 36px;
          text-align: center;
          font-weight: 700;
          color: #2d3436;
          border-radius: 18px;
          background: linear-gradient(135deg, #fff6d8, #ffffff, #fff6d8);
          border: 3px solid #f4b400;
          animation: superGlow 2.8s ease-in-out infinite;
          font-size: 1.5rem;
          line-height: 1.5;
        }

        .principal-card {
          max-width: 400px;
          margin: 0 auto 50px;
          padding: 22px 20px;
          border-radius: 16px;
          text-align: center;
          background: linear-gradient(135deg, #fff8e1, #ffffff);
          border: 2px solid #f4b400;
          box-shadow: 0 10px 30px rgba(0,0,0,0.12);
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
          font-size: 1.6rem;
          font-weight: 700;
          color: #2d3436;
        }

        /* ===== Teachers Grid (FINAL FIX) ===== */
        .teachers-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 22px;
          max-width: 900px;
          margin: 0 auto;
          justify-items: center;
        }

        .teacher-pill {
          width: 100%;
          max-width: 320px;          /* 🔒 fixed card width */
          min-height: 64px;          /* 🔒 equal height */

          background: #ffffff;
          border-radius: 14px;
          box-shadow: 0 8px 20px rgba(0,0,0,0.08);

          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;

          font-weight: 700;
          color: #2d3436;
          font-family: 'Poppins', sans-serif;

          /* ✂️ auto shrink font for long names */
          font-size: clamp(0.95rem, 2.4vw, 1.2rem);
          line-height: 1.25;

          padding: 12px 10px;

          /* long name handling */
          white-space: normal;
          word-break: break-word;
          overflow-wrap: anywhere;
        }

        @media (max-width: 480px) {
          .teacher-pill {
            max-width: 260px;
            min-height: 58px;
            font-size: clamp(0.9rem, 3.5vw, 1.05rem);
          }
        }
      `}</style>

      <h1
        style={{
          textAlign: "center",
          fontSize: "2rem",
          fontWeight: 700,
          marginBottom: "20px",
          color: "#0b1117ff",
           fontFamily: "Poppins, sans-serif",
        }}
      >
        Our Respected Teacher's
      </h1>

      <div className="appreciation-card">
        "You saw potential in us when we saw nothing."
        <span style={{ color: "#b88700", fontWeight: 900 }}>
          {" "}We truly appreciate you.
        </span> 🤍
      </div>

      <div className="principal-card">
        <div className="principal-title">Principal</div>
        <div className="principal-name">{principal}</div>
      </div>

      <div className="teachers-grid">
        {teachers.map((name, index) => (
          <div key={index} className="teacher-pill">
            {name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeachersPage;
