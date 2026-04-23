import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Login.css";

const POPUP_DURATION = 3500;
const SUCCESS_NAV_DELAY_MS = 2800;
const SESSION_KEY = "isLoggedIn";

const LoginPage = ({ onLogin }) => {
  const navigate = useNavigate();
  const navigateAfterLoginRef = useRef(null);
  const adminUser = import.meta.env.VITE_ADMIN_USER ?? "admin";
  const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD ?? "admin0511";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState({ username: false, password: false });
  const [popup, setPopup] = useState({ show: false, type: "success", message: "" });

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === "true") {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    return () => {
      if (navigateAfterLoginRef.current) {
        clearTimeout(navigateAfterLoginRef.current);
        navigateAfterLoginRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!popup.show || popup.type !== "error") return;
    const timer = setTimeout(() => setPopup((p) => ({ ...p, show: false })), POPUP_DURATION);
    return () => clearTimeout(timer);
  }, [popup.show, popup.type]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = username.trim();
    const pass = password.trim();
    if (!user || !pass) {
      setPopup({ show: true, type: "error", message: "Please enter user name and password." });
      return;
    }
    if (user === adminUser && pass === adminPassword) {
      /* Session first so "/" can authenticate; defer onLogin() until after popup —
         immediate onLogin() sets App isLoggedIn and swaps this route for <Navigate />,
         which unmounts LoginPage before the success popup can paint. */
      sessionStorage.setItem(SESSION_KEY, "true");
      setPopup({
        show: true,
        type: "success",
       
      });
      if (navigateAfterLoginRef.current) clearTimeout(navigateAfterLoginRef.current);
      navigateAfterLoginRef.current = setTimeout(() => {
        navigateAfterLoginRef.current = null;
        onLogin?.();
        navigate("/", { replace: true });
      }, SUCCESS_NAV_DELAY_MS);
    } else {
      setPopup({ show: true, type: "error", message: "Invalid username or password." });
    }
  };

  return (
    <div className="login-page">
      {popup.show && (
        <div className={`login-popup-backdrop login-popup-backdrop--${popup.type}`} aria-live="polite">
          <div
            className="login-popup-dialog"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="login-popup-title"
          >
            {popup.type === "success" ? (
              <div className="login-popup-icon login-popup-icon--success" aria-hidden>
                <svg viewBox="0 0 24 24" width="28" height="24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            ) : (
              <div className="login-popup-icon login-popup-icon--error" aria-hidden>
                !
              </div>
            )}
            <h2 id="login-popup-title" className="login-popup-title">
              {popup.type === "success" ? "Login successful" : "Sign in failed"}
            </h2>
            <p className="login-popup-message">{popup.message}</p>
            {popup.type === "error" && (
              <button
                type="button"
                className="login-popup-dismiss"
                onClick={() => setPopup((p) => ({ ...p, show: false }))}
              >
                OK
              </button>
            )}
            {popup.type === "success" && (
              <p className="login-popup-hint">Redirecting in a moment…</p>
            )}
          </div>
        </div>
      )}
      <div className="login-bg">
        <div className="login-bg-shape login-bg-shape-1" />
        <div className="login-bg-shape login-bg-shape-2" />
        <div className="login-bg-shape login-bg-shape-3" />
        <div className="login-bg-gradient" />
      </div>

      <div className="login-container">
        <div className="login-card">
          <div className="login-card-inner">
            <div className="login-header">
              <div className="login-logo">
                <img src="/gallery/desai.jpg" alt="MDRS School" className="login-logo-img" />
              </div>
              <h1 className="login-title">MDRS School</h1>
              <p className="login-subtitle login-welcome-text">Welcome back to MDRS School</p>
            </div>

            <form className="login-form" onSubmit={handleSubmit}>
              <div className="login-field">
                <label
                  className={`login-label ${username || focused.username ? "login-label-up" : ""}`}
                  htmlFor="login-username"
                >
                  User name
                </label>
                <input
                  id="login-username"
                  type="text"
                  className="login-input"
                  placeholder="Enter user name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => setFocused((f) => ({ ...f, username: true }))}
                  onBlur={() => setFocused((f) => ({ ...f, username: false }))}
                  autoComplete="username"
                  required
                />
                <span className="login-input-border" />
              </div>

              <div className="login-field">
                <label
                  className={`login-label ${password || focused.password ? "login-label-up" : ""}`}
                  htmlFor="login-password"
                >
                  Password
                </label>
                <div className="login-input-wrap">
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    className="login-input login-input--password-toggle"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocused((f) => ({ ...f, password: true }))}
                    onBlur={() => setFocused((f) => ({ ...f, password: false }))}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="login-password-toggle"
                    onClick={() => setShowPassword((v) => !v)}
                    onMouseDown={(e) => e.preventDefault()}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    aria-pressed={showPassword}
                  >
                    {showPassword ? <FaEyeSlash aria-hidden /> : <FaEye aria-hidden />}
                  </button>
                  <span className="login-input-border" />
                </div>
              </div>

              <div className="login-options">
                <label className="login-remember">
                  <input type="checkbox" className="login-checkbox" />
                  <span className="login-checkbox-custom" />
                  Remember me
                </label>
                <a href="#forgot" className="login-forgot">Forgot password?</a>
              </div>

              <button type="submit" className="login-btn">
                <span className="login-btn-text">Sign in</span>
                <span className="login-btn-shine" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
