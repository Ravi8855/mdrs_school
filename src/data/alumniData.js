import JattappaImg from "../assets/Jattappa.jpeg";
import ChandrashekarImg from "../assets/Chandrashekar.jpeg";
import VireshImg from "../assets/Viresh.jpg";
import AmbadasImg from "../assets/Ambadas.jpeg";
import HrutikImg from "../assets/Hrutik.jpeg";
import BhimashankarImg from "../assets/Bhimashankar.jpeg";
import MarilingaImg from "../assets/Marilinga.jpeg";
import GolallappaImg from "../assets/Golallappa.jpeg";
import ArunImg from "../assets/Arun.jpeg";
import BhimuImg from "../assets/Bhimu.jpeg";
import PremaImg from "../assets/Prema.jpeg";
import ChaitraImg from "../assets/Chaitra.jpeg";
import ParvatiImg from "../assets/Parvati.jpg";
import UmashreeImg from "../assets/Umashree.jpg";
import GangaImg from "../assets/Ganga.jpeg";
import RoopaImg from "../assets/Roopa.jpeg";
import ShwetaImg from "../assets/Shweta.jpg";
import AmbikaImg from "../assets/Ambika.jpeg";
import VinodImg from "../assets/Vinod.jpg";
import MaheshImg from "../assets/Mahesh.jpeg";
import PraveenImg from "../assets/Praveen.jpeg";
import SunilImg from "../assets/Sunil.jpeg";
import BheembaiImg from "../assets/Bheembai.jpeg";
import SuvarnaImg from "../assets/Suvarna.jpeg";
import SuchitraImg from "../assets/Suchitra.jpeg";
import SavitaImg from "../assets/Savita.jpeg";
import MallammaImg from "../assets/Mallamma.jpeg";
import RaviImg from "../assets/Ravi.png";

/**
 * @typedef {{
 *   name: string
 *   qual: string
 *   qualification?: string
 *   collegeUniversity?: string
 *   location?: string
 * }} AlumniStudent
 */

/** @type {AlumniStudent[]} */
export const ALUMNI_STUDENTS = [
  { name: "Jattappa", qual: "2nd PUC (working)" },
  { name: "Chandrashekar", qual: "B.A in Yadagir" },
  { name: "Viresh", qual: "Medical (MBBS) in Russia" },
  {
    name: "Ambadas",
    qual: "Medical (BAMS) in Bidar",
    qualification: "Medical (BAMS)",
    collegeUniversity: "Sri Sidharameshwar Ayurvedic Medical College",
    location: "Bidar",
  },
  { name: "Hrutik", qual: "Medical (BHMS) in Dharawada" },
  { name: "Bhimashankar", qual: "PU Science (working) in Bangalore" },
  { name: "Marilinga", qual: "B.Com in Bangalore" },
  { name: "Golallappa", qual: "M.Com (ongoing)" },
  {
    name: "Arun",
    qual: "Medical (BAMS) in Udapi",
    qualification: "Medical (BAMS)",
    collegeUniversity:
      "Shri Dharmasthala Manjunatheshwara Ayurvedic Medical College, Udupi",
    location: "Udupi",
  },
  { name: "Bhimu", qual: "Paramedical lab technician (working)" },
  { name: "Prema", qual: "BSc final year in Surapur" },
  { name: "Chaitra", qual: "Paramedical and BSc CBZ Degree in Shahapur" },
  { name: "Parvati", qual: "BA Final Year in Surapur" },
  { name: "Umashree", qual: "BSc Final year in Surapur" },
  { name: "Ganga", qual: "BSc nursing 3rd year in Raichur" },
  { name: "Roopa", qual: "2nd PUC" },
  { name: "Shweta", qual: "BSc nursing in Gulbarga" },
  { name: "Ambika", qual: "Masters in Forensic Science in Bangalore" },
  { name: "Vinod", qual: "BA in Vijayapur" },
  { name: "Mahesh", qual: "BA in Shahapur" },
  { name: "Praveen", qual: "PUC(working) in Shahapur" },
  { name: "Sunil", qual: "Paramedical (working)" },
  { name: "Bheembai", qual: "BA in Gulabarga" },
  { name: "Suvarna", qual: "BSc Nursing" },
  { name: "Suchitra", qual: "Nursing" },
  { name: "Savita", qual: "BSc(CBZ)" },
  { name: "Mallamma", qual: "Diploma Nursing" },
  {
    name: "Ravi",
    qual: "Engineering (CSE) in Mysore",
    qualification: "Engineering (CSE)",
    collegeUniversity: "Visvesvaraya Technological University Mysore",
    location: "Mysore",
  },
];

export const ALUMNI_PHOTOS = {
  Jattappa: JattappaImg,
  Chandrashekar: ChandrashekarImg,
  Viresh: VireshImg,
  Ambadas: AmbadasImg,
  Hrutik: HrutikImg,
  Bhimashankar: BhimashankarImg,
  Marilinga: MarilingaImg,
  Golallappa: GolallappaImg,
  Arun: ArunImg,
  Bhimu: BhimuImg,
  Prema: PremaImg,
  Chaitra: ChaitraImg,
  Parvati: ParvatiImg,
  Umashree: UmashreeImg,
  Ganga: GangaImg,
  Roopa: RoopaImg,
  Shweta: ShwetaImg,
  Ambika: AmbikaImg,
  Vinod: VinodImg,
  Mahesh: MaheshImg,
  Praveen: PraveenImg,
  Sunil: SunilImg,
  Bheembai: BheembaiImg,
  Suvarna: SuvarnaImg,
  Suchitra: SuchitraImg,
  Savita: SavitaImg,
  Mallamma: MallammaImg,
  Ravi: RaviImg,
};

