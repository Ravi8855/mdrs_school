import React from "react";
import { getHostelPersonPhoto } from "../../data/hostelPersonPhotos";
import "./Hostel.css";

/**
 * @param {object} props
 * @param {string} props.name — display name used to resolve `src/assets` photo
 * @param {'xs'|'sm'|'md'|'lg'} [props.size='md']
 * @param {string} [props.className]
 * @param {string} [props.title]
 */
function initialFromName(name) {
  const t = String(name).trim();
  if (!t) return "?";
  const ch = t[0];
  return ch.toLocaleUpperCase();
}

export default function HostelAvatar({ name, size = "md", className = "", title }) {
  const src = getHostelPersonPhoto(name);
  if (src == null || src === "") {
    return (
      <span
        role="img"
        aria-label={title ?? name}
        title={title ?? name}
        className={`hostel-avatar hostel-avatar--placeholder hostel-avatar--${size} ${className}`.trim()}
      >
        {initialFromName(name)}
      </span>
    );
  }
  return (
    <img
      src={src}
      alt=""
      title={title ?? name}
      className={`hostel-avatar hostel-avatar--${size} ${className}`.trim()}
      loading="lazy"
      decoding="async"
    />
  );
}
