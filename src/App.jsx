import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import confetti from "canvas-confetti";

import LoginPage from "./components/LoginPage";
import Navbar from "./components/Navbar";
import AnimatedSection from "./components/AnimatedSection";
import ClassmatesPage from "./components/ClassmatesPage";
import BatchStudentsPage from "./components/BatchStudentsPage";
import TeachersPage from "./components/TeachersPage";
import SchoolHome from "./components/SchoolHome";
import GalleryPage from "./components/GalleryPage";
import Alumni from "./components/Alumni";
import HostelLayout from "./components/hostel/HostelLayout";
import HostelDashboard from "./components/hostel/HostelDashboard";
import RoomList from "./components/hostel/RoomList";
import RoomDetails from "./components/hostel/RoomDetails";
import HostelTeaser from "./components/hostel/HostelTeaser";
import BellRingMadness from "./components/BellRingMadness";
import Footer from "./components/Footer";
import FeedbackCTA from "./components/FeedbackCTA";
import FeedbackPage from "./components/FeedbackPage";

const SESSION_KEY = "isLoggedIn";

const jokes = [
  "Teacher: Why are you talking? Me: I'm not talking, I'm just exchanging information.",
  "My homework is like a customized car. It's unique and probably illegal.",
  "Math: The only place where people buy 64 watermelons and no one wonders why.",
  "I'm not sleeping in class, I'm just testing gravity with my eyelids.",
  "Student: *drops pen* Class: *chaos ensues*",
  "Teacher: 'I will wait until it is quiet.' Class: *Takes a nap*",
];

function AppContent({ onLogout }) {
  const [showBackToTop, setShowBackToTop] = useState(false);

  const handleNavigate = (target) => {
    const element = document.getElementById(target);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, []);

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="app-wrapper" style={{ width: "100%", overflowX: "hidden" }}>
      <Navbar onNavigate={handleNavigate} onLogout={onLogout} />

      <section id="home">
        <SchoolHome onNavigate={handleNavigate} />
      </section>

      <section id="teachers" className="page-section">
        <AnimatedSection><TeachersPage /></AnimatedSection>
      </section>

      <section id="classmates" className="page-section">
        <AnimatedSection><ClassmatesPage variant="preview" /></AnimatedSection>
      </section>

      <section id="alumni" className="page-section">
        <AnimatedSection><Alumni /></AnimatedSection>
      </section>

      <section id="hostel" className="page-section">
        <AnimatedSection><HostelTeaser /></AnimatedSection>
      </section>

      <section id="gallery" className="page-section">
        <AnimatedSection><GalleryPage /></AnimatedSection>
      </section>

      <section id="bell-game" className="page-section">
        <AnimatedSection><BellRingMadness /></AnimatedSection>
      </section>

      <AnimatedSection>
        <FeedbackCTA />
      </AnimatedSection>
      <AnimatedSection>
        <Footer />
      </AnimatedSection>

      <button
        type="button"
        className={`back-to-top ${showBackToTop ? "visible" : ""}`}
        onClick={() => handleNavigate("home")}
        aria-label="Back to top"
      >
        ↑
      </button>
    </div>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    try {
      return sessionStorage.getItem(SESSION_KEY) === "true";
    } catch {
      return false;
    }
  });

  const handleLogin = () => {
    try {
      sessionStorage.setItem(SESSION_KEY, "true");
      setIsLoggedIn(true);
    } catch {
      setIsLoggedIn(true);
    }
  };

  const handleLogout = () => {
    try {
      sessionStorage.removeItem(SESSION_KEY);
      setIsLoggedIn(false);
    } catch {
      setIsLoggedIn(false);
    }
  };

  const authed =
    typeof sessionStorage !== "undefined" && sessionStorage.getItem(SESSION_KEY) === "true";

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isLoggedIn ? (
            <Navigate to="/" replace />
          ) : (
            <LoginPage onLogin={handleLogin} />
          )
        }
      />
      <Route
        path="/"
        element={
          authed ? (
            <AppContent onLogout={handleLogout} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/feedback"
        element={
          authed ? <FeedbackPage onLogout={handleLogout} /> : <Navigate to="/login" replace />
        }
      />
      <Route
        path="/batch-students"
        element={
          authed ? (
            <BatchStudentsPage onLogout={handleLogout} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/hostel"
        element={authed ? <HostelLayout onLogout={handleLogout} /> : <Navigate to="/login" replace />}
      >
        <Route index element={<HostelDashboard />} />
        <Route path="boys" element={<RoomList gender="boys" />} />
        <Route path="girls" element={<RoomList gender="girls" />} />
        <Route path="boys/:roomId" element={<RoomDetails gender="boys" />} />
        <Route path="girls/:roomId" element={<RoomDetails gender="girls" />} />
      </Route>
    </Routes>
  );
}

export default App;
