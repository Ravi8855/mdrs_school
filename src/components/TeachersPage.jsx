import React from "react";

const TeachersPage = () => {
  const principal = "Eranna Arkera Sir";

  const teacherGradients = [
    "linear-gradient(145deg, #e7f5ff 0%, #a5d8ff 100%)",
    "linear-gradient(145deg, #d3f9d8 0%, #b2f2bb 100%)",
    "linear-gradient(145deg, #e5dbff 0%, #d0bfff 100%)",
    "linear-gradient(145deg, #fff9db 0%, #ffe066 100%)",
    "linear-gradient(145deg, #fff4e6 0%, #ffd8a8 100%)",
    "linear-gradient(145deg, #e7f5ff 0%, #a5d8ff 100%)",
    "linear-gradient(145deg, #d3f9d8 0%, #b2f2bb 100%)",
    "linear-gradient(145deg, #e5dbff 0%, #d0bfff 100%)",
    "linear-gradient(145deg, #fff9db 0%, #ffe066 100%)",
    "linear-gradient(145deg, #fff4e6 0%, #ffd8a8 100%)",
  ];

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

        .teachers-page {
          font-family: var(--font-body, 'Poppins', sans-serif);
          background: var(--bg-section, #f1f5f9);
        }
        .appreciation-card {
          max-width: 830px;
          margin: 0 auto 28px;
          padding: 28px 32px;
          text-align: center;
          font-weight: 700;
          color: #2d3436;
          border-radius: 16px;
          background: linear-gradient(145deg, #fff9db 0%, #fff4e6 50%, #fff9db 100%);
          border: 1px solid rgba(255, 224, 102, 0.5);
          box-shadow: 0 6px 18px rgba(0,0,0,0.08);
          font-size: 1.5rem;
          line-height: 1.5;
          transition: box-shadow 0.3s ease, transform 0.3s ease;
        }
        .appreciation-card:hover {
          box-shadow: 0 10px 24px rgba(0,0,0,0.1);
        }

        .principal-card {
          max-width: 400px;
          margin: 0 auto 50px;
          padding: 20px 24px;
          border-radius: 16px;
          text-align: center;
          background: linear-gradient(145deg, #fff9db 0%, #ffe066 100%);
          border: 2px solid rgba(245, 158, 11, 0.5);
          box-shadow: 0 8px 24px rgba(0,0,0,0.1), 0 0 0 1px rgba(251, 191, 36, 0.2);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .principal-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.12), 0 0 20px rgba(251, 191, 36, 0.25);
        }

        .principal-title {
          font-size: 0.9rem;
          font-weight: 800;
          color: #92400e;
          letter-spacing: 1px;
          margin-bottom: 8px;
          text-transform: uppercase;
        }

        .principal-name {
          font-size: 1.6rem;
          font-weight: 700;
          color: #1f2937;
        }

        .teachers-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: clamp(14px, 3vw, 22px);
          max-width: 900px;
          margin: 0 auto;
          justify-items: center;
          padding: 0 clamp(12px, 4vw, 20px);
        }

        .teacher-pill {
          width: 100%;
          max-width: 320px;
          min-height: 68px;
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.7);
          box-shadow: 0 6px 18px rgba(0,0,0,0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          font-weight: 600;
          color: #1f2937;
          font-family: 'Poppins', sans-serif;
          font-size: clamp(0.95rem, 2.4vw, 1.1rem);
          line-height: 1.3;
          padding: 16px 14px;
          white-space: normal;
          word-break: break-word;
          overflow-wrap: anywhere;
          transition: all 0.3s ease;
        }
        .teacher-pill:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 24px rgba(0,0,0,0.15);
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
            padding: 18px 20px;
          }
          .principal-name { font-size: 1.4rem; }
          .teachers-grid { gap: 16px; }
        }

        @media (max-width: 480px) {
          .teacher-pill {
            max-width: 260px;
            min-height: 62px;
            padding: 14px 12px;
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
          <div
            key={index}
            className="teacher-pill reveal-card"
            style={{ background: teacherGradients[index % teacherGradients.length] }}
          >
            {name}
          </div>
        ))}
      </div>
      </div>
    </div>
  );
};

export default TeachersPage;
