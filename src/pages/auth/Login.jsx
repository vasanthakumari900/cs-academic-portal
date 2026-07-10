// src/pages/auth/Login.jsx
// Awwwards-inspired premium university login page with glassmorphism and animated gradient background
import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  FiCalendar, FiClock, FiBookOpen, FiStar, FiArrowRight,
  FiShield,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import collegeLogo from "../../assets/college-logo.jpg";

// ─── Generate 5 random digits ───
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
    <div className="inline-flex items-center gap-3 sm:gap-4 text-sm sm:text-base font-medium text-white/70">
      <span className="flex items-center gap-2"><FiCalendar size={16} /> {dayName}, {dateStr}</span>
      <span className="text-white/20">|</span>
      <span className="flex items-center gap-2 font-mono tracking-wider"><FiClock size={16} /> {timeStr}</span>
    </div>
  );
}

// ─── Floating Orb Component ───
function FloatingOrb({ className, size, color, delay, duration, x, y }) {
  return (
    <motion.div
      className={`pointer-events-none absolute rounded-full blur-3xl ${className}`}
      style={{ width: size, height: size, background: color }}
      animate={{
        x: [0, x, 0],
        y: [0, y, 0],
        scale: [1, 1.15, 1],
        opacity: [0.3, 0.5, 0.3],
      }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

export default function Login() {
  const [rollNumber, setRollNumber] = useState("");
  const [dob, setDob] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [captchaCode, setCaptchaCode] = useState(generateCaptcha());
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
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

  async function handleSubmit(e) {
    e.preventDefault();

    if (!/^(24E(29|30)|25E(29|30))\d{2}$/i.test(rollNumber.trim())) {
      toast.error("Enter a valid student roll number (e.g. 24E2901, 24E3001, 25E2901, or 25E3001)");
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

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-gray-950">
      {/* ─── Animated Gradient Background ─── */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/40 via-violet-700/30 to-cyan-600/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-gray-950/60 via-transparent to-transparent" />

      {/* Floating Orbs */}
      <FloatingOrb size="600px" color="radial-gradient(circle, rgba(37,99,235,0.25), transparent)" delay={0} duration={12} x={80} y={-60} className="top-[-10%] left-[-5%]" />
      <FloatingOrb size="500px" color="radial-gradient(circle, rgba(124,58,237,0.2), transparent)" delay={2} duration={15} x={-60} y={80} className="bottom-[-5%] right-[-5%]" />
      <FloatingOrb size="400px" color="radial-gradient(circle, rgba(6,182,212,0.18), transparent)" delay={4} duration={10} x={70} y={50} className="top-[40%] left-[60%]" />
      <FloatingOrb size="350px" color="radial-gradient(circle, rgba(37,99,235,0.15), transparent)" delay={1} duration={14} x={-50} y={-70} className="top-[60%] left-[10%]" />
      <FloatingOrb size="250px" color="radial-gradient(circle, rgba(124,58,237,0.12), transparent)" delay={3} duration={11} x={40} y={-40} className="top-[15%] right-[25%]" />

      {/* Subtle Grid Overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* ─── Main Content ─── */}
      <div className="relative z-10 flex w-full min-h-screen items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex w-full max-w-6xl flex-col lg:flex-row items-center gap-8 lg:gap-12">
          
          {/* ─── Left: Welcome Section (Desktop) / Top (Mobile) ─── */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="hidden lg:flex lg:w-1/2 flex-col items-start justify-center text-white"
          >
            {/* Logo */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 150, delay: 0.15 }}
              className="mb-6"
            >
              <div className="relative">
                <div className="absolute -inset-6 rounded-full bg-white/5 blur-[40px]" />
                <img
                  src={collegeLogo}
                  alt="DGVC College Logo"
                  className="relative h-auto w-[28rem] object-contain drop-shadow-2xl brightness-110"
                />
              </div>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.6 }}
              className="font-display text-4xl xl:text-5xl font-bold leading-tight"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-purple-200 to-cyan-200">
                CS Academic Portal
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="mt-3 text-base xl:text-lg text-white/60 font-medium"
            >
              Department of Computer Science
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.6 }}
              className="mt-2 text-sm text-white/40 max-w-md leading-relaxed"
            >
              Your single home for lecture notes, video lessons, question papers, and placement resources — all in one organized, searchable system.
            </motion.p>

            {/* Feature chips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.6 }}
              className="mt-8 flex flex-wrap gap-2"
            >
              {["Lecture Notes", "Video Lessons", "Q Papers", "Placements"].map((item) => (
                <span key={item} className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 px-3.5 py-1.5 text-[11px] font-semibold text-white/70 hover:bg-white/15 hover:text-white/90 transition-all">
                  <FiStar size={10} className="text-indigo-300" />
                  {item}
                </span>
              ))}
            </motion.div>

            {/* Clock */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65, duration: 0.6 }}
              className="mt-10 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 px-6 py-4"
            >
              <LiveClock />
            </motion.div>
          </motion.div>

          {/* ─── Right: Login Form ─── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full max-w-md lg:w-1/2"
          >
            {/* Mobile-only top branding */}
            <div className="lg:hidden mb-6 text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mb-4"
              >
                <img
                  src={collegeLogo}
                  alt="DGVC College Logo"
                  className="mx-auto h-auto w-80 object-contain drop-shadow-2xl brightness-110"
                />
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="font-display text-2xl font-bold text-white"
              >
                CS Academic Portal
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-1 text-xs text-white/50"
              >
                Department of Computer Science
              </motion.p>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-4"
              >
                <LiveClock />
              </motion.div>
            </div>

            {/* Glassmorphism Card */}
            <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-white/10 backdrop-blur-2xl shadow-[0_8px_40px_rgba(0,0,0,0.3)] p-8 sm:p-10">
              {/* Glass shine overlay */}
              <div className="pointer-events-none absolute -top-40 -right-40 h-80 w-80 rounded-full bg-white/5 blur-[80px]" />
              <div className="pointer-events-none absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-indigo-500/5 blur-[80px]" />

              <div className="relative">
                {/* Student Login Header */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 text-center"
                >
                  <h2 className="font-display text-xl font-bold text-white">Student Login</h2>
                  <p className="mt-1 text-xs text-white/50">Sign in with your roll number and date of birth</p>
                </motion.div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Roll Number */}
                  <div>
                    <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-white/60">
                      Roll Number
                    </label>
                    <div className="relative group">
                      <FiBookOpen className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-300/70 group-focus-within:text-indigo-300 z-10 transition-colors" size={15} />
                      <input
                        value={rollNumber}
                        onChange={(e) => setRollNumber(formatRoll(e.target.value))}
                        placeholder="e.g. 24E2901"
                        maxLength={7}
                        className="w-full rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm px-11 py-3 font-mono text-sm tracking-wider text-white placeholder:text-white/30 outline-none transition-all focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-400/20 focus:bg-white/15"
                        autoFocus
                      />
                    </div>
                    <p className="mt-1.5 text-[10px] font-medium text-white/40">
                      24E29xx (3rd Yr A) · 24E30xx (3rd Yr B) · 25E29xx (2nd Yr A) · 25E30xx (2nd Yr B)
                    </p>
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-white/60">
                      Date of Birth
                    </label>
                    <div className="relative group">
                      <FiCalendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-300/70 group-focus-within:text-indigo-300 z-10 transition-colors" size={15} />
                      <input
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        max={new Date().toISOString().split("T")[0]}
                        className="w-full rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm px-11 py-3 text-sm text-white outline-none transition-all focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-400/20 focus:bg-white/15 [color-scheme:dark]"
                      />
                    </div>
                    <p className="mt-1.5 text-[10px] font-medium text-white/40">
                      Select your date of birth
                    </p>
                  </div>

                  {/* CAPTCHA */}
                  <div>
                    <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-white/60">
                      Enter the captcha
                    </label>
                    <div className="relative group">
                      <FiShield className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-300/70 group-focus-within:text-indigo-300 z-10 transition-colors" size={15} />
                      <input
                        value={captcha}
                        onChange={(e) => setCaptcha(e.target.value.replace(/[^0-9]/g, "").slice(0, 5))}
                        placeholder="Enter the 5-digit code"
                        maxLength={5}
                        inputMode="numeric"
                        className="w-full rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm px-11 py-3 font-mono text-sm tracking-[0.3em] text-white placeholder:text-white/30 placeholder:tracking-wider outline-none transition-all focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-400/20 focus:bg-white/15"
                      />
                    </div>

                    {/* Captcha display */}
                    <div className="mt-2 flex items-center gap-3">
                      <div className="flex select-none items-center gap-2 rounded-xl border border-white/15 bg-white/10 backdrop-blur-sm px-5 py-3">
                        <span className="text-xl font-bold tracking-[0.4em] text-cyan-300 drop-shadow-lg">
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
                        className="flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/5 backdrop-blur-sm px-3.5 py-3 text-[11px] font-semibold text-white/60 hover:text-white/80 hover:bg-white/10 hover:border-white/30 transition-all"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="23 4 23 10 17 10" />
                          <polyline points="1 20 1 14 7 14" />
                          <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
                        </svg>
                        Refresh
                      </button>
                    </div>
                    <p className="mt-1.5 text-[10px] font-medium text-white/40">
                      Type the 5-digit code shown above
                    </p>
                  </div>

                  {/* Submit Button - Premium Gradient */}
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.02, boxShadow: "0 8px 30px rgba(37,99,235,0.4)" }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/25 transition-all hover:shadow-xl hover:shadow-indigo-600/30 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                  >
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    <span className="relative inline-flex items-center gap-2">
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
                          Access Student Portal
                          <FiArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </span>
                  </motion.button>
                </form>

                {/* Footer */}
                <p className="mt-5 text-center text-[11px] font-medium text-white/30">
                  Enter your roll number, date of birth, and the captcha to sign in
                </p>

                {/* Bottom decorative line */}
                <div className="mt-5 flex items-center justify-center gap-3">
                  <div className="h-px w-12 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-400/50" />
                  <div className="h-px w-12 bg-gradient-to-l from-transparent via-white/20 to-transparent" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
