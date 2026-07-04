// src/pages/student/StudentDashboard.jsx
// Student dashboard — shows E-Content (videos) directly from the dashboard.
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function StudentDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/student/videos", { replace: true });
  }, [navigate]);

  return null;
}
