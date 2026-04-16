import React, { useEffect, useState, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useLocation } from "react-router-dom";
import emailjs from "@emailjs/browser";
import { FaArrowLeft, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import Navbar from "./Navbar";
import AnimatedSection from "./AnimatedSection";
import Footer from "./Footer";
import FeedbackRoleSelect from "./FeedbackRoleSelect";
import {
  insertFeedbackSubmission,
  invokeSendFeedbackSms,
  isSupabaseConfigured,
  saveFeedbackLocally,
} from "../lib/supabaseClient";

const REQUIRED = "This field is required";
const NOTIFY_PHONE = "8855025560";

function escapeHtmlForEmail(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function memoriesDisplay(v) {
  if (v === "yes") return "Yes";
  if (v === "no") return "No";
  return String(v);
}

/**
 * Extra fields for EmailJS so Gmail shows Name / Role / Message on separate lines.
 * In your EmailJS template, use either {{{details_html}}} (HTML) or <pre style="white-space:pre-wrap;font:inherit">{{details_plain}}</pre>.
 */
function buildEmailJsParams(formData) {
  const mem = memoriesDisplay(formData.memories);
  const details_plain = [
    `Name: ${formData.name}`,
    "",
    `Role: ${formData.role}`,
    "",
    "Message:",
    formData.message,
    "",
    `More memories: ${mem}`,
  ].join("\n");

  const safeName = escapeHtmlForEmail(formData.name);
  const safeRole = escapeHtmlForEmail(formData.role);
  const safeMsg = escapeHtmlForEmail(formData.message).replace(/\r\n|\n|\r/g, "<br/>");
  const safeMem = escapeHtmlForEmail(mem);

  const details_html = [
    "<strong>Name:</strong> " + safeName,
    "<strong>Role:</strong> " + safeRole,
    "<strong>Message:</strong><br/>" + safeMsg,
    "<strong>More memories:</strong> " + safeMem,
  ].join("<br/><br/>");

  return {
    name: formData.name,
    role: formData.role,
    message: formData.message,
    memories: mem,
    details_plain,
    details_html,
  };
}

/**
 * Dedicated feedback page (route /feedback). Keeps Navbar + footer shell consistent with the rest of the site.
 * The feedback CTA banner is not shown here to avoid duplicating the entry form.
 */
export default function FeedbackPage({ onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const thanksDialogRef = useRef(null);

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");
  const [moreMemories, setMoreMemories] = useState("");
  const [thanksOpen, setThanksOpen] = useState(false);
  const [emailFailOpen, setEmailFailOpen] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const emailFailCloseRef = useRef(null);

  const scrollFormIntoView = useCallback(() => {
    const el = document.getElementById("feedback-form");
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => {
      const first = el.querySelector("input, textarea, #feedback-role");
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

  const closeEmailFail = useCallback(() => {
    setEmailFailOpen(false);
  }, []);

  useEffect(() => {
    if (!thanksOpen && !emailFailOpen) return;
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      if (thanksOpen) closeThanks();
      if (emailFailOpen) closeEmailFail();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [thanksOpen, emailFailOpen, closeThanks, closeEmailFail]);

  useEffect(() => {
    if (!thanksOpen) return;
    thanksDialogRef.current?.focus?.();
  }, [thanksOpen]);

  useEffect(() => {
    if (!emailFailOpen) return;
    emailFailCloseRef.current?.focus?.();
  }, [emailFailOpen]);

  useEffect(() => {
    if (!thanksOpen && !emailFailOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [thanksOpen, emailFailOpen]);

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

    const formData = {
      name: name.trim(),
      role,
      message: trimmed,
      memories: moreMemories,
    };

    const serviceId = String(import.meta.env.VITE_EMAILJS_SERVICE_ID ?? "").trim();
    const templateId = String(import.meta.env.VITE_EMAILJS_TEMPLATE_ID ?? "").trim();
    const publicKey = String(import.meta.env.VITE_EMAILJS_PUBLIC_KEY ?? "").trim();

    if (!serviceId || !templateId || !publicKey) {
      console.error(
        "EmailJS: missing VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, or VITE_EMAILJS_PUBLIC_KEY. Add them to .env and restart the dev server."
      );
      setEmailFailOpen(true);
      return;
    }

    setSubmitting(true);
    try {
      try {
        const response = await emailjs.send(serviceId, templateId, buildEmailJsParams(formData), { publicKey });
        console.log(response);
      } catch (error) {
        console.error(error);
        if (error && typeof error === "object" && "status" in error && "text" in error) {
          console.error("EmailJS:", error.status, error.text);
        }
        setEmailFailOpen(true);
        return;
      }

      // Email delivered — show thank-you immediately (DB/local is best-effort backup).
      setThanksOpen(true);
      setName("");
      setRole("");
      setMessage("");
      setMoreMemories("");
      setFieldErrors({});

      if (isSupabaseConfigured()) {
        const { error: insertError } = await insertFeedbackSubmission({
          name: name.trim(),
          role,
          message: trimmed,
          more_memories: moreMemories,
          notify_phone: NOTIFY_PHONE,
        });

        if (insertError) {
          console.warn("[feedback] Supabase save failed after email was sent:", insertError.message);
        } else {
          const { error: smsFnError } = await invokeSendFeedbackSms({
            name: name.trim(),
            role,
            message: trimmed,
            more_memories: moreMemories,
          });
          if (smsFnError) {
            console.warn("send-feedback-sms:", smsFnError.message);
          }
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
          console.warn("[feedback] Local save failed after email was sent:", localErr.message);
        }
      }
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
        .feedback-field textarea {
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
        .feedback-field--role {
          margin-bottom: 1.125rem;
        }
        .feedback-field input.feedback-input-error,
        .feedback-field textarea.feedback-input-error {
          border-color: #dc2626;
          box-shadow: 0 0 0 1px rgba(220, 38, 38, 0.2);
        }
        .feedback-field textarea {
          min-height: 140px;
          resize: vertical;
        }
        .feedback-field input:focus,
        .feedback-field textarea:focus {
          outline: none;
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.22);
        }
        .feedback-field input.feedback-input-error:focus,
        .feedback-field textarea.feedback-input-error:focus {
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
          z-index: 99990;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: max(1rem, env(safe-area-inset-top, 0px)) max(1rem, env(safe-area-inset-right, 0px))
            max(1rem, env(safe-area-inset-bottom, 0px)) max(1rem, env(safe-area-inset-left, 0px));
          box-sizing: border-box;
          background: rgba(15, 23, 42, 0.52);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          animation: feedback-thanks-fade-in 0.22s ease-out;
        }
        @keyframes feedback-thanks-fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes feedback-thanks-pop-in {
          from {
            opacity: 0;
            transform: scale(0.96) translateY(8px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .feedback-thanks-dialog {
          width: 100%;
          max-width: min(420px, 100vw - 2rem);
          max-height: min(90dvh, 640px);
          overflow-x: hidden;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          overscroll-behavior: contain;
          background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
          border-radius: clamp(16px, 4vw, 20px);
          padding: clamp(1.5rem, 5vw, 2.25rem) clamp(1.25rem, 4vw, 2rem);
          box-shadow:
            0 0 0 1px rgba(148, 163, 184, 0.12),
            0 24px 48px rgba(15, 23, 42, 0.18);
          text-align: center;
          font-family: var(--font-body, "Poppins", sans-serif);
          animation: feedback-thanks-pop-in 0.28s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .feedback-thanks-icon-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 4.5rem;
          height: 4.5rem;
          margin: 0 auto 1.25rem;
          border-radius: 50%;
          background: linear-gradient(145deg, #ecfdf5 0%, #d1fae5 100%);
          border: 1px solid rgba(16, 185, 129, 0.25);
        }
        .feedback-thanks-icon {
          width: 2.35rem;
          height: 2.35rem;
          color: #059669;
        }
        .feedback-thanks-dialog h2 {
          margin: 0;
          font-size: clamp(1.25rem, 4vw, 1.45rem);
          font-weight: 700;
          letter-spacing: -0.02em;
          color: #0f172a;
        }
        .feedback-thanks-dialog:focus {
          outline: none;
        }
        .feedback-thanks-dialog:focus-visible {
          outline: 3px solid #6366f1;
          outline-offset: 3px;
        }
        .feedback-email-fail-backdrop {
          position: fixed;
          inset: 0;
          z-index: 99990;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: max(1rem, env(safe-area-inset-top, 0px)) max(1rem, env(safe-area-inset-right, 0px))
            max(1rem, env(safe-area-inset-bottom, 0px)) max(1rem, env(safe-area-inset-left, 0px));
          box-sizing: border-box;
          background: rgba(15, 23, 42, 0.52);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          animation: feedback-thanks-fade-in 0.22s ease-out;
        }
        .feedback-email-fail-dialog {
          width: 100%;
          max-width: min(400px, 100vw - 2rem);
          max-height: min(88dvh, 520px);
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          overscroll-behavior: contain;
          background: linear-gradient(180deg, #ffffff 0%, #fef2f2 100%);
          border-radius: clamp(16px, 4vw, 20px);
          padding: clamp(1.35rem, 4vw, 1.75rem) clamp(1.15rem, 4vw, 1.5rem) clamp(1.15rem, 3vw, 1.5rem);
          box-shadow:
            0 0 0 1px rgba(248, 113, 113, 0.2),
            0 24px 48px rgba(15, 23, 42, 0.16);
          text-align: center;
          font-family: var(--font-body, "Poppins", sans-serif);
          animation: feedback-thanks-pop-in 0.28s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .feedback-email-fail-icon-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 4.25rem;
          height: 4.25rem;
          margin: 0 auto 1rem;
          border-radius: 50%;
          background: linear-gradient(145deg, #fef2f2 0%, #fee2e2 100%);
          border: 1px solid rgba(248, 113, 113, 0.35);
        }
        .feedback-email-fail-icon {
          width: 2.1rem;
          height: 2.1rem;
          color: #dc2626;
        }
        .feedback-email-fail-dialog h2 {
          margin: 0 0 0.65rem;
          font-size: clamp(1.15rem, 3.8vw, 1.35rem);
          font-weight: 700;
          color: #991b1b;
        }
        .feedback-email-fail-dialog p {
          margin: 0 0 1.35rem;
          line-height: 1.55;
          color: #64748b;
          font-size: 0.95rem;
        }
        .feedback-email-fail-ok {
          width: 100%;
          min-height: 48px;
          padding: 0.55rem 1.25rem;
          font-size: 1rem;
          font-weight: 600;
          font-family: inherit;
          color: #fff;
          background: linear-gradient(135deg, #b91c1c 0%, #991b1b 100%);
          border: none;
          border-radius: 12px;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(185, 28, 28, 0.3);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .feedback-email-fail-ok:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(185, 28, 28, 0.35);
        }
        .feedback-email-fail-ok:focus-visible {
          outline: 3px solid #dc2626;
          outline-offset: 2px;
        }
      `}</style>

      {typeof document !== "undefined" &&
        thanksOpen &&
        createPortal(
          <div className="feedback-thanks-backdrop" role="presentation" onClick={closeThanks}>
            <div
              ref={thanksDialogRef}
              className="feedback-thanks-dialog"
              role="dialog"
              aria-modal="true"
              aria-labelledby="feedback-thanks-title"
              tabIndex={-1}
              onClick={(ev) => ev.stopPropagation()}
            >
              <div className="feedback-thanks-icon-wrap" aria-hidden>
                <FaCheckCircle className="feedback-thanks-icon" />
              </div>
              <h2 id="feedback-thanks-title">Thank you for your feedback</h2>
            </div>
          </div>,
          document.body
        )}

      {typeof document !== "undefined" &&
        emailFailOpen &&
        createPortal(
          <div className="feedback-email-fail-backdrop" role="presentation" onClick={closeEmailFail}>
            <div
              className="feedback-email-fail-dialog"
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="feedback-email-fail-title"
              onClick={(ev) => ev.stopPropagation()}
            >
              <div className="feedback-email-fail-icon-wrap" aria-hidden>
                <FaExclamationCircle className="feedback-email-fail-icon" />
              </div>
              <h2 id="feedback-email-fail-title">Failed to send email</h2>
              <p>
                We could not send your feedback by email. Please check your internet connection and try again. If the
                problem continues, contact the school.
              </p>
              <button ref={emailFailCloseRef} type="button" className="feedback-email-fail-ok" onClick={closeEmailFail}>
                OK
              </button>
            </div>
          </div>,
          document.body
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

            <div className="feedback-field feedback-field--role">
              <label htmlFor="feedback-role" id="feedback-role-label">
                Role
              </label>
              <FeedbackRoleSelect
                id="feedback-role"
                value={role}
                onChange={(v) => {
                  setRole(v);
                  if (fieldErrors.role) setFieldErrors((f) => ({ ...f, role: undefined }));
                }}
                hasError={Boolean(fieldErrors.role)}
                ariaDescribedBy={fieldErrors.role ? "feedback-error-role" : undefined}
              />
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
