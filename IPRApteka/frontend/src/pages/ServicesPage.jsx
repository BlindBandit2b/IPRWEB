import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./profile.css";

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const [filters, setFilters] = useState({
    category: "",
    min_price: "",
    max_price: "",
    search: ""
  });

  useEffect(() => {
    if (token && role === "doctor") {
      navigate("/doctor/services", { replace: true });
    }
  }, [token, role, navigate]);

  const loadServices = useCallback(() => {
    const params = new URLSearchParams(filters);
    fetch("http://localhost:5000/services?" + params.toString())
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setServices(data); });
  }, [filters]);

  useEffect(() => {
    fetch("http://localhost:5000/api/categories")
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setCategories(data); });
    loadServices();
  }, [loadServices]);

  const updateFilter = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleAddToCart = (service) => {
    const currentCart = JSON.parse(localStorage.getItem("cart")) || [];
    const isAlreadyInCart = currentCart.some(item => item._id === service._id);

    if (!isAlreadyInCart) {
      const updatedCart = [...currentCart, service];
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    }
    navigate("/cart");
  };

  return (
    <>
      <header className="page-header" style={{ padding: '20px', background: 'rgba(0,0,0,0.3)', marginBottom: '20px' }}>
        <nav style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center', alignItems: 'center' }}>
          <Link to="/home" className="nav-link" style={navLinkStyle}>Главная</Link>
          <Link to="/about" className="nav-link" style={navLinkStyle}>О компании</Link>
          <Link to="/news" className="nav-link" style={navLinkStyle}>Новости</Link>
          <Link to="/dictionary" className="nav-link" style={navLinkStyle}>Словарь</Link>
          <Link to="/contacts" className="nav-link" style={navLinkStyle}>Контакты</Link>
          <Link to="/vacancies" className="nav-link" style={navLinkStyle}>Вакансии</Link>
          <Link to="/reviews" className="nav-link" style={navLinkStyle}>Отзывы</Link>
          <Link to="/promocodes" className="nav-link" style={navLinkStyle}>Промокоды</Link>

          <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px' }}>
            {token ? (
              <button className="login-btn" onClick={() => navigate("/profile")}>Профиль</button>
            ) : (
              <button className="login-btn" onClick={() => navigate("/auth")}>Войти</button>
            )}
          </div>
        </nav>
      </header>

      <div className="profile-page-wrapper">
        <div className="card">
          <div className="left-container">
            <h2 className="gradienttext">Фильтр</h2>

            <label style={{ color: "white" }}>Поиск:</label>
            <input
              placeholder="Название..."
              name="search"
              value={filters.search}
              onChange={updateFilter}
              className="btn"
              style={{ marginBottom: "10px", background: "white", color: "black" }}
            />

            <label style={{ color: "white" }}>Категория:</label>
            <select name="category" onChange={updateFilter} className="btn" style={{ background: "white" }}>
              <option value="">Все категории</option>
              {categories.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>

            <label style={{ color: "white", marginTop: "10px" }}>Цена от:</label>
            <input type="number" name="min_price" onChange={updateFilter} className="btn" style={{ background: "white" }} />

            <label style={{ color: "white" }}>до:</label>
            <input type="number" name="max_price" onChange={updateFilter} className="btn" style={{ background: "white" }} />

            <button onClick={loadServices} className="btn solid" style={{ marginTop: "15px", width: '100%' }}>
              Применить
            </button>
          </div>

          <div className="right-container">
            <h3 className="gradienttext">Каталог услуг</h3>
            <ul style={{ padding: 0 }}>
              {services.length > 0 ? (
                services.map(s => (
                  <li key={s._id} style={listItemStyle}>
                    <div style={{ color: "white" }}>
                      <strong style={{ fontSize: '1.2rem' }}>{s.name}</strong>
                      <div style={{ color: "#5995fd", fontWeight: 'bold', margin: '5px 0' }}>
                        {s.price} руб.
                      </div>
                      <small style={{ color: "#ccc" }}>
                        Категория: {s.category?.name || "Общая"}
                      </small>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                      <button
                        className="btn"
                        onClick={() => navigate(`/services/${s._id}`)}
                      >
                        Подробнее
                      </button>
                      <button
                        className="btn solid"
                        onClick={() => handleAddToCart(s)}
                      >
                        В корзину
                      </button>
                    </div>
                  </li>
                ))
              ) : (
                <li style={{ listStyle: 'none' }}>
                  <p style={{ color: 'white' }}>Услуги не найдены.</p>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '40px', paddingBottom: '20px' }}>
          <span className="credit" style={{ color: "#5995fd", marginRight: '15px' }}>
            © 2025 Covid Belarus
          </span>
          <span className="credit" style={{ color: "#5995fd" }}>
            Медицинский портал
          </span>
        </div>
      </div>
    </>
  );
}

const navLinkStyle = {
  color: "white",
  textDecoration: "none",
  fontWeight: "500",
  fontSize: "0.9rem",
  transition: "0.3s",
  padding: "5px 10px"
};

const listItemStyle = {
  background: "rgba(255,255,255,0.05)",
  padding: "20px",
  borderRadius: "15px",
  marginBottom: "15px",
  listStyle: "none",
  border: "1px solid rgba(255,255,255,0.1)"
};