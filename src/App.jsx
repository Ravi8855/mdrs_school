import React, { Suspense, useCallback, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./components/LoginPage";
import AnimatedSection from "./components/AnimatedSection";
import MainLayout from "./layouts/MainLayout";
import MobileHomeMenu from "./pages/MobileHomeMenu";
import { clearProfileSession } from "./lib/profileSession";
import CinematicIntro from "./components/CinematicIntro";
import {
  ClassmatesPage,
  BatchStudentsPage,
  Batch2013StudentsPage,
  Batch2015StudentsPage,
  Batch2016StudentsPage,
  Batch2017StudentsPage,
  Batch2014StudentProfile,
  Batch2013StudentProfile,
  Batch2015StudentProfile,
  Batch2016StudentProfile,
  Batch2017StudentProfile,
  TeachersPage,
  GalleryPage,
  Alumni,
  AlumniProfile,
  HostelLayout,
  HostelDashboard,
  RoomList,
  RoomDetails,
  VotingPage,
  BellRingMadness,
  FeedbackPage,
  StudentProfilePage,
  MobilePeopleMenu,
  MobileBatchesMenu,
  MobileFeaturesMenu,
  MeetStudentsGalleryPage,
} from "./lazyPages";

const SESSION_KEY = "isLoggedIn";
/** Once per tab session: intro plays on first open, not on every refresh. */
const INTRO_SESSION_KEY = "mdrs_intro_done_session";

function AppRouteFallback() {
  return <div className="app-route-fallback" aria-hidden />;
}

function ProtectedShell({ authed }) {
  if (!authed) {
    return <Navigate to="/login" replace />;
  }
  return <MainLayout />;
}

function App() {
  const [showIntro, setShowIntro] = useState(() => {
    try {
      if (typeof sessionStorage === "undefined") return true;
      return sessionStorage.getItem(INTRO_SESSION_KEY) !== "true";
    } catch {
      return true;
    }
  });

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

  const handleIntroEnd = useCallback(() => {
    try {
      sessionStorage.setItem(INTRO_SESSION_KEY, "true");
    } catch {
      // ignore
    }
    setShowIntro(false);
  }, []);

  return (
    <BrowserRouter>
      {showIntro ? (
        <CinematicIntro onFinish={handleIntroEnd} />
      ) : (
        <Suspense fallback={<AppRouteFallback />}>
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
              <Route path="/batches" element={<MobileBatchesMenu />} />
              <Route path="/meet-seniors-juniors" element={<MeetStudentsGalleryPage />} />
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
              <Route
                path="/batch-students/:slug"
                element={
                  <AnimatedSection>
                    <Batch2014StudentProfile />
                  </AnimatedSection>
                }
              />
              <Route path="/batch-2013-students" element={<Batch2013StudentsPage onLogout={handleLogout} />} />
              <Route
                path="/batch-2013-students/:slug"
                element={
                  <AnimatedSection>
                    <Batch2013StudentProfile />
                  </AnimatedSection>
                }
              />
              <Route path="/batch-2015-students" element={<Batch2015StudentsPage onLogout={handleLogout} />} />
              <Route
                path="/batch-2015-students/:slug"
                element={
                  <AnimatedSection>
                    <Batch2015StudentProfile />
                  </AnimatedSection>
                }
              />
              <Route path="/batch-2016-students" element={<Batch2016StudentsPage onLogout={handleLogout} />} />
              <Route
                path="/batch-2016-students/:slug"
                element={
                  <AnimatedSection>
                    <Batch2016StudentProfile />
                  </AnimatedSection>
                }
              />
              <Route path="/batch-2017-students" element={<Batch2017StudentsPage onLogout={handleLogout} />} />
              <Route
                path="/batch-2017-students/:slug"
                element={
                  <AnimatedSection>
                    <Batch2017StudentProfile />
                  </AnimatedSection>
                }
              />
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
        </Suspense>
      )}
    </BrowserRouter>
  );
}

export default App;
