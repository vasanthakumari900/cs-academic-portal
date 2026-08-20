// src/pages/auth/Login.jsx
// Futuristic Developer Dark Mode (Midnight Dark Obsidian) — All logic & functionality preserved.
import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCalendar, FiClock, FiBookOpen, FiStar, FiArrowRight,
  FiShield, FiUser, FiLock, FiChevronRight, FiCheckCircle,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { logStudentLogin } from "../../services/activityLoggerService";
import collegeLogo from "../../assets/college-logo.jpg";
import LiveDateTime from "../../components/common/LiveDateTime";
import PortalScreencastPlayer from "../../components/common/PortalScreencastPlayer";

function generateCaptcha() {
  let code = "";
  for (let i = 0; i < 5; i++) {
    code += Math.floor(Math.random() * 10);
  }
  return code;
}

function getRollRecognition(roll) {
  const clean = roll.trim().toUpperCase();
  if (!clean || clean.length < 7) return null;

  const match = clean.match(/^(24|25|26)E/);
  if (!match) return null;

  const yr = match[1];
  let yearStr = yr === "24" ? "3rd Year" : yr === "25" ? "2nd Year" : "1st Year";

  return {
    year: yearStr,
    full: `${yearStr} UG · B.Sc. Computer Science`,
  };
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

  const rollInfo = getRollRecognition(rollNumber);

  const refreshCaptcha = useCallback(() => {
    setCaptchaCode(generateCaptcha());
    setCaptcha("");
  }, []);

  function formatRoll(value) {
    return value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  }

  function handleDobChange(e) {
    const rawVal = e.target.value;
    let digits = rawVal.replace(/[^\d]/g, "");
    if (digits.length > 8) digits = digits.slice(0, 8);

    let formatted = digits;
    if (digits.length >= 5) {
      formatted = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
    } else if (digits.length >= 3) {
      formatted = `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }
    setDob(formatted);
  }

  function toDisplayDate(dateStr) {
    if (!dateStr) return "";
    const clean = dateStr.trim();
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(clean)) return clean;
    if (/^\d{4}-\d{2}-\d{2}$/.test(clean)) {
      const [y, m, d] = clean.split("-");
      return `${d}/${m}/${y}`;
    }
    return clean;
  }

  async function handleStudentSubmit(e) {
    e.preventDefault();

    if (!/^(24E(29|30)|25E(29|30)|26E(30|31))\d{2}$/i.test(rollNumber.trim())) {
      toast.error("Enter a valid student roll number (e.g. 24E2901, 25E2901, 26E3001, or 26E3101)");
      return;
    }

    const displayDob = toDisplayDate(dob);
    if (!displayDob || !/^\d{2}\/\d{2}\/\d{4}$/.test(displayDob)) {
      toast.error("Please enter or select a valid date of birth (e.g. 15/08/2004)");
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

  const tabBtn = (active) =>
    `flex-1 rounded-lg py-2.5 text-xs font-black uppercase tracking-wider transition-all duration-200 font-heading cursor-pointer ${
      active
        ? "bg-gradient-to-r from-[#06B6D4] to-[#0891B2] text-[#090D16] shadow-[0_0_15px_rgba(6,182,212,0.4)]"
        : "text-slate-400 hover:text-cyan-300 hover:bg-slate-800/60"
    }`;

  const inputCls =
    "w-full rounded-xl border border-slate-700 bg-[#1E293B] px-11 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition-all focus:border-[#06B6D4] focus:ring-2 focus:ring-[#06B6D4]/30";

  function handleDemoSelect(role) {
    const freshCaptcha = generateCaptcha();
    setCaptchaCode(freshCaptcha);
    setCaptcha(freshCaptcha);

    if (role === "student" || role === "admin") {
      setActiveTab("student");
      setRollNumber("24E3006");
      setDob("15/08/2004");
      toast.success(`${role === "admin" ? "Admin" : "Student"} demo credentials loaded! Click Sign In.`);
    } else if (role === "faculty") {
      setActiveTab("faculty");
      setFacultyName("Faculty User");
      setFacultyPassword("password123");
      toast.success("Faculty demo credentials loaded! Click Sign In.");
    }
  }

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-[#090D16] text-[#F3F4F6]">
      {/* Ambient Cyber Obsidian Orbs */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-[#06B6D4]/15 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-32 -right-24 h-[28rem] w-[28rem] rounded-full bg-[#F59E0B]/15 blur-[140px]" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-cyan-500/5 blur-[100px]" />

      {/* Main Content */}
      <div className="relative z-10 flex w-full min-h-screen items-center justify-center px-3 py-6 sm:px-6 lg:px-8">
        <div className="flex w-full max-w-6xl flex-col items-center justify-center gap-6 text-left">

          {/* Top Website Screencast Video Tour */}
          <div className="w-full">
            <PortalScreencastPlayer onSelectDemoRole={handleDemoSelect} />
          </div>

          <div className="flex w-full flex-col lg:flex-row items-center justify-center gap-6 lg:gap-12 text-left">

          {/* Left: Welcome Section (Desktop) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="hidden lg:flex lg:w-1/2 flex-col items-start justify-center"
          >
            <div className="relative">
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
                  className="h-auto w-full max-w-[26rem] object-contain rounded-2xl border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.15)] bg-white p-3"
                />
              </motion.div>

              {/* Title */}
              <h1 className="font-heading text-3xl xl:text-4xl font-extrabold leading-tight text-white flex items-center gap-2">
                <span>CS Academic Portal</span>
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#06B6D4] animate-ping" />
              </h1>

              <p className="mt-1 text-sm xl:text-base text-[#06B6D4] font-bold font-heading">
                Department of Computer Science
              </p>

              <p className="mt-3 text-sm xl:text-base text-slate-300 max-w-md leading-relaxed">
                Your single home for lecture notes, video lessons, question papers, and placement resources — all in one organized, searchable system.
              </p>

              {/* Feature chips */}
              <div className="mt-5 flex flex-wrap gap-2">
                {["Lecture Notes", "Video Lessons", "Question Papers", "Placement Drives"].map((item) => (
                  <span key={item} className="inline-flex items-center gap-1.5 rounded-full bg-[#1E293B] border border-cyan-500/30 px-3 py-1.5 text-[11px] font-bold text-cyan-300 shadow-sm">
                    <FiStar size={10} className="text-[#F59E0B]" />
                    {item}
                  </span>
                ))}
              </div>

              {/* Live Calendar & Digital Clock */}
              <div className="mt-6 w-full max-w-md">
                <LiveDateTime />
              </div>

              {/* Trust strip */}
              <div className="mt-6 flex items-center gap-2 text-[11px] font-semibold text-slate-400">
                <FiShield size={13} className="text-[#F59E0B]" />
                Secure portal · NAAC A++ · University of Madras
              </div>
            </div>
          </motion.div>

          {/* Right: Login Form (Frosted Dark Glass #111827) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ maxWidth: 'var(--fluid-container-sm)' }}
            className="w-full lg:w-1/2 mx-auto"
          >
            {/* Mobile branding */}
            <div className="lg:hidden mb-4 text-center">
              <img
                src={collegeLogo}
                alt="DGVC College Logo"
                className="mx-auto mb-3 h-auto w-full max-w-[22rem] sm:max-w-[24rem] object-contain rounded-2xl border border-cyan-500/30 shadow-md bg-white p-2"
              />
              <h2 style={{ fontSize: 'clamp(1.4rem,3vw,1.875rem)' }} className="font-heading font-extrabold text-white">
                CS Academic Portal
              </h2>
              <p className="mt-0.5 text-xs text-[#06B6D4] font-bold font-heading">
                Department of Computer Science
              </p>
              <div className="mt-3 flex justify-center w-full">
                <LiveDateTime />
              </div>
            </div>

            {/* Login Card - Frosted Dark Glass (#111827 with backdrop-blur) */}
            <div style={{ padding: 'var(--fluid-pad-page)' }} className="rounded-3xl border border-cyan-500/30 bg-[#111827]/80 backdrop-blur-xl shadow-[0_8px_32px_rgba(6,182,212,0.15)] text-left">
              <div className="relative">
                {/* Tab Switcher */}
                <div className="mb-5 flex rounded-xl bg-[#1E293B]/80 p-1 border border-slate-700">
                  <button
                    type="button"
                    onClick={() => { setActiveTab("student"); setCaptcha(""); refreshCaptcha(); }}
                    className={tabBtn(activeTab === "student")}
                  >
                    Student
                  </button>
                  <button
                    type="button"
                    onClick={() => { setActiveTab("faculty"); setCaptcha(""); refreshCaptcha(); }}
                    className={tabBtn(activeTab === "faculty")}
                  >
                    Faculty
                  </button>
                </div>

                {/* Header */}
                <div className="mb-6 text-center">
                  <h2 style={{ fontSize: 'clamp(1.4rem,3vw,1.875rem)' }} className="font-heading font-extrabold text-white">
                    {activeTab === "student" ? "Student Login" : "Faculty Login"}
                  </h2>
                  <p className="mt-1 text-xs text-slate-400">
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
                        <label className="mb-1.5 block text-[11px] font-mono font-bold uppercase tracking-widest text-[#06B6D4]">
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
                            className={`${inputCls} font-mono uppercase tracking-wider`}
                            autoFocus
                          />
                        </div>

                        {/* Real-Time Roll Recognition Pill */}
                        <AnimatePresence>
                          {rollInfo && (
                            <motion.div
                              initial={{ opacity: 0, y: -6, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: -6, scale: 0.95 }}
                              className="mt-2 flex items-center gap-1.5 rounded-xl bg-[#06B6D4]/15 border border-[#06B6D4]/40 px-3 py-1.5 text-[11px] font-extrabold text-cyan-300 shadow-sm backdrop-blur-xs font-mono"
                            >
                              <FiCheckCircle size={13} className="text-[#F59E0B] shrink-0 animate-pulse" />
                              <span>🎓 {rollInfo.full}</span>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <p className="mt-1.5 text-[10px] text-slate-400 font-mono">
                          Formats: 24E2901-24E3060, 25E2901-25E3060, 26E3001-26E3160
                        </p>
                      </div>

                      {/* DOB: Side-by-Side Dual Typing & Prominent Mobile Calendar Button */}
                      <div>
                        <label className="mb-1.5 block text-[11px] font-mono font-bold uppercase tracking-widest text-[#06B6D4]">
                          Date of Birth
                        </label>
                        <div className="flex items-center gap-2">
                          {/* 1. Direct Numeric Keyboard Typing Input Box */}
                          <div className="relative flex-1">
                            <FiCalendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 z-10 pointer-events-none" size={15} />
                            <input
                              type="text"
                              inputMode="numeric"
                              value={dob}
                              onChange={handleDobChange}
                              placeholder="DD/MM/YYYY (Type here)"
                              maxLength={10}
                              className={`${inputCls} font-mono tracking-wider text-white text-xs sm:text-sm`}
                            />
                          </div>

                          {/* 2. Prominent Touch-Friendly Calendar Button for Mobile Phones */}
                          <label className="relative shrink-0 flex items-center justify-center gap-1.5 rounded-xl border border-[#06B6D4]/40 bg-[#1E293B] hover:bg-slate-700 px-3.5 py-3 text-xs font-mono font-bold text-cyan-300 shadow-sm cursor-pointer active:scale-95 transition-all">
                            <FiCalendar size={18} className="text-[#06B6D4]" />
                            <span className="text-[11px]">Calendar</span>
                            <input
                              type="date"
                              max={new Date().toISOString().split("T")[0]}
                              onChange={(e) => {
                                if (e.target.value) {
                                  const [y, m, d] = e.target.value.split("-");
                                  setDob(`${d}/${m}/${y}`);
                                }
                              }}
                              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                            />
                          </label>
                        </div>
                        <p className="mt-1.5 text-[10px] text-slate-400 font-mono">
                          ⌨️ Type <strong className="text-cyan-300">DD/MM/YYYY</strong> or tap <strong className="text-cyan-300">📅 Calendar</strong> button
                        </p>
                      </div>
                    </>
                  )}

                  {/* Faculty Fields */}
                  {activeTab === "faculty" && (
                    <>
                      {/* Faculty Name */}
                      <div>
                        <label className="mb-1.5 block text-[11px] font-mono font-bold uppercase tracking-widest text-[#06B6D4]">
                          Faculty Name
                        </label>
                        <div className="relative">
                          <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 z-10" size={15} />
                          <input
                            value={facultyName}
                            onChange={(e) => setFacultyName(e.target.value.toUpperCase())}
                            placeholder="Enter name in CAPITAL letters"
                            className={inputCls}
                            autoFocus={activeTab === "faculty"}
                          />
                        </div>
                        <p className="mt-1.5 text-[10px] text-slate-400 font-mono">
                          Enter your full name in capital letters
                        </p>
                      </div>

                      {/* Password */}
                      <div>
                        <label className="mb-1.5 block text-[11px] font-mono font-bold uppercase tracking-widest text-[#06B6D4]">
                          Password
                        </label>
                        <div className="relative">
                          <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 z-10" size={15} />
                          <input
                            type="password"
                            value={facultyPassword}
                            onChange={(e) => setFacultyPassword(e.target.value)}
                            placeholder="Enter your password"
                            className={inputCls}
                          />
                        </div>
                        <p className="mt-1.5 text-[10px] text-slate-400 font-mono">
                          Use your assigned password (e.g. DGVC@0001)
                        </p>
                      </div>
                    </>
                  )}

                  {/* CAPTCHA */}
                  <div>
                    <label className="mb-1.5 block text-[11px] font-mono font-bold uppercase tracking-widest text-[#06B6D4]">
                      Enter the captcha
                    </label>
                    <div className="relative">
                      <FiShield className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 z-10" size={15} />
                      <input
                        value={captcha}
                        onChange={(e) => setCaptcha(e.target.value.replace(/[^0-9]/g, "").slice(0, 5))}
                        placeholder="Enter 5-digit code"
                        maxLength={5}
                        inputMode="numeric"
                        className={`${inputCls} font-mono tracking-[0.3em]`}
                      />
                    </div>

                    {/* Captcha display */}
                    <div className="mt-2 flex items-center gap-3 flex-wrap">
                      <div data-testid="captcha-box" className="flex select-none items-center gap-2 rounded-xl border border-cyan-500/30 bg-[#1E293B] px-5 py-3 shadow-inner">
                        <span className="text-xl font-bold tracking-[0.4em] text-cyan-300 font-mono">
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
                        className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-[#1E293B] px-3.5 py-3 text-[11px] font-extrabold text-cyan-300 hover:bg-slate-700 hover:text-white transition-all cursor-pointer font-mono"
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
                    className="group w-full rounded-xl bg-gradient-to-r from-[#06B6D4] via-[#0891B2] to-[#F59E0B] hover:from-[#22D3EE] hover:to-[#FBBF24] px-6 py-3.5 text-sm font-extrabold text-[#090D16] shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-2 font-heading cursor-pointer"
                  >
                    <span className="inline-flex items-center justify-center gap-2 w-full">
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
                          <FiArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </span>
                  </button>
                </form>

                {/* Footer */}
                <p className="mt-5 text-center text-[11px] font-medium text-slate-400">
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
    </div>
  );
}
