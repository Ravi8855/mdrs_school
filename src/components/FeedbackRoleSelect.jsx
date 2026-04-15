import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import { FaChevronDown, FaCheck } from "react-icons/fa";

const OPTIONS = [
  { value: "parents", label: "Parent" },
  { value: "student", label: "Student" },
  { value: "teacher", label: "Teacher" },
];

/**
 * Custom role dropdown (listbox pattern). Same string values as before: parents | student | teacher.
 */
export default function FeedbackRoleSelect({ id, value, onChange, hasError, ariaDescribedBy }) {
  const listboxId = useId();
  const rootRef = useRef(null);
  const btnRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [focusedIdx, setFocusedIdx] = useState(0);

  const selected = OPTIONS.find((o) => o.value === value) ?? null;

  const indexOfValue = useCallback((v) => {
    const i = OPTIONS.findIndex((o) => o.value === v);
    return i < 0 ? 0 : i;
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    btnRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    setFocusedIdx(indexOfValue(value));
  }, [open, value, indexOfValue]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) close();
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open, close]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  const choose = (v) => {
    onChange(v);
    close();
  };

  const onButtonKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!open) {
        setOpen(true);
        setFocusedIdx(indexOfValue(value));
      } else {
        setFocusedIdx((i) => (i + 1) % OPTIONS.length);
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) {
        setOpen(true);
        setFocusedIdx(indexOfValue(value));
      } else {
        setFocusedIdx((i) => (i - 1 + OPTIONS.length) % OPTIONS.length);
      }
    } else if (e.key === "Enter" || e.key === " ") {
      if (open) {
        e.preventDefault();
        choose(OPTIONS[focusedIdx].value);
      } else {
        e.preventDefault();
        setOpen(true);
      }
    } else if (e.key === "Home" && open) {
      e.preventDefault();
      setFocusedIdx(0);
    } else if (e.key === "End" && open) {
      e.preventDefault();
      setFocusedIdx(OPTIONS.length - 1);
    }
  };

  return (
    <div className="fb-role" ref={rootRef}>
      <style>{`
        .fb-role {
          position: relative;
          font-family: var(--font-body, "Poppins", sans-serif);
        }
        .fb-role-btn {
          width: 100%;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          text-align: left;
          font-family: inherit;
          font-size: max(16px, 1rem);
          font-weight: 600;
          line-height: 1.4;
          min-height: clamp(50px, 12vw, 54px);
          padding: clamp(0.8rem, 2.2vw, 0.95rem) clamp(1rem, 3vw, 1.15rem);
          border-radius: 12px;
          border: 1.5px solid #e2e8f0;
          background: #ffffff;
          color: #0f172a;
          cursor: pointer;
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.06);
          transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
        }
        .fb-role-btn--placeholder {
          color: #64748b;
          font-weight: 500;
        }
        .fb-role-btn:hover {
          border-color: #c7d2fe;
          background: #fafbff;
        }
        .fb-role-btn:active {
          background: #f5f7ff;
        }
        .fb-role-btn[aria-expanded="true"] {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
        }
        .fb-role-btn:focus-visible {
          outline: none;
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.22);
        }
        .fb-role-btn--err {
          border-color: #dc2626;
          box-shadow: 0 0 0 1px rgba(220, 38, 38, 0.2);
        }
        .fb-role-btn--err:focus-visible {
          border-color: #dc2626;
          box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.15);
        }
        .fb-role-btn-text {
          flex: 1;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .fb-role-chevron {
          flex-shrink: 0;
          width: 1.1rem;
          height: 1.1rem;
          color: #4338ca;
          transition: transform 0.2s ease;
        }
        .fb-role-btn[aria-expanded="true"] .fb-role-chevron {
          transform: rotate(180deg);
        }
        .fb-role-list {
          position: absolute;
          left: 0;
          right: 0;
          top: calc(100% + 6px);
          z-index: 950;
          margin: 0;
          padding: 0.35rem;
          list-style: none;
          border-radius: 12px;
          border: 1px solid rgba(199, 210, 254, 0.9);
          background: #ffffff;
          box-shadow:
            0 10px 25px -5px rgba(15, 23, 42, 0.12),
            0 8px 10px -6px rgba(99, 102, 241, 0.15);
          max-height: min(50vh, 220px);
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          transform-origin: top center;
          animation: fbRoleIn 0.18s ease-out;
        }
        @keyframes fbRoleIn {
          from {
            opacity: 0;
            transform: translateY(-6px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .fb-role-opt {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
          margin: 0.15rem 0;
          padding: 0.75rem 0.85rem;
          min-height: 48px;
          box-sizing: border-box;
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 500;
          color: #334155;
          cursor: pointer;
          transition: background 0.15s ease, color 0.15s ease;
        }
        .fb-role-opt:hover,
        .fb-role-opt--focus {
          background: linear-gradient(135deg, #eef2ff 0%, #ede9fe 100%);
          color: #312e81;
        }
        .fb-role-opt--selected {
          background: linear-gradient(135deg, #e0e7ff 0%, #ddd6fe 100%);
          color: #3730a3;
          font-weight: 600;
        }
        .fb-role-opt--selected.fb-role-opt--focus {
          background: linear-gradient(135deg, #c7d2fe 0%, #d8b4fe 100%);
        }
        .fb-role-check {
          flex-shrink: 0;
          width: 1rem;
          height: 1rem;
          color: #4f46e5;
        }
      `}</style>

      <button
        ref={btnRef}
        type="button"
        id={id}
        className={[
          "fb-role-btn",
          hasError ? "fb-role-btn--err" : "",
          !value ? "fb-role-btn--placeholder" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-activedescendant={open ? `${listboxId}-opt-${focusedIdx}` : undefined}
        aria-invalid={hasError || undefined}
        aria-describedby={ariaDescribedBy}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onButtonKeyDown}
      >
        <span className="fb-role-btn-text">{selected ? selected.label : "Choose your role"}</span>
        <FaChevronDown className="fb-role-chevron" aria-hidden />
      </button>

      {open ? (
        <ul id={listboxId} role="listbox" className="fb-role-list" aria-labelledby="feedback-role-label">
          {OPTIONS.map((opt, i) => {
            const isSelected = value === opt.value;
            const isFocus = i === focusedIdx;
            return (
              <li
                key={opt.value}
                id={`${listboxId}-opt-${i}`}
                role="option"
                aria-selected={isSelected}
                className={[
                  "fb-role-opt",
                  isFocus ? "fb-role-opt--focus" : "",
                  isSelected ? "fb-role-opt--selected" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onMouseEnter={() => setFocusedIdx(i)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => choose(opt.value)}
              >
                <span>{opt.label}</span>
                {isSelected ? <FaCheck className="fb-role-check" aria-hidden /> : <span className="fb-role-check-slot" aria-hidden />}
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
