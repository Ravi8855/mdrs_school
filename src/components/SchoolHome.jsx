import React from "react";
import collegeImg from "../assets/college.jpg";
import desaiImg from "../assets/desai.jpg";

const SchoolHome = () => {
  return (
    <section className="home-hero">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800;900&family=Poppins:wght@400;600&display=swap');

        .home-hero {
          min-height: 100vh;
          width: 100%;
          background-image:
            linear-gradient(
              rgba(0, 0, 0, 0.25),
              rgba(0, 0, 0, 0.35)
            ),
            url(${collegeImg});
          background-size: cover;
          background-position: center center;
          background-repeat: no-repeat;

          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          margin-bottom: 0;
        }

        /* ✅ CARD WITHOUT BLUR / OVERLAY */
        .home-card {
          max-width: 1000px;
          width: 100%;
          padding: 40px 30px;
          text-align: center;
          margin-bottom: 0;

          background: transparent; /* 🔥 REMOVED DARK CARD */
          border-radius: 0;
          backdrop-filter: none; /* Explicitly remove any backdrop blur effects */
          -webkit-backdrop-filter: none; /* Safari support */
        }

        /* ===== MORARJI DESAI IMAGE ===== */
        .desai-image {
          width: 120px;
          height: 120px;
          object-fit: cover;
          border-radius: 50%;
          margin-bottom: 12px;

          border: 4px solid #FFD700;
          box-shadow:
            0 0 15px rgba(255, 215, 0, 0.6),
            0 0 30px rgba(255, 215, 0, 0.4);
        }

        /* ===== SCHOOL NAME ===== */
        .school-name {
          font-family: 'Montserrat', sans-serif;
          font-size: clamp(2.3rem, 4.8vw, 4.2rem);
          font-weight: 900;
          letter-spacing: 2px;

          margin-top: 0;
          margin-bottom: 15px;

          color: #FFD700;
          text-shadow:
            0 0 8px rgba(255, 215, 0, 0.7),
            0 0 16px rgba(255, 215, 0, 0.5);
          line-height: 1.1;
        }

        .school-subtitle {
          font-family: 'Poppins', sans-serif;
          font-size: clamp(1rem, 2.2vw, 1.4rem);
          font-weight: 600;
          letter-spacing: 1.2px;
          color: #f5e6a8;
          margin-bottom: 25px;
          line-height: 1.4;
        }

        .school-tagline {
          font-family: 'Poppins', sans-serif;
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
            padding: 30px 15px;
          }

          .home-card {
            padding: 35px 20px;
          }

          .desai-image {
            width: 110px;
            height: 110px;
          }
        }

        @media (max-width: 600px) {
          .home-card {
            padding: 30px 15px;
          }

          .desai-image {
            width: 100px;
            height: 100px;
          }
        }

        @media (max-width: 480px) {
          .home-card {
            padding: 25px 12px;
          }

          .desai-image {
            width: 90px;
            height: 90px;
            border-width: 3px;
          }
        }

        @media (max-width: 360px) {
          .home-card {
            padding: 20px 10px;
          }

          .desai-image {
            width: 80px;
            height: 80px;
          }
        }
      `}</style>

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
          DORIGUDDA UKKENALA, SHAHAPUR, YADGIR DIST – 585309
        </div>

        <p className="school-tagline">
          A place where discipline builds character, education shapes the future,
          and students grow with confidence, values, and purpose ✨
        </p>
      </div>
    </section>
  );
};

export default SchoolHome;
