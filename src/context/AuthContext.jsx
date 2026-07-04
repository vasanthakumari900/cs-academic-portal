// src/context/AuthContext.jsx
// Student & Faculty login with roll number + date of birth.
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

// Demo student records
const DEMO_STUDENTS = {
  "24E3001": { name: "Arun Kumar", rollNumber: "24E3001", dob: "15/06/2005", year: 1, semester: 1, type: "student" },
  "24E3002": { name: "Priya Sharma", rollNumber: "24E3002", dob: "22/03/2005", year: 1, semester: 1, type: "student" },
  "24E3003": { name: "Rahul Verma", rollNumber: "24E3003", dob: "10/11/2004", year: 2, semester: 3, type: "student" },
  "24E3004": { name: "Sneha Patel", rollNumber: "24E3004", dob: "05/09/2005", year: 1, semester: 1, type: "student" },
  "23E3006": { name: "Divya Nair", rollNumber: "23E3006", dob: "28/07/2004", year: 3, semester: 5, type: "student" },
  "23E3008": { name: "Ananya Iyer", rollNumber: "23E3008", dob: "30/12/2003", year: 3, semester: 5, type: "student" },
};

// Demo faculty records
const DEMO_FACULTY = {
  "FAC001": { name: "M P Sudha", rollNumber: "FAC001", dob: "12/04/1980", subject: "DBMS", type: "faculty" },
  "FAC002": { name: "R Saranya", rollNumber: "FAC002", dob: "25/08/1982", subject: "ASP.NET", type: "faculty" },
  "FAC003": { name: "Dr Dharani", rollNumber: "FAC003", dob: "18/11/1978", subject: "OPERATING SYSTEM", type: "faculty" },
  "FAC004": { name: "V Ponnila", rollNumber: "FAC004", dob: "05/03/1985", subject: "DMT", type: "faculty" },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { name, rollNumber, type, ... }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("ddgdvc_user");
      if (saved) setUser(JSON.parse(saved));
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  function login(rollNumber, dob, loginType = "student") {
    const normalizedRoll = rollNumber.trim().toUpperCase();
    const records = loginType === "faculty" ? DEMO_FACULTY : DEMO_STUDENTS;
    const record = records[normalizedRoll];

    // Flexible: accept any 24E30xx format for students, any FACxxx for faculty
    if (!record) {
      // For students, accept any roll matching 24E30XX pattern
      if (loginType === "student" && /^24E30\d{2}$/i.test(normalizedRoll)) {
        const userData = {
          name: `Student ${normalizedRoll}`,
          rollNumber: normalizedRoll,
          year: 1,
          semester: 1,
          type: "student",
        };
        setUser(userData);
        localStorage.setItem("ddgdvc_user", JSON.stringify(userData));
        return userData;
      }
      // For faculty, accept any FACXXX
      if (loginType === "faculty" && /^FAC\d{3}$/i.test(normalizedRoll)) {
        const userData = {
          name: `Faculty ${normalizedRoll}`,
          rollNumber: normalizedRoll,
          subject: "General",
          type: "faculty",
        };
        setUser(userData);
        localStorage.setItem("ddgdvc_user", JSON.stringify(userData));
        return userData;
      }
      throw new Error("Invalid roll number. Please try again.");
    }

    // Validate DOB
    if (record.dob !== dob.trim()) {
      throw new Error("Date of birth does not match our records.");
    }

    const { dob: _, ...userData } = record;
    setUser(userData);
    localStorage.setItem("ddgdvc_user", JSON.stringify(userData));
    return userData;
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("ddgdvc_user");
  }

  const value = { user, loading, login, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
