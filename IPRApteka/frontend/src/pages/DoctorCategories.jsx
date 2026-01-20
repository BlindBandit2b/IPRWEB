import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./doctor.css";

export default function DoctorCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);

  const loadCategories = () => {
    fetch("http://localhost:5000/api/categories")
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setCategories(data); })
      .catch(err => console.error("Ошибка:", err));
  };

  useEffect(loadCategories, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:5000/api/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({ name })
    }).then(() => { setName(""); loadCategories(); });
  };

  const handleDelete = (id) => {
    if (window.confirm("Вы уверены, что хотите удалить эту категорию?")) {
      fetch(`http://localhost:5000/api/categories/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      }).then(() => loadCategories());
    }
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    fetch(`http://localhost:5000/api/categories/${editingCategory._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({ name: editingCategory.name })
    }).then(() => {
      setEditingCategory(null);
      loadCategories();
    });
  };

  return (
    <div className="doctor-services-container">
      <div style={{ marginBottom: "20px" }}>
        <Link to="/doctor/services" className="btn">Назад</Link>
      </div>

      <div className="card">
        <h2 className="gradienttext">Управление категориями</h2>

        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <div className="form-field">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Новая категория..."
              required
            />
          </div>
          <button type="submit" className="btn">Добавить</button>
        </form>

        <hr style={{ width: "100%", margin: "30px 0", border: "0.5px solid white" }} />

        <ul style={{ width: "100%", padding: 0 }}>
          {categories.map((cat) => (
            <li key={cat._id} style={{
              background: "rgba(255,255,255,0.1)",
              margin: "10px 0", padding: "15px", borderRadius: "15px",
              display: "flex", justifyContent: "space-between", alignItems: "center"
            }}>
              <span style={{color: "white"}}>{cat.name}</span>
              <div>
                <button className="btn" style={{width: "auto", padding: "0 15px", marginRight: "10px"}}
                        onClick={() => setEditingCategory(cat)}>
                  Править
                </button>
                <button className="btn delete" style={{width: "auto", padding: "0 15px", background: "#ff4b2b"}}
                        onClick={() => handleDelete(cat._id)}>
                  Удалить
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {editingCategory && (
        <div className="modal-overlay" style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000
        }}>
          <div className="card" style={{width: "400px", background: "white", color: "#333"}}>
            <h3 style={{color: "#333"}}>Редактировать категорию</h3>
            <form onSubmit={handleUpdate} style={{width: "100%"}}>
              <input
                style={{border: "1px solid #ccc", color: "#333", marginBottom: "15px"}}
                type="text"
                value={editingCategory.name}
                onChange={e => setEditingCategory({...editingCategory, name: e.target.value})}
              />
              <div style={{display: "flex", gap: "10px"}}>
                <button type="submit" className="btn">Сохранить</button>
                <button type="button" className="btn" style={{background: "#888"}} onClick={() => setEditingCategory(null)}>Отмена</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}