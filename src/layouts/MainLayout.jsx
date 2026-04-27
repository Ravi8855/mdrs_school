import React from "react";
import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import { FaArrowLeft, FaUserCircle } from "react-icons/fa";
import BottomNav from "../components/BottomNav";
import "./MainLayout.css";

export default function MainLayout() {
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
          <div className="main-app-shell__header-actions">
            <Link
              to="/profile"
              className="main-app-shell__profile"
              aria-label="Your profile"
              title="Profile"
            >
              <FaUserCircle aria-hidden />
            </Link>
          </div>
        </header>
        <main className="main-app-shell__main">
          <Outlet />
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
