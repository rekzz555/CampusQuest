import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./App.css";
import axios from "axios";

// ✅ Global Axios Config: Attach token if present
const token = localStorage.getItem("token");
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

