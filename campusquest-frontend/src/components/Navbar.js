import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <h2 className="logo">CampusQuest</h2>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/register">Register</Link></li>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/apply">Apply</Link></li>
        <li><Link to="/colleges">Colleges</Link></li>
        <li><Link to="/applications">Applications</Link></li>
        <li><Link to="/admin/users">Admin Users</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
