// 📁 src/pages/LoginPage.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../pages/LoginPage.css";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // 🔐 Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token) {
      if (role === "admin") {
        navigate("/admin/users");
      } else {
        navigate("/dashboard");
      }
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);

    try {
      const res = await axios.post("http://localhost:8000/admin/login", formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      const { access_token, role } = res.data;

      // ✅ Store auth details
      localStorage.setItem("token", access_token);
      localStorage.setItem("username", username);
      localStorage.setItem("role", role);
      axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;

      toast.success("✅ Logged in successfully!");

      // 🔄 Redirect based on role
      if (role === "admin") {
        navigate("/admin/users");
      } else {
        navigate("/dashboard");
      }

    } catch (err) {
      toast.error("❌ Login failed: " + (err.response?.data?.detail || "Unknown error"));
    }
  };

  return (
    <div className="auth-wrapper">
      <form onSubmit={handleLogin} className="auth-box">
        <h2>CampusQuest Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
