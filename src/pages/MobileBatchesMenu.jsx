import React from "react";
import { Link } from "react-router-dom";
import { FaLayerGroup, FaChevronRight } from "react-icons/fa";
import "./mobileHubMenus.css";

/** Serial order: earlier graduating year first (2013 → 2014 → 2015 → 2016 → 2017). */
const items = [
  {
    serial: 1,
    to: "/batch-2013-students",
    title: "2013 batch students",
    desc: "Class list & aquarium",
    Icon: FaLayerGroup,
    accent: "batches-2013",
  },
  {
    serial: 2,
    to: "/batch-students",
    title: "2014 batch students",
    desc: "Class list & aquarium",
    Icon: FaLayerGroup,
    accent: "batches-2014",
  },
  {
    serial: 3,
    to: "/batch-2015-students",
    title: "2015 batch students",
    desc: "Class list & aquarium",
    Icon: FaLayerGroup,
    accent: "batches-2015",
  },
  {
    serial: 4,
    to: "/batch-2016-students",
    title: "2016 batch students",
    desc: "Class list & aquarium",
    Icon: FaLayerGroup,
    accent: "batches-2016",
  },
  {
    serial: 5,
    to: "/batch-2017-students",
    title: "2017 batch students",
    desc: "Class list & aquarium",
    Icon: FaLayerGroup,
    accent: "batches-2017",
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
        {items.map(({ serial, to, title, desc, Icon, accent }) => (
          <Link
            key={to}
            to={to}
            className={`premium-tile premium-tile--${accent}`}
            aria-label={`${serial}. ${title}`}
          >
            <span className="premium-tile__icon" aria-hidden>
              <Icon />
            </span>
            <span className="premium-tile__body">
              <span className="premium-tile__title">
                <span className="premium-tile__serial" aria-hidden>
                  {serial}.{" "}
                </span>
                {title}
              </span>
              <span className="premium-tile__desc">{desc}</span>
            </span>
            <FaChevronRight className="premium-tile__chevron" aria-hidden />
          </Link>
        ))}
      </nav>
    </div>
  );
}
