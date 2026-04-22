import React from "react";
import { Link } from "react-router-dom";
import "./Hostel.css";

/** Short home-section CTA linking to the full Our Hostel area */
export default function HostelTeaser() {
  return (
    <section className="hostel-page" style={{ minHeight: "unset" }} aria-labelledby="hostel-teaser-title">
      <div className="hostel-inner">
        <div className="hostel-hero-text hostel-hero--teaser">
          <h2 id="hostel-teaser-title" className="hostel-title hostel-title--hero">
            <span className="hostel-title-word">Our</span>{" "}
            <span className="hostel-title-word">Hostel</span>
          </h2>
          <p className="hostel-subtitle" style={{ marginBottom: 20 }}>
            Browse boys and girls hostel houses, masters, leaders, and roommates.
          </p>
        </div>
        <Link to="/hostel" className="hostel-dash-card hostel-dash-card--boys" style={{ maxWidth: 360 }}>
          <span className="hostel-dash-cta">Open hostel dashboard →</span>
        </Link>
      </div>
    </section>
  );
}
