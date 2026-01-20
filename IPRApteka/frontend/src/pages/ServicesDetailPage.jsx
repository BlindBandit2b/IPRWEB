import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "./profile.css";

export default function ServiceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(`http://localhost:5000/services/${id}`)
      .then((res) => res.json())
      .then(setService)
      .catch((err) => console.error("Ошибка загрузки услуги:", err));
  }, [id]);

  const addToCart = () => {
    fetch(`http://localhost:5000/api/cart/add/${id}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }).then(() => alert("Услуга добавлена в корзину"));
  };

  if (!service) return <div className="profile-page-wrapper"><p style={{color: "white"}}>Загрузка...</p></div>;

  return (
    <div className="profile-page-wrapper">
      <div className="card">
        <div className="left-container">
          <h2 className="gradienttext">{service.name}</h2>
          <div className="credit" style={{ position: "static", marginTop: "20px" }}>
            {token ? (
              <button onClick={addToCart} className="btn">Добавить в корзину</button>
            ) : (
              <p style={{ color: "#fff" }}>
                Чтобы заказать услугу, пожалуйста,{" "}
                <Link to="/auth" style={{ color: "#5995fd" }}>войдите</Link> в аккаунт.
              </p>
            )}
          </div>
          <div className="credit" style={{ position: "static", marginTop: "20px" }}>
             <button onClick={() => navigate("/services")} className="btn" style={{background: "none", border: "1px solid #5995fd"}}>
               ← Назад к списку
             </button>
          </div>
        </div>

        <div className="right-container">
          <h3 className="gradienttext">Описание услуги</h3>
          <p style={{color: "white"}}><strong>Категория:</strong> {service.category?.name || "Общая"}</p>
          <p style={{color: "white"}}><strong>Цена:</strong> {service.price} BYN</p>
          <p style={{color: "white", marginTop: "15px"}}><strong>Описание:</strong></p>
          <p style={{color: "#ccc", lineHeight: "1.6"}}>{service.description}</p>
        </div>
      </div>
    </div>
  );
}