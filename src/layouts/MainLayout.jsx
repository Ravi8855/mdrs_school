import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import BottomNav from "../components/BottomNav";
import "./MainLayout.css";

export default function MainLayout({ onLogout }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const showBack = pathname !== "/home";

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="main-app-shell">
      <div className="main-app-shell__frame">
        <header className="main-app-shell__header">
          <div className="main-app-shell__header-left">
            {showBack ? (
              <button
                type="button"
                className="main-app-shell__back"
                onClick={handleBack}
                aria-label="Go back"
              >
                <FaArrowLeft aria-hidden />
              </button>
            ) : null}
            <span className="main-app-shell__brand">MDRS School</span>
          </div>
          {onLogout ? (
            <button type="button" className="main-app-shell__logout" onClick={onLogout}>
              Logout
            </button>
          ) : null}
        </header>
        <main className="main-app-shell__main">
          <Outlet />
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
