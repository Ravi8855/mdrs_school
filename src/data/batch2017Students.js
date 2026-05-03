/** URL slug from display name (same rules as other batches). */
export function batch2017Slug(name) {
  return String(name)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
}

/** @param {string} slug from route */
export function getBatch2017BySlug(slug) {
  if (!slug) return null;
  const decoded = decodeURIComponent(slug).toLowerCase();
  return BATCH_2017_STUDENTS.find((s) => batch2017Slug(s.name) === decoded) || null;
}

/**
 * Static 2017 batch profile cards (optional photos / fields).
 * @typedef {{ name: string, qualification: string, location: string, image: string, collegeUniversity?: string }} Batch2017Student
 * @type {Batch2017Student[]}
 */
export const BATCH_2017_STUDENTS = [];

/** Names shown in the 2017 batch aquarium. */
export const BATCH_2017_CLASS_NAMES = [
  "Prajwal N",
  "Prajwal Gonal",
  "Kailasa",
  "Vishal",
  "Rahul Rathod",
  "Rahul Bahadur",
  "Anil",
  "Kallappa",
  "Manju Devaraja",
  "Basavaraja",
  "Maryappa",
  "Channabasava",
  "Subhash",
  "Sudhakar",
  "Gopal",
  "Bhagyashree",
  "Pavitra",
  "Sona",
  "Niveditha",
  "Geeta",
  "Geeta Pawar",
  "Irshad Begum",
  "Shashikala",
  "Suprita",
  "Ashwini",
  "Laxmi",
  "Akash",
  "Amoghsidda",
  "Abhishek",
  "Parshuram",
  "Mareamma",
  "Aishwarya",
  "Sharada M",
  "Sharada",
  "Monika",
  "Pooja",
  "Raghavendra",
];
