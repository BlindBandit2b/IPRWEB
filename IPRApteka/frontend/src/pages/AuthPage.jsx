import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./signin.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

export default function AuthPage() {
  const navigate = useNavigate();
  const [isSignUpActive, setSignUpActive] = useState(false);
  const [error, setError] = useState("");

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
    repeatPassword: "",
  });

  const redirectByRole = useCallback(
    (token) => {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));

        localStorage.setItem("token", token);
        localStorage.setItem("role", payload.role || "client");
        localStorage.setItem("username", payload.username || "");

        if (payload.role === "doctor") {
          navigate("/doctor/services", { replace: true });
        } else {
          navigate("/services", { replace: true });
        }
      } catch (err) {
        console.error("Ошибка обработки токена:", err);
        navigate("/services", { replace: true });
      }
    },
    [navigate]
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      redirectByRole(token);
    }
  }, [redirectByRole]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Ошибка входа");
        return;
      }

      redirectByRole(data.token);
    } catch (err) {
      setError("Ошибка сервера");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (registerData.password !== registerData.repeatPassword) {
      setError("Пароли не совпадают");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: registerData.username,
          email: registerData.email,
          password: registerData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Ошибка регистрации");
        return;
      }

      redirectByRole(data.token);
    } catch (err) {
      setError("Ошибка сервера");
    }
  };

  return (
    <div className={`auth-container ${isSignUpActive ? "sign-up-mode" : ""}`}>
      <div className="forms-container">
        <div className="signin-signup">

          <form className="sign-in-form" onSubmit={handleLogin}>
            <h2 className="title">Sign in</h2>
            <div className="input-field">
              <i className="fas fa-envelope"></i>
              <input
                type="email"
                placeholder="Email"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                required
              />
            </div>
            <div className="input-field">
              <i className="fas fa-lock"></i>
              <input
                type="password"
                placeholder="Password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                required
              />
            </div>
            {error && <p className="error" style={{ color: "red", fontSize: "0.8rem" }}>{error}</p>}
            <input type="submit" className="btn solid" value="Login" />
            <p className="social-text">Or Sign in with social platforms</p>
            <div className="social-media">
              <a href="http://localhost:5000/auth/google" className="social-icon">
                <i className="fab fa-google"></i>
              </a>
              <a href="http://localhost:5000/auth/facebook" className="social-icon">
                <i className="fab fa-facebook-f"></i>
              </a>
            </div>
          </form>

          <form className="sign-up-form" onSubmit={handleRegister}>
            <h2 className="title">Sign up</h2>
            <div className="input-field">
              <i className="fas fa-user"></i>
              <input
                type="text"
                placeholder="Username"
                value={registerData.username}
                onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                required
              />
            </div>
            <div className="input-field">
              <i className="fas fa-envelope"></i>
              <input
                type="email"
                placeholder="Email"
                value={registerData.email}
                onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                required
              />
            </div>
            <div className="input-field">
              <i className="fas fa-lock"></i>
              <input
                type="password"
                placeholder="Password"
                value={registerData.password}
                onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                required
              />
            </div>
            <div className="input-field">
              <i className="fas fa-lock"></i>
              <input
                type="password"
                placeholder="Repeat password"
                value={registerData.repeatPassword}
                onChange={(e) => setRegisterData({ ...registerData, repeatPassword: e.target.value })}
                required
              />
            </div>
            {error && <p className="error" style={{ color: "red", fontSize: "0.8rem" }}>{error}</p>}
            <input type="submit" className="btn" value="Sign up" />
          </form>
        </div>
      </div>

      <div className="panels-container">
        <div className="panel left-panel">
          <div className="content">
            <h3>New here?</h3>
            <p>Join our medical community!</p>
            <button className="btn transparent" onClick={() => setSignUpActive(true)}>Sign up</button>
          </div>
          <img src="/images/log2.png" className="image" alt="Login Illustration" />
        </div>
        <div className="panel right-panel">
          <div className="content">
            <h3>One of us?</h3>
            <p>Welcome back! Join us again.</p>
            <button className="btn transparent" onClick={() => setSignUpActive(false)}>Sign in</button>
          </div>
          <img src="/images/register.svg" className="image register" alt="Register Illustration" />
        </div>
      </div>
    </div>
  );
}