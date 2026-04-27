import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./components/LoginPage";
import AnimatedSection from "./components/AnimatedSection";
import ClassmatesPage from "./components/ClassmatesPage";
import BatchStudentsPage from "./components/BatchStudentsPage";
import TeachersPage from "./components/TeachersPage";
import GalleryPage from "./components/GalleryPage";
import Alumni from "./components/Alumni";
import AlumniProfile from "./components/AlumniProfile";
import HostelLayout from "./components/hostel/HostelLayout";
import HostelDashboard from "./components/hostel/HostelDashboard";
import RoomList from "./components/hostel/RoomList";
import RoomDetails from "./components/hostel/RoomDetails";
import VotingPage from "./components/VotingPage";
import BellRingMadness from "./components/BellRingMadness";
import FeedbackPage from "./components/FeedbackPage";
import MainLayout from "./layouts/MainLayout";
import StudentProfilePage from "./components/StudentProfilePage";
import MobileHomeMenu from "./pages/MobileHomeMenu";
import MobileFeaturesMenu from "./pages/MobileFeaturesMenu";
import MobilePeopleMenu from "./pages/MobilePeopleMenu";
import { clearProfileSession } from "./lib/profileSession";

const SESSION_KEY = "isLoggedIn";

function ProtectedShell({ authed }) {
  if (!authed) {
    return <Navigate to="/login" replace />;
  }
  return <MainLayout />;
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
      clearProfileSession();
      setIsLoggedIn(false);
    } catch {
      clearProfileSession();
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
            <Navigate to="/home" replace />
          ) : (
            <LoginPage onLogin={handleLogin} />
          )
        }
      />

      <Route element={<ProtectedShell authed={authed} />}>
        <Route path="/home" element={<MobileHomeMenu />} />
        <Route path="/people" element={<MobilePeopleMenu />} />
        <Route path="/features" element={<MobileFeaturesMenu />} />
        <Route path="/feedback" element={<FeedbackPage onLogout={handleLogout} />} />
        <Route path="/profile" element={<StudentProfilePage />} />
        <Route
          path="/classmates"
          element={
            <AnimatedSection>
              <ClassmatesPage variant="full" />
            </AnimatedSection>
          }
        />
        <Route
          path="/teachers"
          element={
            <AnimatedSection>
              <TeachersPage />
            </AnimatedSection>
          }
        />
        <Route
          path="/alumni"
          element={
            <AnimatedSection>
              <Alumni />
            </AnimatedSection>
          }
        />
        <Route
          path="/alumni/:slug"
          element={
            <AnimatedSection>
              <AlumniProfile />
            </AnimatedSection>
          }
        />
        <Route
          path="/gallery"
          element={
            <AnimatedSection>
              <GalleryPage />
            </AnimatedSection>
          }
        />
        <Route
          path="/bell-game"
          element={
            <AnimatedSection>
              <BellRingMadness />
            </AnimatedSection>
          }
        />
        <Route path="/batch-students" element={<BatchStudentsPage onLogout={handleLogout} />} />
        <Route path="/hostel" element={<HostelLayout onLogout={handleLogout} />}>
          <Route index element={<HostelDashboard />} />
          <Route path="boys" element={<RoomList gender="boys" />} />
          <Route path="girls" element={<RoomList gender="girls" />} />
          <Route path="boys/:roomId" element={<RoomDetails gender="boys" />} />
          <Route path="girls/:roomId" element={<RoomDetails gender="girls" />} />
        </Route>
        <Route path="/voting" element={<VotingPage onLogout={handleLogout} />} />
      </Route>

      <Route path="/" element={<Navigate to={authed ? "/home" : "/login"} replace />} />

      <Route path="*" element={<Navigate to={authed ? "/home" : "/login"} replace />} />
    </Routes>
  );
}

export default App;
