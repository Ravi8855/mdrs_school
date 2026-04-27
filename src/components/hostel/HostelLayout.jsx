import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Navbar from "../Navbar";

export default function HostelLayout({ onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (target) => {
    const scrollToTarget = () => {
      const element = document.getElementById(target);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    if (location.pathname !== "/home") {
      navigate("/home");
      setTimeout(scrollToTarget, 80);
      return;
    }
    scrollToTarget();
  };

  return (
    <div className="app-wrapper" style={{ width: "100%", overflowX: "hidden" }}>
      <Navbar onNavigate={handleNavigate} onLogout={onLogout} />
      <main className="hostel-route-main">
        <Outlet />
      </main>
    </div>
  );
}
