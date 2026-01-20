import React from "react";
import { Link } from "react-router-dom";
import "./profile.css";

export default function ClientProfile({ data }) {
  const { user, profile, joke } = data;

  return (
    <div className="card">
      <div className="left-container">
        <img src="/images/log2.png" className="image" alt="User" />
        <h2 className="gradienttext">
          {profile?.firstName || "Имя"}
        </h2>

        <Link to="/profile/edit" className="btn solid change-btn">Change</Link>
        <Link to="/appointments" className="btn solid change-btn" style={{ paddingRight: "25px" }}>
          Appointment
        </Link>
        <Link to="/services" className="btn solid change-btn">Home</Link>
      </div>

      <div className="right-container">
        <h3 className="gradienttext">Profile Details</h3>
        <table>
          <tbody>
            <tr>
              <td>Username :</td>
              <td>{user?.username}</td>
            </tr>
            <tr>
              <td>Email :</td>
              <td>{user?.email}</td>
            </tr>
            <tr>
              <td>Date of birth :</td>
              <td>{profile?.dateOfBirth || "—"}</td>
            </tr>
            <tr>
              <td>Mobile :</td>
              <td>{profile?.mobile || "—"}</td>
            </tr>
            <tr>
              <td>Address :</td>
              <td>{profile?.address || "—"}</td>
            </tr>
          </tbody>
        </table>

        <div className="joke-container" style={{ border: "1px solid #ccc", borderRadius: "8px", color: "white", marginTop: "20px", padding: "15px" }}>
          <h3 style={{ marginBottom: "10px", color: "#5995fd" }}>Медицинская шутка дня:</h3>
          <p style={{ fontStyle: "italic", lineHeight: "1.4" }}>{joke}</p>
        </div>
      </div>
    </div>
  );
}