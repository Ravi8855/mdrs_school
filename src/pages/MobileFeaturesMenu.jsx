import React from "react";
import { Link } from "react-router-dom";
import {
  FaHotel,
  FaImages,
  FaBell,
  FaCheckSquare,
  FaChevronRight,
} from "react-icons/fa";
import "./mobileHubMenus.css";

const items = [
  {
    to: "/hostel",
    title: "Our Hostel",
    desc: "Rooms & student life",
    Icon: FaHotel,
    accent: "feat-hostel",
  },
  {
    to: "/gallery",
    title: "Gallery",
    desc: "Moments from campus",
    Icon: FaImages,
    accent: "feat-gallery",
  },
  {
    to: "/bell-game",
    title: "Bell Game",
    desc: "Quick fun challenge",
    Icon: FaBell,
    accent: "feat-bell",
  },
  {
    to: "/voting",
    title: "Voting",
    desc: "Class polls & results",
    Icon: FaCheckSquare,
    accent: "feat-voting",
  },
];

export default function MobileFeaturesMenu() {
  return (
    <div className="premium-hub">
      <header className="premium-hub__header">
        <p className="premium-hub__eyebrow">Discover</p>
        <h1 className="premium-hub__title">Features</h1>
        <p className="premium-hub__lead">Hostel, gallery, activities, and voting.</p>
      </header>
      <nav className="premium-hub__list" aria-label="School features">
        {items.map(({ to, title, desc, Icon, accent }) => (
          <Link key={to} to={to} className={`premium-tile premium-tile--${accent}`}>
            <span className="premium-tile__icon" aria-hidden>
              <Icon />
            </span>
            <span className="premium-tile__body">
              <span className="premium-tile__title">{title}</span>
              <span className="premium-tile__desc">{desc}</span>
            </span>
            <FaChevronRight className="premium-tile__chevron" aria-hidden />
          </Link>
        ))}
      </nav>
    </div>
  );
}
