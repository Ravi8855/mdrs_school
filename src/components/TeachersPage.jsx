import React, { useState } from "react";

// ✅ IMPORT IMAGES (ONLY AVAILABLE TEACHER FILES)
import subhasImg from "../assets/Subhas sir.jpg";
import bhagamma from "../assets/Bhagamma mam.jpg";
import sumanthImg from "../assets/Sumanth sir.jpg";
import principalImg from "../assets/principal.jpg";
import madivalappaImg from "../assets/Madivalappa sir.jpg";
import rameshImg from "../assets/Ramesh sir.jpg";
import malluImg from "../assets/Mallu sir.jpg";
import rajkumarImg from "../assets/Rajkumar sir.jpg";
import shantalingappaImg from "../assets/Shantalingappa sir.jpg";
import chandruImg from "../assets/Chandru sir.jpg";
import RenukaImg from "../assets/Renuka mam.jpg";
import AshwiniImg from "../assets/Ashwini mam.jpg";




const TeachersPage = () => {
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [expandedImage, setExpandedImage] = useState(null);

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

  // ✅ UPDATED TEACHER DATA WITH AVAILABLE IMAGES AND SUBJECTS
  const teachers = [
    { name: "Subhas Sir", img: subhasImg, subject: "Science" },
    { name: "Bhagamma Mam", img: bhagamma, subject: "Social Science" },
    { name: "Sumanth Sir", img: sumanthImg, subject: "English" },
    { name: "Madivalappa Sir", img: madivalappaImg, subject: "Kannada" },
    { name: "Mallu Sir", img: malluImg, subject: "Health Care" },
    { name: "Rajkumar Sir", img: rajkumarImg, subject: "Physical Education" },
    { name: "Shantalingappa Sir", img: shantalingappaImg, subject: "Kannada" },
    { name: "Chandru Sir", img: chandruImg, subject: "hindi" },
    { name: "Renuka Mam", img: RenukaImg, subject: "English" },
    { name: "Ashwini Mam", img: AshwiniImg, subject: "Computer Science" },
    { name: "Ramesh Sir", img: rameshImg, subject: "Singing" },
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

        /* Teachers Grid — uniform square cards, 3 per row */
        .teachers-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 20px;
          width: 100%;
          margin: 0 auto;
          align-items: stretch;
        }

        .teacher-pill {
          cursor: pointer;
          border-radius: 16px;
          padding: 16px 12px;
          text-align: center;
          box-shadow: 0 6px 18px rgba(0,0,0,0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          background: white;
          aspect-ratio: 1 / 1;
          width: 100%;
          min-width: 0;
          min-height: 0;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .teacher-pill:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 28px rgba(0,0,0,0.15);
        }

        .teacher-pill:focus-visible {
          outline: 2px solid rgba(71, 85, 105, 0.45);
          outline-offset: 3px;
        }

        .teacher-pill .teacher-img {
          order: -1;
          flex-shrink: 0;
        }

        .teacher-pill div {
          font-weight: 700;
          font-size: 1rem;
          color: var(--text);
          margin: 0;
          width: 100%;
          min-width: 0;
          max-width: 100%;
          text-align: center;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          word-break: break-word;
          line-height: 1.25;
        }

        .teacher-img {
          width: clamp(56px, 32%, 80px);
          height: clamp(56px, 32%, 80px);
          border-radius: 50%;
          object-fit: cover;
          margin: 0 auto;
          border: 3px solid white;
          box-shadow: 0 4px 10px rgba(0,0,0,0.2);
          display: block;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          flex-shrink: 0;
        }

        .teacher-img:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 16px rgba(0,0,0,0.3);
        }

        /* Responsive */
        @media (max-width: 1400px) {
          .teachers-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 20px;
          }
        }

        @media (max-width: 1200px) {
          .teachers-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 18px;
          }
        }

        @media (max-width: 1024px) {
          .page-wrap.teachers-page {
            padding: var(--space-5);
          }

          .section-inner {
            padding: 0 var(--space-3);
          }

          .teachers-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 16px;
          }

          .teacher-pill {
            padding: 14px 10px;
            gap: 8px;
          }

          .teacher-img {
            width: clamp(52px, 30%, 76px);
            height: clamp(52px, 30%, 76px);
          }
        }

        @media (max-width: 768px) {
          .page-wrap.teachers-page {
            padding: var(--space-5);
          }

          .section-inner {
            padding: 0;
          }

          .teachers-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 15px;
          }

          .principal-card {
            padding: 30px 20px;
          }

          .section-title {
            font-size: 1.75rem;
          }

          .teacher-pill {
            padding: 12px 8px;
            gap: 8px;
          }

          .teacher-img {
            width: clamp(48px, 28%, 70px);
            height: clamp(48px, 28%, 70px);
          }

          .teacher-pill div {
            font-size: 0.9rem;
            -webkit-line-clamp: 2;
            line-clamp: 2;
          }
        }

        @media (max-width: 600px) {
          .page-wrap.teachers-page {
            padding: var(--space-4);
          }

          .section-inner {
            padding: 0;
          }

          .teachers-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 12px;
          }

          .teacher-pill {
            padding: 10px 6px;
            border-radius: 12px;
            gap: 6px;
          }

          .teacher-pill div {
            font-size: 0.85rem;
            -webkit-line-clamp: 2;
            line-clamp: 2;
          }

          .teacher-img {
            width: clamp(44px, 26%, 64px);
            height: clamp(44px, 26%, 64px);
            border: 2px solid white;
          }

          .principal-card {
            padding: 25px 15px;
            margin: 15px 0;
          }

          .principal-title {
            font-size: 0.85rem;
          }

          .principal-name {
            font-size: 1.3rem;
            margin: 8px 0;
          }

          .principal-card img {
            width: 100px;
            height: 100px;
            margin-top: 12px;
            border: 3px solid white;
          }

          .section-title {
            font-size: 1.5rem;
          }

          .section-subtitle {
            font-size: 0.9rem;
          }
        }

        @media (max-width: 480px) {
          .page-wrap.teachers-page {
            padding: var(--space-4);
          }

          .section-inner {
            padding: 0;
          }

          .teachers-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 10px;
            width: 100%;
            padding: 0;
          }

          .teacher-pill {
            padding: 8px 5px;
            border-radius: 12px;
            gap: 6px;
          }

          .teacher-pill div {
            font-size: 0.8rem;
            font-weight: 700;
            -webkit-line-clamp: 2;
            line-clamp: 2;
          }

          .teacher-img {
            width: clamp(40px, 24%, 58px);
            height: clamp(40px, 24%, 58px);
            border: 2px solid white;
          }

          .principal-card {
            padding: 20px 15px;
            margin: 15px 0;
          }

          .principal-title {
            font-size: 0.8rem;
          }

          .principal-name {
            font-size: 1.25rem;
            margin: 8px 0;
          }

          .principal-card img {
            width: 95px;
            height: 95px;
            margin-top: 12px;
            border: 3px solid white;
          }

          .section-title {
            font-size: 1.4rem;
          }

          .section-subtitle {
            font-size: 0.85rem;
          }
        }

        /* Extra small devices */
        @media (max-width: 380px) {
          .page-wrap.teachers-page {
            padding: var(--space-3);
          }

          .section-inner {
            padding: 0;
          }

          .teachers-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 8px;
            padding: 0;
          }

          .teacher-pill {
            padding: 7px 4px;
            border-radius: 10px;
            gap: 5px;
          }

          .teacher-pill div {
            font-size: 0.75rem;
            -webkit-line-clamp: 2;
            line-clamp: 2;
          }

          .teacher-img {
            width: clamp(38px, 22%, 54px);
            height: clamp(38px, 22%, 54px);
            border: 2px solid white;
          }

          .principal-card {
            padding: 15px 12px;
            margin: 10px 0;
          }

          .principal-name {
            font-size: 1.1rem;
            margin: 6px 0;
          }

          .principal-card img {
            width: 85px;
            height: 85px;
            margin-top: 10px;
          }

          .section-title {
            font-size: 1.3rem;
          }

          .section-subtitle {
            font-size: 0.8rem;
          }
        }

        @media (max-width: 360px) {
          .page-wrap.teachers-page {
            padding: var(--space-3);
          }

          .section-inner {
            padding: 0;
          }

          .teachers-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 6px;
            padding: 0;
          }

          .teacher-pill {
            padding: 6px 3px;
            border-radius: 10px;
            gap: 4px;
          }

          .teacher-pill div {
            font-size: 0.7rem;
            line-height: 1.2;
            -webkit-line-clamp: 2;
            line-clamp: 2;
          }

          .teacher-img {
            width: clamp(36px, 21%, 50px);
            height: clamp(36px, 21%, 50px);
            border: 2px solid white;
          }

          .principal-card {
            padding: 12px 10px;
            margin: 8px 0;
          }

          .principal-title {
            font-size: 0.75rem;
            margin-bottom: 4px;
          }

          .principal-name {
            font-size: 1rem;
            margin: 4px 0;
          }

          .principal-card img {
            width: 80px;
            height: 80px;
            margin-top: 8px;
            border: 2px solid white;
          }

          .section-title {
            font-size: 1.2rem;
          }

          .section-subtitle {
            font-size: 0.75rem;
            margin-top: 8px;
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
          padding: 16px;
          box-sizing: border-box;
        }

        .principal-image-modal-content {
          position: relative;
          width: min(92vw, 420px);
          max-width: 420px;
          max-height: calc(100vh - 32px);
          height: auto;
          box-sizing: border-box;
          animation: slideUp 0.3s ease;
          background: white;
          border-radius: 18px;
          padding: 18px 16px 16px;
          padding-top: 52px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          gap: 10px;
          overflow: auto;
          z-index: 2100;
        }

        .principal-image-modal img {
          flex: 0 0 auto;
          align-self: center;
          width: clamp(88px, 28vw, 124px);
          height: clamp(88px, 28vw, 124px);
          aspect-ratio: 1 / 1;
          object-fit: cover;
          object-position: center;
          border-radius: 50%;
          border: 4px solid #fff;
          margin: 0;
          box-sizing: border-box;
          box-shadow:
            0 12px 32px rgba(0, 0, 0, 0.2),
            0 4px 12px rgba(0, 0, 0, 0.1),
            0 0 0 1px rgba(0, 0, 0, 0.06);
        }

        .modal-teacher-name {
          font-size: clamp(1.05rem, 4.4vw, 1.35rem);
          font-weight: 800;
          color: #1a1a1a;
          margin: 0;
          width: 100%;
          max-width: 100%;
          padding: 0 44px;
          box-sizing: border-box;
          text-align: center;
          font-family: var(--font-heading);
          line-height: 1.2;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: normal;
          word-break: break-word;
        }

        .modal-teacher-subject {
          font-size: clamp(0.9rem, 3.8vw, 1.05rem);
          color: #555;
          text-align: center;
          margin: 0;
          font-weight: 600;
          letter-spacing: 0.3px;
          width: 100%;
          max-width: 100%;
          padding: 0 16px;
          box-sizing: border-box;
          line-height: 1.25;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: normal;
          word-break: break-word;
        }

        .principal-close-btn {
          position: absolute;
          top: 8px;
          right: 8px;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          font-size: 24px;
          cursor: pointer;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          z-index: 2001;
        }

        .principal-close-btn:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
          background: rgba(0, 0, 0, 0.9);
        }

        .principal-card img {
          cursor: pointer;
          transition: transform 0.2s ease;
        }

        .principal-card img:hover {
          transform: scale(1.05);
        }

        /* Expanded Image Modal */
        .expanded-image-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.88);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 3500;
          animation: fadeIn 0.3s ease;
          padding: 20px;
          overflow: auto;
        }

        .expanded-image-content {
          position: relative;
          max-width: 600px;
          max-height: 700px;
          width: 100%;
          height: auto;
          animation: slideUp 0.3s ease;
          border-radius: 12px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          background: white;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          z-index: 3510;
          box-sizing: border-box;
          padding: 0;
        }

        .expanded-image-modal img {
          width: 100%;
          height: auto;
          max-width: 100%;
          max-height: 700px;
          object-fit: contain;
          border-radius: 12px;
          display: block;
        }

        .expanded-image-close-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          font-size: 24px;
          cursor: pointer;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          z-index: 3520;
        }

        .expanded-image-close-btn:hover {
          background: rgba(0, 0, 0, 0.9);
          transform: scale(1.15);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
        }

        /* Expanded Image Responsive */
        @media (max-width: 1024px) {
          .expanded-image-modal {
            padding: 20px;
          }

          .expanded-image-content {
            max-width: 550px;
            max-height: 650px;
          }

          .expanded-image-modal img {
            max-height: 650px;
          }

          .expanded-image-close-btn {
            width: 38px;
            height: 38px;
            font-size: 22px;
            top: 8px;
            right: 8px;
          }
        }

        @media (max-width: 768px) {
          .expanded-image-modal {
            padding: 15px;
          }

          .expanded-image-content {
            max-width: 500px;
            max-height: 600px;
          }

          .expanded-image-modal img {
            max-height: 600px;
          }

          .expanded-image-close-btn {
            width: 36px;
            height: 36px;
            font-size: 20px;
            top: 8px;
            right: 8px;
          }
        }

        @media (max-width: 600px) {
          .expanded-image-modal {
            padding: 12px;
          }

          .expanded-image-content {
            max-width: 95%;
            max-height: 500px;
            border-radius: 10px;
          }

          .expanded-image-modal img {
            max-height: 500px;
            border-radius: 10px;
          }

          .expanded-image-close-btn {
            width: 34px;
            height: 34px;
            font-size: 18px;
            top: 8px;
            right: 8px;
          }
        }

        @media (max-width: 480px) {
          .expanded-image-modal {
            padding: 10px;
          }

          .expanded-image-content {
            max-width: 100%;
            max-height: 450px;
            border-radius: 8px;
          }

          .expanded-image-modal img {
            max-height: 450px;
            border-radius: 8px;
          }

          .expanded-image-close-btn {
            width: 32px;
            height: 32px;
            font-size: 16px;
            top: 6px;
            right: 6px;
          }
        }

        @media (max-width: 360px) {
          .expanded-image-modal {
            padding: 8px;
          }

          .expanded-image-content {
            max-width: 100%;
            max-height: 400px;
            border-radius: 8px;
          }

          .expanded-image-modal img {
            max-height: 400px;
          }

          .expanded-image-close-btn {
            width: 30px;
            height: 30px;
            font-size: 14px;
            top: 5px;
            right: 5px;
          }
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

        /* Modal Responsive Styles — square card, laptop / tablet / mobile */
        @media (max-width: 1024px) {
          .principal-image-modal img {
            width: clamp(84px, 26vw, 116px);
            height: clamp(84px, 26vw, 116px);
            border: 4px solid #fff;
          }

          .principal-close-btn {
            width: 38px;
            height: 38px;
            font-size: 22px;
            top: 6px;
            right: 6px;
          }
        }

        @media (max-width: 768px) {
          .principal-image-modal img {
            width: clamp(80px, 25vw, 112px);
            height: clamp(80px, 25vw, 112px);
            border: 4px solid #fff;
          }

          .principal-close-btn {
            width: 36px;
            height: 36px;
            font-size: 20px;
            top: 6px;
            right: 6px;
          }
        }

        @media (max-width: 600px) {
          .principal-image-modal {
            padding: 0 12px;
          }

          .principal-image-modal-content {
            width: min(94vw, 380px);
            max-width: 380px;
            border-radius: 14px;
            padding: 16px 14px 14px;
            padding-top: 48px;
          }

          .principal-image-modal img {
            width: clamp(76px, 24vw, 106px);
            height: clamp(76px, 24vw, 106px);
            border: 3.5px solid #fff;
          }

          .modal-teacher-name {
            padding: 0 40px;
          }

          .principal-close-btn {
            width: 34px;
            height: 34px;
            font-size: 18px;
            top: 5px;
            right: 5px;
          }
        }

        @media (max-width: 480px) {
          .principal-image-modal {
            padding: 0 8px;
          }

          .principal-image-modal-content {
            width: min(96vw, 360px);
            max-width: 360px;
            border-radius: 12px;
            padding-top: 46px;
          }

          .principal-image-modal img {
            width: clamp(72px, 24vw, 98px);
            height: clamp(72px, 24vw, 98px);
            border: 3px solid #fff;
          }

          .modal-teacher-name {
            padding: 0 38px;
          }

          .modal-teacher-subject {
            padding: 0 12px;
          }

          .principal-close-btn {
            width: 32px;
            height: 32px;
            font-size: 16px;
            top: 5px;
            right: 5px;
          }
        }

        @media (max-width: 380px) {
          .principal-image-modal img {
            width: clamp(68px, 23vw, 92px);
            height: clamp(68px, 23vw, 92px);
            border: 3px solid #fff;
          }

          .principal-close-btn {
            width: 30px;
            height: 30px;
            font-size: 14px;
          }
        }

        @media (max-width: 360px) {
          .principal-image-modal img {
            width: clamp(64px, 22vw, 88px);
            height: clamp(64px, 22vw, 88px);
            border: 2.5px solid #fff;
          }

          .principal-close-btn {
            width: 28px;
            height: 28px;
            font-size: 12px;
            top: 4px;
            right: 4px;
          }
        }

        @supports (height: 100dvh) {
          .principal-image-modal-content {
            max-height: calc(100dvh - 32px);
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
          onClick={() => setSelectedTeacher({ ...principal, subject: "Principal" })}
        />
      </div>

      {/* TEACHERS GRID */}
      <div className="teachers-grid">
        {teachers.map((t, index) => (
          <div
            key={index}
            className="teacher-pill"
            style={{ background: teacherGradients[index % teacherGradients.length] }}
            role="button"
            tabIndex={0}
            aria-label={`Open details for ${t.name}`}
            onClick={() => setSelectedTeacher(t)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setSelectedTeacher(t);
              }
            }}
          >
            <div>{t.name}</div>

            {/* ✅ IMAGE BELOW NAME */}
            <img 
              src={t.img} 
              alt={t.name} 
              className="teacher-img"
            />
          </div>
        ))}
      </div>

      {/* IMAGE MODAL - For Principal and Teachers */}
      {selectedTeacher && (
        <div className="principal-image-modal" onClick={() => setSelectedTeacher(null)}>
          <div className="principal-image-modal-content" onClick={(e) => e.stopPropagation()}>
            <button 
              className="principal-close-btn" 
              onClick={() => setSelectedTeacher(null)}
              title="Close"
            >
              ✕
            </button>
            <img 
              src={selectedTeacher.img} 
              alt={selectedTeacher.name}
              onClick={(e) => {
                e.stopPropagation();
                setExpandedImage(selectedTeacher.img);
              }}
              style={{ cursor: "pointer" }}
              title="Click to view larger"
            />
            <div className="modal-teacher-name">{selectedTeacher.name}</div>
            {selectedTeacher.subject !== "Principal" && (
              <div className="modal-teacher-subject">Sub: {selectedTeacher.subject}</div>
            )}
          </div>
        </div>
      )}

      {/* EXPANDED IMAGE MODAL */}
      {expandedImage && (
        <div className="expanded-image-modal" onClick={() => setExpandedImage(null)}>
          <div className="expanded-image-content" onClick={(e) => e.stopPropagation()}>
            <button 
              className="expanded-image-close-btn" 
              onClick={() => setExpandedImage(null)}
              title="Close"
            >
              ✕
            </button>
            <img src={expandedImage} alt="Expanded view" />
          </div>
        </div>
      )}

      </div>
    </div>
  );
};

export default TeachersPage;