/** Normalize Vite base so public assets resolve when the app is not hosted at `/`. */
export function publicAssetUrl(relativePath) {
  const p = String(relativePath || "").replace(/^\//, "");
  const base = import.meta.env.BASE_URL || "/";
  if (base === "/") return `/${p}`;
  const b = base.endsWith("/") ? base.slice(0, -1) : base;
  return `${b}/${p}`;
}

/** Public asset — same-origin, small, and included in PWA precache patterns. */
export const PUBLIC_IMAGE_FALLBACK = publicAssetUrl("icon-192.png");

/**
 * Swap to a stable placeholder so broken URLs never leave the img empty.
 * Avoids infinite onError loops when already showing the fallback.
 * @param {import("react").SyntheticEvent<HTMLImageElement>} e
 * @param {string} [fallback]
 */
export function handleImgError(e, fallback = PUBLIC_IMAGE_FALLBACK) {
  const el = e?.currentTarget;
  if (!el || typeof window === "undefined") return;
  try {
    const cur = new URL(el.currentSrc || el.src, window.location.href).href;
    const fb = new URL(fallback, window.location.href).href;
    if (cur === fb) return;
  } catch {
    /* ignore URL parse issues */
  }
  el.src = fallback;
}
