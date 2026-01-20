import React, { useState, useEffect } from "react";
import ClientProfile from "./ClientProfile";

export default function ProfilePage() {
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/api/profile/me", {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        if (!res.ok) throw new Error("Ошибка при загрузке профиля");
        return res.json();
      })
      .then(data => setProfileData(data))
      .catch(err => {
        console.error(err);
        setError(err.message);
      });
  }, []);

  if (error) {
    return (
      <div className="profile-page-wrapper">
        <h2 style={{color: "white"}}>Ошибка: {error}</h2>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="profile-page-wrapper">
        <h2 style={{color: "white"}}>Загрузка данных профиля...</h2>
      </div>
    );
  }

  return (
    <div className="profile-page-wrapper">
      <ClientProfile data={profileData} />
    </div>
  );
}