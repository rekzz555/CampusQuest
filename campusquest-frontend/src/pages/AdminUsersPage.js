import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import { useNavigate } from "react-router-dom";
import "react-confirm-alert/src/react-confirm-alert.css";
import "../pages/AdminUsersPage.css";

const AdminUsersPage = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [applications, setApplications] = useState([]);
  const [scores, setScores] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const currentUsername = localStorage.getItem("username");

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    const hours = date.getHours() % 12 || 12;
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = date.getHours() >= 12 ? "PM" : "AM";
    return `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`;
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:8000/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch {
      toast.error("❌ Failed to load users.");
    }
  };

  const fetchApplications = async () => {
    try {
      const res = await axios.get("http://localhost:8000/admin/applications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications(res.data);
    } catch {
      toast.error("❌ Failed to load applications.");
    }
  };

  const fetchScores = async () => {
    try {
      const res = await axios.get("http://localhost:8000/admin/scores", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setScores(res.data);
    } catch {
      toast.error("❌ Failed to load scores.");
    }
  };

  const handleDelete = (username) => {
    confirmAlert({
      title: "⚠️ Confirm Deletion",
      message: `Are you sure you want to delete '${username}'?`,
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            try {
              await axios.delete(`http://localhost:8000/admin/users/${username}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              toast.success(`✅ Deleted user '${username}'`);
              setUsers((prev) => prev.filter((u) => u.username !== username));
            } catch (err) {
              toast.error("❌ " + (err.response?.data?.detail || "Failed to delete user"));
            }
          },
        },
        {
          label: "Cancel",
          onClick: () => toast.info("❎ Deletion cancelled."),
        },
      ],
    });
  };

  const handleLogout = () => {
    localStorage.clear();
    toast.info("👋 Logged out as admin.");
    navigate("/");
  };

  useEffect(() => {
    fetchUsers();
    fetchApplications();
    fetchScores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="admin-wrapper">
      <div className="admin-header">
        <h2>🛠️ Admin Dashboard</h2>
        <button className="logout-admin-btn" onClick={handleLogout}>Logout</button>
      </div>

      <div className="admin-tabs">
        <button className={activeTab === "users" ? "active" : ""} onClick={() => setActiveTab("users")}>Users</button>
        <button className={activeTab === "applications" ? "active" : ""} onClick={() => setActiveTab("applications")}>Applications</button>
        <button className={activeTab === "scores" ? "active" : ""} onClick={() => setActiveTab("scores")}>Scores</button>
      </div>

      {activeTab === "users" && (
        <div className="tab-panel">
          <h3>👥 All Users</h3>
          {users.length === 0 ? (
            <p>No users found.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, idx) => {
                  const isAdmin = u.role === "admin";
                  const isCurrent = u.username === currentUsername;
                  return (
                    <tr key={idx}>
                      <td>{u.username}</td>
                      <td>{u.email || <i style={{ color: "#ccc" }}>N/A</i>}</td>
                      <td><span className="role-badge">{u.role}</span></td>
                      <td>
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(u.username)}
                          disabled={isAdmin || isCurrent}
                          title={isAdmin ? "Cannot delete admin" : isCurrent ? "Cannot delete yourself" : "Delete user"}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {activeTab === "applications" && (
        <div className="tab-panel">
          <h3>📋 All Applications</h3>
          {applications.length === 0 ? (
            <p>No applications found.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>College</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app, idx) => (
                  <tr key={idx}>
                    <td>{app.username}</td>
                    <td>{app.college_name}</td>
                    <td>{app.status || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {activeTab === "scores" && (
        <div className="tab-panel">
          <h3>🧠 Aptitude Scores</h3>
          {scores.length === 0 ? (
            <p>No scores found.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Score</th>
                  <th>Submitted At</th>
                </tr>
              </thead>
              <tbody>
                {scores.map((s, idx) => (
                  <tr key={idx}>
                    <td>{s.username}</td>
                    <td>{s.score}</td>
                    <td>{formatDate(s.timestamp)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;
