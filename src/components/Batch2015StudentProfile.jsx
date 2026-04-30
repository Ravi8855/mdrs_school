import React, { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { getBatch2015BySlug } from "../data/batch2015Students";
import { handleImgError } from "../utils/imageFallback";
import "./Alumni.css";

/**
 * Static 2015 batch student detail — same layout as other batch profiles.
 */
export default function Batch2015StudentProfile() {
  const { slug } = useParams();
  const student = slug ? getBatch2015BySlug(slug) : null;
  const [lightbox, setLightbox] = useState(null);

  if (!student) {
    return <Navigate to="/batch-2015-students" replace />;
  }

  const displayName = student.name;
  const img = student.image;
  const fields = {
    qualification: student.qualification?.trim() || "—",
    collegeUniversity: student.collegeUniversity?.trim() || "—",
    location: student.location?.trim() || "—",
  };

  return (
    <div className="alumni-profile-page">
      <div className="alumni-profile-inner">
        <Link to="/batch-2015-students" className="alumni-profile-back">
          ← 2015 batch students
        </Link>

        <article className="alumni-profile-card">
          <p className="alumni-profile-eyebrow">2015 batch</p>
          <h1 className="alumni-profile-title">{displayName}</h1>

          <div className="alumni-profile-avatar-wrap">
            <div className="alumni-profile-avatar-inner">
              <button
                type="button"
                className="alumni-profile-avatar-btn"
                onClick={() => setLightbox({ src: img, name: displayName })}
                aria-label={`View larger photo of ${displayName}`}
              >
                <img src={img} alt="" className="alumni-profile-avatar" onError={handleImgError} />
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

      {lightbox ? (
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
            <img src={lightbox.src} alt={lightbox.name} decoding="async" onError={handleImgError} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
