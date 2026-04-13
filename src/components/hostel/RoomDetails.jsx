import React from "react";
import { Link, useParams } from "react-router-dom";
import { FaArrowLeft, FaHome, FaUserGraduate, FaUserTie } from "react-icons/fa";
import { getHouseById } from "../../data/hostelData";
import "./Hostel.css";

function normalizeName(n) {
  return String(n).trim().toLowerCase();
}

export default function RoomDetails({ gender }) {
  const { roomId } = useParams();
  const house = getHouseById(gender, roomId);
  const baseList = `/hostel/${gender}`;

  if (!house) {
    return (
      <div className="hostel-page" data-gender={gender}>
        <div className="hostel-inner">
          <Link to={baseList} className="hostel-back">
            <FaArrowLeft aria-hidden /> Back to rooms
          </Link>
          <div className="hostel-not-found">
            <h1 className="hostel-title">House not found</h1>
            <p>There is no room with this link. Check the URL or return to the list.</p>
            <Link to={baseList} className="hostel-back" style={{ display: "inline-flex" }}>
              View all houses
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const leaderKey = normalizeName(house.houseLeader);

  return (
    <div className="hostel-page" data-gender={gender}>
      <div className="hostel-inner">
        <Link to={baseList} className="hostel-back">
          <FaArrowLeft aria-hidden /> All houses
        </Link>

        <div className="hostel-details-hero">
          <h1>
            <FaHome style={{ marginRight: 10, verticalAlign: "-0.1em", opacity: 0.85 }} aria-hidden />
            {house.name}
          </h1>
          <div className="hostel-details-row">
            <div className="hostel-detail-block">
              <FaUserTie aria-hidden />
              <div>
                <label>House Master</label>
                <strong>{house.houseMaster}</strong>
              </div>
            </div>
            <div className="hostel-detail-block">
              <FaUserGraduate aria-hidden />
              <div>
                <label>House Leader</label>
                <strong>{house.houseLeader}</strong>
              </div>
            </div>
          </div>
        </div>

        <section className="hostel-students" aria-labelledby="hostel-students-heading">
          <h2 id="hostel-students-heading">Students (roommates)</h2>
          <ul className="hostel-student-list">
            {(house.roommates || []).map((name) => {
              const isLeader = normalizeName(name) === leaderKey;
              return (
                <li
                  key={name}
                  className={`hostel-student-item ${isLeader ? "hostel-student-item--leader" : ""}`}
                >
                  <span className="hostel-student-icon" aria-hidden>
                    <FaUserGraduate />
                  </span>
                  <span className="hostel-student-name">{name}</span>
                  {isLeader && (
                    <span className="hostel-star" title="House leader">
                      ⭐
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </div>
  );
}
