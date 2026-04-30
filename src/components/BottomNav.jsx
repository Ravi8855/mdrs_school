import React, { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  HiOutlineHome,
  HiOutlineSquares2X2,
  HiOutlineUserGroup,
  HiOutlineChatBubbleLeftRight,
  HiOutlineRectangleStack,
} from "react-icons/hi2";
import "./BottomNav.css";

function tabForPath(pathname) {
  if (pathname === "/people") return "people";

  if (
    pathname === "/batches" ||
    pathname === "/batch-students" ||
    pathname.startsWith("/batch-students/") ||
    pathname === "/batch-2013-students" ||
    pathname.startsWith("/batch-2013-students/") ||
    pathname === "/batch-2015-students" ||
    pathname.startsWith("/batch-2015-students/") ||
    pathname === "/batch-2016-students" ||
    pathname.startsWith("/batch-2016-students/")
  ) {
    return "batches";
  }

  if (
    pathname === "/classmates" ||
    pathname === "/teachers" ||
    pathname === "/meet-seniors-juniors" ||
    pathname === "/alumni" ||
    pathname.startsWith("/alumni/")
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

  return null;
}

export default function BottomNav() {
  const { pathname } = useLocation();
  const active = useMemo(() => tabForPath(pathname), [pathname]);

  const linkClass = (tab) =>
    `mobile-bottom-nav__link${active === tab ? " mobile-bottom-nav__link--active" : ""}`;

  return (
    <nav className="mobile-bottom-nav" aria-label="Main">
      <div className="mobile-bottom-nav__tabs">
        <Link to="/home" className={linkClass("home")} aria-current={active === "home" ? "page" : undefined}>
          <span className="mobile-bottom-nav__icon" aria-hidden>
            <HiOutlineHome />
          </span>
          Home
        </Link>
        <Link to="/people" className={linkClass("people")} aria-current={active === "people" ? "page" : undefined}>
          <span className="mobile-bottom-nav__icon" aria-hidden>
            <HiOutlineUserGroup />
          </span>
          People
        </Link>
        <Link
          to="/batches"
          className={linkClass("batches")}
          aria-current={active === "batches" ? "page" : undefined}
          aria-label="Batches"
        >
          <span className="mobile-bottom-nav__icon" aria-hidden>
            <HiOutlineRectangleStack />
          </span>
          Batches
        </Link>
        <Link
          to="/features"
          className={linkClass("features")}
          aria-current={active === "features" ? "page" : undefined}
          aria-label="Features"
        >
          <span className="mobile-bottom-nav__icon" aria-hidden>
            <HiOutlineSquares2X2 />
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
            <HiOutlineChatBubbleLeftRight />
          </span>
          Feedback
        </Link>
      </div>
    </nav>
  );
}
