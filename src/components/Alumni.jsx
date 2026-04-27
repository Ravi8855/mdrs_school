import React from "react";
import { Link } from "react-router-dom";
import "./Alumni.css";
import { ALUMNI_STUDENTS, alumniSlug, getAlumniPhoto } from "../data/alumniData";

export default function Alumni() {
  return (
    <div className="alumni-section container">
      <div className="section-title-wrap">
        <h2 className="section-title">Alumni</h2>
        <div className="section-title-accent" aria-hidden="true" />
        <p className="section-subtitle alumni-subtitle">Passout students of MDRS — where they are now.</p>
      </div>

      <div className="alumni-grid">
        {ALUMNI_STUDENTS.map((s, i) => (
          <Link
            key={s.name + i}
            to={`/alumni/${alumniSlug(s.name)}`}
            className="alumni-item glass-card reveal-card"
            aria-label={`Open profile for ${s.name}`}
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <div className="alumni-thumb-wrap">
              <div className="alumni-thumb-inner">
                <img
                  src={getAlumniPhoto(s.name)}
                  alt={s.name}
                  className="alumni-thumb"
                  loading="lazy"
                />
              </div>
            </div>
            <div className="alumni-meta">
              <span className="alumni-name">{s.name}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
