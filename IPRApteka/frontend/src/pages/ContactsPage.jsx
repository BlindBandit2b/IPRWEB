import React, { useState, useEffect } from "react";

export default function ContactsPage() {
  const [staff, setStaff] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/contacts")
      .then(res => res.json())
      .then(data => setStaff(Array.isArray(data) ? data : []))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="profile-page-wrapper">
      <div className="card">
        <h2 className="gradienttext">Наши специалисты</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          {staff.map(person => (
            <div key={person._id} style={{ color: 'white', textAlign: 'center', background: 'rgba(255,255,255,0.1)', padding: '15px', borderRadius: '15px' }}>
              <img src={person.photo || "/images/default-avatar.png"} alt={person.name} style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover' }} />
              <h4>{person.name}</h4>
              <p style={{ color: '#5995fd' }}>{person.role}</p>
              <p><small>{person.email}</small></p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}