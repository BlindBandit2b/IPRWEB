import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./profile.css";

export default function EditProfilePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    mobile: "",
    address: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/api/profile/me", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error("Не удалось загрузить данные");
        return res.json();
      })
      .then(data => {
        if (data.profile) {
          setFormData({
            firstName: data.profile.firstName || "",
            lastName: data.profile.lastName || "",
            dateOfBirth: data.profile.dateOfBirth ? data.profile.dateOfBirth.split('T')[0] : "",
            mobile: data.profile.mobile || "",
            address: data.profile.address || ""
          });
        }
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:5000/api/profile/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        navigate("/profile");
      } else {
        alert("Ошибка при сохранении");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="profile-page-wrapper"><h2 style={{color: "white"}}>Загрузка...</h2></div>;
  if (error) return <div className="profile-page-wrapper"><h2 style={{color: "white"}}>{error}</h2></div>;

  return (
    <div className="profile-page-wrapper">
      <div className="card">
        <h2 className="gradienttext">Edit Profile</h2>
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <div className="input-group">
            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>Mobile</label>
            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <label>Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <div style={{ marginTop: "20px", display: "flex", gap: "10px", justifyContent: "center" }}>
            <button type="submit" className="btn solid">Save Changes</button>
            <button type="button" onClick={() => navigate("/profile")} className="btn">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}