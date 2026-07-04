// src/pages/auth/Login.jsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { FiUser, FiCalendar, FiClock, FiBookOpen, FiMonitor } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

function LiveClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const dayName = days[now.getDay()];
  const dateStr = now.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  const timeStr = now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  return (
    <div className="flex items-center justify-center gap-3 text-sm font-medium text-gray-500">
      <span className="flex items-center gap-1.5"><FiCalendar size={14} /> {dayName}, {dateStr}</span>
      <span className="text-gray-300">|</span>
      <span className="flex items-center gap-1.5 font-mono tracking-wider"><FiClock size={14} /> {timeStr}</span>
    </div>
  );
}

const tabs = [
  { id: "student", label: "Student", icon: FiBookOpen },
  { id: "faculty", label: "Faculty", icon: FiMonitor },
];

export default function Login() {
  const [loginType, setLoginType] = useState("student");
  const [rollNumber, setRollNumber] = useState("");
  const [dob, setDob] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  function formatRoll(value) {
    return value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  }
  function formatDob(value) {
    const digits = value.replace(/\D/g, "").slice(0, 8);
    let f = "";
    if (digits.length > 0) f = digits.slice(0, 2);
    if (digits.length > 2) f += "/" + digits.slice(2, 4);
    if (digits.length > 4) f += "/" + digits.slice(4, 8);
    return f;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const rollPattern = loginType === "faculty" ? /^FAC\d{3}$/i : /^24E30\d{2}$/i;
    if (!rollPattern.test(rollNumber.trim())) {
      toast.error(loginType === "faculty" ? "Enter a valid faculty code (e.g. FAC001)" : "Enter a valid roll number (e.g. 24E3001)");
      return;
    }
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dob)) {
      toast.error("Enter a valid date of birth (DD/MM/YYYY)");
      return;
    }
    setLoading(true);
    try {
      await login(rollNumber, dob, loginType);
      toast.success(`Welcome, ${rollNumber}!`);
      const dest = loginType === "faculty" ? "/faculty/dashboard" : "/student/dashboard";
      navigate(location.state?.from?.pathname || dest, { replace: true });
    } catch (err) {
      toast.error(err.message);
    } finally { setLoading(false); }
  }

  function switchTab(id) {
    setLoginType(id);
    setRollNumber("");
    setDob("");
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-hero px-4 py-12">
      {/* Decorative grid */}
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white/80 shadow-premium backdrop-blur-xl p-8">
          {/* Top accent bar */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-600 via-blue-800 to-cyan-500" />

          {/* Clock */}
          <div className="mb-6">
            <LiveClock />
          </div>

          {/* Logo + College Name */}
          <div className="mb-6 flex flex-col items-center">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
              className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-blue-800 to-cyan-500 text-white shadow-neon-primary"
            >
              <span className="font-display text-2xl font-extrabold tracking-tight">DV</span>
            </motion.div>
            <h1 className="text-center font-display text-xl font-bold leading-tight text-gray-900 sm:text-2xl">
              DWARAKA DOSS GOVERDHAN DOSS
              <br />
              VAISHNAV COLLEGE
            </h1>
            <p className="mt-1.5 text-xs font-medium text-gray-400">
              Department of Computer Science
            </p>
          </div>

          {/* Student / Faculty Tabs */}
          <div className="mb-6 grid grid-cols-2 gap-1.5 rounded-xl bg-gray-100/80 p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => switchTab(tab.id)}
                className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all ${
                  loginType === tab.id
                    ? "bg-white text-blue-600 shadow-soft border border-gray-100"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Form */}
          <AnimatePresence mode="wait">
            <motion.form
              key={loginType}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* Roll Number */}
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                  {loginType === "faculty" ? "Faculty Code" : "Roll Number"}
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    value={rollNumber}
                    onChange={(e) => setRollNumber(formatRoll(e.target.value))}
                    placeholder={loginType === "faculty" ? "e.g. FAC001" : "e.g. 24E3001"}
                    maxLength={7}
                    className="w-full rounded-xl border border-gray-200 bg-white px-11 py-3.5 font-mono text-sm tracking-wider text-gray-700 outline-none transition-all placeholder:text-gray-400 focus:border-blue-400/60 focus:ring-2 focus:ring-blue-500/20"
                    autoFocus
                  />
                </div>
                <p className="mt-2 text-xs font-medium text-gray-400">
                  {loginType === "faculty" ? "Format: FAC + 3 digits (e.g. FAC001)" : "Format: 24E30xx (e.g. 24E3001)"}
                </p>
              </div>

              {/* Date of Birth */}
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Date of Birth
                </label>
                <div className="relative">
                  <FiCalendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    value={dob}
                    onChange={(e) => setDob(formatDob(e.target.value))}
                    placeholder="DD/MM/YYYY"
                    maxLength={10}
                    className="w-full rounded-xl border border-gray-200 bg-white px-11 py-3.5 font-mono text-sm tracking-wider text-gray-700 outline-none transition-all placeholder:text-gray-400 focus:border-blue-400/60 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <p className="mt-2 text-xs font-medium text-gray-400">Format: DD/MM/YYYY</p>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-3.5 text-sm font-semibold text-white shadow-premium transition-all hover:shadow-premium-lg disabled:opacity-60"
              >
                <span className="relative">
                  {loading ? "Verifying…" : `Access ${loginType === "faculty" ? "Faculty" : "Student"} Portal`}
                </span>
              </motion.button>
            </motion.form>
          </AnimatePresence>

          {/* Footer */}
          <p className="mt-5 text-center text-xs font-medium text-gray-400">
            Enter your college {loginType === "faculty" ? "faculty code" : "roll number"} and date of birth to sign in.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
