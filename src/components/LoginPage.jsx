import React, { useState } from "react";
import "./Login.css";

// Demo credentials (for development / demo use only)
const DEMO_USERNAME = "mdrs";
const DEMO_PASSWORD = "school";

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [focused, setFocused] = useState({ email: false, password: false });
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    const user = email.trim();
    const pass = password.trim();
    if (!user || !pass) return;
    if (user === DEMO_USERNAME && pass === DEMO_PASSWORD) {
      onLogin?.();
    } else {
      setError("Invalid username or password. Use demo: mdrs / school");
    }
  };

  return (
    <div className="login-page">
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
                <span className="login-logo-icon">MDRS</span>
              </div>
              <h1 className="login-title">MDRS School</h1>
              <p className="login-subtitle login-welcome-text">Welcome back to MDRS School</p>
            </div>

            <form className="login-form" onSubmit={handleSubmit}>
              <div className="login-field">
                <label
                  className={`login-label ${email || focused.email ? "login-label-up" : ""}`}
                  htmlFor="login-email"
                >
                  Email or username
                </label>
                <input
                  id="login-email"
                  type="text"
                  className="login-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocused((f) => ({ ...f, email: true }))}
                  onBlur={() => setFocused((f) => ({ ...f, email: false }))}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocused((f) => ({ ...f, password: true }))}
                  onBlur={() => setFocused((f) => ({ ...f, password: false }))}
                  autoComplete="current-password"
                  required
                />
                <span className="login-input-border" />
              </div>

              {error && (
                <p className="login-error" role="alert">
                  {error}
                </p>
              )}
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
