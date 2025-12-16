import React from "react";
import {
  FaLinkedin,
  FaGithub,
  FaWhatsapp,
  FaInstagram,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="mdrs-footer">
      <style>{`
        .mdrs-footer {
          background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
          padding: 50px 20px 40px;
          text-align: center;
          color: #ffffff;
          font-family: 'Poppins', sans-serif;
        }

        .footer-title {
          font-size: 1.4rem;
          font-weight: 700;
          margin-bottom: 20px;
          color: #ffd700;
          text-shadow: 0 0 12px rgba(255, 215, 0, 0.6);
        }

        .footer-icons {
          display: flex;
          justify-content: center;
          gap: 28px;
          flex-wrap: wrap;
          margin-bottom: 20px;
        }

        .footer-icons a {
          font-size: 2rem;
          transition: transform 0.3s ease;
        }

        .footer-icons a:hover {
          transform: translateY(-6px) scale(1.1);
        }

        /* Individual icon colors + glow */
        .linkedin {
          color: #0a66c2;
          text-shadow: 0 0 12px rgba(10, 102, 194, 0.8);
        }

        .github {
          color: #ffffff;
          text-shadow: 0 0 12px rgba(255, 255, 255, 0.7);
        }

        .whatsapp {
          color: #25d366;
          text-shadow: 0 0 12px rgba(37, 211, 102, 0.9);
        }

        .instagram {
          color: #e1306c;
          text-shadow: 0 0 12px rgba(225, 48, 108, 0.9);
        }

        .footer-copy {
          font-size: 0.95rem;
          opacity: 0.85;
        }

        @media (max-width: 600px) {
          .footer-title {
            font-size: 1.2rem;
          }

          .footer-icons a {
            font-size: 1.8rem;
          }
        }
      `}</style>

      <div className="footer-title">
        Proudly built by SSLC 2014–2015 Batch Student's
      </div>

      <div className="footer-icons">
        <a
          href="https://www.linkedin.com/in/ravi-s-b7b86135a/"
          target="_blank"
          rel="noopener noreferrer"
          className="linkedin"
          aria-label="LinkedIn"
        >
          <FaLinkedin />
        </a>

        <a
          href="https://github.com/Ravi8855"
          target="_blank"
          rel="noopener noreferrer"
          className="github"
          aria-label="GitHub"
        >
          <FaGithub />
        </a>

        <a
          href="https://wa.me/918855025560"
          target="_blank"
          rel="noopener noreferrer"
          className="whatsapp"
          aria-label="WhatsApp"
        >
          <FaWhatsapp />
        </a>

        <a
          href="https://www.instagram.com/ravi_____here?igsh=MXByZ3M3cWVnaWVoNg=="
          target="_blank"
          rel="noopener noreferrer"
          className="instagram"
          aria-label="Instagram"
        >
          <FaInstagram />
        </a>
      </div>

      <div className="footer-copy">
        © {new Date().getFullYear()} MDRS • Built with ❤️ and memories
      </div>
    </footer>
  );
};

export default Footer;
