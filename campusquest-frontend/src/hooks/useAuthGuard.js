import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useAuthGuard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");

    if (!token || !username) {
      alert("⚠️ Session expired. Please login again.");
      navigate("/login");
    }
  }, [navigate]); // ✅ Added navigate to dependencies
};

export default useAuthGuard;
