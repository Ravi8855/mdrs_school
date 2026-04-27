import React, { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { getAlumniBySlug, getAlumniPhoto, getAlumniDetailFields } from "../data/alumniData";
import "./Alumni.css";

export default function AlumniProfile() {
  const { slug } = useParams();
  const student = slug ? getAlumniBySlug(slug) : null;
  const [lightbox, setLightbox] = useState(null);

  if (!student) {
    return <Navigate to="/alumni" replace />;
  }

  const img = getAlumniPhoto(student.name);
  const fields = getAlumniDetailFields(student);

  return (
    <div className="alumni-profile-page">
      <div className="alumni-profile-inner">
        <Link to="/alumni" className="alumni-profile-back">
          ← All alumni
        </Link>

        <article className="alumni-profile-card">
          <p className="alumni-profile-eyebrow">Alumni</p>
          <h1 className="alumni-profile-title">{student.name}</h1>

          <div className="alumni-profile-avatar-wrap">
            <div className="alumni-profile-avatar-inner">
              <button
                type="button"
                className="alumni-profile-avatar-btn"
                onClick={() => setLightbox({ src: img, name: student.name })}
                aria-label={`View larger photo of ${student.name}`}
              >
                <img src={img} alt="" className="alumni-profile-avatar" />
              </button>
            </div>
          </div>

          <dl className="alumni-profile-fields">
            <div className="alumni-profile-field">
              <dt>Qualification</dt>
              <dd>{fields.qualification}</dd>
            </div>
            <div className="alumni-profile-field">
              <dt>College / University</dt>
              <dd>{fields.collegeUniversity}</dd>
            </div>
            <div className="alumni-profile-field">
              <dt>Location</dt>
              <dd>{fields.location}</dd>
            </div>
          </dl>

          <p className="alumni-profile-hint">Tap the photo to view it larger.</p>
        </article>
      </div>

      {lightbox && (
        <div className="alumni-fullscreen" onClick={() => setLightbox(null)}>
          <button
            type="button"
            className="lightbox-close"
            aria-label="Close image"
            onClick={(e) => {
              e.stopPropagation();
              setLightbox(null);
            }}
          >
            ✕
          </button>
          <div className="alumni-fullscreen-square" onClick={(e) => e.stopPropagation()}>
            <img src={lightbox.src} alt={lightbox.name} />
          </div>
        </div>
      )}
    </div>
  );
}
