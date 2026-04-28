import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaUserCircle, FaPen } from "react-icons/fa";
import { getProfileKey } from "../lib/profileSession";
import {
  fetchProfileByUserKey,
  updateStudentProfileDetails,
  insertProfileWithoutPassword,
  uploadProfileImage,
  isSupabaseConfigured,
} from "../lib/profilesSupabase";
import { isProfilesTableMissingError, profilesTableSetupHint } from "../lib/profileErrors";
import "./StudentProfilePage.css";

/** @param {{ name?: unknown; qualification?: unknown; college?: unknown; location?: unknown; bio?: unknown; image?: unknown }} profile */
export function calculateProfileCompletion(profile) {
  const s = (v) => (v == null ? "" : String(v));
  const fields = [
    s(profile.name),
    s(profile.qualification),
    s(profile.college),
    s(profile.location),
    s(profile.bio),
  ];
  const filledFields = fields.filter((field) => field && field.trim() !== "").length;
  const totalFields = fields.length;
  let percentage = Math.round((filledFields / totalFields) * 100);
  if (profile.image) {
    percentage = Math.min(100, percentage + 10);
  }
  return percentage;
}

export default function StudentProfilePage() {
  const routeLocation = useLocation();
  const [sessionKey, setSessionKey] = useState(() => getProfileKey());
  const userKey = sessionKey;

  const [loading, setLoading] = useState(true);
  const [row, setRow] = useState(null);
  const [error, setError] = useState("");
  /** When true, the editor pane is shown (never opened automatically after load). */
  const [showEditor, setShowEditor] = useState(false);
  const [name, setName] = useState("");
  const [qualification, setQualification] = useState("");
  const [college, setCollege] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [percentage, setPercentage] = useState(0);

  const showEditorRef = useRef(false);
  const loadRequestIdRef = useRef(0);
  const photoInputRef = useRef(null);

  useEffect(() => {
    showEditorRef.current = showEditor;
  }, [showEditor]);

  /** Profile key is written on the login page; re-read when opening /profile so state stays in sync. */
  useEffect(() => {
    setSessionKey(getProfileKey());
  }, [routeLocation.pathname]);

  useEffect(() => {
    setShowEditor(false);
  }, [userKey]);

  useEffect(() => {
    if (!showSaveSuccess) return undefined;
    const onKey = (ev) => {
      if (ev.key === "Escape") setShowSaveSuccess(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showSaveSuccess]);

  const load = useCallback(async () => {
    setError("");
    const requestId = ++loadRequestIdRef.current;
    if (!isSupabaseConfigured()) {
      setLoading(false);
      setRow(null);
      return;
    }
    if (!userKey) {
      setLoading(false);
      setRow(null);
      return;
    }
    setLoading(true);
    const { data, error: fetchErr } = await fetchProfileByUserKey(userKey);
    if (requestId !== loadRequestIdRef.current) return;

    setLoading(false);
    if (fetchErr) {
      setError(fetchErr.message);
      setRow(null);
      return;
    }
    setRow(data);
    if (showEditorRef.current) {
      setFile(null);
      return;
    }
    if (data) {
      setName(String(data.name || ""));
      setQualification(String(data.qualification || ""));
      setCollege(String(data.college || ""));
      setLocation(String(data.location || ""));
      setBio(String(data.bio || ""));
      setImageUrl(String(data.image_url || ""));
    } else {
      setName("");
      setQualification("");
      setCollege("");
      setLocation("");
      setBio("");
      setImageUrl("");
    }
    setFile(null);
  }, [userKey]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!file) {
      setPreview("");
      return;
    }
    const u = URL.createObjectURL(file);
    setPreview(u);
    return () => URL.revokeObjectURL(u);
  }, [file]);

  const profileForCompletion = useMemo(() => {
    if (showEditor) {
      const hasImage = Boolean(preview || (imageUrl && imageUrl.trim()) || file);
      return { name, qualification, college, location, bio, image: hasImage };
    }
    if (row) {
      return {
        name: row.name,
        qualification: row.qualification,
        college: row.college,
        location: row.location,
        bio: row.bio,
        image: Boolean(row.image_url && String(row.image_url).trim()),
      };
    }
    return { name: "", qualification: "", college: "", location: "", bio: "", image: false };
  }, [showEditor, name, qualification, college, location, bio, imageUrl, preview, file, row]);

  useEffect(() => {
    setPercentage(calculateProfileCompletion(profileForCompletion));
  }, [profileForCompletion]);

  const completionChecklist = useMemo(() => {
    const p = profileForCompletion;
    const t = (v) => (v == null ? "" : String(v).trim());
    return [
      { id: "name", label: "Name", done: Boolean(t(p.name)) },
      { id: "qualification", label: "Qualification", done: Boolean(t(p.qualification)) },
      { id: "college", label: "College / University", todoPhrase: "college / university", done: Boolean(t(p.college)) },
      { id: "location", label: "Location", done: Boolean(t(p.location)) },
      { id: "bio", label: "Bio", done: Boolean(t(p.bio)) },
      { id: "photo", label: "Profile photo", done: Boolean(p.image), optional: true },
    ];
  }, [profileForCompletion]);

  const openEditor = () => {
    setShowEditor(true);
    setFile(null);
    setError("");
    if (row) {
      setName(String(row.name || ""));
      setQualification(String(row.qualification || ""));
      setCollege(String(row.college || ""));
      setLocation(String(row.location || ""));
      setBio(String(row.bio || ""));
      setImageUrl(String(row.image_url || ""));
    }
  };

  const closeEditor = () => {
    setShowEditor(false);
    setError("");
    setFile(null);
    if (row) {
      setName(String(row.name || ""));
      setQualification(String(row.qualification || ""));
      setCollege(String(row.college || ""));
      setLocation(String(row.location || ""));
      setBio(String(row.bio || ""));
      setImageUrl(String(row.image_url || ""));
    } else {
      setName("");
      setQualification("");
      setCollege("");
      setLocation("");
      setBio("");
      setImageUrl("");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!userKey) return;
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Name is required.");
      return;
    }
    setSaving(true);
    setError("");
    let url = imageUrl.trim();
    if (file) {
      const { publicUrl, error: upErr } = await uploadProfileImage(file, userKey);
      if (upErr) {
        setError(upErr.message);
        setSaving(false);
        return;
      }
      url = publicUrl || "";
      setImageUrl(url);
      setFile(null);
    }
    const fields = {
      name: trimmedName,
      qualification,
      college,
      location,
      bio,
      image_url: url,
    };
    const { error: saveErr } = row
      ? await updateStudentProfileDetails(userKey, fields)
      : await insertProfileWithoutPassword({ user_key: userKey, ...fields });
    setSaving(false);
    if (saveErr) {
      setError(saveErr.message);
      return;
    }
    setShowEditor(false);
    await load();
    setShowSaveSuccess(true);
  };

  const avatarSrc = preview || (imageUrl && imageUrl.trim()) || undefined;

  const renderProfileDisplay = () => {
    if (loading) {
      return (
        <div className="student-profile-display student-profile-display--loading">
          <div className="student-profile-skeleton student-profile-skeleton--avatar" />
          <div className="student-profile-skeleton student-profile-skeleton--line" />
          <div className="student-profile-skeleton student-profile-skeleton--line short" />
        </div>
      );
    }
    if (error) {
      if (isProfilesTableMissingError(error)) {
        return (
          <div className="student-profile-display">
            <div className="student-profile-setup-callout" role="status">
              <p className="student-profile-setup-title">Database setup needed</p>
              <p className="student-profile-setup-text">{profilesTableSetupHint()}</p>
              <p className="student-profile-setup-detail">
                The script creates the <code>public.profiles</code> table, storage policies, and reloads the API
                schema.
              </p>
            </div>
          </div>
        );
      }
      return (
        <div className="student-profile-display">
          <p className="student-profile-error" role="alert">
            {error}
          </p>
        </div>
      );
    }
    if (row) {
      return (
        <div className="student-profile-display">
          <div className="student-profile-hero">
            <div className="student-profile-avatar-wrap student-profile-avatar-wrap--hero">
              <div className="student-profile-avatar-inner">
                {avatarSrc ? (
                  <img src={avatarSrc} alt="" className="student-profile-avatar" />
                ) : (
                  <FaUserCircle className="student-profile-avatar-placeholder" aria-hidden />
                )}
              </div>
            </div>
            <h2 className="student-profile-hero-name">{row.name}</h2>
          </div>
          <div className="student-profile-info-card">
            <div className="student-profile-info-row">
              <span className="student-profile-info-label">Qualification</span>
              <span className="student-profile-info-value">{row.qualification?.trim() || "—"}</span>
            </div>
            <div className="student-profile-info-row">
              <span className="student-profile-info-label">College</span>
              <span className="student-profile-info-value">{row.college?.trim() || "—"}</span>
            </div>
            <div className="student-profile-info-row">
              <span className="student-profile-info-label">Location</span>
              <span className="student-profile-info-value">{row.location?.trim() || "—"}</span>
            </div>
            <div className="student-profile-info-row student-profile-info-row--bio">
              <span className="student-profile-info-label">Bio</span>
              <span className="student-profile-info-value student-profile-bio-text">
                {row.bio?.trim() ? row.bio : "—"}
              </span>
            </div>
          </div>
          <button type="button" className="student-profile-btn student-profile-btn--primary student-profile-btn--pill" onClick={openEditor}>
            Edit Profile
          </button>
        </div>
      );
    }
    return (
      <div className="student-profile-display student-profile-display--empty">
        <div className="student-profile-hero">
          <div className="student-profile-avatar-wrap student-profile-avatar-wrap--hero student-profile-avatar-wrap--muted">
            <div className="student-profile-avatar-inner">
              <FaUserCircle className="student-profile-avatar-placeholder" aria-hidden />
            </div>
          </div>
          <h2 className="student-profile-hero-name student-profile-hero-name--sub">Your profile</h2>
          <p className="student-profile-empty-hint">Add your details so classmates can see you on the alumni page.</p>
        </div>
        <button type="button" className="student-profile-btn student-profile-btn--primary student-profile-btn--pill" onClick={openEditor}>
          Complete profile
        </button>
      </div>
    );
  };

  const renderProfileEditor = () => (
    <form className="student-profile-editor-form student-profile-form-root" onSubmit={handleSave} noValidate>
      <div className="student-profile-edit-topbar">
        <button type="button" className="student-profile-edit-back" onClick={closeEditor} disabled={saving} aria-label="Close editor">
          ←
        </button>
        <span className="student-profile-edit-title">Edit profile</span>
        <span className="student-profile-edit-spacer" aria-hidden />
      </div>
      {error ? (
        isProfilesTableMissingError(error) ? (
          <div className="student-profile-setup-callout student-profile-setup-callout--compact" role="status">
            <p className="student-profile-setup-title">Database setup needed</p>
            <p className="student-profile-setup-text">{profilesTableSetupHint()}</p>
          </div>
        ) : (
          <p className="student-profile-error student-profile-error--inline" role="alert">
            {error}
          </p>
        )
      ) : null}

      <div className="student-profile-avatar-wrap student-profile-avatar-wrap--form student-profile-avatar-wrap--editor">
        <input
          ref={photoInputRef}
          type="file"
          accept="image/*"
          className="student-profile-file-input"
          tabIndex={-1}
          onChange={(ev) => {
            const f = ev.target.files?.[0];
            setFile(f || null);
            ev.target.value = "";
          }}
        />
        <div className="student-profile-avatar-inner">
          {avatarSrc ? (
            <img src={avatarSrc} alt="" className="student-profile-avatar" />
          ) : (
            <FaUserCircle className="student-profile-avatar-placeholder" aria-hidden />
          )}
        </div>
        <button
          type="button"
          className="student-profile-avatar-edit-btn"
          onClick={() => photoInputRef.current?.click()}
          disabled={saving}
          aria-label="Change profile photo"
        >
          <FaPen aria-hidden />
        </button>
      </div>

      <label
        className={`student-profile-label${!name.trim() ? " student-profile-label--missing" : ""}`}
      >
        Name
        <input
          className="student-profile-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoComplete="name"
        />
      </label>
      <label
        className={`student-profile-label${!qualification.trim() ? " student-profile-label--missing" : ""}`}
      >
        Qualification
        <input
          className="student-profile-input"
          value={qualification}
          onChange={(e) => setQualification(e.target.value)}
          autoComplete="off"
        />
      </label>
      <label
        className={`student-profile-label${!college.trim() ? " student-profile-label--missing" : ""}`}
      >
        College / University
        <input
          className="student-profile-input"
          value={college}
          onChange={(e) => setCollege(e.target.value)}
          autoComplete="organization"
        />
      </label>
      <label
        className={`student-profile-label${!location.trim() ? " student-profile-label--missing" : ""}`}
      >
        Location
        <input
          className="student-profile-input"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          autoComplete="address-level1"
        />
      </label>
      <label
        className={`student-profile-label${!bio.trim() ? " student-profile-label--missing" : ""}`}
      >
        Bio
        <textarea
          className="student-profile-textarea"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={4}
          placeholder="A few lines about you…"
        />
      </label>

      <div className="student-profile-actions student-profile-actions--editor">
        <button type="button" className="student-profile-btn" onClick={closeEditor} disabled={saving}>
          Cancel
        </button>
        <button type="submit" className="student-profile-btn student-profile-btn--primary" disabled={saving}>
          {saving ? "Saving…" : "Save"}
        </button>
      </div>
    </form>
  );

  if (!isSupabaseConfigured()) {
    return (
      <div className="student-profile-page student-profile-page--centered student-profile-root">
        <div className="student-profile-card glass-card student-profile-card--hub">
          <h1 className="student-profile-title">Profile</h1>
          <p className="student-profile-muted">
            Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable profiles.
          </p>
          <Link to="/home" className="student-profile-link">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  if (!userKey) {
    return (
      <div className="student-profile-page student-profile-page--centered student-profile-root">
        <div className="student-profile-inner student-profile-inner--hub">
          <Link to="/home" className="student-profile-back student-profile-back--hub">
            ← Home
          </Link>
          <article className="student-profile-card glass-card student-profile-card--hub student-profile-fade-in">
            <div className="student-profile-hub-icon" aria-hidden>
              <FaUserCircle />
            </div>
            <h1 className="student-profile-title student-profile-title--hub">Profile</h1>
            <p className="student-profile-muted student-profile-muted--hub">
              Your profile is linked to the username you used on the login page. Sign out from the menu, then sign in
              again so your profile key is saved to this session.
            </p>
            <Link to="/home" className="student-profile-link">
              Back to home
            </Link>
          </article>
        </div>
      </div>
    );
  }

  return (
    <div className="student-profile-page student-profile-root">
      <div className="student-profile-inner">
        <Link to="/home" className="student-profile-back">
          ← Home
        </Link>

        <article className="student-profile-card glass-card student-profile-card--app">
          <header className="student-profile-app-header">
            <p className="student-profile-eyebrow">Your profile</p>
            {!showEditor && !loading ? (
              <p className="student-profile-app-sub">
                {row ? "Signed in" : "Finish setup to appear on alumni"}
              </p>
            ) : null}
          </header>

          {percentage < 100 ? (
            <div className="profile-progress" aria-live="polite">
              <p className="profile-progress__percent">{percentage}% Profile Completed</p>
              <div className="progress-bar" role="progressbar" aria-valuenow={percentage} aria-valuemin={0} aria-valuemax={100}>
                <div className="progress-fill" style={{ width: `${percentage}%` }} />
              </div>
              <p className="profile-progress__hint">Complete your profile to reach 100%</p>
              <ul className="profile-completion-checklist">
                {completionChecklist.map((item) => {
                  const todoText =
                    item.id === "photo"
                      ? "Add profile photo (optional +10%)"
                      : `Add ${item.todoPhrase ?? item.label.toLowerCase()}`;
                  const doneText = item.id === "photo" ? "Profile photo added" : `${item.label} added`;
                  return (
                    <li
                      key={item.id}
                      className={`profile-completion-checklist__item${item.done ? " profile-completion-checklist__item--done" : " profile-completion-checklist__item--todo"}`}
                    >
                      <span className="profile-completion-checklist__icon" aria-hidden>
                        {item.done ? "✅" : "❌"}
                      </span>
                      {item.done ? doneText : todoText}
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}

          <div className="student-profile-panel-stack">
            {showEditor ? (
              <div className="student-profile-panel student-profile-panel--editor" key="editor">
                {renderProfileEditor()}
              </div>
            ) : (
              <div className="student-profile-panel" key="display">
                {renderProfileDisplay()}
              </div>
            )}
          </div>
        </article>
      </div>

      {showSaveSuccess ? (
        <div
          className="student-profile-success-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="student-profile-success-title"
          onClick={() => setShowSaveSuccess(false)}
        >
          <div className="student-profile-success-card" onClick={(ev) => ev.stopPropagation()}>
            <h2 id="student-profile-success-title" className="student-profile-success-title student-profile-success-title--solo">
              Edited successfully
            </h2>
            <button type="button" className="student-profile-success-btn" onClick={() => setShowSaveSuccess(false)}>
              OK
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
