import React, { useState, useEffect } from "react";

export default function DictionaryPage() {
  const [faqs, setFaqs] = useState([]);
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/dictionary")
      .then(res => res.json())
      .then(data => setFaqs(Array.isArray(data) ? data : []))
      .catch(err => console.error("Ошибка загрузки словаря:", err));
  }, []);

  return (
    <div className="profile-page-wrapper">
      <div className="card" style={{ display: 'flex', flexDirection: 'column', color: 'white' }}>
        <h2 className="gradienttext">Словарь терминов</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
          {faqs.map(faq => (
            <div key={faq._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <div
                onClick={() => setOpenId(openId === faq._id ? null : faq._id)}
                style={{ cursor: 'pointer', padding: '15px 0', display: 'flex', justifyContent: 'space-between' }}
              >
                <strong style={{ color: 'white' }}>{faq.question}</strong>
                <span style={{ color: '#5995fd' }}>{faq.dateAdded}</span>
              </div>
              {openId === faq._id && (
                <div style={{ paddingBottom: '15px', color: '#eee', lineHeight: '1.6' }}>
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}