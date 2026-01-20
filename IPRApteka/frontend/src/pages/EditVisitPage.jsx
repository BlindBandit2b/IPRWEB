import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./editPage.css";

export default function EditVisitPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [visit, setVisit] = useState(null);
  const [form, setForm] = useState({
    date: "",
    time_start: "",
    time_end: "",
    diagnosis_text: "",
  });

  useEffect(() => {
    fetch(`http://localhost:5000/api/doctor/visits/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        setVisit(data);
        setForm({
          date: data.schedule.date,
          time_start: data.schedule.time_start,
          time_end: data.schedule.time_end,
          diagnosis_text: data.diagnosis_text || "",
        });
      });
  }, [id]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function submit(e) {
    e.preventDefault();

    fetch(`http://localhost:5000/api/doctor/visits/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(form),
    }).then(() => navigate("/doctor/visits"));
  }

  function deleteVisit() {
    if (!window.confirm("Удалить посещение?")) return;

    fetch(`http://localhost:5000/api/doctor/visits/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then(() => navigate("/doctor/visits"));
  }

  if (!visit) return <p>Загрузка...</p>;

  return (
    <div className="page-wrapper">
      <div className="card">
        <h2>Редактировать посещение</h2>

        <div className="client-info">
          <h3>Информация о клиенте</h3>
          <p><strong>ФИО:</strong> {visit.client.first_name} {visit.client.last_name}</p>
          <p><strong>Email:</strong> {visit.client.email || "не указан"}</p>
        </div>

        <form onSubmit={submit}>
          <label>Дата</label>
          <input type="date" name="date" value={form.date} onChange={handleChange} />

          <label>Время начала</label>
          <input type="time" name="time_start" value={form.time_start} onChange={handleChange} />

          <label>Время окончания</label>
          <input type="time" name="time_end" value={form.time_end} onChange={handleChange} />

          <label>Диагноз</label>
          <textarea
            name="diagnosis_text"
            value={form.diagnosis_text}
            onChange={handleChange}
          />

          <button className="btn">Сохранить</button>
        </form>

        <button className="btn delete" onClick={deleteVisit}>
          Удалить посещение
        </button>

        <button className="btn back" onClick={() => navigate("/doctor/visits")}>
          ← Назад
        </button>
      </div>
    </div>
  );
}
