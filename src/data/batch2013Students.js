/** URL slug from display name (same rules as 2014 batch). */
export function batch2013Slug(name) {
  return String(name)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
}

/** @param {string} slug from route */
export function getBatch2013BySlug(slug) {
  if (!slug) return null;
  const decoded = decodeURIComponent(slug).toLowerCase();
  return BATCH_2013_STUDENTS.find((s) => batch2013Slug(s.name) === decoded) || null;
}

/**
 * Static 2013 batch profile cards (optional photos / fields).
 * @typedef {{ name: string, qualification: string, location: string, image: string, collegeUniversity?: string }} Batch2013Student
 * @type {Batch2013Student[]}
 */
export const BATCH_2013_STUDENTS = [];

/** Names shown in the 2013 batch aquarium. */
export const BATCH_2013_CLASS_NAMES = [
  "Ayyappa Swamy",
  "Karan",
  "Bhimashankar",
  "Prashant",
  "Shivakumar",
  "Siddaling",
  "Anand",
  "Ashok Rathod",
  "Mallikarjun",
  "Praveen patil",
  "Pavan",
  "Mounesh",
  "Ajay",
  "Kodachi(Siddanna)",
  "Praveen",
  "Bhojappa",
  "Arun Chawan",
  "Chandrashekar",
  "Bhagesh",
];
