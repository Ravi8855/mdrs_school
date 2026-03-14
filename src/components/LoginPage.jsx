import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const POPUP_DURATION = 3000;
const SESSION_KEY = "isLoggedIn";

const LoginPage = ({ onLogin }) => {
  const navigate = useNavigate();
  const adminUser = import.meta.env.VITE_ADMIN_USER ?? "admin";
  const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD ?? "admin0511";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [focused, setFocused] = useState({ username: false, password: false });
  const [popup, setPopup] = useState({ show: false, type: "success", message: "" });

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === "true") {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    if (!popup.show) return;
    const timer = setTimeout(() => setPopup((p) => ({ ...p, show: false })), POPUP_DURATION);
    return () => clearTimeout(timer);
  }, [popup.show]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = username.trim();
    const pass = password.trim();
    if (!user || !pass) {
      setPopup({ show: true, type: "error", message: "Please enter user name and password." });
      return;
    }
    if (user === adminUser && pass === adminPassword) {
      sessionStorage.setItem(SESSION_KEY, "true");
      onLogin?.();
      setPopup({ show: true, type: "success", message: "Login successful! Welcome back." });
      navigate("/", { replace: true });
    } else {
      setPopup({ show: true, type: "error", message: "Invalid username or password." });
    }
  };

  return (
    <div className="login-page">
      {popup.show && (
        <div
          className={`login-popup login-popup-${popup.type}`}
          role="alert"
          style={{
            position: "fixed",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10000,
            padding: "14px 24px",
            borderRadius: "0 0 8px 8px",
            color: "#fff",
            fontWeight: 600,
            fontSize: "1rem",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            maxWidth: "90vw",
            textAlign: "center",
          }}
        >
          {popup.message}
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
                <input
                  id="login-password"
                  type="password"
                  className="login-input"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocused((f) => ({ ...f, password: true }))}
                  onBlur={() => setFocused((f) => ({ ...f, password: false }))}
                  autoComplete="current-password"
                  required
                />
                <span className="login-input-border" />
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

            <p className="login-footer-text">
              By signing in, you agree to our terms and privacy policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
