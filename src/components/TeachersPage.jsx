import React, { useState } from "react";

// ✅ IMPORT IMAGES (ONLY AVAILABLE TEACHER FILES)
import jattappaImg from "../assets/Jattappa.jpeg";
import principalImg from "../assets/principal.jpg";
import madivalappaImg from "../assets/Madivalappa sir.jpg";
import malluImg from "../assets/Mallu sir.jpg";
import rajkumarImg from "../assets/Rajkumar sir.jpg";
import shantalingappaImg from "../assets/Shantalingappa sir.jpg";
import sumanthImg from "../assets/Sumanth sir.jpg";


const TeachersPage = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const principal = {
    name: "Eranna Arkera Sir",
    img: principalImg,
  };

  const teacherGradients = [
    "linear-gradient(145deg, #e7f5ff 0%, #a5d8ff 100%)",
    "linear-gradient(145deg, #d3f9d8 0%, #b2f2bb 100%)",
    "linear-gradient(145deg, #e5dbff 0%, #d0bfff 100%)",
    "linear-gradient(145deg, #fff9db 0%, #ffe066 100%)",
    "linear-gradient(145deg, #fff4e6 0%, #ffd8a8 100%)",
  ];

  // ✅ UPDATED TEACHER DATA WITH AVAILABLE IMAGES
  const teachers = [
    { name: "Madivalappa Sir", img: madivalappaImg },
    { name: "Mallu Sir", img: malluImg },
    { name: "Rajkumar Sir", img: rajkumarImg },
    { name: "Shantalingappa Sir", img: shantalingappaImg },
    { name: "Sumanth Sir", img: sumanthImg },
  ];

  return (
    <div className="page-wrap teachers-page">
      <div className="section-inner">

      <style>{`
        .page-wrap.teachers-page {
          width: 100%;
          padding: var(--space-6);
          background: var(--bg);
        }

        .section-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 var(--space-4);
        }

        .section-title-wrap {
          text-align: center;
          margin-bottom: var(--space-8);
        }

        .section-title {
          font-family: var(--font-heading);
          font-size: clamp(1.75rem, 3.5vw, 2.25rem);
          font-weight: 800;
          color: var(--text);
          margin: 0 0 var(--space-2);
          line-height: 1.2;
        }

        .section-title-accent {
          display: inline-block;
          width: 56px;
          height: 4px;
          background: linear-gradient(90deg, var(--primary), var(--accent));
          border-radius: 2px;
          margin: var(--space-2) 0;
        }

        .section-subtitle {
          font-size: 1rem;
          color: var(--text-muted);
          margin-top: var(--space-3);
          max-width: 560px;
          margin-left: auto;
          margin-right: auto;
          line-height: 1.5;
        }

        /* Principal Card */
        .principal-card {
          text-align: center;
          background: linear-gradient(135deg, #ffe66d 0%, #ffb347 100%);
          border-radius: 20px;
          padding: 40px 30px;
          margin: var(--space-8) 0;
          box-shadow: 0 12px 36px rgba(0,0,0,0.12);
        }

        .principal-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: #8B4513;
          text-transform: uppercase;
          letter-spacing: 1.2px;
          margin: 0 0 var(--space-2);
        }

        .principal-name {
          font-family: var(--font-heading);
          font-size: 1.75rem;
          font-weight: 800;
          color: #2c2c2c;
          margin: var(--space-2) 0;
        }

        .principal-card img {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          margin-top: var(--space-4);
          border: 4px solid white;
          object-fit: cover;
          box-shadow: 0 8px 20px rgba(0,0,0,0.2);
          cursor: pointer;
          transition: transform 0.2s ease;
        }

        .principal-card img:hover {
          transform: scale(1.08);
        }

        /* Teachers Grid */
        .teachers-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          max-width: 1000px;
          margin: 0 auto;
        }

        .teacher-pill {
          border-radius: 16px;
          padding: 20px;
          text-align: center;
          box-shadow: 0 6px 18px rgba(0,0,0,0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          background: white;
        }

        .teacher-pill:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 28px rgba(0,0,0,0.15);
        }

        .teacher-pill div {
          font-weight: 700;
          font-size: 1rem;
          color: var(--text);
          margin-bottom: var(--space-3);
        }

        .teacher-img {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          object-fit: cover;
          margin: 0 auto;
          border: 3px solid white;
          box-shadow: 0 4px 10px rgba(0,0,0,0.2);
          display: block;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .teacher-img:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 16px rgba(0,0,0,0.3);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .teachers-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
          }

          .principal-card {
            padding: 30px 20px;
          }

          .section-title {
            font-size: 1.75rem;
          }
        }

        @media (max-width: 480px) {
          .teachers-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .teacher-pill {
            padding: 15px;
          }

          .principal-card {
            padding: 25px 15px;
          }

          .principal-name {
            font-size: 1.5rem;
          }
        }

        /* Principal Image Modal */
        .principal-image-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          animation: fadeIn 0.3s ease;
        }

        .principal-image-modal-content {
          position: relative;
          max-width: 90vw;
          max-height: 90vh;
          animation: slideUp 0.3s ease;
        }

        .principal-image-modal img {
          width: 100%;
          height: auto;
          max-width: 600px;
          max-height: 600px;
          object-fit: contain;
          border-radius: 12px;
        }

        .principal-close-btn {
          position: absolute;
          top: -50px;
          right: 0;
          background: white;
          color: #000;
          border: none;
          width: 45px;
          height: 45px;
          border-radius: 50%;
          font-size: 28px;
          cursor: pointer;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .principal-close-btn:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
        }

        .principal-card img {
          cursor: pointer;
          transition: transform 0.2s ease;
        }

        .principal-card img:hover {
          transform: scale(1.05);
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>

      {/* TITLE */}
      <div className="section-title-wrap">
        <h2 className="section-title">Our Respected Teachers</h2>
        <p className="section-subtitle">
          The people who shaped our batch with dedication and care.
        </p>
      </div>

      {/* PRINCIPAL */}
      <div className="principal-card">
        <div className="principal-title">Principal</div>
        <div className="principal-name">{principal.name}</div>
        <img 
          src={principal.img} 
          alt="Principal" 
          onClick={() => setSelectedImage(principal.img)}
        />
      </div>

      {/* TEACHERS GRID */}
      <div className="teachers-grid">
        {teachers.map((t, index) => (
          <div
            key={index}
            className="teacher-pill"
            style={{ background: teacherGradients[index % teacherGradients.length] }}
          >
            <div>{t.name}</div>

            {/* ✅ IMAGE BELOW NAME */}
            <img 
              src={t.img} 
              alt={t.name} 
              className="teacher-img"
              onClick={() => setSelectedImage(t.img)}
            />
          </div>
        ))}
      </div>

      {/* IMAGE MODAL - For Principal and Teachers */}
      {selectedImage && (
        <div className="principal-image-modal" onClick={() => setSelectedImage(null)}>
          <div className="principal-image-modal-content" onClick={(e) => e.stopPropagation()}>
            <button 
              className="principal-close-btn" 
              onClick={() => setSelectedImage(null)}
              title="Close"
            >
              ✕
            </button>
            <img src={selectedImage} alt="Full view" />
          </div>
        </div>
      )}

      </div>
    </div>
  );
};

export default TeachersPage;