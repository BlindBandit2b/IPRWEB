import React, { useState, useEffect } from "react";

export default function VacanciesPage() {
  const [vacancies, setVacancies] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/vacancies")
      .then(res => res.json())
      .then(data => setVacancies(Array.isArray(data) ? data : []))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="profile-page-wrapper" style={{ color: 'white' }}>
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h2 className="gradienttext">Вакансии</h2>
        {vacancies.length === 0 ? (
          <p style={{ color: 'white' }}>На данный момент открытых вакансий нет.</p>
        ) : (
          vacancies.map(v => (
            <div key={v._id} style={{
              background: 'rgba(255,255,255,0.1)',
              padding: '20px',
              borderRadius: '15px',
              color: 'white',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              <h3 style={{ color: 'white', margin: 0 }}>{v.title}</h3>
              <p style={{ color: 'white', margin: 0 }}>{v.description}</p>
              <p style={{ color: 'white', margin: 0 }}><strong>Зарплата:</strong> {v.salary}</p>
              <button className="btn solid" style={{ alignSelf: 'flex-start' }}>Откликнуться</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}