import React from 'react';

export default function AboutPage() {
  return (
    <div className="profile-page-wrapper">
      <div className="card" style={{ color: 'white', padding: '20px' }}>
        <h2 className="gradienttext" style={{ marginBottom: '20px' }}>О компании</h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '30px',
          alignItems: 'start'
        }}>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <p style={{ lineHeight: '1.6' }}>
              Мы — ведущий медицинский центр, основанный в 2020 году. Наша миссия — предоставлять высокотехнологичную помощь в комфортных условиях.
            </p>
            <video width="100%" controls style={{ borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}>
              <source src="/videos/about.mp4" type="video/mp4" />
              Ваш браузер не поддерживает видео.
            </video>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <h3 style={{ color: '#5995fd', marginBottom: '10px' }}>История развития</h3>
              <ul style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
                <li><strong>2020:</strong> Открытие первого многопрофильного филиала.</li>
                <li><strong>2023:</strong> Запуск собственной платформы онлайн-диагностики.</li>
              </ul>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '10px' }}>
              <h3 style={{ color: '#5995fd', fontSize: '1.1rem', marginBottom: '5px' }}>Реквизиты</h3>
              <p style={{ fontSize: '0.9rem', margin: 0 }}>
                УНП: 123456789<br />
                Р/С: BY12345678901234567890
              </p>
            </div>

            <div style={{
              border: '1px dashed #5995fd',
              padding: '15px',
              borderRadius: '10px',
              textAlign: 'center'
            }}>
              <h4 style={{ margin: '0 0 10px 0' }}>СЕРТИФИКАТ СООТВЕТСТВИЯ</h4>
              <p style={{ fontSize: '0.85rem', color: '#ccc', marginBottom: '10px' }}>
                Настоящий документ подтверждает высокую квалификацию специалистов и соответствие стандартам качества.
              </p>
              <p style={{ fontSize: '0.8rem', marginBottom: '15px' }}>Выдан: 2025-12-26</p>

              <a
                href="/images/certificate-full.jpg"
                target="_blank"
                rel="noopener noreferrer"
                className="btn solid"
                style={{
                  textDecoration: 'none',
                  display: 'inline-block',
                  fontSize: '0.8rem',
                  padding: '8px 15px'
                }}
              >
                Смотреть оригинал фото
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}