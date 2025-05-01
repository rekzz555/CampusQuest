// 📁 src/pages/CareerPage.js
import React, { useState } from "react";
import useAuthGuard from "../hooks/useAuthGuard";
import "./CareerPage.css";

const streamOptions = ["Science", "Commerce", "Arts", "Any"];
const courseOptions = ["B.Tech", "MBA", "B.Com", "B.Sc", "BA", "MBBS", "LLB", "BA LLB", "BCA", "MCA"];

const careerData = {
  "Science-B.Tech": {
    options: "Software Developer, Testing, Data Analyst",
    job: ["Software Engineer", "Senior Developer", "Team Lead"],
    studies: ["M.Tech", "R&D Engineer", "Senior Engineer"],
  },
  "Science-MBBS": {
    options: "Doctor, Medical Practice",
    job: ["Junior Doctor", "Resident", "Specialist"],
    studies: ["MD/MS", "Surgeon", "Senior Consultant"],
  },
  "Science-B.Sc": {
    options: "Lab Technician, Research Assistant, Scientist",
    job: ["Assistant", "Scientist", "Senior Scientist"],
    studies: ["M.Sc", "Research Lead", "Professor"],
  },
  "Any-BCA": {
    options: "IT Support, Software Testing, Web Development",
    job: ["Tech Support", "QA Analyst", "Full Stack Developer"],
    studies: ["MCA", "MBA (IT)", "System Architect"],
  },
  "Any-MCA": {
    options: "Software Engineer, System Analyst, IT Consultant",
    job: ["Developer", "System Engineer", "Solutions Architect"],
    studies: ["PhD in CS", "Tech Lead", "CTO"],
  },
  "Commerce-B.Com": {
    options: "Accountant, Finance Executive, Banker",
    job: ["Accountant", "Senior Accountant", "Finance Manager"],
    studies: ["CA", "Auditor", "Finance Director"],
  },
  "Commerce-BBA": {
    options: "Marketing, Sales, Business Development",
    job: ["Sales Executive", "Area Manager", "Regional Head"],
    studies: ["MBA", "Product Manager", "VP Sales"],
  },
  "Arts-BA": {
    options: "Civil Services, Journalism, Teaching",
    job: ["Reporter", "Senior Reporter", "Editor"],
    studies: ["MA", "Lecturer", "Professor"],
  },
  "Any-MBA": {
    options: "Manager, Business Analyst, HR",
    job: ["Analyst", "Manager", "Senior Manager"],
    studies: ["PhD/MBA Executive", "Consultant", "Professor"],
  },
  "Any-LLB": {
    options: "Lawyer, Legal Advisor, Corporate Counsel",
    job: ["Junior Lawyer", "Advocate", "Legal Consultant"],
    studies: ["LLM", "Corporate Lawyer", "Legal Head"],
  },
  "Any-BA LLB": {
    options: "Advocate, Legal Consultant, Judicial Services",
    job: ["Junior Lawyer", "Legal Associate", "Senior Advocate"],
    studies: ["LLM", "Corporate Lawyer", "Legal Advisor"],
  },
};

const CareerPage = () => {
  useAuthGuard();

  const [stream, setStream] = useState("");
  const [course, setCourse] = useState("");
  const [selectedPath, setSelectedPath] = useState(null);
  const [pathType, setPathType] = useState("job");

  const handleSubmit = () => {
    const key = `${stream}-${course}`;
    const fallbackKey = `Any-${course}`;

    if (careerData[key]) {
      setSelectedPath(careerData[key]);
    } else if (careerData[fallbackKey]) {
      setSelectedPath(careerData[fallbackKey]);
    } else {
      setSelectedPath({ error: "❌ No pathway found for this selection." });
    }
  };

  return (
    <div className="career-wrapper">
      <div className="career-box">
        <h2>🎓 Explore Your Career Path</h2>

        <div className="dropdowns">
          <select value={stream} onChange={(e) => setStream(e.target.value)}>
            <option value="">Select Stream</option>
            {streamOptions.map((s, i) => (
              <option key={i} value={s}>{s}</option>
            ))}
          </select>

          <select value={course} onChange={(e) => setCourse(e.target.value)}>
            <option value="">Select Course</option>
            {courseOptions.map((c, i) => (
              <option key={i} value={c}>{c}</option>
            ))}
          </select>

          <div className="path-select">
            <label>
              <input
                type="radio"
                value="job"
                checked={pathType === "job"}
                onChange={() => setPathType("job")}
              />
              Job Path
            </label>
            <label>
              <input
                type="radio"
                value="studies"
                checked={pathType === "studies"}
                onChange={() => setPathType("studies")}
              />
              Higher Studies Path
            </label>
          </div>

          <button className="career-btn" onClick={handleSubmit}>
            Show Path
          </button>
        </div>

        {selectedPath && selectedPath.error && (
          <p className="error-msg">{selectedPath.error}</p>
        )}

        {selectedPath && !selectedPath.error && (
          <div className="tree-path">
            <p><strong>🎯 Career Options:</strong> {selectedPath.options}</p>
            <div className="tree-container">
              {(pathType === "job" ? selectedPath.job : selectedPath.studies).map((step, idx) => (
                <div key={idx} className="tree-node">
                  {step}
                  {idx < 2 && <div className="arrow">↓</div>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CareerPage;
