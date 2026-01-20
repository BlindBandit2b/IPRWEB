import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();

  const [banners] = useState([
    { id: 1, src: "/images/banner1.png", link: "/news" },
    { id: 2, src: "https://images.unsplash.com/photo-1512678080530-7760d81faba6?w=400&h=200&fit=crop", link: "/about" }
  ]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [intervalTime, setIntervalTime] = useState(3000);

  useEffect(() => {
    const timer = setInterval(() => {
      if (document.hasFocus()) {
        setCurrentIdx((prev) => (prev + 1) % banners.length);
      }
    }, intervalTime);
    return () => clearInterval(timer);
  }, [intervalTime, banners.length]);

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left;
    const y = e.clientY - box.top;
    const centerX = box.width / 2;
    const centerY = box.height / 2;
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`;
  };

  return (
    <div className="profile-page-wrapper">
      <div className="card" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={{ transition: 'transform 0.1s', color: 'white' }}>
        <header style={{ textAlign: 'center' }}>
          <h1 className="gradienttext">VitaNova Clinic</h1>

          <div className="banner-container" style={{ margin: '20px 0' }}>
            <a href={banners[currentIdx].link}>
              <img
                src={banners[currentIdx].src}
                alt="Banner"
                style={{ width: '100%', maxWidth: '400px', height: '200px', objectFit: 'cover', borderRadius: '15px' }}
              />
            </a>
            <div style={{ marginTop: '10px' }}>
              <label style={{ fontSize: '0.8rem' }}>Скорость ротации (мс): </label>
              <input
                type="number"
                value={intervalTime}
                onChange={(e) => setIntervalTime(Number(e.target.value))}
                style={{ width: '70px', background: '#333', color: 'white', border: 'none', borderRadius: '5px' }}
              />
            </div>
          </div>
        </header>

        <section style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center' }}>
          <h3>Наши продукты</h3>
          <button className="btn solid" onClick={() => navigate("/services")}>Перейти в каталог</button>
        </section>

        <footer style={{ marginTop: '30px', textAlign: 'center' }}>
          <p>Наши партнеры:</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
             <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/WHO_logo.svg/1200px-WHO_logo.svg.png"
                  alt="WHO" style={{ width: '100px', filter: 'brightness(0) invert(1)' }} />
          </div>
        </footer>
      </div>
    </div>
  );
}