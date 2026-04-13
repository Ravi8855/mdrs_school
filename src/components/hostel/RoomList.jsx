import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaHome, FaSearch } from "react-icons/fa";
import { getHousesForGender } from "../../data/hostelData";
import "./Hostel.css";

const storageKey = (gender) => `mdrs_hostel_search_${gender}`;

export default function RoomList({ gender }) {
  const houses = getHousesForGender(gender);
  const [query, setQuery] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey(gender));
      if (saved != null) setQuery(saved);
    } catch {
      /* ignore */
    }
  }, [gender]);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey(gender), query);
    } catch {
      /* ignore */
    }
  }, [gender, query]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return houses;
    return houses.filter((h) => {
      const blob = [
        h.name,
        h.houseMaster,
        h.houseLeader,
        ...(h.roommates || []),
      ]
        .join(" ")
        .toLowerCase();
      return blob.includes(q);
    });
  }, [houses, query]);

  const base = `/hostel/${gender}`;
  const title = gender === "boys" ? "Boys Hostel" : "Girls Hostel";
  const isEmptyDataset = houses.length === 0;

  return (
    <div className="hostel-page" data-gender={gender}>
      <div className="hostel-inner">
        <Link to="/hostel" className="hostel-back">
          <FaArrowLeft aria-hidden /> Hostel home
        </Link>
        <h1 className="hostel-title">{title}</h1>
        <p className="hostel-subtitle">Tap a house to see master, leader, and all roommates.</p>

        {isEmptyDataset ? (
          <div className="hostel-empty">
            <h3>Coming soon</h3>
            <p>Girls hostel room details will be published here when available.</p>
          </div>
        ) : (
          <>
            <div className="hostel-toolbar">
              <div className="hostel-search-icon hostel-search-wrap">
                <FaSearch aria-hidden />
                <input
                  type="search"
                  className="hostel-search"
                  placeholder="Search by student, house, or teacher…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  aria-label="Search students and houses"
                />
              </div>
              <span className="hostel-meta-pill">
                {filtered.length} house{filtered.length === 1 ? "" : "s"} shown
              </span>
            </div>

            {filtered.length === 0 ? (
              <div className="hostel-empty">
                <h3>No matches</h3>
                <p>Try another name, or clear the search to see all houses.</p>
              </div>
            ) : (
              <div className="hostel-room-grid">
                {filtered.map((h) => (
                  <Link key={h.id} to={`${base}/${h.id}`} className="hostel-room-card">
                    <div className="hostel-room-card-head">
                      <span className="hostel-room-card-icon" aria-hidden>
                        <FaHome />
                      </span>
                      <div>
                        <h3>{h.name}</h3>
                        <div className="hostel-room-card-meta">
                          <span>Master: {h.houseMaster}</span>
                          <span>Leader: {h.houseLeader}</span>
                        </div>
                      </div>
                    </div>
                    <div className="hostel-room-count">
                      {(h.roommates || []).length} student
                      {(h.roommates || []).length === 1 ? "" : "s"}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
