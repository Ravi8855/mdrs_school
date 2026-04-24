import React from "react";
import desaiImg from "../assets/desai.jpg";

const SchoolHome = () => {
  return (
    <section className="home-hero" aria-label="School homepage hero">
      <style>{`
        @keyframes heroFadeIn {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .home-hero {
          --home-nav-offset: 70px;
          position: relative;
          width: 100%;
          min-height: max(440px, calc(100svh - var(--home-nav-offset)));
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 24px 20px 28px;
          box-sizing: border-box;
          isolation: isolate;
        }

        .home-hero::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          background: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.2),
            rgba(0, 0, 0, 0.5)
          );
        }

        .home-hero__media {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .home-hero__bg-img {
          width: 100%;
          height: 100%;
          max-height: 100vh;
          object-fit: cover;
          object-position: center center;
          display: block;
        }

        .hero-content {
          position: relative;
          z-index: 2;
          transform: translateY(-10px);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
          max-width: min(920px, 100%);
          flex: 1 1 auto;
          min-height: 0;
        }

        .home-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          gap: 16px;
          width: 100%;
          max-width: 880px;
          margin: 0 auto;
          padding: 8px 4px 0;
          box-sizing: border-box;
          background: none;
          animation: heroFadeIn 0.95s cubic-bezier(0.22, 1, 0.36, 1) 0.06s both;
        }

        .hero-avatar {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .hero-avatar img {
          border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.6);
          box-shadow:
            0px 2px 6px rgba(0, 0, 0, 0.5),
            inset 0px 0px 4px rgba(0, 0, 0, 0.3);
        }

        .desai-image {
          width: 96px;
          height: 96px;
          object-fit: cover;
          position: relative;
          z-index: 0;
        }

        .school-name.hero-title {
          font-family: var(--font-heading), 'Poppins', sans-serif;
          font-size: 24px;
          font-weight: 800;
          color: rgba(255, 204, 0, 0.9);
          text-transform: uppercase;
          letter-spacing: 1px;
          line-height: 1.25;
          margin: 0;
          text-wrap: balance;
          text-shadow:
            0px 1px 2px rgba(0, 0, 0, 0.6),
            0px 2px 6px rgba(0, 0, 0, 0.4);
        }

        .school-subtitle.hero-subtitle {
          font-family: var(--font-body), 'Poppins', sans-serif;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.03em;
          line-height: 1.55;
          margin: 6px 0 0;
          color: rgba(255, 255, 255, 0.8);
          max-width: 42ch;
          text-shadow: 0px 1px 3px rgba(0, 0, 0, 0.6);
          text-wrap: balance;
        }

        .school-name.hero-title,
        .school-subtitle.hero-subtitle {
          filter: contrast(0.95) brightness(0.95);
        }

        @media (min-width: 600px) {
          .home-card {
            gap: 18px;
            padding: 10px 8px 0;
          }
          .desai-image {
            width: 108px;
            height: 108px;
          }
          .school-name.hero-title {
            font-size: clamp(26px, 2.8vw + 12px, 30px);
            letter-spacing: 1px;
          }
          .school-subtitle.hero-subtitle {
            font-size: clamp(12px, 1.2vw + 10px, 14px);
            max-width: 48ch;
          }
        }

        @media (min-width: 900px) {
          .home-hero {
            min-height: max(480px, calc(100svh - var(--home-nav-offset)));
            padding: 28px 32px 32px;
          }
          .home-card {
            gap: 20px;
            max-width: 900px;
            padding: 12px 12px 0;
          }
          .desai-image {
            width: 120px;
            height: 120px;
          }
          .school-name.hero-title {
            font-size: clamp(28px, 1.5vw + 18px, 34px);
            letter-spacing: 1px;
          }
          .school-subtitle.hero-subtitle {
            font-size: clamp(13px, 0.8vw + 11px, 15px);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .home-card {
            animation: none;
          }
        }
      `}</style>

      <div className="home-hero__media" aria-hidden="true">
        <img
          className="home-hero__bg-img"
          src="/gallery/img12.jpg"
          alt=""
          decoding="async"
          fetchPriority="high"
        />
      </div>

      <div className="hero-content">
        <div className="home-card">
          <div className="hero-avatar">
            <img
              src={desaiImg}
              alt="Morarji Desai"
              className="desai-image"
            />
          </div>
          <h1 className="school-name hero-title">
            MORARJI DESAI RESIDENTIAL SCHOOL
          </h1>
          <div className="school-subtitle hero-subtitle">
            Dorigudda Ukkenala, Shahapur, Yadgir Dist – 585309
          </div>
        </div>
      </div>
    </section>
  );
};

export default SchoolHome;
