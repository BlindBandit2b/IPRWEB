import React, { useState, useEffect } from "react";

export default function NewsPage() {
  const [news, setNews] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/news")
      .then(res => res.json())
      .then(data => setNews(data));
  }, []);

  return (
    <div className="profile-page-wrapper">
      <div className="card">
        <h2 className="gradienttext">Новости медицины</h2>
        {selectedArticle ? (
          <div style={{ color: "white" }}>
            <button className="btn" onClick={() => setSelectedArticle(null)}>Назад к списку</button>
            <h3>{selectedArticle.title}</h3>
            <img src={selectedArticle.image} alt="news" style={{ width: '100%', borderRadius: '10px' }} />
            <p>{selectedArticle.fullContent}</p>
          </div>
        ) : (
          <div className="news-grid">
            {news.map(item => (
              <div key={item._id} style={{ background: 'rgba(255,255,255,0.1)', padding: '15px', borderRadius: '10px', marginBottom: '15px' }}>
                <img src={item.image} alt="thumb" style={{ width: '100px', float: 'left', marginRight: '15px' }} />
                <h4 style={{ color: 'white' }}>{item.title}</h4>
                <p style={{ color: '#ccc' }}>{item.shortDescription}</p>
                <button className="btn solid" onClick={() => setSelectedArticle(item)}>Читать далее</button>
                <div style={{ clear: 'both' }}></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}