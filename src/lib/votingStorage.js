import { VOTING_CATEGORIES } from "../data/votingCategories";

const SELECTION_KEY = "mdrs_class_voting_pick_v1";

/** @returns {Record<string, string | null>} */
function emptySelections() {
  const out = {};
  for (const cat of VOTING_CATEGORIES) {
    out[cat.id] = null;
  }
  return out;
}

/**
 * @param {unknown} raw
 * @returns {Record<string, string | null>}
 */
export function normalizeSelections(raw) {
  const out = emptySelections();
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) return out;
  /** @type {Record<string, unknown>} */
  const r = raw;
  for (const cat of VOTING_CATEGORIES) {
    const v = r[cat.id];
    if (typeof v !== "string") continue;
    if (cat.nominees.some((n) => n.id === v)) {
      out[cat.id] = v;
    }
  }
  return out;
}

/** One nominee id per category (or null) — single vote per category on this device. */
export function readSelections() {
  try {
    const raw = localStorage.getItem(SELECTION_KEY);
    if (!raw) return emptySelections();
    return normalizeSelections(JSON.parse(raw));
  } catch {
    return emptySelections();
  }
}

/** @param {Record<string, string | null>} selections */
export function writeSelections(selections) {
  try {
    localStorage.setItem(SELECTION_KEY, JSON.stringify(selections));
  } catch {
    /* quota / private mode */
  }
}

/**
 * Set this device’s pick for a category (replaces any previous pick in that category).
 * @param {Record<string, string | null>} selections
 * @param {string} categoryId
 * @param {string} nomineeId
 * @returns {Record<string, string | null>}
 */
export function pickNominee(selections, categoryId, nomineeId) {
  const cat = VOTING_CATEGORIES.find((c) => c.id === categoryId);
  if (!cat || !cat.nominees.some((n) => n.id === nomineeId)) {
    return normalizeSelections(selections);
  }
  const next = normalizeSelections(selections);
  next[categoryId] = nomineeId;
  writeSelections(next);
  return next;
}

/** @param {Record<string, string | null>} selections @param {string} categoryId @param {string} nomineeId */
export function selectionCountForNominee(selections, categoryId, nomineeId) {
  return selections[categoryId] === nomineeId ? 1 : 0;
}
