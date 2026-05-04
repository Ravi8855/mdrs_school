import React from "react";
import { Link } from "react-router-dom";
import {
  FaChalkboardTeacher,
  FaGraduationCap,
  FaChevronRight,
  FaUserFriends,
} from "react-icons/fa";
import "./mobileHubMenus.css";

const items = [
  {
    to: "/teachers",
    title: "Teachers",
    desc: "Our guiding faculty",
    Icon: FaChalkboardTeacher,
    accent: "people-teachers",
  },
  {
    to: "/meet-seniors-juniors",
    title: "Meet our seniors & juniors",
    desc: "One gallery — tap photos to expand",
    Icon: FaUserFriends,
    accent: "people-seniors-juniors",
  },
  {
    to: "/alumni",
    title: "Alumni",
    desc: "Graduates & journeys",
    Icon: FaGraduationCap,
    accent: "people-alumni",
  },
];

export default function MobilePeopleMenu() {
  return (
    <div className="premium-hub">
      <header className="premium-hub__header">
        <p className="premium-hub__eyebrow">Community</p>
        <h1 className="premium-hub__title">People</h1>
        <p className="premium-hub__lead">
          Teachers, seniors &amp; juniors, and alumni — all in one place.
        </p>
      </header>
      <nav className="premium-hub__list" aria-label="People and community">
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
