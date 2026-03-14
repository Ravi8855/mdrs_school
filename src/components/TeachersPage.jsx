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
    <div className="page-wrap teachers-page">
      <div className="section-inner">
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

        .teachers-page {
          font-family: var(--font-body, 'Poppins', sans-serif);
          background: var(--bg-section, #f1f5f9);
        }
        .appreciation-card {
          max-width: 830px;
          margin: 0 auto 28px;
          padding: 30px 36px;
          text-align: center;
          font-weight: 700;
          color: #2d3436;
          border-radius: 16px;
          background: linear-gradient(135deg, #fffbf0, #ffffff, #fffbf0);
          border: 1px solid rgba(244, 180, 0, 0.4);
          box-shadow: 0 4px 20px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04);
          animation: superGlow 2.8s ease-in-out infinite;
          font-size: 1.5rem;
          line-height: 1.5;
        }

        .principal-card {
          max-width: 400px;
          margin: 0 auto 50px;
          padding: 24px 20px;
          border-radius: 16px;
          text-align: center;
          background: #ffffff;
          border: 1px solid rgba(244, 180, 0, 0.35);
          box-shadow: 0 4px 20px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04);
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
          max-width: 320px;
          min-height: 64px;
          background: #ffffff;
          border-radius: 14px;
          border: 1px solid rgba(0,0,0,0.05);
          box-shadow: 0 2px 12px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04);
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          font-weight: 700;
          color: #2d3436;
          font-family: 'Poppins', sans-serif;
          font-size: clamp(0.95rem, 2.4vw, 1.2rem);
          line-height: 1.25;
          padding: 12px 10px;
          white-space: normal;
          word-break: break-word;
          overflow-wrap: anywhere;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .teacher-pill:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.08);
        }

        .teachers-title {
          text-align: center;
          font-size: clamp(1.5rem, 3.5vw, 2rem);
          font-weight: 700;
          margin-bottom: 24px;
          color: var(--text, #0f172a);
          font-family: var(--font-heading, 'Poppins', sans-serif);
          letter-spacing: 0.02em;
        }
        @media (max-width: 768px) {
          .appreciation-card {
            padding: 24px 20px;
            font-size: clamp(1.1rem, 3.5vw, 1.4rem);
          }
          .principal-card {
            padding: 20px 16px;
          }
          .principal-name { font-size: 1.4rem; }
          .teachers-grid { gap: 16px; }
        }

        @media (max-width: 480px) {
          .teacher-pill {
            max-width: 260px;
            min-height: 58px;
            font-size: clamp(0.9rem, 3.5vw, 1.05rem);
          }
          .appreciation-card {
            padding: 20px 16px;
            font-size: clamp(1rem, 4vw, 1.2rem);
          }
          .principal-card { padding: 18px 14px; }
          .principal-name { font-size: 1.25rem; }
        }

        @media (max-width: 360px) {
          .teachers-grid { gap: 12px; }
          .appreciation-card { padding: 16px 12px; }
        }
      `}</style>

      <div className="section-title-wrap">
        <h2 className="section-title">Our Respected Teachers</h2>
        <div className="section-title-accent" aria-hidden="true" />
        <p className="section-subtitle">The people who shaped our batch with dedication and care.</p>
      </div>

      <div className="appreciation-card reveal-card">
        "You saw potential in us when we saw nothing."
        <span style={{ color: "#b88700", fontWeight: 900 }}>
          {" "}We truly appreciate you.
        </span>
      </div>

      <div className="principal-card reveal-card">
        <div className="principal-title">Principal</div>
        <div className="principal-name">{principal}</div>
      </div>

      <div className="teachers-grid">
        {teachers.map((name, index) => (
          <div key={index} className="teacher-pill reveal-card">
            {name}
          </div>
        ))}
      </div>
      </div>
    </div>
  );
};

export default TeachersPage;
