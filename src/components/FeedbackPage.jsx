import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import Navbar from "./Navbar";
import AnimatedSection from "./AnimatedSection";
import Footer from "./Footer";
import {
  insertFeedbackSubmission,
  invokeSendFeedbackSms,
  isSupabaseConfigured,
  saveFeedbackLocally,
} from "../lib/supabaseClient";

const ROLE_OPTIONS = [
  { value: "", label: "Select your role" },
  { value: "parents", label: "Parents" },
  { value: "student", label: "Student" },
  { value: "teacher", label: "Teacher" },
];

const REQUIRED = "This field is required";
const NOTIFY_PHONE = "8855025560";

/** School WhatsApp (personal). Pre-filled chat: `https://wa.me/<digits>?text=…` */
const FEEDBACK_WHATSAPP_DEFAULT_LINK = "https://wa.me/918855025560";

function digitsFromWaMeUrl(url) {
  const m = String(url).match(/wa\.me\/(\d{10,15})/i);
  return m ? m[1] : null;
}

/** International digits only (no +). Env overrides default link above. */
function getWhatsAppRecipientDigits() {
  const envLink = import.meta.env.VITE_FEEDBACK_WHATSAPP_LINK;
  if (typeof envLink === "string" && envLink.trim()) {
    const fromWa = digitsFromWaMeUrl(envLink.trim());
    if (fromWa) return fromWa;
    const api = envLink.trim().match(/[?&]phone=(\d{10,15})/i);
    if (api) return api[1];
  }
  const raw = import.meta.env.VITE_FEEDBACK_WHATSAPP_NUMBER;
  if (typeof raw === "string" && raw.replace(/\D/g, "").length >= 10) {
    return raw.replace(/\D/g, "");
  }
  return digitsFromWaMeUrl(FEEDBACK_WHATSAPP_DEFAULT_LINK) ?? "918855025560";
}

/** Opens WhatsApp to the configured number with the feedback text in the compose box. */
function buildWhatsAppUrl(payload) {
  const digits = getWhatsAppRecipientDigits();
  const text = [
    "*MDRS School — Website feedback*",
    "",
    `Name: ${payload.name}`,
    `Role: ${payload.role}`,
    `More memories: ${payload.moreMemories}`,
    "",
    "Message:",
    payload.message,
  ].join("\n");
  const safe = text.length > 3800 ? `${text.slice(0, 3797)}...` : text;
  return `https://wa.me/${digits}?text=${encodeURIComponent(safe)}`;
}

/**
 * Dedicated feedback page (route /feedback). Keeps Navbar + footer shell consistent with the rest of the site.
 * The feedback CTA banner is not shown here to avoid duplicating the entry form.
 */
