import React, { useState } from "react";
import "./Alumni.css";

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

const studentsData = [
  {name:"Jattappa",qual:"2nd PUC (working)"},
  { name: "Chandrashekar", qual: "B.A in Yadagir" },
  { name: "Viresh", qual: "Medical (MBBS) in Russia" },
  { name: "Ambadas", qual: "Medical (BAMS) in Bidar" },
  { name: "Hrutik", qual: "Medical (BHMS) in Dharawada" },
  { name: "Bhimashankar", qual: "PU Science (working) in Bangalore" },
  { name: "Marilinga", qual: "B.Com in Bangalore" },
  { name: "Golallappa", qual: "M.Com (ongoing)" },
  { name: "Arun", qual: "Medical (BAMS) in Udapi" },
  { name: "Bhimu", qual: "Paramedical lab technician (working)" },
  { nam: "Prema", qual: "BSc final year in Surapur" },
  { name: "Chaitra", qual: "Paramedical and BSc CBZ Degree in Shahapur" },
  { nam: "Umashree", qual: "BSc Final year in Surapur" },
  { name: "Ganga", qual: "BSc nursing 3rd year in Raichur" },
  { name: "Roopa", qual: "2nd PUC" },
  { name: "Shweta", qual: "BSc nursing in Gulbarga" },
  { name: "Ambika", qual: "Masters in Forensic Science in Bangalore" },
  {name: "Vinod",qual:"BA in Vijayapur"},
  {name:"Mahesh",qual:"BA in Shahapur"},
 { name: "Praveen", qual: "PUC(working) in Shahapur" },
  {name:"Sunil",qual:"Paramedical (working)"},
  {name:"Bheembai",qual:"BA in Gulabarga"},
  {name:"Suvarna",qual:"BSc Nursing"},
  {name:"Suchitra",qual:"Nursing"},
  {name:"Savita",qual:"BSc(CBZ)"},
  {name:"Mallamma", qual: "Diploma Nursing" },
  { name: "Ravi", qual: "Engineering (CSE) in Mysore" },
];

// Use images from public/gallery if available; fallback to react.svg
const galleryPaths = {
  Jattappa:JattappaImg,
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
  Umashree: UmashreeImg,
  Ganga: GangaImg,
  Roopa: RoopaImg,
  Shweta: ShwetaImg,
  Ambika: AmbikaImg,
  Vinod:VinodImg,
  Mahesh:MaheshImg,
  Praveen: PraveenImg,
  Sunil:SunilImg,
  Bheembai:BheembaiImg,
  Suvarna:SuvarnaImg,
  Suchitra:SuchitraImg,
  Savita:SavitaImg,
  Mallamma:MallammaImg,
  Ravi: RaviImg,

};

export default function Alumni() {
  const [selected, setSelected] = useState(null);
  const [showImgLarge, setShowImgLarge] = useState(false);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState(null);

  const openCard = (index) => {
    const student = studentsData[index];
    const img = galleryPaths[student.name] || "/react.svg";
    setSelected({ ...student, img });
    setShowImgLarge(false);
  };

  const closeCard = () => setSelected(null);

  const openFullscreen = () => setShowFullscreen(true);
  const closeFullscreen = () => setShowFullscreen(false);

  return (
    <div className="alumni-section container">
      <h2 className="page-title">Alumni</h2>
      <p className="alumni-subtitle">
        Passout Students of MDRS
      </p>

      <div className="alumni-grid">
        {studentsData.map((s, i) => (
          <button
            key={s.name + i}
            className="alumni-item glass-card"
            onClick={() => openCard(i)}
            aria-label={`Open details for ${s.name}`}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") openCard(i);
            }}
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <img
              src={galleryPaths[s.name] || "/react.svg"}
              alt={s.name}
              className="alumni-thumb"
              loading="lazy"
              onClick={(e) => {
                e.stopPropagation();
                const imgSrc = galleryPaths[s.name] || "/react.svg";
                setLightboxSrc(imgSrc);
              }}
            />
            <div className="alumni-meta">
              <span className="alumni-name">{s.name}</span>
            </div>
          </button>
        ))}
      </div>

      {selected && (
        <div className="alumni-modal" role="dialog" aria-modal="true">
          <div className="alumni-overlay" onClick={() => { closeCard(); setShowFullscreen(false); setLightboxSrc(null); }} />
          <div className="alumni-card">
            <img
              src={selected.img}
              alt={selected.name}
              className={`alumni-avatar`}
              onClick={(e) => {
                e.stopPropagation();
                setLightboxSrc(selected.img);
              }}
            />
            <div className="alumni-card-body">
              <h3>{selected.name}</h3>
              <p className="alumni-qual">{selected.qual}</p>
              <div className="alumni-actions">
                <button onClick={closeCard} className="button-full-width">Close</button>
              </div>
            </div>
          </div>

          {/* fullscreen/lightbox viewer should be sibling to the card so it can cover viewport */}
          {lightboxSrc && (
            <div className="alumni-fullscreen" onClick={() => setLightboxSrc(null)}>
              <button className="lightbox-close" aria-label="Close image" onClick={(e)=>{e.stopPropagation(); setLightboxSrc(null);}}>✕</button>
              <img src={lightboxSrc} alt={selected ? selected.name : 'Alumni'} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
