import React from "react";
import { Link } from "react-router-dom";
import { FaFemale, FaMale } from "react-icons/fa";
import "./Hostel.css";

export default function HostelDashboard() {
  return (
    <div className="hostel-page">
      <div className="hostel-inner">
        <header className="hostel-hero hostel-hero--dashboard">
          <Link to="/" className="hostel-back" aria-label="Back to school home">
            ← Back to home
          </Link>
          <div className="hostel-hero-text">
            <h1 className="hostel-title hostel-title--hero">
              <span className="hostel-title-word">Our</span>{" "}
              <span className="hostel-title-word">Hostel</span>
            </h1>
            <p className="hostel-subtitle">
              Explore "2015 batch" boys and girls hostel houses, house masters, leaders, and roommates in one
              place.
            </p>
          </div>
        </header>

        <div className="hostel-dashboard-grid">
          <Link to="/hostel/boys" className="hostel-dash-card hostel-dash-card--boys">
            <span className="hostel-dash-card-icon" aria-hidden>
              <FaMale />
            </span>
            <h2>Boys Hostel</h2>
            <p>View all houses, masters, leaders, and students.</p>
            <span className="hostel-dash-cta">
              Open rooms <span aria-hidden>→</span>
            </span>
          </Link>

          <Link to="/hostel/girls" className="hostel-dash-card hostel-dash-card--girls">
            <span className="hostel-dash-card-icon" aria-hidden>
              <FaFemale />
            </span>
            <h2>Girls Hostel</h2>
            <p>Same layout — details will be added soon.</p>
            <span className="hostel-dash-cta">
              Open rooms <span aria-hidden>→</span>
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
