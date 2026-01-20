import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./doctor.css";

export default function DoctorServicesPage() {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({ name: "", price: "", description: "", category: "" });

  const [editingService, setEditingService] = useState(null);

  function loadData() {
    const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };

    fetch(`http://localhost:5000/services/doctor?search=${search}`, { headers })
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setServices(data); });

    fetch(`http://localhost:5000/api/categories`, { headers })
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setCategories(data); });
  }

  useEffect(loadData, [search]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();

    const isEditing = !!editingService;
    const url = isEditing
      ? `http://localhost:5000/services/doctor/${editingService._id}`
      : "http://localhost:5000/services/doctor";

    const method = isEditing ? "PUT" : "POST";

    fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(form)
    }).then(res => {
      if (res.ok) {
        setForm({ name: "", price: "", description: "", category: "" });
        setEditingService(null);
        loadData();
      }
    });
  }

  function startEdit(service) {
    setEditingService(service);
    setForm({
      name: service.name,
      price: service.price,
      description: service.description,
      category: service.category?._id || ""
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function deleteService(id) {
    if (window.confirm("Удалить услугу?")) {
      fetch(`http://localhost:5000/services/doctor/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }).then(() => loadData());
    }
  }

  return (
    <div className="profile-page-wrapper">
      <header className="page-header">
          <Link to="/categories" className="login-btn" style={{textDecoration: 'none'}}>Категории</Link>
          <Link to="/profile" className="login-btn" style={{textDecoration: 'none'}}>Профиль</Link>
      </header>

      <div className="card">
          <div className="left-container">
            <h3 className="gradienttext">
              {editingService ? "Редактирование" : "Добавление"} услуги
            </h3>

            <form onSubmit={handleSubmit}>
              <input name="name" placeholder="Название" value={form.name} onChange={handleChange} required />

              <select name="category" value={form.category} onChange={handleChange} required
                      style={{ width: "100%", padding: "10px", borderRadius: "10px", marginBottom: "10px", background: "rgba(255,255,255,0.1)", color: "white" }}>
                <option value="" style={{color: "black"}}>Выберите категорию</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id} style={{color: "black"}}>{cat.name}</option>
                ))}
              </select>

              <input name="price" type="number" placeholder="Цена" value={form.price} onChange={handleChange} required />
              <textarea name="description" placeholder="Описание" value={form.description} onChange={handleChange} required />

              <button className="btn">{editingService ? "Сохранить изменения" : "Добавить"}</button>
              {editingService && (
                <button type="button" className="btn" style={{background: "#888", marginTop: "5px"}}
                        onClick={() => {setEditingService(null); setForm({name:"", price:"", description:"", category:""})}}>
                  Отмена
                </button>
              )}
            </form>
          </div>

          <div className="right-container">
            <input placeholder="Поиск..." value={search} onChange={e => setSearch(e.target.value)} style={{ marginBottom: "20px" }} />

            <ul style={{ padding: 0 }}>
              {services.map(s => (
                <li key={s._id} style={{ listStyle: "none", background: "rgba(255,255,255,0.1)", padding: "15px", borderRadius: "15px", marginBottom: "10px" }}>
                  <strong>{s.name}</strong>
                  <span style={{ fontSize: "0.8em", marginLeft: "10px", color: "#ccc" }}>
                    ({s.category?.name || "Без категории"})
                  </span>
                  <br />
                  <span style={{ fontSize: "1.1em" }}>{s.price} руб.</span>

                  <div style={{marginTop: "10px", display: "flex", gap: "10px"}}>
                    <button className="btn" style={{padding: "5px 15px", fontSize: "0.8em"}}
                            onClick={() => startEdit(s)}>Изменить</button>
                    <button className="btn delete" style={{padding: "5px 15px", fontSize: "0.8em"}}
                            onClick={() => deleteService(s._id)}>Удалить</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
    </div>
  );
}