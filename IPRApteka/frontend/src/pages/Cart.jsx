import { useEffect, useState } from "react";

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [promo, setPromo] = useState("");
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/api/cart", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => setCart(data))
      .catch(err => {
        console.error("Error loading cart", err);
        setCart({ services: [] });
      });
  }, []);

  const remove = (id) => {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:5000/api/cart/remove/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(() => {
      setCart(prev => ({
        ...prev,
        services: prev.services.filter(s => s._id !== id),
      }));
    });
  };

  const applyPromo = () => {
    if (promo.toUpperCase() === "HEALTH2025") {
      setDiscount(0.20);
      alert("Промокод применен: Скидка 20%");
    } else {
      alert("Промокод не найден");
      setDiscount(0);
    }
  };

  if (!cart) return <div className="profile-page-wrapper"><p style={{color:'white'}}>Загрузка корзины...</p></div>;

  const totalPrice = cart.services.reduce((acc, s) => acc + s.price, 0);
  const finalPrice = totalPrice * (1 - discount);

  return (
    <div className="profile-page-wrapper">
      <div className="card" style={{ color: 'white', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h2 className="gradienttext">Ваша корзина</h2>

        {cart.services.length === 0 ? (
          <p>Корзина пуста. Выберите услуги в каталоге.</p>
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {cart.services.map(s => (
                <div key={s._id} style={{
                  background: 'rgba(255,255,255,0.1)',
                  padding: '15px',
                  borderRadius: '12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <strong style={{ display: 'block' }}>{s.name}</strong>
                    <span style={{ color: '#5995fd' }}>{s.price} BYN</span>
                  </div>
                  <button
                    onClick={() => remove(s._id)}
                    style={{ background: '#ff4b2b', border: 'none', color: 'white', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer' }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)' }} />

            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                placeholder="Введите промокод (HEALTH2025)"
                value={promo}
                onChange={(e) => setPromo(e.target.value)}
                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: 'rgba(255,255,255,0.2)', color: 'white' }}
              />
              <button onClick={applyPromo} className="btn solid" style={{ margin: 0, width: '120px', height: '40px' }}>Применить</button>
            </div>

            <div style={{ textAlign: 'right', marginTop: '10px' }}>
              <p style={{ fontSize: '1.1rem' }}>Сумма: <s>{totalPrice} BYN</s></p>
              <h3 style={{ color: '#5995fd' }}>К оплате: {finalPrice.toFixed(2)} BYN</h3>
              <button className="btn solid" style={{ width: '100%', marginTop: '15px' }}>Оформить запись</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}