export default function FeedbackPage({ onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const thanksCloseRef = useRef(null);
  /** Snapshot of last successful submit for the WhatsApp “send copy” action. */
  const lastSubmissionRef = useRef(null);

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");
  const [moreMemories, setMoreMemories] = useState("");
  const [thanksOpen, setThanksOpen] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const scrollFormIntoView = useCallback(() => {
    const el = document.getElementById("feedback-form");
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => {
      const first = el.querySelector("input, textarea, select");
      first?.focus?.();
    }, 400);
  }, []);

  useEffect(() => {
    if (location.hash === "#feedback-form") {
      scrollFormIntoView();
    }
  }, [location.hash, location.pathname, scrollFormIntoView]);

  const handleNavigate = (target) => {
    const scrollToTarget = () => {
      const element = document.getElementById(target);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(scrollToTarget, 80);
      return;
    }
    scrollToTarget();
  };

  const goBack = () => {
    navigate(-1);
  };

  const closeThanks = useCallback(() => {
    setThanksOpen(false);
  }, []);

  useEffect(() => {
    if (!thanksOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") closeThanks();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [thanksOpen, closeThanks]);

  useEffect(() => {
    if (!thanksOpen) return;
    thanksCloseRef.current?.focus?.();
  }, [thanksOpen]);

  const scrollToFirstError = (errs) => {
    const order = ["name", "role", "message", "moreMemories"];
    const first = order.find((k) => errs[k]);
    const idMap = {
      name: "feedback-name",
      role: "feedback-role",
      message: "feedback-message",
      moreMemories: "feedback-more-memories-group",
    };
    const id = first ? idMap[first] : null;
    if (id) {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    const trimmed = message.trim();
    const errs = {};
    if (!name.trim()) errs.name = REQUIRED;
    if (!role) errs.role = REQUIRED;
    if (!trimmed) errs.message = REQUIRED;
    if (!moreMemories) errs.moreMemories = REQUIRED;

    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) {
      scrollToFirstError(errs);
      return;
    }

    setSubmitting(true);
    try {
      if (isSupabaseConfigured()) {
        const { error: insertError } = await insertFeedbackSubmission({
          name: name.trim(),
          role,
          message: trimmed,
          more_memories: moreMemories,
          notify_phone: NOTIFY_PHONE,
        });

        if (insertError) {
          setSubmitError(insertError.message || "Could not save your feedback. Please try again.");
          return;
        }

        const { error: smsFnError } = await invokeSendFeedbackSms({
          name: name.trim(),
          role,
          message: trimmed,
          more_memories: moreMemories,
        });
        if (smsFnError) {
          console.warn("send-feedback-sms:", smsFnError.message);
        }
      } else {
        const { error: localErr } = saveFeedbackLocally({
          name: name.trim(),
          role,
          message: trimmed,
          more_memories: moreMemories,
          notify_phone: NOTIFY_PHONE,
        });
        if (localErr) {
          setSubmitError("Could not save feedback in this browser. Check storage permissions and try again.");
          return;
        }
      }

      lastSubmissionRef.current = {
        name: name.trim(),
        role,
        message: trimmed,
        moreMemories,
      };
      setThanksOpen(true);
      setName("");
      setRole("");
      setMessage("");
      setMoreMemories("");
      setFieldErrors({});
    } finally {
      setSubmitting(false);
    }
  };

  const errCls = (key) => (fieldErrors[key] ? "feedback-input-error" : "");

  return (
    <div className="app-wrapper" style={{ width: "100%", overflowX: "hidden" }}>
      <style>{`
        .feedback-page-main {
          padding-top: 1rem;
          padding-bottom: 2rem;
          font-family: var(--font-body, "Poppins", sans-serif);
        }
        .feedback-page-inner {
          max-width: 640px;
          margin: 0 auto;
          padding: 0 clamp(16px, 4vw, 24px);
        }
        .feedback-back {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          margin: 0 0 0.75rem;
          padding: 0;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          background: #fff;
          color: #4338ca;
          cursor: pointer;
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.08);
          transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
        }
        .feedback-back:hover {
          background: #eef2ff;
          border-color: #c7d2fe;
        }
        .feedback-back:focus-visible {
          outline: 3px solid #6366f1;
          outline-offset: 2px;
        }
        .feedback-page-title {
          margin: 0 0 1.25rem;
          font-size: clamp(1.5rem, 4vw, 1.85rem);
          color: #0f172a;
        }
        #feedback-form {
          background: linear-gradient(145deg, #f8fafc 0%, #f1f5f9 100%);
          border: 1px solid rgba(148, 163, 184, 0.35);
          border-radius: 16px;
          padding: clamp(18px, 3vw, 24px);
          box-shadow: 0 4px 16px rgba(15, 23, 42, 0.06);
        }
        .feedback-form-heading {
          margin: 0 0 1rem;
          font-size: 1.1rem;
          color: #0f172a;
        }
        .feedback-field {
          margin-bottom: 1rem;
        }
        .feedback-field label,
        .feedback-fieldset-label {
          display: block;
          font-size: 0.875rem;
          font-weight: 600;
          color: #334155;
          margin-bottom: 0.35rem;
        }
        .feedback-field input,
        .feedback-field textarea,
        .feedback-field select {
          width: 100%;
          box-sizing: border-box;
          font-family: inherit;
          font-size: 1rem;
          padding: 0.65rem 0.75rem;
          border-radius: 10px;
          border: 1px solid #cbd5e1;
          background: #fff;
          color: #0f172a;
          min-height: 44px;
        }
        .feedback-field input.feedback-input-error,
        .feedback-field textarea.feedback-input-error,
        .feedback-field select.feedback-input-error {
          border-color: #dc2626;
          box-shadow: 0 0 0 1px rgba(220, 38, 38, 0.2);
        }
        .feedback-field select {
          cursor: pointer;
        }
        .feedback-field textarea {
          min-height: 140px;
          resize: vertical;
        }
        .feedback-field input:focus,
        .feedback-field textarea:focus,
        .feedback-field select:focus {
          outline: none;
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
        }
        .feedback-field input.feedback-input-error:focus,
        .feedback-field textarea.feedback-input-error:focus,
        .feedback-field select.feedback-input-error:focus {
          border-color: #dc2626;
          box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.15);
        }
        .feedback-field-error {
          margin: 0.35rem 0 0;
          font-size: 0.8125rem;
          font-weight: 500;
          color: #b91c1c;
        }
        .feedback-fieldset.feedback-fieldset-error .feedback-fieldset-label {
          color: #b91c1c;
        }
        .feedback-fieldset {
          margin: 0 0 1rem;
          padding: 0;
          border: none;
        }
        .feedback-radios {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .feedback-radio-label {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 500;
          color: #334155;
          cursor: pointer;
          min-height: 44px;
        }
        .feedback-radio-label input {
          width: 1.1rem;
          height: 1.1rem;
          accent-color: #6366f1;
        }
        .feedback-memories-hint {
          margin: 0 0 1rem;
          padding: 0.75rem 1rem;
          border-radius: 10px;
          background: #eef2ff;
          border: 1px solid #c7d2fe;
          color: #3730a3;
          font-size: 0.95rem;
          line-height: 1.5;
        }
        .feedback-form-submit-error {
          margin: 0 0 1rem;
          padding: 0.75rem 1rem;
          border-radius: 10px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #991b1b;
          font-size: 0.9rem;
          line-height: 1.45;
        }
        .feedback-submit {
          margin-top: 0.25rem;
          width: 100%;
          min-height: 48px;
          font-size: 1rem;
          font-weight: 600;
          font-family: inherit;
          color: #fff;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          background: linear-gradient(135deg, #6366f1 0%, #7c3aed 100%);
          box-shadow: 0 4px 14px rgba(99, 102, 241, 0.35);
          transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
        }
        .feedback-submit:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
        }
        .feedback-submit:focus-visible {
          outline: 3px solid #4338ca;
          outline-offset: 3px;
        }
        .feedback-submit:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }
        .feedback-thanks-backdrop {
          position: fixed;
          inset: 0;
          z-index: 10050;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.25rem;
          background: rgba(15, 23, 42, 0.45);
          backdrop-filter: blur(4px);
        }
        .feedback-thanks-dialog {
          width: 100%;
          max-width: 400px;
          background: #fff;
          border-radius: 16px;
          padding: 1.5rem 1.35rem 1.25rem;
          box-shadow: 0 20px 50px rgba(15, 23, 42, 0.2);
          text-align: center;
          font-family: var(--font-body, "Poppins", sans-serif);
        }
        .feedback-thanks-dialog h2 {
          margin: 0 0 0.65rem;
          font-size: 1.35rem;
          color: #0f172a;
        }
        .feedback-thanks-dialog p {
          margin: 0 0 1.25rem;
          line-height: 1.55;
          color: #475569;
          font-size: 0.95rem;
        }
        .feedback-thanks-ok {
          min-height: 44px;
          min-width: 120px;
          padding: 0.5rem 1.25rem;
          font-size: 1rem;
          font-weight: 600;
          font-family: inherit;
          color: #fff;
          background: linear-gradient(135deg, #6366f1 0%, #7c3aed 100%);
          border: none;
          border-radius: 10px;
          cursor: pointer;
        }
        .feedback-thanks-ok:focus-visible {
          outline: 3px solid #4338ca;
          outline-offset: 2px;
        }
        .feedback-thanks-wa-hint {
          margin: 0 0 0.75rem;
          font-size: 0.875rem;
          line-height: 1.45;
          color: #64748b;
        }
        .feedback-thanks-wa {
          width: 100%;
          min-height: 48px;
          margin-bottom: 0.65rem;
          padding: 0.55rem 1rem;
          font-size: 1rem;
          font-weight: 600;
          font-family: inherit;
          color: #fff;
          background: #25d366;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          transition: filter 0.2s ease, transform 0.15s ease;
        }
        .feedback-thanks-wa:hover {
          filter: brightness(1.05);
          transform: translateY(-1px);
        }
        .feedback-thanks-wa:focus-visible {
          outline: 3px solid #128c7e;
          outline-offset: 2px;
        }
      `}</style>

      {thanksOpen && (
        <div className="feedback-thanks-backdrop" role="presentation" onClick={closeThanks}>
          <div
            className="feedback-thanks-dialog"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="feedback-thanks-title"
            onClick={(ev) => ev.stopPropagation()}
          >
            <h2 id="feedback-thanks-title">Thank you!</h2>
            <p>Thanks — we’ve received your feedback.</p>
            <p className="feedback-thanks-wa-hint">
              Tap below to open WhatsApp with this text, then tap <strong>Send</strong>.
            </p>
            <button
              type="button"
              className="feedback-thanks-wa"
              aria-label="Open WhatsApp with your feedback message ready to send"
              onClick={() => {
                const p = lastSubmissionRef.current;
                if (!p) return;
                const url = buildWhatsAppUrl(p);
                window.open(url, "_blank", "noopener,noreferrer");
              }}
            >
              Send on WhatsApp
            </button>
            <button ref={thanksCloseRef} type="button" className="feedback-thanks-ok" onClick={closeThanks}>
              OK
            </button>
          </div>
        </div>
      )}

      <Navbar onNavigate={handleNavigate} onLogout={onLogout} />
      <main className="page-section feedback-page-main">
        <div className="feedback-page-inner">
          <button type="button" className="feedback-back" onClick={goBack} aria-label="Go back">
            <FaArrowLeft aria-hidden />
          </button>
          <h1 className="feedback-page-title">Feedback</h1>

          <form id="feedback-form" className="feedback-form" onSubmit={handleSubmit} noValidate>
            <h2 className="feedback-form-heading">Your feedback</h2>

            {submitError ? (
              <div className="feedback-form-submit-error" role="alert">
                {submitError}
              </div>
            ) : null}

            <div className="feedback-field">
              <label htmlFor="feedback-name">Name</label>
              <input
                id="feedback-name"
                name="name"
                type="text"
                autoComplete="name"
                className={errCls("name")}
                aria-invalid={Boolean(fieldErrors.name)}
                aria-describedby={fieldErrors.name ? "feedback-error-name" : undefined}
                value={name}
                onChange={(ev) => {
                  setName(ev.target.value);
                  if (fieldErrors.name) setFieldErrors((f) => ({ ...f, name: undefined }));
                }}
                placeholder="Your name"
              />
              {fieldErrors.name ? (
                <p id="feedback-error-name" className="feedback-field-error" role="alert">
                  {fieldErrors.name}
                </p>
              ) : null}
            </div>

            <div className="feedback-field">
              <label htmlFor="feedback-role">Role</label>
              <select
                id="feedback-role"
                name="role"
                className={errCls("role")}
                aria-invalid={Boolean(fieldErrors.role)}
                aria-describedby={fieldErrors.role ? "feedback-error-role" : undefined}
                value={role}
                onChange={(ev) => {
                  setRole(ev.target.value);
                  if (fieldErrors.role) setFieldErrors((f) => ({ ...f, role: undefined }));
                }}
              >
                {ROLE_OPTIONS.map((opt) => (
                  <option key={opt.value || "placeholder"} value={opt.value} disabled={opt.value === ""}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {fieldErrors.role ? (
                <p id="feedback-error-role" className="feedback-field-error" role="alert">
                  {fieldErrors.role}
                </p>
              ) : null}
            </div>

            <div className="feedback-field">
              <label htmlFor="feedback-message">Message</label>
              <textarea
                id="feedback-message"
                name="message"
                className={errCls("message")}
                aria-invalid={Boolean(fieldErrors.message)}
                aria-describedby={fieldErrors.message ? "feedback-error-message" : undefined}
                value={message}
                onChange={(ev) => {
                  setMessage(ev.target.value);
                  if (fieldErrors.message) setFieldErrors((f) => ({ ...f, message: undefined }));
                }}
                placeholder="Share your ideas or feedback here…"
              />
              {fieldErrors.message ? (
                <p id="feedback-error-message" className="feedback-field-error" role="alert">
                  {fieldErrors.message}
                </p>
              ) : null}
            </div>

            <fieldset
              id="feedback-more-memories-group"
              className={`feedback-fieldset${fieldErrors.moreMemories ? " feedback-fieldset-error" : ""}`}
              aria-describedby={fieldErrors.moreMemories ? "feedback-error-moreMemories" : undefined}
            >
              <legend className="feedback-fieldset-label">Do you want to add more memories?</legend>
              <div className="feedback-radios">
                <label className="feedback-radio-label">
                  <input
                    type="radio"
                    name="moreMemories"
                    value="yes"
                    checked={moreMemories === "yes"}
                    onChange={() => {
                      setMoreMemories("yes");
                      if (fieldErrors.moreMemories) setFieldErrors((f) => ({ ...f, moreMemories: undefined }));
                    }}
                  />
                  Yes
                </label>
                <label className="feedback-radio-label">
                  <input
                    type="radio"
                    name="moreMemories"
                    value="no"
                    checked={moreMemories === "no"}
                    onChange={() => {
                      setMoreMemories("no");
                      if (fieldErrors.moreMemories) setFieldErrors((f) => ({ ...f, moreMemories: undefined }));
                    }}
                  />
                  No
                </label>
              </div>
              {fieldErrors.moreMemories ? (
                <p id="feedback-error-moreMemories" className="feedback-field-error" role="alert">
                  {fieldErrors.moreMemories}
                </p>
              ) : null}
            </fieldset>

            {moreMemories === "yes" && (
              <p className="feedback-memories-hint" role="status">
                Ok nice — share your memories with Ravi.
              </p>
            )}

            <button type="submit" className="feedback-submit" disabled={submitting}>
              {submitting ? "Submitting…" : "Submit"}
            </button>
          </form>
        </div>
      </main>
      <AnimatedSection>
        <Footer />
      </AnimatedSection>
    </div>
  );
}
