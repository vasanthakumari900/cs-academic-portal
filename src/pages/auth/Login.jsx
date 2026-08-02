// src/pages/auth/Login.jsx
// Exact original Login layout & components with Wine Red (#7F011F) and Light Sand (#F5EBD0) theme
import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  FiCalendar, FiClock, FiBookOpen, FiStar, FiArrowRight,
  FiShield, FiUser, FiLock,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { logStudentLogin } from "../../services/activityLoggerService";
import collegeLogo from "../../assets/college-logo.jpg";
import LiveDateTime from "../../components/common/LiveDateTime";

function generateCaptcha() {
  let code = "";
  for (let i = 0; i < 5; i++) {
    code += Math.floor(Math.random() * 10);
  }
  return code;
}

export default function Login() {
  const [activeTab, setActiveTab] = useState("student");
  const [rollNumber, setRollNumber] = useState("");
  const [dob, setDob] = useState("");
  const [facultyName, setFacultyName] = useState("");
  const [facultyPassword, setFacultyPassword] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [captchaCode, setCaptchaCode] = useState(generateCaptcha());
  const [loading, setLoading] = useState(false);
  const { login, facultyLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const refreshCaptcha = useCallback(() => {
    setCaptchaCode(generateCaptcha());
    setCaptcha("");
  }, []);

  function formatRoll(value) {
    return value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  }
  function toDisplayDate(dateStr) {
    if (!dateStr) return "";
    const [y, m, d] = dateStr.split("-");
    return `${d}/${m}/${y}`;
  }

  async function handleStudentSubmit(e) {
    e.preventDefault();

    if (!/^(24E(29|30)|25E(29|30)|26E(30|31))\d{2}$/i.test(rollNumber.trim())) {
      toast.error("Enter a valid student roll number (e.g. 24E2901, 25E2901, 26E3001, or 26E3101)");
      return;
    }

    const displayDob = toDisplayDate(dob);
    if (!displayDob || !/^\d{2}\/\d{2}\/\d{4}$/.test(displayDob)) {
      toast.error("Please select your date of birth");
      return;
    }
    if (captcha.trim() !== captchaCode) {
      toast.error("Captcha does not match. Please try again.");
      refreshCaptcha();
      return;
    }
    setLoading(true);
    try {
      const loginResult = await login(rollNumber, displayDob);
      const userName = loginResult?.name || rollNumber;
      
      // Automatically log student login event in Firestore
      logStudentLogin(loginResult || { rollNumber, dob: displayDob }, "Success");

      toast.success(`Welcome, ${userName}!`);
      navigate(location.state?.from?.pathname || "/student/dashboard", { replace: true });
    } catch (err) {
      logStudentLogin({ rollNumber, dob: displayDob }, "Failed");
      toast.error(err.message);
    } finally { setLoading(false); }
  }

  async function handleFacultySubmit(e) {
    e.preventDefault();

    if (!facultyName.trim()) {
      toast.error("Please enter your faculty name.");
      return;
    }
    if (!facultyPassword.trim()) {
      toast.error("Please enter your password.");
      return;
    }
    if (captcha.trim() !== captchaCode) {
      toast.error("Captcha does not match. Please try again.");
      refreshCaptcha();
      return;
    }
    setLoading(true);
    try {
      const result = await facultyLogin(facultyName, facultyPassword);
      toast.success(`Welcome, ${result.name}!`);
      navigate("/faculty/dashboard", { replace: true });
    } catch (err) {
      toast.error(err.message);
    } finally { setLoading(false); }
  }

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-[#F5EBD0]">
      {/* Main Content */}
      <div className="relative z-10 flex w-full min-h-screen items-center justify-center px-3 py-4 sm:px-6 lg:px-8">
        <div className="flex w-full max-w-6xl flex-col lg:flex-row items-center justify-center gap-6 lg:gap-10 text-left">
          
          {/* Left: Welcome Section (Desktop) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="hidden lg:flex lg:w-1/2 flex-col items-start justify-center"
          >
            {/* Logo */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="mb-3"
            >
              <img
                src={collegeLogo}
                alt="DGVC College Logo"
                className="h-auto w-full max-w-[28rem] xl:max-w-[32rem] object-contain rounded-lg border border-[#E6DAB8] shadow-sm bg-white p-2"
              />
            </motion.div>

            {/* Title */}
            <h1 className="font-sans text-3xl xl:text-4xl font-bold leading-tight text-[#7F011F]">
              CS Academic Portal
            </h1>

            <p className="mt-0.5 text-sm xl:text-base text-[#7F011F] font-semibold">
              Department of Computer Science
            </p>

            <p className="mt-1 text-xs xl:text-sm text-[#6B4F45] max-w-md leading-relaxed">
              Your single home for lecture notes, video lessons, question papers, and placement resources — all in one organized, searchable system.
            </p>

            {/* Feature chips */}
            <div className="mt-3 flex flex-wrap gap-1.5 sm:gap-2">
              {["Lecture Notes", "Video Lessons", "Question Papers", "Placement Drives"].map((item) => (
                <span key={item} className="inline-flex items-center gap-1.5 rounded-full bg-white border border-[#E6DAB8] px-3 py-1 text-[11px] font-semibold text-[#7F011F] shadow-xs">
                  <FiStar size={10} className="text-[#7F011F]" />
                  {item}
                </span>
              ))}
            </div>

            {/* Live Calendar & Digital Clock */}
            <div className="mt-4 w-full max-w-md">
              <LiveDateTime />
            </div>
          </motion.div>

          {/* Right: Login Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md lg:w-1/2"
          >
            {/* Mobile branding */}
            <div className="lg:hidden mb-4 text-center">
              <img
                src={collegeLogo}
                alt="DGVC College Logo"
                className="mx-auto mb-3 h-auto w-full max-w-[22rem] sm:max-w-[24rem] object-contain rounded-lg border border-[#E6DAB8] shadow-sm bg-white p-2"
              />
              <h2 className="font-sans text-2xl font-bold text-[#7F011F]">
                CS Academic Portal
              </h2>
              <p className="mt-0.5 text-xs text-[#7F011F] font-semibold">
                Department of Computer Science
              </p>
              <div className="mt-3 flex justify-center w-full">
                <LiveDateTime />
              </div>
            </div>

            {/* Login Card */}
            <div className="rounded-xl border border-[#E6DAB8] bg-white shadow-md p-5 sm:p-7 text-left">
              <div className="relative">
                {/* Tab Switcher */}
                <div className="mb-4 flex rounded-lg bg-[#F5EBD0] p-1 border border-[#E6DAB8]">
                  <button
                    type="button"
                    onClick={() => { setActiveTab("student"); setCaptcha(""); refreshCaptcha(); }}
                    className={`flex-1 rounded-md py-2 text-xs font-bold uppercase tracking-wider transition-all ${
                      activeTab === "student"
                        ? "bg-[#7F011F] text-white shadow-sm"
                        : "text-[#6B4F45] hover:text-[#7F011F]"
                    }`}
                  >
                    Student
                  </button>
                  <button
                    type="button"
                    onClick={() => { setActiveTab("faculty"); setCaptcha(""); refreshCaptcha(); }}
                    className={`flex-1 rounded-md py-2 text-xs font-bold uppercase tracking-wider transition-all ${
                      activeTab === "faculty"
                        ? "bg-[#7F011F] text-white shadow-sm"
                        : "text-[#6B4F45] hover:text-[#7F011F]"
                    }`}
                  >
                    Faculty
                  </button>
                </div>

                {/* Header */}
                <div className="mb-6 text-center">
                  <h2 className="font-sans text-xl font-bold text-[#7F011F]">
                    {activeTab === "student" ? "Student Login" : "Faculty Login"}
                  </h2>
                  <p className="mt-1 text-xs text-[#6B4F45]">
                    {activeTab === "student"
                      ? "Sign in with your roll number and date of birth"
                      : "Sign in with your name and password"}
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={activeTab === "student" ? handleStudentSubmit : handleFacultySubmit} className="space-y-4">
                  {/* Student Fields */}
                  {activeTab === "student" && (
                    <>
                      {/* Roll Number */}
                      <div>
                        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-[#7F011F]">
                          Roll Number
                        </label>
                        <div className="relative">
                          <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 z-10" size={15} />
                          <input
                            type="text"
                            value={rollNumber}
                            onChange={(e) => setRollNumber(formatRoll(e.target.value))}
                            placeholder="e.g. 24E2901, 25E2901, or 26E3001"
                            maxLength={8}
                            className="w-full rounded-lg border border-[#E6DAB8] bg-[#F5EBD0]/30 px-11 py-3 font-mono text-sm uppercase tracking-wider text-[#7F011F] placeholder:text-[#9E8B76] outline-none transition-all focus:border-[#7F011F] focus:ring-1 focus:ring-[#7F011F]/15 focus:bg-white"
                            autoFocus
                          />
                        </div>
                        <p className="mt-1.5 text-[10px] text-[#6B4F45]">
                          Formats: 24E2901-24E3060, 25E2901-25E3060, 26E3001-26E3160
                        </p>
                      </div>

                      {/* DOB */}
                      <div>
                        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-[#7F011F]">
                          Date of Birth
                        </label>
                        <div className="relative">
                          <FiCalendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 z-10" size={15} />
                          <input
                            type="date"
                            value={dob}
                            onChange={(e) => setDob(e.target.value)}
                            max={new Date().toISOString().split("T")[0]}
                            className="w-full rounded-lg border border-[#E6DAB8] bg-[#F5EBD0]/30 px-11 py-3 text-sm text-[#7F011F] outline-none transition-all focus:border-[#7F011F] focus:ring-1 focus:ring-[#7F011F]/15 focus:bg-white"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* Faculty Fields */}
                  {activeTab === "faculty" && (
                    <>
                      {/* Faculty Name */}
                      <div>
                        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-[#7F011F]">
                          Faculty Name
                        </label>
                        <div className="relative">
                          <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 z-10" size={15} />
                          <input
                            value={facultyName}
                            onChange={(e) => setFacultyName(e.target.value.toUpperCase())}
                            placeholder="Enter name in CAPITAL letters"
                            className="w-full rounded-lg border border-[#E6DAB8] bg-[#F5EBD0]/30 px-11 py-3 text-sm text-[#7F011F] placeholder:text-[#9E8B76] outline-none transition-all focus:border-[#7F011F] focus:ring-1 focus:ring-[#7F011F]/15 focus:bg-white"
                            autoFocus={activeTab === "faculty"}
                          />
                        </div>
                        <p className="mt-1.5 text-[10px] text-[#6B4F45]">
                          Enter your full name in capital letters
                        </p>
                      </div>

                      {/* Password */}
                      <div>
                        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-[#7F011F]">
                          Password
                        </label>
                        <div className="relative">
                          <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 z-10" size={15} />
                          <input
                            type="password"
                            value={facultyPassword}
                            onChange={(e) => setFacultyPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="w-full rounded-lg border border-[#E6DAB8] bg-[#F5EBD0]/30 px-11 py-3 text-sm text-[#7F011F] placeholder:text-[#9E8B76] outline-none transition-all focus:border-[#7F011F] focus:ring-1 focus:ring-[#7F011F]/15 focus:bg-white"
                          />
                        </div>
                        <p className="mt-1.5 text-[10px] text-[#6B4F45]">
                          Use your assigned password (e.g. DGVC@0001)
                        </p>
                      </div>
                    </>
                  )}

                  {/* CAPTCHA */}
                  <div>
                    <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-[#7F011F]">
                      Enter the captcha
                    </label>
                    <div className="relative">
                      <FiShield className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 z-10" size={15} />
                      <input
                        value={captcha}
                        onChange={(e) => setCaptcha(e.target.value.replace(/[^0-9]/g, "").slice(0, 5))}
                        placeholder="Enter the 5-digit code"
                        maxLength={5}
                        inputMode="numeric"
                        className="w-full rounded-lg border border-[#E6DAB8] bg-[#F5EBD0]/30 px-11 py-3 font-mono text-sm tracking-[0.3em] text-[#7F011F] placeholder:text-[#9E8B76] placeholder:tracking-wider outline-none transition-all focus:border-[#7F011F] focus:ring-1 focus:ring-[#7F011F]/15 focus:bg-white"
                      />
                    </div>

                    {/* Captcha display */}
                    <div className="mt-2 flex items-center gap-3">
                      <div className="flex select-none items-center gap-2 rounded-lg border border-[#E6DAB8] bg-[#F5EBD0] px-5 py-3">
                        <span className="text-xl font-bold tracking-[0.4em] text-[#7F011F]">
                          {captchaCode.split("").map((d, i) => (
                            <span
                              key={i}
                              className="inline-block"
                              style={{
                                transform: `rotate(${(i - 2) * 3}deg)`,
                                opacity: 0.95 - i * 0.04,
                              }}
                            >
                              {d}
                            </span>
                          ))}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={refreshCaptcha}
                        className="flex items-center gap-1.5 rounded-lg border border-[#E6DAB8] bg-white px-3.5 py-3 text-[11px] font-semibold text-[#7F011F] hover:bg-[#F5EBD0] transition-all"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="23 4 23 10 17 10" />
                          <polyline points="1 20 1 14 7 14" />
                          <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
                        </svg>
                        Refresh
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-lg bg-[#7F011F] hover:bg-[#660119] px-6 py-3.5 text-sm font-bold text-white shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                  >
                    <span className="inline-flex items-center gap-2">
                      {loading ? (
                        <>
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Verifying…
                        </>
                      ) : (
                        <>
                          {activeTab === "student" ? "Access Student Portal" : "Access Faculty Portal"}
                          <FiArrowRight size={16} />
                        </>
                      )}
                    </span>
                  </button>
                </form>

                {/* Footer */}
                <p className="mt-5 text-center text-[11px] font-medium text-[#6B4F45]">
                  {activeTab === "student"
                    ? "Enter your roll number, date of birth, and the captcha to sign in"
                    : "Enter your name, password, and the captcha to sign in"}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
