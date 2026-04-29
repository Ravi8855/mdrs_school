import React from "react";
import { Link } from "react-router-dom";
import { FaLayerGroup, FaChevronRight } from "react-icons/fa";
import "./mobileHubMenus.css";

const items = [
  {
    to: "/batch-students",
    title: "2014 batch students",
    Icon: FaLayerGroup,
    accent: "batches-2014",
  },
];

export default function MobileBatchesMenu() {
  return (
    <div className="premium-hub">
      <header className="premium-hub__header">
        <p className="premium-hub__eyebrow">Graduating classes</p>
        <h1 className="premium-hub__title">Batches</h1>
      </header>
      <nav className="premium-hub__list" aria-label="Batches">
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
