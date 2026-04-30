import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./Alumni.css";
import {
  ALUMNI_STUDENTS,
  alumniSlug,
  mergeAlumniWithProfiles,
  mergeProfilesIntoStaticGrid,
} from "../data/alumniData";
import { getSupabaseClient } from "../lib/supabaseClient";
import { fetchAllProfiles, isSupabaseConfigured } from "../lib/profilesSupabase";
import { handleImgError } from "../utils/imageFallback";

export default function Alumni() {
  const [profiles, setProfiles] = useState(() => (isSupabaseConfigured() ? undefined : []));

  const loadProfiles = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setProfiles([]);
      return;
    }
    const { data, error } = await fetchAllProfiles();
    setProfiles(error ? [] : data || []);
  }, []);

  useEffect(() => {
    loadProfiles();
  }, [loadProfiles]);

  useEffect(() => {
    if (!isSupabaseConfigured()) return undefined;
    const sb = getSupabaseClient();
    if (!sb) return undefined;
    const ch = sb
      .channel("profiles-alumni-list")
      .on("postgres_changes", { event: "*", schema: "public", table: "profiles" }, () => {
        loadProfiles();
      })
      .subscribe();
    return () => {
      sb.removeChannel(ch);
    };
  }, [loadProfiles]);

  const list = useMemo(() => {
    if (!isSupabaseConfigured()) {
      return mergeAlumniWithProfiles(ALUMNI_STUDENTS, []);
    }
    if (profiles === undefined) {
      return mergeAlumniWithProfiles(ALUMNI_STUDENTS, []);
    }
    return mergeProfilesIntoStaticGrid(profiles);
  }, [profiles]);

  return (
    <div className="alumni-section container">
      <div className="section-title-wrap">
        <h2 className="section-title">Alumni</h2>
        <div className="section-title-accent" aria-hidden="true" />
        <p className="section-subtitle alumni-subtitle">Passout students of MDRS — where they are now.</p>
      </div>

      <div className="alumni-grid">
        {list.map((s, i) => (
          <Link
            key={(s.user_key ? String(s.user_key) : s.name) + i}
            to={`/alumni/${alumniSlug(s.name)}`}
            className="alumni-item glass-card reveal-card"
            aria-label={`Open profile for ${s.name}`}
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <div className="alumni-thumb-wrap">
              <div className="alumni-thumb-inner">
                <img
                  src={s.displayImage}
                  alt={s.name}
                  className="alumni-thumb"
                  decoding="async"
                  onError={handleImgError}
                />
              </div>
            </div>
            <div className="alumni-meta">
              <span className="alumni-name">{s.name}</span>
              {s.displayQualification ? (
                <span className="alumni-qual-short">{s.displayQualification}</span>
              ) : null}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
