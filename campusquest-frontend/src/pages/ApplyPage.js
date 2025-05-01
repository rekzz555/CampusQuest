import React, { useState } from "react";
import axios from "axios";

const ApplyPage = () => {
  const [collegeId, setCollegeId] = useState("");
  const username = localStorage.getItem("username");

  const handleApply = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/apply", { username, college_id: parseInt(collegeId) });
      alert("Applied successfully!");
    } catch (err) {
      alert("Application failed: " + (err.response?.data?.detail || "Error"));
    }
  };

  return (
    <div className="login-wrapper">
      <form onSubmit={handleApply} className="login-form">
        <h2>Apply to College</h2>
        <input type="text" placeholder="College ID" value={collegeId} onChange={(e) => setCollegeId(e.target.value)} required />
        <button type="submit">Apply</button>
      </form>
    </div>
  );
};

export default ApplyPage;
