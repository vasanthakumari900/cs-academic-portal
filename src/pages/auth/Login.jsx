// src/pages/auth/Login.jsx
import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  FiCalendar, FiClock, FiBookOpen, FiStar, FiArrowRight,
  FiShield, FiUser, FiLock,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import collegeLogo from "../../assets/college-logo.jpg";

function generateCaptcha() {
  let code = "";
  for (let i = 0; i < 5; i++) {
    code += Math.floor(Math.random() * 10);
  }
  return code;
}

function LiveClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const dayName = days[now.getDay()];
  const dateStr = `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
  const timeStr = now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  return (
    <div className="inline-flex items-center gap-3 sm:gap-4 text-sm sm:text-base font-semibold text-[#4B5563]">
      <span className="flex items-center gap-2 text-[#0F4C81]"><FiCalendar size={16} /> {dayName}, {dateStr}</span>
      <span className="text-slate-300">|</span>
      <span className="flex items-center gap-2 font-mono tracking-wider text-[#0F4C81]"><FiClock size={16} /> {timeStr}</span>
    </div>
  );
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
      toast.success(`Welcome, ${userName}!`);
      navigate(location.state?.from?.pathname || "/student/dashboard", { replace: true });
    } catch (err) {
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
    <div className="relative flex min-h-screen overflow-hidden bg-[#F8FAFC]">
      {/* Main Content */}
      <div className="relative z-10 flex w-full min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex w-full max-w-6xl flex-col lg:flex-row items-center gap-8 lg:gap-12 text-left">
          
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
              className="mb-6"
            >
              <img
                src={collegeLogo}
                alt="DGVC College Logo"
                className="h-auto w-[32rem] object-contain rounded-lg border border-[#E5E7EB] shadow-sm"
              />
            </motion.div>

            {/* Title */}
            <h1 className="font-sans text-4xl xl:text-5xl font-bold leading-tight text-[#0F4C81]">
              CS Academic Portal
            </h1>

            <p className="mt-3 text-base xl:text-lg text-[#0F4C81] font-semibold">
              Department of Computer Science
            </p>

            <p className="mt-2 text-sm text-[#4B5563] max-w-md leading-relaxed">
              Your single home for lecture notes, video lessons, question papers, and placement resources — all in one organized, searchable system.
            </p>

            {/* Feature chips */}
            <div className="mt-8 flex flex-wrap gap-2">
              {["Lecture Notes", "Video Lessons", "Question Papers", "Placement Drives"].map((item) => (
                <span key={item} className="inline-flex items-center gap-1.5 rounded-full bg-white border border-[#E5E7EB] px-3.5 py-1.5 text-[11px] font-semibold text-[#4B5563] shadow-sm">
                  <FiStar size={10} className="text-[#1E88E5]" />
                  {item}
                </span>
              ))}
            </div>

            {/* Clock */}
            <div className="mt-10 rounded-xl bg-white border border-[#E5E7EB] px-6 py-4 shadow-sm">
              <LiveClock />
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
            <div className="lg:hidden mb-6 text-center">
              <img
                src={collegeLogo}
                alt="DGVC College Logo"
                className="mx-auto mb-4 h-auto w-full max-w-[20rem] object-contain rounded-lg border border-[#E5E7EB] shadow-sm"
              />
              <h2 className="font-sans text-2xl font-bold text-[#0F4C81]">
                CS Academic Portal
              </h2>
              <p className="mt-1 text-xs text-[#0F4C81] font-semibold">
                Department of Computer Science
              </p>
              <div className="mt-4 flex justify-center">
                <div className="rounded-xl bg-white border border-[#E5E7EB] px-4 py-2 shadow-sm">
                  <LiveClock />
                </div>
              </div>
            </div>

            {/* Login Card */}
            <div className="rounded-xl border border-[#E5E7EB] bg-white shadow-sm p-8 sm:p-10 text-left">
              <div className="relative">
                {/* Tab Switcher */}
                <div className="mb-6 flex rounded-lg bg-slate-100 p-1 border border-[#E5E7EB]">
                  <button
                    type="button"
                    onClick={() => { setActiveTab("student"); setCaptcha(""); refreshCaptcha(); }}
                    className={`flex-1 rounded-md py-2 text-xs font-bold uppercase tracking-wider transition-all ${
                      activeTab === "student"
                        ? "bg-[#0F4C81] text-white shadow-sm"
                        : "text-[#6B7280] hover:text-[#4B5563]"
                    }`}
                  >
                    Student
                  </button>
                  <button
                    type="button"
                    onClick={() => { setActiveTab("faculty"); setCaptcha(""); refreshCaptcha(); }}
                    className={`flex-1 rounded-md py-2 text-xs font-bold uppercase tracking-wider transition-all ${
                      activeTab === "faculty"
                        ? "bg-[#0F4C81] text-white shadow-sm"
                        : "text-[#6B7280] hover:text-[#4B5563]"
                    }`}
                  >
                    Faculty
                  </button>
                </div>

                {/* Header */}
                <div className="mb-6 text-center">
                  <h2 className="font-sans text-xl font-bold text-[#0F4C81]">
                    {activeTab === "student" ? "Student Login" : "Faculty Login"}
                  </h2>
                  <p className="mt-1 text-xs text-[#6B7280]">
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
                        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-[#6B7280]">
                          Roll Number
                        </label>
                        <div className="relative">
                          <FiBookOpen className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 z-10" size={15} />
                          <input
                            value={rollNumber}
                            onChange={(e) => setRollNumber(formatRoll(e.target.value))}
                            placeholder="e.g. 24E2901"
                            maxLength={7}
                            className="w-full rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] px-11 py-3 font-mono text-sm tracking-wider text-[#0F4C81] placeholder:text-[#6B7280]/60 outline-none transition-all focus:border-[#0F4C81] focus:ring-1 focus:ring-[#0F4C81]/15 focus:bg-white"
                            autoFocus={activeTab === "student"}
                          />
                        </div>
                        <p className="mt-1.5 text-[10px] text-[#6B7280]">
                          24E29xx (3rd Yr A) · 24E30xx (3rd Yr B) · 25E29xx (2nd Yr A) · 25E30xx (2nd Yr B) · 26E30xx (1st Yr A) · 26E31xx (1st Yr B)
                        </p>
                      </div>

                      {/* Date of Birth */}
                      <div>
                        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-[#6B7280]">
                          Date of Birth
                        </label>
                        <div className="relative">
                          <FiCalendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 z-10" size={15} />
                          <input
                            type="date"
                            value={dob}
                            onChange={(e) => setDob(e.target.value)}
                            max={new Date().toISOString().split("T")[0]}
                            className="w-full rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] px-11 py-3 text-sm text-[#0F4C81] outline-none transition-all focus:border-[#0F4C81] focus:ring-1 focus:ring-[#0F4C81]/15 focus:bg-white"
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
                        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-[#6B7280]">
                          Faculty Name
                        </label>
                        <div className="relative">
                          <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 z-10" size={15} />
                          <input
                            value={facultyName}
                            onChange={(e) => setFacultyName(e.target.value.toUpperCase())}
                            placeholder="Enter name in CAPITAL letters"
                            className="w-full rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] px-11 py-3 text-sm text-[#0F4C81] placeholder:text-[#6B7280]/60 outline-none transition-all focus:border-[#0F4C81] focus:ring-1 focus:ring-[#0F4C81]/15 focus:bg-white"
                            autoFocus={activeTab === "faculty"}
                          />
                        </div>
                        <p className="mt-1.5 text-[10px] text-[#6B7280]">
                          Enter your full name in capital letters
                        </p>
                      </div>

                      {/* Password */}
                      <div>
                        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-[#6B7280]">
                          Password
                        </label>
                        <div className="relative">
                          <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 z-10" size={15} />
                          <input
                            type="password"
                            value={facultyPassword}
                            onChange={(e) => setFacultyPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="w-full rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] px-11 py-3 text-sm text-[#0F4C81] placeholder:text-[#6B7280]/60 outline-none transition-all focus:border-[#0F4C81] focus:ring-1 focus:ring-[#0F4C81]/15 focus:bg-white"
                          />
                        </div>
                        <p className="mt-1.5 text-[10px] text-[#6B7280]">
                          Use your assigned password (e.g. DGVC@0001)
                        </p>
                      </div>
                    </>
                  )}

                  {/* CAPTCHA */}
                  <div>
                    <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-[#6B7280]">
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
                        className="w-full rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] px-11 py-3 font-mono text-sm tracking-[0.3em] text-[#0F4C81] placeholder:text-[#6B7280]/60 placeholder:tracking-wider outline-none transition-all focus:border-[#0F4C81] focus:ring-1 focus:ring-[#0F4C81]/15 focus:bg-white"
                      />
                    </div>

                    {/* Captcha display */}
                    <div className="mt-2 flex items-center gap-3">
                      <div className="flex select-none items-center gap-2 rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] px-5 py-3">
                        <span className="text-xl font-bold tracking-[0.4em] text-[#0F4C81]">
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
                        className="flex items-center gap-1.5 rounded-lg border border-[#E5E7EB] bg-white px-3.5 py-3 text-[11px] font-semibold text-[#4B5563] hover:bg-[#F8FAFC] transition-all"
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
                    className="w-full rounded-lg bg-[#0F4C81] hover:bg-[#1E88E5] px-6 py-3.5 text-sm font-bold text-white shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
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
                <p className="mt-5 text-center text-[11px] font-medium text-[#6B7280]">
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