export function alumniSlug(name) {
  return String(name)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
}

export function getAlumniPhoto(name) {
  return ALUMNI_PHOTOS[name] || "/react.svg";
}

/**
 * Split legacy `qual` string into labeled fields (same source as the old popup).
 * When text contains " in …", treat the tail as college / study location.
 */
export function parseAlumniFields(qual) {
  if (!qual || typeof qual !== "string") {
    return { qualification: "—", collegeUniversity: "—", location: "—" };
  }
  const q = qual.trim();
  const m = q.match(/\s+in\s+(.+)$/i);
  if (!m) {
    return { qualification: q, collegeUniversity: "—", location: "—" };
  }
  const place = m[1].trim();
  const degree = q.slice(0, q.length - m[0].length).trim();
  return {
    qualification: degree,
    collegeUniversity: place,
    location: place,
  };
}

/** Merge optional per-person overrides with parsed `qual`. */
export function getAlumniDetailFields(student) {
  const parsed = parseAlumniFields(student.qual);
  return {
    qualification: student.qualification ?? parsed.qualification,
    collegeUniversity: student.collegeUniversity ?? parsed.collegeUniversity,
    location: student.location ?? parsed.location,
  };
}

/** @param {string} slug from URL */
export function getAlumniBySlug(slug) {
  if (!slug) return null;
  const decoded = decodeURIComponent(slug).toLowerCase();
  return ALUMNI_STUDENTS.find((s) => alumniSlug(s.name) === decoded) || null;
}

/**
 * Overlay Supabase profile rows when `profiles.name` slug matches the static alum slug.
 * @param {AlumniStudent[]} staticStudents
 * @param {Array<Record<string, unknown>> | null | undefined} dbProfiles
 */
export function mergeAlumniWithProfiles(staticStudents, dbProfiles) {
  const list = Array.isArray(dbProfiles) ? dbProfiles : [];
  const bySlug = new Map();
  for (const p of list) {
    const n = p.name != null ? String(p.name).trim() : "";
    if (!n) continue;
    const slug = alumniSlug(n);
    if (slug) bySlug.set(slug, p);
  }
  return staticStudents.map((s) => {
    const slug = alumniSlug(s.name);
    const db = bySlug.get(slug);
    const fallbackPhoto = getAlumniPhoto(s.name);
    const url = db?.image_url && String(db.image_url).trim() ? String(db.image_url).trim() : "";
    const displayImage = url || fallbackPhoto;
    const parsed = parseAlumniFields(s.qual);
    const qualFromDb =
      db?.qualification != null && String(db.qualification).trim()
        ? String(db.qualification).trim()
        : "";
    const displayQualification = qualFromDb || s.qualification || parsed.qualification;
    const userKey = db?.user_key != null ? String(db.user_key).trim() : "";
    return {
      ...s,
      displayImage,
      displayQualification,
      image_url: url || undefined,
      ...(userKey ? { user_key: userKey } : {}),
    };
  });
}

/**
 * Full alumni grid: static passout list (photos + qual) merged with DB, then any
 * profile-only signups not already matched by name slug.
 * @param {Array<Record<string, unknown>> | null | undefined} dbProfiles
 */
export function mergeProfilesIntoStaticGrid(dbProfiles) {
  const mergedStatic = mergeAlumniWithProfiles(ALUMNI_STUDENTS, dbProfiles);
  const seenSlugs = new Set(mergedStatic.map((s) => alumniSlug(s.name)));
  const list = Array.isArray(dbProfiles) ? dbProfiles : [];
  const extras = [];
  for (const p of list) {
    const name = p.name != null ? String(p.name).trim() : "";
    if (!name) continue;
    const slug = alumniSlug(name);
    if (seenSlugs.has(slug)) continue;
    seenSlugs.add(slug);
    const url = p.image_url && String(p.image_url).trim() ? String(p.image_url).trim() : "";
    const qual = p.qualification != null ? String(p.qualification).trim() : "";
    extras.push({
      user_key: String(p.user_key || ""),
      name: name || "—",
      qual: qual || "—",
      displayImage: url || "/react.svg",
      displayQualification: qual || "—",
      image_url: url || undefined,
    });
  }
  return [...mergedStatic, ...extras];
}

/** Find a profile row whose name slug matches the alumni URL slug. */
export function findProfileForAlumniSlug(slug, dbProfiles) {
  if (!slug || !Array.isArray(dbProfiles)) return null;
  const dec = decodeURIComponent(slug).toLowerCase();
  for (const p of dbProfiles) {
    const n = p.name != null ? String(p.name).trim() : "";
    if (n && alumniSlug(n) === dec) return p;
  }
  return null;
}

/**
 * Map Supabase `profiles` rows to the shape used by the Alumni grid (same fields as merge output).
 * @param {Array<Record<string, unknown>> | null | undefined} profiles
 */
export function mapProfilesToAlumniCards(profiles) {
  const list = Array.isArray(profiles) ? profiles : [];
  return list.map((p) => {
    const name = p.name != null ? String(p.name).trim() : "";
    const url = p.image_url && String(p.image_url).trim() ? String(p.image_url).trim() : "";
    const qual = p.qualification != null ? String(p.qualification).trim() : "";
    return {
      user_key: String(p.user_key || ""),
      name: name || "—",
      displayImage: url || "/react.svg",
      displayQualification: qual || "—",
    };
  });
}
