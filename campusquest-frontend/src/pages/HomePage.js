import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../pages/HomePage.css";
import logo from "../assets/campusquest-logo.png";

const HomePage = () => {
  const navigate = useNavigate();

  // 🔐 Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }

    // ✅ Show toast if redirected after logout
    const justLoggedOut = sessionStorage.getItem("justLoggedOut");
    if (justLoggedOut) {
      toast.info("👋 Logged out successfully.");
      sessionStorage.removeItem("justLoggedOut");
    }
  }, [navigate]);

  return (
    <div className="home-container">
      <img src={logo} alt="CampusQuest Logo" className="home-logo" />
      <h1 className="home-title">CampusQuest</h1>
      <p className="home-subtitle">Your gateway to smarter college & career decisions</p>

      <div className="home-buttons">
        <button className="home-button" onClick={() => navigate("/register")}>
          Register
        </button>
        <button className="home-button" onClick={() => navigate("/login")}>
          Login
        </button>
      </div>

      <div className="founder-section">
        <h2>Message from the Founder</h2>
        <p>
          Hi, I'm <strong>Mihir Thakkar</strong>. I created <strong>CampusQuest</strong> not just as a project, but as a mission — to help students like you
          make more confident and informed career and college decisions.
          <br /><br />
          This platform is a result of countless hours of dedication, research, and passion. It’s designed with real students in mind, giving you insights and tools I wish I had.
          <br /><br />
          From one student to another, this is a journey — and I’m constantly refining it to serve you better.<br />
          Let’s make the right choice, together.
        </p>
      </div>
    </div>
  );
};

export default HomePage;
