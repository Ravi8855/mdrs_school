import React from "react";
import FloatingBubbles from "./FloatingBubbles";

const QUICK_LINKS = [
  { id: "home", label: "Home" },
  { id: "classmates", label: "Classmates" },
  { id: "teachers", label: "Teachers" },
  { id: "alumni", label: "Alumni" },
  { id: "hostel", label: "Our Hostel", href: "/hostel" },
  { id: "gallery", label: "Gallery" },
  { id: "bell-game", label: "Bell Game" },
];

const Footer = () => {
  return (
    <footer className="mdrs-footer">
      <style>{`
        .mdrs-footer {
          position: relative;
          overflow: hidden;
          background: linear-gradient(to top, #e0f7ff 0%, #eef4ff 42%, #f3e8ff 100%);
          color: #1e293b;
          font-family: var(--font-body, 'Poppins', sans-serif);
          box-shadow: 0 -6px 28px rgba(99, 102, 241, 0.1);
          padding: 12px clamp(16px, 4vw, 24px) clamp(20px, 4vw, 28px);
        }

        .footer-inner {
          position: relative;
          z-index: 10;
          max-width: 1000px;
          margin: 0 auto;
          width: 100%;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          gap: 40px 32px;
          margin-bottom: 36px;
          text-align: left;
          align-items: start;
        }

        .footer-credit {
          text-align: center;
          padding: 0 16px;
        }
        .footer-credit .footer-title {
          font-size: 1rem;
          font-weight: 600;
          margin: 0 0 8px 0;
          color: #5b21b6;
        }
        .footer-credit .footer-copy {
          font-size: 0.875rem;
          color: #475569;
          margin: 0;
          text-align: center;
        }

        .footer-block h4 {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #6d28d9;
          margin: 0 0 16px 0;
        }

        .footer-contact-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .footer-contact-list a {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          color: #334155;
          text-decoration: none;
          font-size: clamp(0.9rem, 2vw, 0.95rem);
          padding: 8px 0;
          min-height: 44px;
          transition: color 0.2s ease, transform 0.2s ease;
        }

        .footer-contact-list a:hover {
          color: #7c3aed;
          transform: translateX(4px);
        }

        .footer-contact-list a svg {
          flex-shrink: 0;
          font-size: 1.35rem;
          width: 1.35rem;
          height: 1.35rem;
        }

        .footer-contact-list a.contact-whatsapp svg {
          color: #25d366;
        }
        .footer-contact-list a.contact-whatsapp:hover svg {
          color: #2ee66b;
        }

        .footer-contact-list a.contact-email svg {
          color: #64748b;
        }
        .footer-contact-list a.contact-email:hover svg {
          color: #7c3aed;
        }

        .footer-quick-links {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .footer-quick-links a {
          color: #334155;
          text-decoration: none;
          font-size: clamp(0.9rem, 2vw, 0.95rem);
          padding: 8px 0;
          min-height: 44px;
          display: inline-flex;
          align-items: center;
          transition: color 0.2s ease, padding-left 0.2s ease;
        }

        .footer-quick-links a:hover {
          color: #7c3aed;
          padding-left: 4px;
        }

        .footer-divider {
          display: none;
        }

        /* Hide first footer-block (contact) on desktop */
        .footer-grid .footer-block:first-child {
          display: none;
        }

        .footer-title {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 16px;
          color: #5b21b6;
          text-align: center;
        }

        .footer-copy {
          font-size: 0.875rem;
          text-align: center;
          color: #475569;
          margin: 0;
        }

        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .mdrs-footer { padding: 36px 20px 24px; }
          .footer-grid {
            gap: 28px;
            margin-bottom: 28px;
            text-align: center;
          }
          .footer-contact-list { align-items: center; }
          .footer-quick-links { align-items: center; }
          .footer-block h4 { text-align: center; }
          .footer-grid .footer-block:first-child {
            display: block;
          }
          .footer-divider {
            display: block;
            height: 1px;
            background: rgba(109, 40, 217, 0.18);
            margin-bottom: 28px;
          }
        }

        /* Mobile Bottom Section */
        .footer-mobile-info {
          display: none;
        }

        @media (max-width: 640px) {
          .footer-mobile-info {
            display: block;
            text-align: center;
            padding-top: 20px;
          }

          .footer-mobile-info-text {
            font-size: 0.9rem;
            color: #334155;
            margin: 0 0 12px 0;
            font-weight: 500;
          }

          .footer-mobile-email {
            font-size: 0.95rem;
            color: #6d28d9;
            font-weight: 600;
            text-decoration: none;
            transition: color 0.2s ease;
          }

          .footer-mobile-email:hover {
            color: #7c3aed;
            text-decoration: underline;
          }
        }
      `}</style>

      <FloatingBubbles />

      <div className="footer-inner">
        <div className="footer-grid">
          <div className="footer-block">
           
          </div>
          <div className="footer-credit">
            <p className="footer-title"> Built by SSLC 2015–2016 Batch Students</p>
          </div>
          <div className="footer-block">
            <h4>Quick Links</h4>
            <ul className="footer-quick-links">
              {QUICK_LINKS.map(({ id, label, href }) => (
                <li key={id}>
                  <a href={href ?? `/#${id}`}>{label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
