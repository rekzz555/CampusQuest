import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// 📄 Pages
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ApplicationsPage from "./pages/ApplicationsPage";
import CollegesPage from "./pages/CollegesPage";
import ApplyPage from "./pages/ApplyPage";
import AptitudePage from "./pages/AptitudePage";
import CareerPage from "./pages/CareerPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import NotFoundPage from "./pages/NotFoundPage";

// 🔐 Context
import { AuthProvider } from "./context/AuthContext";

// ⏱️ Inactivity Handler
import SessionTimeout from "./components/SessionTimeout";

// 🎨 Styles
import "./App.css";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <SessionTimeout /> {/* ✅ Auto logout after inactivity */}
        <Routes>
          {/* 🌐 Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* 👤 User-Protected Routes */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/applications" element={<ApplicationsPage />} />
          <Route path="/colleges" element={<CollegesPage />} />
          <Route path="/apply" element={<ApplyPage />} />
          <Route path="/aptitude" element={<AptitudePage />} />
          <Route path="/career" element={<CareerPage />} />

          {/* 🔐 Admin Only */}
          <Route path="/admin/users" element={<AdminUsersPage />} />

          {/* 🚫 Catch-All */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>

        {/* 🔔 Toast Alerts */}
        <ToastContainer position="top-center" autoClose={3000} />
      </Router>
    </AuthProvider>
  );
};

export default App;
