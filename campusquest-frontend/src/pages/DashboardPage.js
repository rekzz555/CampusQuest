// 📁 src/pages/DashboardPage.js
import React from "react";
import { useNavigate } from "react-router-dom";
import useAuthGuard from "../hooks/useAuthGuard";
import "../pages/DashboardPage.css";

const DashboardPage = () => {
  useAuthGuard();
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.setItem("justLoggedOut", "true"); // 👈 Only set flag
    navigate("/"); // 👈 Redirect to home
  };

  return (
    <div className="dashboard-wrapper">
      {/* 📘 Learning Resources */}
      <div className="resource-card">
        <h3>📚 Learning Resources</h3>
        <hr />
        <div className="resource-item">
          <strong>Coursera – University Courses</strong>
          <p>Explore real university content from top institutions.</p>
          <a href="https://www.coursera.org/" target="_blank" rel="noreferrer">Visit Coursera</a>
        </div>
        <div className="resource-item">
          <strong>Khan Academy – Aptitude & Basics</strong>
          <p>Free lessons on maths, logic, aptitude & school subjects.</p>
          <a href="https://www.khanacademy.org/" target="_blank" rel="noreferrer">Go to Khan Academy</a>
        </div>
        <div className="resource-item">
          <strong>GeeksforGeeks – Tech Help</strong>
          <p>Great for coding concepts, DSA & interview prep.</p>
          <a href="https://www.geeksforgeeks.org/" target="_blank" rel="noreferrer">Browse GeeksforGeeks</a>
        </div>
        <div className="resource-item">
          <strong>NPTEL – Indian Lectures</strong>
          <p>Government-backed online lectures from IITs & IIMs.</p>
          <a href="https://nptel.ac.in/" target="_blank" rel="noreferrer">Visit NPTEL</a>
        </div>
        <div className="resource-item">
          <strong>MIT OpenCourseWare</strong>
          <p>Study CS, physics, math & more from MIT for free.</p>
          <a href="https://ocw.mit.edu/" target="_blank" rel="noreferrer">Explore MIT OCW</a>
        </div>
      </div>

      {/* 🎯 Dashboard Center Panel */}
      <div className="main-dashboard-card">
        <h2>Welcome, {username}</h2>
        <p>You're logged in to CampusQuest. Select an option below:</p>

        <div className="dashboard-buttons">
          <button onClick={() => navigate("/aptitude")}>Take Aptitude Test</button>
          <button onClick={() => navigate("/colleges")}>View Colleges</button>
          <button onClick={() => navigate("/applications")}>Track Applications</button>
          <button onClick={() => navigate("/career")}>Explore Career Pathways</button>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {/* 🎥 Video Resources */}
      <div className="resource-card">
        <h3>🎥 Inspirational Videos</h3>
        <hr />
        <div className="resource-item">
          <strong>Choosing a Career Wisely</strong>
          <p>TEDx talk on smart decision-making for students.</p>
          <a href="https://www.youtube.com/watch?v=6zGQSWib32E" target="_blank" rel="noreferrer">Watch Video</a>
        </div>
        <div className="resource-item">
          <strong>Improve Communication</strong>
          <p>Learn how to speak with clarity & confidence.</p>
          <a href="https://www.youtube.com/watch?v=MdZAMSyn_As" target="_blank" rel="noreferrer">Watch Talk</a>
        </div>
        <div className="resource-item">
          <strong>Success by Sandeep Maheshwari</strong>
          <p>One of India's most motivational talks for students.</p>
          <a href="https://www.youtube.com/watch?v=1nzz4e8F3FU" target="_blank" rel="noreferrer">Watch Now</a>
        </div>
        <div className="resource-item">
          <strong>Time Management Skills</strong>
          <p>Simple strategies to organize study & life better.</p>
          <a href="https://www.youtube.com/watch?v=tT89OZ7TNwc" target="_blank" rel="noreferrer">Improve Time</a>
        </div>
        <div className="resource-item">
          <strong>Why Do We Fall – Motivation</strong>
          <p>Powerful video to reignite self-belief and growth.</p>
          <a href="https://www.youtube.com/watch?v=mgmVOuLgFB0" target="_blank" rel="noreferrer">Feel Inspired</a>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
