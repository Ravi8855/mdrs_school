import React, { useCallback, useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import {
  getAlumniBySlug,
  getAlumniPhoto,
  getAlumniDetailFields,
  findProfileForAlumniSlug,
} from "../data/alumniData";
import { getSupabaseClient } from "../lib/supabaseClient";
import { fetchAllProfiles, isSupabaseConfigured } from "../lib/profilesSupabase";
import { handleImgError } from "../utils/imageFallback";
import "./Alumni.css";

export default function AlumniProfile() {
  const { slug } = useParams();
  const student = slug ? getAlumniBySlug(slug) : null;
  const [lightbox, setLightbox] = useState(null);
  const [dbRow, setDbRow] = useState(null);
  const [ready, setReady] = useState(false);

  const loadProfileRow = useCallback(async () => {
    if (!slug) {
      setDbRow(null);
      setReady(true);
      return;
    }
    if (!isSupabaseConfigured()) {
      setDbRow(null);
      setReady(true);
      return;
    }
    const { data, error } = await fetchAllProfiles();
    if (error || !data) {
      setDbRow(null);
    } else {
      setDbRow(findProfileForAlumniSlug(slug, data));
    }
    setReady(true);
  }, [slug]);

  useEffect(() => {
    setReady(false);
    loadProfileRow();
  }, [loadProfileRow]);

  useEffect(() => {
    if (!slug || !isSupabaseConfigured()) return undefined;
    const sb = getSupabaseClient();
    if (!sb) return undefined;
    const ch = sb
      .channel(`profiles-alumni-detail-${slug}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "profiles" }, () => {
        loadProfileRow();
      })
      .subscribe();
    return () => {
      sb.removeChannel(ch);
    };
  }, [slug, loadProfileRow]);

  if (!ready) {
    return (
      <div className="alumni-profile-page">
        <div className="alumni-profile-inner">
          <Link to="/alumni" className="alumni-profile-back">
            ← All alumni
          </Link>
          <article className="alumni-profile-card">
            <p className="alumni-profile-eyebrow">Alumni</p>
            <p className="alumni-profile-hint">Loading…</p>
          </article>
        </div>
      </div>
    );
  }

  if (!student && !dbRow) {
    return <Navigate to="/alumni" replace />;
  }

  const displayName = student?.name ?? String(dbRow?.name ?? "");
  const baseFields = student
    ? getAlumniDetailFields(student)
    : { qualification: "—", collegeUniversity: "—", location: "—" };
  const q = dbRow?.qualification != null ? String(dbRow.qualification).trim() : "";
  const c = dbRow?.college != null ? String(dbRow.college).trim() : "";
  const l = dbRow?.location != null ? String(dbRow.location).trim() : "";
  const fields = {
    qualification: q || baseFields.qualification,
    collegeUniversity: c || baseFields.collegeUniversity,
    location: l || baseFields.location,
  };
  const url = dbRow?.image_url != null ? String(dbRow.image_url).trim() : "";
  const img = url || (student ? getAlumniPhoto(student.name) : "/react.svg");

  return (
    <div className="alumni-profile-page">
      <div className="alumni-profile-inner">
        <Link to="/alumni" className="alumni-profile-back">
          ← All alumni
        </Link>

        <article className="alumni-profile-card">
          <p className="alumni-profile-eyebrow">Alumni</p>
          <h1 className="alumni-profile-title">{displayName}</h1>

          <div className="alumni-profile-avatar-wrap">
            <div className="alumni-profile-avatar-inner">
              <button
                type="button"
                className="alumni-profile-avatar-btn"
                onClick={() => setLightbox({ src: img, name: displayName })}
                aria-label={`View larger photo of ${displayName}`}
              >
                <img src={img} alt="" className="alumni-profile-avatar" decoding="async" onError={handleImgError} />
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
            <img src={lightbox.src} alt={lightbox.name} decoding="async" onError={handleImgError} />
          </div>
        </div>
      )}
    </div>
  );
}
