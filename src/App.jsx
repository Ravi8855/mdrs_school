import React, { useEffect, useState } from "react";
import confetti from "canvas-confetti";

import LoginPage from "./components/LoginPage";
import Navbar from "./components/Navbar";
import AnimatedSection from "./components/AnimatedSection";
import ClassmatesPage from "./components/ClassmatesPage";
import TeachersPage from "./components/TeachersPage";
import SchoolHome from "./components/SchoolHome";
import WorkersPage from "./components/WorkersPage";
import GalleryPage from "./components/GalleryPage";
import Alumni from "./components/Alumni";
import BellRingMadness from "./components/BellRingMadness";
import Footer from "./components/Footer";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("mdrs-school-logged-in") ?? "false");
    } catch {
      return false;
    }
  });
  const [randomJoke, setRandomJoke] = useState("");

  const jokes = [
    "Teacher: Why are you talking? Me: I'm not talking, I'm just exchanging information.",
    "My homework is like a customized car. It's unique and probably illegal.",
    "Math: The only place where people buy 64 watermelons and no one wonders why.",
    "I'm not sleeping in class, I'm just testing gravity with my eyelids.",
    "Student: *drops pen* Class: *chaos ensues*",
    "Teacher: 'I will wait until it is quiet.' Class: *Takes a nap*",
  ];

  const handleConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  useEffect(() => {
    if (isLoggedIn) {
      handleConfetti();
      setRandomJoke(jokes[Math.floor(Math.random() * jokes.length)]);
    }
  }, [isLoggedIn]);

  const handleLogin = () => {
    try {
      localStorage.setItem("mdrs-school-logged-in", "true");
      setIsLoggedIn(true);
    } catch {
      setIsLoggedIn(true);
    }
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const [showBackToTop, setShowBackToTop] = useState(false);

  const handleNavigate = (target) => {
    const element = document.getElementById(target);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="app-wrapper" style={{ width: '100%', overflowX: 'hidden' }}>
      <Navbar onNavigate={handleNavigate} />

      {/* All sections rendered on single page */}
      <section id="home">
        <SchoolHome onNavigate={handleNavigate} />
      </section>

      <section id="teachers" className="page-section">
        <AnimatedSection><TeachersPage /></AnimatedSection>
      </section>

      <section id="classmates" className="page-section">
        <AnimatedSection><ClassmatesPage /></AnimatedSection>
      </section>

      <section id="workers" className="page-section">
        <AnimatedSection><WorkersPage /></AnimatedSection>
      </section>

      <section id="alumni" className="page-section">
        <AnimatedSection><Alumni /></AnimatedSection>
      </section>

      <section id="gallery" className="page-section">
        <AnimatedSection><GalleryPage /></AnimatedSection>
      </section>

      <section id="bell-game" className="page-section">
        <AnimatedSection><BellRingMadness /></AnimatedSection>
      </section>

      <AnimatedSection><Footer /></AnimatedSection>

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

export default App;
