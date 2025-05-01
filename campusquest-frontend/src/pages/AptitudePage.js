import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { parseQuestionsFromText } from "../utils/parseQuestions";
import useAuthGuard from "../hooks/useAuthGuard";
import "./AptitudePage.css";

const AptitudePage = () => {
  useAuthGuard();

  const [started, setStarted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState("");
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10 * 60);
  const [submitted, setSubmitted] = useState(false);

  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch("/aptitude_questions.txt");
        const text = await res.text();
        const parsed = parseQuestionsFromText(text);
        if (!parsed.length) throw new Error("No questions parsed");
        setQuestions(parsed);
      } catch {
        toast.error("⚠️ Failed to load questions.");
      }
    };
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (!started || timeLeft <= 0) {
      if (timeLeft <= 0) setShowScore(true);
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [started, timeLeft]);

  useEffect(() => {
    if (showScore && username && token && !submitted) {
      setSubmitted(true);

      axios
        .post(
          "http://localhost:8000/aptitude",
          { username, score },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          toast.success("✅ Score submitted successfully!");
        })
        .catch((err) => {
          const errorMsg = err.response?.data?.detail || err.message;
          console.error("❌ Submission error:", errorMsg);
          toast.error(`❌ Failed to submit your score: ${errorMsg}`);
        });
    }
  }, [showScore, username, token, score, submitted]);

  const handleStart = () => setStarted(true);

  const handleNext = () => {
    if (selected === questions[current].answer) {
      setScore((prev) => prev + 1);
    }
    setSelected("");
    if (current + 1 < questions.length) {
      setCurrent((prev) => prev + 1);
    } else {
      setShowScore(true);
    }
  };

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  if (!started) {
    return (
      <div className="apt-container">
        <div className="apt-box">
          <h2>🧠 Ready for the Aptitude Test?</h2>
          <ul>
            <li>Total time: <strong>10 minutes</strong></li>
            <li>Each question has 4 options</li>
            <li>Click <strong>Next</strong> to proceed, no backtracking</li>
            <li>Your score will be shown at the end</li>
          </ul>
          <button className="apt-start" onClick={handleStart}>Start Test</button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return <div className="apt-container">📦 Loading questions...</div>;
  }

  if (showScore) {
    return (
      <div className="apt-container">
        <div className="apt-box">
          <h2>🎉 Test Complete</h2>
          <p>Your Score: {score} / {questions.length}</p>
          <button className="apt-dash-btn" onClick={() => navigate("/dashboard")}>
            ⬅️ Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const q = questions[current];

  return (
    <div className="apt-container">
      <div className="apt-box">
        <div className="apt-header">
          <span className="apt-timer">⏳ Time Left: {formatTime(timeLeft)}</span>
          <h3>Question {current + 1} of {questions.length}</h3>
        </div>

        <div className="apt-question">{q.question}</div>

        <div className="apt-options">
          {q.options.map((opt, idx) => (
            <button
              key={idx}
              className={`apt-option ${selected === opt.label ? "selected" : ""}`}
              onClick={() => setSelected(opt.label)}
            >
              {opt.label}. {opt.text}
            </button>
          ))}
        </div>

        <button
          className="apt-next"
          onClick={handleNext}
          disabled={!selected}
        >
          {current === questions.length - 1 ? "Finish" : "Next"}
        </button>
      </div>
    </div>
  );
};

export default AptitudePage;
