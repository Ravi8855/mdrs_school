import React from "react";
import desaiImg from "../assets/desai.jpg";

const SchoolHome = ({ onNavigate }) => {
  return (
    <section className="home-hero">
      <style>{`
        @keyframes heroFadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .home-hero {
          min-height: 100vh;
          width: 100%;
          background-image:
            linear-gradient(
              to bottom,
              rgba(15, 23, 42, 0.25) 0%,
              rgba(15, 23, 42, 0.5) 45%,
              rgba(15, 23, 42, 0.82) 100%
            ),
            url(/school-building.jpg);
          background-size: cover;
          background-position: center center;
          background-repeat: no-repeat;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 48px 24px 56px;
          margin-bottom: 0;
          box-sizing: border-box;
          position: relative;
        }
        .hero-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          flex: 1;
          width: 100%;
        }
        .desai-image {
          animation: heroFadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both;
        }
        .school-name {
          animation: heroFadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.25s both;
        }
        .school-subtitle {
          animation: heroFadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.35s both;
        }
        .hero-welcome {
          animation: heroFadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both;
        }
        @media (prefers-reduced-motion: reduce) {
          .desai-image, .school-name, .school-subtitle, .hero-welcome { animation: none; }
        }
        .hero-welcome {
          font-family: var(--font-heading), 'Poppins', sans-serif;
          font-size: 0.85rem;
          font-weight: 600;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(251, 191, 36, 0.95);
          margin: 0 0 20px;
        }
        .home-card {
          max-width: 880px;
          width: 100%;
          padding: 44px 36px;
          text-align: center;
          margin: 0 auto;
          background: transparent;
          border-radius: 0;
          box-sizing: border-box;
        }

        .desai-image {
          width: 120px;
          height: 120px;
          object-fit: cover;
          border-radius: 50%;
          margin-bottom: 14px;
          border: 4px solid #fbbf24;
          box-shadow: 0 4px 24px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.1);
        }

        .school-name {
          font-family: var(--font-heading), 'Poppins', sans-serif;
          font-size: clamp(1.85rem, 4.2vw, 3.25rem);
          font-weight: 800;
          letter-spacing: 0.02em;
          margin-top: 0;
          margin-bottom: 14px;
          color: #fbbf24;
          text-shadow: 0 2px 24px rgba(0,0,0,0.4);
          line-height: 1.2;
        }

        .school-subtitle {
          font-family: var(--font-body), 'Poppins', sans-serif;
          font-size: clamp(0.95rem, 2vw, 1.25rem);
          font-weight: 600;
          letter-spacing: 0.04em;
          color: rgba(255,255,255,0.92);
          margin-bottom: 0;
          line-height: 1.5;
        }

        .school-tagline {
          font-family: var(--font-body), 'Poppins', sans-serif;
          font-size: clamp(1rem, 2.2vw, 1.3rem);
          font-weight: 500;
          color: #ffffff;
          max-width: 850px;
          margin: 0 auto;
          line-height: 1.7;
          text-shadow: 0 0 8px rgba(255, 255, 255, 0.4);
          padding: 0 15px;
        }

        @media (max-width: 768px) {
          .home-hero {
            padding: 40px 20px 48px;
            background-position: center center;
          }
          .home-card { padding: 36px 24px; }
          .desai-image { width: 110px; height: 110px; }
          .hero-welcome { font-size: 0.75rem; letter-spacing: 0.15em; }
        }

        @media (max-width: 600px) {
          .home-card { padding: 32px 20px; }
          .desai-image { width: 100px; height: 100px; }
        }

        @media (max-width: 480px) {
          .home-hero { padding: 32px 16px 40px; }
          .home-card { padding: 28px 16px; }
          .desai-image { width: 90px; height: 90px; border-width: 3px; }
        }

        @media (max-width: 360px) {
          .home-card { padding: 22px 12px; }
          .desai-image { width: 80px; height: 80px; }
        }
      `}</style>

      <div className="hero-content">
        <div className="home-card">
          <img
            src={desaiImg}
            alt="Morarji Desai"
            className="desai-image"
          />
          <h1 className="school-name">
            MORARJI DESAI RESIDENTIAL SCHOOL
          </h1>
          <div className="school-subtitle">
            Dorigudda Ukkenala, Shahapur, Yadgir Dist – 585309
          </div>
        </div>
      </div>
    </section>
  );
};

export default SchoolHome;
