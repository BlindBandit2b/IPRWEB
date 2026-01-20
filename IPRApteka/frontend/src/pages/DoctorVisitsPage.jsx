import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./profile.css";

export default function DoctorVisitsPage() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/api/doctor/visits", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error("Ошибка при загрузке записей");
        return res.json();
      })
      .then(data => {
        const visitsArray = Array.isArray(data) ? data : (data.visits || []);
        setVisits(visitsArray);
        setLoading(false);
      })
      .catch(err => {
        console.error("Ошибка:", err);
        setError(err.message);
        setLoading(false);
        setVisits([]);
      });
  }, []);

  if (loading) return <div className="profile-page-wrapper"><h2 style={{color: "white"}}>Загрузка...</h2></div>;
  if (error) return <div className="profile-page-wrapper"><h2 style={{color: "white"}}>Ошибка: {error}</h2></div>;

  return (
    <div className="profile-page-wrapper">
      <div className="card" style={{ width: "90%", maxWidth: "1000px" }}>
        <h2 className="gradienttext">Приемы пациентов</h2>

        {visits.length === 0 ? (
          <p style={{ color: "white" }}>Записей пока нет.</p>
        ) : (
          <div style={{ width: "100%" }}>
            {visits.map((visit) => (
              <div key={visit._id} style={{
                background: "rgba(255,255,255,0.1)",
                padding: "15px",
                borderRadius: "15px",
                marginBottom: "10px",
                color: "white",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <div>
                  <strong>Пациент:</strong> {visit.client?.username || "Не указан"} <br />
                  <strong>Дата:</strong> {visit.schedule?.date ? new Date(visit.schedule.date).toLocaleDateString() : "Дата не назначена"} <br />
                  <strong>Статус:</strong> {visit.status}
                </div>
                <button
                  className="btn"
                  style={{ width: "100px" }}
                  onClick={() => navigate(`/doctor/visits/${visit._id}/edit`)}
                >
                  Edit
                </button>
              </div>
            ))}
          </div>
        )}
        <button onClick={() => navigate("/doctor/services")} className="btn" style={{marginTop: "20px"}}>Назад</button>
      </div>
    </div>
  );
}