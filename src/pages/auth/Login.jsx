// src/pages/auth/Login.jsx
import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { FiCalendar, FiClock, FiBookOpen, FiStar, FiArrowRight, FiShield } from "react-icons/fi";
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
    <div className="flex items-center justify-center gap-3 text-sm font-medium text-gray-500">
      <span className="flex items-center gap-1.5"><FiCalendar size={14} /> {dayName}, {dateStr}</span>
      <span className="text-gray-300">|</span>
      <span className="flex items-center gap-1.5 font-mono tracking-wider"><FiClock size={14} /> {timeStr}</span>
    </div>
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
    if (!/^(24E(29|30)|25E30)\d{2}$/i.test(rollNumber.trim())) {
      toast.error("Enter a valid roll number (e.g. 24E2901, 24E3001, or 25E3001)");
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
      const loginResult = await login(rollNumber, displayDob, "student");
      const studentName = loginResult?.name || rollNumber;
      toast.success(`Welcome, ${studentName}!`);
      navigate(location.state?.from?.pathname || "/student/dashboard", { replace: true });
    } catch (err) {
      toast.error(err.message);
    } finally { setLoading(false); }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      {/* Bright gradient background */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50" />
      <motion.div
        className="pointer-events-none absolute inset-0"
        animate={{
          background: [
            "radial-gradient(ellipse at 20% 50%, rgba(251,191,36,0.12) 0%, transparent 50%)",
            "radial-gradient(ellipse at 80% 50%, rgba(251,146,60,0.10) 0%, transparent 50%)",
            "radial-gradient(ellipse at 20% 50%, rgba(251,191,36,0.12) 0%, transparent 50%)",
          ],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Glowing orbs */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-amber-300/20 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-orange-300/20 blur-[120px]" />

      {/* Grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(251,191,36,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(251,191,36,0.04) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="relative overflow-hidden rounded-3xl border border-amber-100 bg-white shadow-xl shadow-amber-200/20 p-8 sm:p-10">
          {/* Inner content */}
          <div className="relative">
            {/* Top accent */}
            <div className="absolute -top-10 left-1/2 h-20 w-3/4 -translate-x-1/2 rounded-full bg-amber-400/10 blur-[40px]" />

            {/* Clock */}
            <div className="mb-6">
              <LiveClock />
            </div>

            {/* Logo and branding */}
            <div className="mb-6 flex flex-col items-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 150, delay: 0.1 }}
              >
                <div className="relative">
                  <div className="absolute -inset-4 rounded-full bg-amber-200/30 blur-[30px]" />
                  <img
                    src={collegeLogo}
                    alt="DGVC College Logo"
                    className="relative h-auto w-80 object-contain drop-shadow-xl sm:w-96"
                  />
                </div>
              </motion.div>

              {/* Section badge */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-amber-700 border border-amber-200 shadow-sm"
              >
                <FiStar size={12} className="text-amber-500" />
                UG Section A & B
                <FiStar size={12} className="text-amber-500" />
              </motion.div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Roll Number */}
              <div>
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-gray-500">
                  Roll Number
                </label>
                <div className="relative group">
                  <FiBookOpen className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-400 group-focus-within:text-amber-600 z-10 transition-colors" size={15} />
                  <input
                    value={rollNumber}
                    onChange={(e) => setRollNumber(formatRoll(e.target.value))}
                    placeholder="e.g. 24E2901"
                    maxLength={7}
                    className="w-full rounded-xl border border-gray-200 bg-white px-11 py-3 font-mono text-sm tracking-wider text-gray-800 placeholder:text-gray-400 outline-none transition-all focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
                    autoFocus
                  />
                </div>
                <p className="mt-1.5 text-[11px] font-medium text-gray-400">
                  24E29xx (3rd Yr A) · 24E30xx (3rd Yr B) · 25E30xx (2nd Yr B)
                </p>
              </div>

              {/* Date of Birth */}
              <div>
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-gray-500">
                  Date of Birth
                </label>
                <div className="relative group">
                  <FiCalendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-400 group-focus-within:text-amber-600 z-10 transition-colors" size={15} />
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    max={new Date().toISOString().split("T")[0]}
                    className="w-full rounded-xl border border-gray-200 bg-white px-11 py-3 text-sm text-gray-800 outline-none transition-all focus:border-amber-400 focus:ring-2 focus:ring-amber-200 [color-scheme:light]"
                  />
                </div>
                <p className="mt-1.5 text-[11px] font-medium text-gray-400">
                  Select your date of birth
                </p>
              </div>

              {/* CAPTCHA */}
              <div>
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-gray-500">
                  Enter the captcha
                </label>
                <div className="relative group">
                  <FiShield className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-400 group-focus-within:text-amber-600 z-10 transition-colors" size={15} />
                  <input
                    value={captcha}
                    onChange={(e) => setCaptcha(e.target.value.replace(/[^0-9]/g, "").slice(0, 5))}
                    placeholder="Enter the 5-digit code"
                    maxLength={5}
                    inputMode="numeric"
                    className="w-full rounded-xl border border-gray-200 bg-white px-11 py-3 font-mono text-sm tracking-[0.3em] text-gray-800 placeholder:text-gray-400 placeholder:tracking-wider outline-none transition-all focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
                  />
                </div>

                {/* Captcha display */}
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex select-none items-center gap-2 rounded-lg border border-gray-200 bg-amber-50/50 px-4 py-2.5">
                    <span className="text-xl font-bold tracking-[0.4em] text-amber-600 drop-shadow-sm">
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
                    className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2.5 text-[11px] font-semibold text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-all"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="23 4 23 10 17 10" />
                      <polyline points="1 20 1 14 7 14" />
                      <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
                    </svg>
                    Refresh
                  </button>
                </div>
                <p className="mt-1.5 text-[11px] font-medium text-gray-400">
                  Type the 5-digit code shown above
                </p>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-amber-500/25 transition-all hover:shadow-xl hover:shadow-amber-500/30 hover:from-amber-400 hover:to-orange-400 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
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
            <p className="mt-5 text-center text-xs font-medium text-gray-400">
              Enter your roll number, date of birth, and the captcha to sign in.
            </p>

            {/* Bottom decorative line */}
            <div className="mt-5 flex items-center justify-center gap-3">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-200" />
              <div className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-200" />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
