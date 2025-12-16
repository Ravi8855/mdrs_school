import React, { useEffect, useState } from "react";
import confetti from "canvas-confetti";

import Navbar from "./components/Navbar";
import BestFriendsPage from "./components/BestFriendsPage";
import ClassmatesPage from "./components/ClassmatesPage";
import TeachersPage from "./components/TeachersPage";
import SchoolHome from "./components/SchoolHome";
import WorkersPage from "./components/WorkersPage";
import GalleryPage from "./components/GalleryPage";
import SpinWheelPage from "./components/SpinWheelPage";
import Footer from "./components/Footer"; // ✅ added footer

function App() {
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
    handleConfetti();
    setRandomJoke(jokes[Math.floor(Math.random() * jokes.length)]);
  }, []);

  const handleNavigate = (target) => {
    const element = document.getElementById(target);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="app-wrapper">
      <Navbar onNavigate={handleNavigate} />

      {/* All sections rendered on single page */}
      <section id="home">
        <SchoolHome />
      </section>

      <section id="classmates">
        <ClassmatesPage />
      </section>

     <section id="teachers" className="page-section">
  <TeachersPage />
</section>


      <section id="workers">
        <WorkersPage />
      </section>

      <section id="bff">
        <BestFriendsPage />
      </section>

      <section id="gallery">
        <GalleryPage />
      </section>

      <section id="spin-wheel">
        <SpinWheelPage />
      </section>

      {/* ✅ PREMIUM FOOTER ADDED HERE */}
      <Footer />
    </div>
  );
}

export default App;
