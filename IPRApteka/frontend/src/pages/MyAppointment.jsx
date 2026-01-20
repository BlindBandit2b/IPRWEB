import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./doctor.css";

export default function MyAppointments() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/appointments", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setVisits(data);
        setLoading(false);
      })
      .catch((err) => console.error("Ошибка загрузки:", err));
  }, []);


  const calculateTotal = (services) => {
    return services.reduce((sum, s) => sum + s.price, 0);
  };

  return (
    <div className="doctor-services-container">
      <div className="card" style={{ alignItems: "flex-start", width: "80%" }}>
        <h2 className="gradienttext">Мои записи на прием</h2>

        {loading ? (
          <p style={{ color: "white" }}>Загрузка...</p>
        ) : visits.length > 0 ? (
          <ul style={{ width: "100%", padding: 0 }}>
            {visits.map((visit) => (
              <li key={visit._id} style={{
                background: "rgba(255, 255, 255, 0.15)",
                borderRadius: "15px",
                padding: "20px",
                marginBottom: "15px",
                listStyle: "none",
                color: "white"
              }}>
                <div style={{ marginBottom: "10px" }}>
                  <strong>📅 Дата и время:</strong> {new Date(visit.schedule.date).toLocaleDateString()} c {visit.schedule.time_start} до {visit.schedule.time_end}
                </div>

                <div style={{ marginBottom: "10px" }}>
                  <strong>👨‍⚕️ Доктор:</strong> {visit.schedule.doctor.first_name} {visit.schedule.doctor.last_name}
                </div>

                <div style={{ marginBottom: "10px" }}>
                  <strong>🛠 Услуги:</strong>
                  <ul style={{ fontSize: "14px", marginTop: "5px" }}>
                    {visit.services.map((s) => (
                      <li key={s._id} style={{ background: "none", padding: "2px 0", margin: 0 }}>
                        • {s.name} — {s.price} ₽
                      </li>
                    ))}
                  </ul>
                </div>

                <div style={{ marginBottom: "10px" }}>
                  <strong>🩺 Диагноз:</strong> {visit.diagnosis_text || "Ожидается прием"}
                </div>

                <div style={{ fontSize: "1.1rem", borderTop: "1px solid rgba(255,255,255,0.3)", paddingTop: "10px" }}>
                  <strong>💰 Итого: {calculateTotal(visit.services)} ₽</strong>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ color: "white" }}>У вас пока нет активных записей.</p>
        )}

        <div style={{ marginTop: "20px" }}>
          <Link to="/services" className="btn" style={{ background: "#888" }}>
            ← Назад к услугам
          </Link>
        </div>
      </div>
    </div>
  );
}