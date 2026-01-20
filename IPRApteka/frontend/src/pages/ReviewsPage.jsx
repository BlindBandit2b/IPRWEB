import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(5);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleAddReview = () => {
    if (!token) {
      navigate("/auth");
    } else {
      console.log("Отзыв отправлен:", newReview, rating);
    }
  };

  return (
    <div className="profile-page-wrapper">
      <div className="card">
        <h2 className="gradienttext">Отзывы</h2>

        <div className="reviews-list" style={{ color: 'white' }}>
          <div style={{ borderBottom: '1px solid #ccc', padding: '10px 0' }}>
            <strong>User123</strong> (Оценка: 5)
            <p>Отличный сервис!</p>
            <small>26.12.2025</small>
          </div>
        </div>

        <div style={{ marginTop: '20px' }}>
          <textarea
            className="btn"
            style={{ width: '100%', background: 'white', color: 'black' }}
            placeholder="Ваш отзыв..."
            onChange={(e) => setNewReview(e.target.value)}
          />
          <select className="btn" onChange={(e) => setRating(e.target.value)}>
            {[1,2,3,4,5].map(num => <option key={num} value={num}>{num}</option>)}
          </select>
          <button className="btn solid" onClick={handleAddReview}>Отправить</button>
        </div>
      </div>
    </div>
  );
}