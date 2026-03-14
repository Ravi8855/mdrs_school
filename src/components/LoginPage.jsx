import React, { useState } from "react";
import "./Login.css";

const LoginPage = ({ onLogin }) => {
  const adminUser = import.meta.env.VITE_ADMIN_USER ?? "admin";
  const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD ?? "admin0511";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [focused, setFocused] = useState({ username: false, password: false });
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    const user = username.trim();
    const pass = password.trim();
    if (!user || !pass) {
      setError("Please enter user name and password.");
      return;
    }
    if (user === adminUser && pass === adminPassword) {
      onLogin?.();
    } else {
      setError("Invalid user name or password.");
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
