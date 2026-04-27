import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FaUserCircle, FaCheckCircle } from "react-icons/fa";
import { getProfileKey, setProfileKeyFromLogin } from "../lib/profileSession";
import {
  fetchProfileByUserKey,
  createStudentProfileAccount,
  updateStudentProfileDetails,
  insertProfileWithoutPassword,
  verifyStudentSignIn,
  uploadProfileImage,
  isSupabaseConfigured,
} from "../lib/profilesSupabase";
import { isProfilesTableMissingError, profilesTableSetupHint } from "../lib/profileErrors";
import "./StudentProfilePage.css";

function normalizeAccountUsername(raw) {
  return String(raw || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "");
}

export default function StudentProfilePage() {
  const [sessionKey, setSessionKey] = useState(() => getProfileKey());
  const userKey = sessionKey;

  const [gateScreen, setGateScreen] = useState("gate");

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

  const [regUsername, setRegUsername] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");
  const [regName, setRegName] = useState("");
  const [regQual, setRegQual] = useState("");
  const [regCollege, setRegCollege] = useState("");
  const [regLocation, setRegLocation] = useState("");
  const [regBio, setRegBio] = useState("");
  const [regFile, setRegFile] = useState(null);
  const [regPreview, setRegPreview] = useState("");
  const [regSaving, setRegSaving] = useState(false);
  const [regError, setRegError] = useState("");

  const [siUsername, setSiUsername] = useState("");
  const [siPassword, setSiPassword] = useState("");
  const [siSaving, setSiSaving] = useState(false);
  const [siError, setSiError] = useState("");

  const showEditorRef = useRef(false);
  const loadRequestIdRef = useRef(0);

  useEffect(() => {
    showEditorRef.current = showEditor;
  }, [showEditor]);

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

  useEffect(() => {
    if (!regFile) {
      setRegPreview("");
      return;
    }
    const u = URL.createObjectURL(regFile);
    setRegPreview(u);
    return () => URL.revokeObjectURL(u);
  }, [regFile]);

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
    const wasExistingRow = Boolean(row);
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
    if (wasExistingRow) {
      setShowSaveSuccess(true);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegError("");
    const u = normalizeAccountUsername(regUsername);
    if (!/^[a-z0-9_]{2,40}$/.test(u)) {
      setRegError("Username: 2–40 characters, letters, numbers, or underscore only.");
      return;
    }
    if (regPassword.length < 6) {
      setRegError("Password must be at least 6 characters.");
      return;
    }
    if (regPassword !== regConfirm) {
      setRegError("Passwords do not match.");
      return;
    }
    const n = regName.trim();
    if (!n) {
      setRegError("Name is required.");
      return;
    }
    setRegSaving(true);
    let imgUrl = "";
    if (regFile) {
      const { publicUrl, error: upErr } = await uploadProfileImage(regFile, u);
      if (upErr) {
        setRegError(upErr.message);
        setRegSaving(false);
        return;
      }
      imgUrl = publicUrl || "";
    }
    const { error: ce } = await createStudentProfileAccount({
      user_key: u,
      password: regPassword,
      name: n,
      qualification: regQual,
      college: regCollege,
      location: regLocation,
      bio: regBio,
      image_url: imgUrl,
    });
    setRegSaving(false);
    if (ce) {
      setRegError(ce.message);
      return;
    }
    setProfileKeyFromLogin(u);
    setSessionKey(u);
    setGateScreen("gate");
    setRegUsername("");
    setRegPassword("");
    setRegConfirm("");
    setRegName("");
    setRegQual("");
    setRegCollege("");
    setRegLocation("");
    setRegBio("");
    setRegFile(null);
  };

  const handleStudentSignIn = async (e) => {
    e.preventDefault();
    setSiError("");
    const u = normalizeAccountUsername(siUsername);
    if (!u) {
      setSiError("Enter your account username.");
      return;
    }
    setSiSaving(true);
    const { ok, error: ve } = await verifyStudentSignIn(u, siPassword);
    setSiSaving(false);
    if (!ok || ve) {
      setSiError(ve?.message || "Sign in failed.");
      return;
    }
    setProfileKeyFromLogin(u);
    setSessionKey(u);
    setSiUsername("");
    setSiPassword("");
    setGateScreen("gate");
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
        <div className="student-profile-avatar-inner">
          {avatarSrc ? (
            <img src={avatarSrc} alt="" className="student-profile-avatar" />
          ) : (
            <FaUserCircle className="student-profile-avatar-placeholder" aria-hidden />
          )}
        </div>
      </div>
      <label className="student-profile-label">
        Profile photo
        <input
          type="file"
          accept="image/*"
          className="student-profile-file"
          onChange={(ev) => {
            const f = ev.target.files?.[0];
            setFile(f || null);
          }}
        />
      </label>

      <label className="student-profile-label">
        Name
        <input
          className="student-profile-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoComplete="name"
        />
      </label>
      <label className="student-profile-label">
        Qualification
        <input
          className="student-profile-input"
          value={qualification}
          onChange={(e) => setQualification(e.target.value)}
          autoComplete="off"
        />
      </label>
      <label className="student-profile-label">
        College / University
        <input
          className="student-profile-input"
          value={college}
          onChange={(e) => setCollege(e.target.value)}
          autoComplete="organization"
        />
      </label>
      <label className="student-profile-label">
        Location
        <input
          className="student-profile-input"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          autoComplete="address-level1"
        />
      </label>
      <label className="student-profile-label">
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
    if (gateScreen === "register") {
      return (
        <div className="student-profile-page student-profile-root">
          <div className="student-profile-inner">
            <button
              type="button"
              className="student-profile-back student-profile-back--btn"
              onClick={() => {
                setGateScreen("gate");
                setRegError("");
              }}
            >
              ← Back
            </button>
            <article className="student-profile-card glass-card student-profile-card--forms">
              <p className="student-profile-eyebrow">Create account</p>
              <h1 className="student-profile-title">New student profile</h1>
              <p className="student-profile-muted">
                Choose a username and password, then add your details. You can edit everything later.
              </p>
              {regError ? (
                isProfilesTableMissingError(regError) ? (
                  <div className="student-profile-setup-callout student-profile-setup-callout--compact" role="status">
                    <p className="student-profile-setup-title">Database setup needed</p>
                    <p className="student-profile-setup-text">{profilesTableSetupHint()}</p>
                  </div>
                ) : (
                  <p className="student-profile-error" role="alert">
                    {regError}
                  </p>
                )
              ) : null}
              <form className="student-profile-form student-profile-form-root" onSubmit={handleRegister} autoComplete="off">
                <label className="student-profile-label">
                  Account username
                  <input
                    className="student-profile-input"
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    autoComplete="username"
                    placeholder="e.g. priya_sharma"
                    required
                  />
                </label>
                <label className="student-profile-label">
                  Password
                  <input
                    className="student-profile-input"
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    autoComplete="new-password"
                    minLength={6}
                    required
                  />
                </label>
                <label className="student-profile-label">
                  Confirm password
                  <input
                    className="student-profile-input"
                    type="password"
                    value={regConfirm}
                    onChange={(e) => setRegConfirm(e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                </label>
                <hr className="student-profile-divider" />
                <label className="student-profile-label">
                  Name
                  <input
                    className="student-profile-input"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    autoComplete="name"
                    required
                  />
                </label>
                <label className="student-profile-label">
                  Qualification
                  <input
                    className="student-profile-input"
                    value={regQual}
                    onChange={(e) => setRegQual(e.target.value)}
                  />
                </label>
                <label className="student-profile-label">
                  College / University
                  <input
                    className="student-profile-input"
                    value={regCollege}
                    onChange={(e) => setRegCollege(e.target.value)}
                  />
                </label>
                <label className="student-profile-label">
                  Location
                  <input
                    className="student-profile-input"
                    value={regLocation}
                    onChange={(e) => setRegLocation(e.target.value)}
                  />
                </label>
                <label className="student-profile-label">
                  Bio
                  <textarea
                    className="student-profile-textarea"
                    value={regBio}
                    onChange={(e) => setRegBio(e.target.value)}
                    rows={4}
                    placeholder="A few lines about you…"
                  />
                </label>
                <label className="student-profile-label">
                  Profile photo (optional)
                  <input
                    type="file"
                    accept="image/*"
                    className="student-profile-file"
                    onChange={(ev) => setRegFile(ev.target.files?.[0] || null)}
                  />
                </label>
                {regPreview ? (
                  <div className="student-profile-reg-preview">
                    <img src={regPreview} alt="" className="student-profile-reg-preview-img" />
                  </div>
                ) : null}
                <div className="student-profile-actions">
                  <button
                    type="button"
                    className="student-profile-btn"
                    onClick={() => {
                      setGateScreen("gate");
                      setRegError("");
                    }}
                    disabled={regSaving}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="student-profile-btn student-profile-btn--primary" disabled={regSaving}>
                    {regSaving ? "Creating…" : "Create account"}
                  </button>
                </div>
              </form>
            </article>
          </div>
        </div>
      );
    }

    if (gateScreen === "signin") {
      return (
        <div className="student-profile-page student-profile-root">
          <div className="student-profile-inner">
            <button
              type="button"
              className="student-profile-back student-profile-back--btn"
              onClick={() => {
                setGateScreen("gate");
                setSiError("");
              }}
            >
              ← Back
            </button>
            <article className="student-profile-card glass-card">
              <p className="student-profile-eyebrow">Sign in</p>
              <h1 className="student-profile-title">Student sign in</h1>
              <p className="student-profile-muted">
                Use the username you chose at registration. If your account has no password yet, leave password blank.
              </p>
              {siError ? (
                isProfilesTableMissingError(siError) ? (
                  <div className="student-profile-setup-callout student-profile-setup-callout--compact" role="status">
                    <p className="student-profile-setup-title">Database setup needed</p>
                    <p className="student-profile-setup-text">{profilesTableSetupHint()}</p>
                  </div>
                ) : (
                  <p className="student-profile-error" role="alert">
                    {siError}
                  </p>
                )
              ) : null}
              <form className="student-profile-form student-profile-form-root" onSubmit={handleStudentSignIn} autoComplete="off">
                <label className="student-profile-label">
                  Account username
                  <input
                    className="student-profile-input"
                    value={siUsername}
                    onChange={(e) => setSiUsername(e.target.value)}
                    autoComplete="username"
                    required
                  />
                </label>
                <label className="student-profile-label">
                  Password
                  <input
                    className="student-profile-input"
                    type="password"
                    value={siPassword}
                    onChange={(e) => setSiPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                </label>
                <div className="student-profile-actions">
                  <button type="submit" className="student-profile-btn student-profile-btn--primary" disabled={siSaving}>
                    {siSaving ? "Signing in…" : "Sign in"}
                  </button>
                </div>
              </form>
            </article>
          </div>
        </div>
      );
    }

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
            <p className="student-profile-muted student-profile-muted--hub">Create an account or sign in to manage your student profile.</p>
            <div className="student-profile-gate-actions">
              <button
                type="button"
                className="student-profile-btn student-profile-btn--primary student-profile-gate-primary"
                onClick={() => setGateScreen("register")}
              >
                Create Account
              </button>
              <button type="button" className="student-profile-btn student-profile-btn--outline" onClick={() => setGateScreen("signin")}>
                Sign In
              </button>
            </div>
            <p className="student-profile-gate-footer">
              <Link to="/login" className="student-profile-link">
                Staff login
              </Link>
            </p>
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
            <div className="student-profile-success-icon" aria-hidden>
              <FaCheckCircle />
            </div>
            <p className="student-profile-success-eyebrow">All set</p>
            <h2 id="student-profile-success-title" className="student-profile-success-title">
              Profile updated
            </h2>
            <p className="student-profile-success-text">
              Your profile is up to date. Alumni and classmates will see your latest photo and details.
            </p>
            <button type="button" className="student-profile-success-btn" onClick={() => setShowSaveSuccess(false)}>
              Done
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
