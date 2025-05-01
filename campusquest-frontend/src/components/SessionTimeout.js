// 📁 src/components/SessionTimeout.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const INACTIVITY_LIMIT = 10 * 60 * 1000; // 10 minutes

const SessionTimeout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    let timeout;

    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        localStorage.clear();
        toast.info("⏳ Session expired due to inactivity");
        navigate("/");
      }, INACTIVITY_LIMIT);
    };

    // Track all activity events
    const events = ["mousemove", "keydown", "click"];
    events.forEach((event) => window.addEventListener(event, resetTimer));
    resetTimer(); // Start on mount

    return () => {
      clearTimeout(timeout);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [navigate]);

  return null;
};

export default SessionTimeout;
