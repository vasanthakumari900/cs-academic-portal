// src/hooks/useActivityTracker.js
// Custom hook to automatically log student page visits and actions in the background.

import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { logStudentActivity } from "../services/activityLoggerService";

export default function useActivityTracker(pageName, targetItem = "", action = "Viewed") {
  const { user } = useAuth();

  useEffect(() => {
    if (user && user.type === "student") {
      logStudentActivity({
        studentInfo: user,
        pageVisited: pageName,
        targetItem,
        action,
      });
    }
  }, [pageName, targetItem, action, user]);
}
