// src/pages/auth/Login.jsx
// Premium split-screen login — brand maroon/gold. All logic preserved.
import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  FiCalendar, FiClock, FiBookOpen, FiStar, FiArrowRight,
  FiShield, FiUser, FiLock, FiChevronRight,
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

  const tabBtn = (active) =>
    `flex-1 rounded-lg py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-200 font-heading ${
      active
        ? "bg-[#4A1620] text-white shadow-[0_2px_8px_rgba(74,22,32,0.3)]"
        : "text-[#7C4B5E] hover:text-[#4A1620] hover:bg-white/60"
    }`;

  const inputCls =
    "w-full rounded-xl border border-[#EDC8D0] dark:border-white/15 bg-white dark:bg-[#22101A] px-11 py-3 text-sm text-[#2A0D13] dark:text-[#F0E2E6] placeholder:text-[#9C6D7F] outline-none transition-all focus:border-[#4A1620] focus:ring-2 focus:ring-[#4A1620]/15";

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-[#FBF7F2] dark:bg-[#190B13]">
      {/* Ambient background orbs */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-[#D97706]/10 blur-[110px]" />
      <div className="pointer-events-none absolute -bottom-32 -right-24 h-[28rem] w-[28rem] rounded-full bg-[#4A1620]/15 blur-[130px]" />

      {/* Main Content */}
      <div className="relative z-10 flex w-full min-h-screen items-center justify-center px-3 py-4 sm:px-6 lg:px-8">
        <div className="flex w-full max-w-6xl flex-col lg:flex-row items-center justify-center gap-6 lg:gap-12 text-left">

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
                  className="h-auto w-full max-w-[26rem] object-contain rounded-2xl border border-[#F0E2E6] shadow-[0_2px_4px_rgba(28,10,16,0.05),0_16px_48px_rgba(28,10,16,0.12)] bg-white p-3"
                />
              </motion.div>

              {/* Title */}
              <h1 className="font-heading text-3xl xl:text-4xl font-bold leading-tight text-[#3A101A] dark:text-[#F3E4E8]">
                CS Academic Portal
              </h1>

              <p className="mt-1 text-sm xl:text-base text-[#7E2238] dark:text-[#F4C266] font-semibold font-heading">
                Department of Computer Science
              </p>

              <p className="mt-3 text-sm xl:text-base text-[#7C4B5E] dark:text-[#D9C2CA] max-w-md leading-relaxed">
                Your single home for lecture notes, video lessons, question papers, and placement resources — all in one organized, searchable system.
              </p>

              {/* Feature chips */}
              <div className="mt-5 flex flex-wrap gap-2">
                {["Lecture Notes", "Video Lessons", "Question Papers", "Placement Drives"].map((item) => (
                  <span key={item} className="inline-flex items-center gap-1.5 rounded-full bg-white dark:bg-[#22101A] border border-[#F0E2E6] dark:border-white/10 px-3 py-1.5 text-[11px] font-semibold text-[#4A1620] dark:text-[#F3E4E8] shadow-[0_1px_2px_rgba(28,10,16,0.04)]">
                    <FiStar size={10} className="text-[#D97706]" />
                    {item}
                  </span>
                ))}
              </div>

              {/* Live Calendar & Digital Clock */}
              <div className="mt-6 w-full max-w-md">
                <LiveDateTime />
              </div>

              {/* Trust strip */}
              <div className="mt-6 flex items-center gap-2 text-[11px] font-semibold text-[#9C6D7F] dark:text-[#C09DAA]">
                <FiShield size={13} className="text-[#D97706]" />
                Secure portal · NAAC A++ · University of Madras
              </div>
            </div>
          </motion.div>

          {/* Right: Login Form */}
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
                className="mx-auto mb-3 h-auto w-full max-w-[22rem] sm:max-w-[24rem] object-contain rounded-2xl border border-[#F0E2E6] shadow-md bg-white p-2"
              />
              <h2 style={{ fontSize: 'clamp(1.4rem,3vw,1.875rem)' }} className="font-heading font-bold text-[#3A101A] dark:text-[#F3E4E8]">
                CS Academic Portal
              </h2>
              <p className="mt-0.5 text-xs text-[#7E2238] dark:text-[#F4C266] font-semibold font-heading">
                Department of Computer Science
              </p>
              <div className="mt-3 flex justify-center w-full">
                <LiveDateTime />
              </div>
            </div>

            {/* Login Card */}
            <div style={{ padding: 'var(--fluid-pad-page)' }} className="rounded-2xl border border-[#F0E2E6]/80 dark:border-white/10 bg-white dark:bg-[#22101A] shadow-[0_2px_4px_rgba(28,10,16,0.05),0_16px_48px_rgba(28,10,16,0.10)] text-left">
              <div className="relative">
                {/* Tab Switcher */}
                <div className="mb-5 flex rounded-xl bg-[#F6E4E8]/60 dark:bg-white/5 p-1 border border-[#F0E2E6] dark:border-white/10">
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
                  <h2 style={{ fontSize: 'clamp(1.4rem,3vw,1.875rem)' }} className="font-heading font-bold text-[#3A101A] dark:text-[#F3E4E8]">
                    {activeTab === "student" ? "Student Login" : "Faculty Login"}
                  </h2>
                  <p className="mt-1 text-xs text-[#9C6D7F] dark:text-[#D9C2CA]">
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
                        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-[#4A1620] dark:text-[#F4C266] font-heading">
                          Roll Number
                        </label>
                        <div className="relative">
                          <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9C6D7F] z-10" size={15} />
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
                        <p className="mt-1.5 text-[10px] text-[#9C6D7F]">
                          Formats: 24E2901-24E3060, 25E2901-25E3060, 26E3001-26E3160
                        </p>
                      </div>

                      {/* DOB */}
                      <div>
                        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-[#4A1620] dark:text-[#F4C266] font-heading">
                          Date of Birth
                        </label>
                        <div className="relative">
                          <FiCalendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9C6D7F] z-10" size={15} />
                          <input
                            type="date"
                            value={dob}
                            onChange={(e) => setDob(e.target.value)}
                            max={new Date().toISOString().split("T")[0]}
                            className={`${inputCls} text-[#2A0D13] dark:text-[#F0E2E6]`}
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
                        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-[#4A1620] dark:text-[#F4C266] font-heading">
                          Faculty Name
                        </label>
                        <div className="relative">
                          <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9C6D7F] z-10" size={15} />
                          <input
                            value={facultyName}
                            onChange={(e) => setFacultyName(e.target.value.toUpperCase())}
                            placeholder="Enter name in CAPITAL letters"
                            className={inputCls}
                            autoFocus={activeTab === "faculty"}
                          />
                        </div>
                        <p className="mt-1.5 text-[10px] text-[#9C6D7F]">
                          Enter your full name in capital letters
                        </p>
                      </div>

                      {/* Password */}
                      <div>
                        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-[#4A1620] dark:text-[#F4C266] font-heading">
                          Password
                        </label>
                        <div className="relative">
                          <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9C6D7F] z-10" size={15} />
                          <input
                            type="password"
                            value={facultyPassword}
                            onChange={(e) => setFacultyPassword(e.target.value)}
                            placeholder="Enter your password"
                            className={inputCls}
                          />
                        </div>
                        <p className="mt-1.5 text-[10px] text-[#9C6D7F]">
                          Use your assigned password (e.g. DGVC@0001)
                        </p>
                      </div>
                    </>
                  )}

                  {/* CAPTCHA */}
                  <div>
                    <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-[#4A1620] dark:text-[#F4C266] font-heading">
                      Enter the captcha
                    </label>
                    <div className="relative">
                      <FiShield className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9C6D7F] z-10" size={15} />
                      <input
                        value={captcha}
                        onChange={(e) => setCaptcha(e.target.value.replace(/[^0-9]/g, "").slice(0, 5))}
                        placeholder="Enter the 5-digit code"
                        maxLength={5}
                        inputMode="numeric"
                        className={`${inputCls} font-mono tracking-[0.3em]`}
                      />
                    </div>

                    {/* Captcha display */}
                    <div className="mt-2 flex items-center gap-3 flex-wrap">
                      <div className="flex select-none items-center gap-2 rounded-xl border border-[#F0E2E6] dark:border-white/10 bg-[#FBF4F5] dark:bg-[#2E1622] px-5 py-3">
                        <span className="text-xl font-bold tracking-[0.4em] text-[#4A1620] dark:text-[#F3E4E8] font-heading">
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
                        className="flex items-center gap-1.5 rounded-xl border border-[#F0E2E6] dark:border-white/15 bg-white dark:bg-[#22101A] px-3.5 py-3 text-[11px] font-semibold text-[#4A1620] dark:text-[#F3E4E8] hover:bg-[#F6E4E8]/60 dark:hover:bg-white/10 transition-all"
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
                    className="group w-full rounded-xl bg-gradient-to-b from-[#61182A] to-[#4A1620] hover:from-[#7E2238] hover:to-[#61182A] px-6 py-3.5 text-sm font-bold text-white shadow-[0_1px_2px_rgba(28,10,16,0.2),0_6px_20px_rgba(74,22,32,0.35)] transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed mt-2 font-heading"
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
                          <FiArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </span>
                  </button>
                </form>

                {/* Footer */}
                <p className="mt-5 text-center text-[11px] font-medium text-[#9C6D7F] dark:text-[#C09DAA]">
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
