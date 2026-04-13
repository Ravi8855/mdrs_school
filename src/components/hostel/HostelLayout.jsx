import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer";
import AnimatedSection from "../AnimatedSection";

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

    if (location.pathname !== "/") {
      navigate("/");
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
      <AnimatedSection>
        <Footer />
      </AnimatedSection>
    </div>
  );
}
