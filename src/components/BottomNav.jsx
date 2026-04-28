import React, { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaThLarge, FaUsers, FaCommentDots, FaUserCircle } from "react-icons/fa";
import "./BottomNav.css";

function tabForPath(pathname) {
  if (pathname === "/people") return "people";

  if (
    pathname === "/classmates" ||
    pathname === "/teachers" ||
    pathname === "/meet-seniors-juniors" ||
    pathname === "/alumni" ||
    pathname.startsWith("/alumni/") ||
    pathname === "/batch-students" ||
    pathname.startsWith("/batch-students/")
  ) {
    return "people";
  }

  if (pathname === "/home") return "home";

  if (pathname === "/features") return "features";
  if (pathname.startsWith("/hostel")) return "features";
  if (pathname === "/gallery" || pathname === "/bell-game" || pathname === "/voting") {
    return "features";
  }

  if (pathname === "/feedback" || pathname.startsWith("/feedback")) return "feedback";

  if (pathname === "/profile") return "profile";

  return null;
}

export default function BottomNav() {
  const { pathname } = useLocation();
  const active = useMemo(() => tabForPath(pathname), [pathname]);

  const linkClass = (tab) =>
    `mobile-bottom-nav__link${active === tab ? " mobile-bottom-nav__link--active" : ""}`;

  const profileClass =
    `mobile-bottom-nav__profile${active === "profile" ? " mobile-bottom-nav__profile--active" : ""}`;

  return (
    <nav className="mobile-bottom-nav" aria-label="Main">
      <div className="mobile-bottom-nav__tabs">
        <Link to="/home" className={linkClass("home")} aria-current={active === "home" ? "page" : undefined}>
          <span className="mobile-bottom-nav__icon" aria-hidden>
            <FaHome />
          </span>
          Home
        </Link>
        <Link to="/people" className={linkClass("people")} aria-current={active === "people" ? "page" : undefined}>
          <span className="mobile-bottom-nav__icon" aria-hidden>
            <FaUsers />
          </span>
          People
        </Link>
        <Link
          to="/features"
          className={linkClass("features")}
          aria-current={active === "features" ? "page" : undefined}
          aria-label="Features"
        >
          <span className="mobile-bottom-nav__icon" aria-hidden>
            <FaThLarge />
          </span>
          Features
        </Link>
        <Link
          to="/feedback"
          className={linkClass("feedback")}
          aria-current={active === "feedback" ? "page" : undefined}
          aria-label="Feedback"
        >
          <span className="mobile-bottom-nav__icon" aria-hidden>
            <FaCommentDots />
          </span>
          Feedback
        </Link>
      </div>
      <span className="mobile-bottom-nav__divider" aria-hidden />
      <Link
        to="/profile"
        className={profileClass}
        aria-label="Your profile"
        title="Profile"
        aria-current={active === "profile" ? "page" : undefined}
      >
        <span className="mobile-bottom-nav__profile-icon" aria-hidden>
          <FaUserCircle />
        </span>
      </Link>
    </nav>
  );
}
