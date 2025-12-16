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
              rgba(0, 0, 0, 0.45),
              rgba(0, 0, 0, 0.6)
            ),
            url(${collegeImg});
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;

          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        /* ❌ NO BLUR CARD */
        .home-card {
          max-width: 1000px;
          width: 100%;
          padding: 45px 28px;
          text-align: center;
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
          font-size: clamp(2.1rem, 4.8vw, 3.9rem);
          font-weight: 900;
          letter-spacing: 2px;

          margin-top: 0;
          margin-bottom: 10px;

          color: #FFD700;
          text-shadow:
            0 0 6px rgba(255, 215, 0, 0.6),
            0 0 14px rgba(255, 215, 0, 0.4);
        }

        .school-subtitle {
          font-family: 'Poppins', sans-serif;
          font-size: clamp(0.95rem, 2.2vw, 1.25rem);
          font-weight: 600;
          letter-spacing: 1px;
          color: #f5e6a8;
          margin-bottom: 22px;
        }

        .school-tagline {
          font-family: 'Poppins', sans-serif;
          font-size: clamp(0.95rem, 2.2vw, 1.15rem);
          font-weight: 500;
          color: #ffffff;
          max-width: 800px;
          margin: 0 auto;
          line-height: 1.65;

          text-shadow: 0 0 6px rgba(255, 255, 255, 0.3);
        }

        @media (max-width: 600px) {
          .home-card {
            padding: 35px 18px;
          }

          .desai-image {
            width: 105px;
            height: 105px;
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
