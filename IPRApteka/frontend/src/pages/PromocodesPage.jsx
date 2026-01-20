import React, { useState, useEffect } from "react"; // Добавлен импорт

export default function PromocodesPage() {
  const [codes, setCodes] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/promocodes")
      .then(res => res.json())
      .then(data => setCodes(Array.isArray(data) ? data : []))
      .catch(err => console.error("Ошибка промокодов:", err));
  }, []);

  return (
    <div className="profile-page-wrapper">
      <div className="card">
        <h2 className="gradienttext">Промокоды и купоны</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
          {codes.map(code => (
            <div key={code._id} style={{
              padding: '20px',
              borderRadius: '15px',
              border: '2px dashed #5995fd',
              background: code.status === 'archive' ? 'rgba(0,0,0,0.3)' : 'rgba(89, 149, 253, 0.1)',
              color: 'white'
            }}>
              <h3 style={{ margin: '0 0 10px 0', letterSpacing: '2px' }}>{code.code}</h3>
              <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Скидка: {code.discount}%</p>
              <div style={{
                marginTop: '10px',
                fontSize: '0.7rem',
                color: code.status === 'active' ? '#4caf50' : '#f44336'
              }}>
                {code.status === 'active' ? '● Активен' : '● В архиве'}
              </div>
            </div>
          ))}
        </div>
        {codes.length === 0 && <p style={{ color: "white", marginTop: "20px" }}>Промокоды отсутствуют.</p>}
      </div>
    </div>
  );
}