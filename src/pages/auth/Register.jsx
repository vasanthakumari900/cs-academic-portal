import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { FiUser, FiMail, FiLock, FiArrowRight, FiShield, FiChevronLeft } from "react-icons/fi";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student" });
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  function handleChange(field, value) { setForm((prev) => ({ ...prev, [field]: value })); }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast.success("Account created! (demo)");
      navigate("/login");
    }, 1000);
  }

  const inputCls =
    "w-full rounded-xl border border-[#EDC8D0] dark:border-white/15 bg-white dark:bg-[#22101A] px-11 py-3 text-sm text-[#2A0D13] dark:text-[#F0E2E6] placeholder:text-[#9C6D7F] outline-none transition-all focus:border-[#4A1620] focus:ring-2 focus:ring-[#4A1620]/15";

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-[#FBF7F2] dark:bg-[#190B13]">
      {/* Ambient background orbs */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-[#D97706]/10 blur-[110px]" />
      <div className="pointer-events-none absolute -bottom-32 -left-24 h-[28rem] w-[28rem] rounded-full bg-[#4A1620]/15 blur-[130px]" />

      <div className="relative z-10 flex w-full items-center justify-center px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ maxWidth: 'var(--fluid-container-sm)' }} className="relative w-full mx-auto">
          <div style={{ padding: 'var(--fluid-pad-page)' }} className="relative overflow-hidden rounded-2xl bg-white dark:bg-[#22101A] border border-[#F0E2E6]/80 dark:border-white/10 shadow-[0_2px_4px_rgba(28,10,16,0.05),0_16px_48px_rgba(28,10,16,0.10)]">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-b from-[#61182A] to-[#4A1620] text-white shadow-[0_4px_14px_rgba(74,22,32,0.35)] border border-[#C96A7E]/40">
                <FiUser size={24} />
              </div>
              <h1 style={{ fontSize: 'clamp(1.4rem,3vw,1.875rem)' }} className="font-heading font-bold text-[#3A101A] dark:text-[#F3E4E8]">
                Create your account
              </h1>
              <p className="mt-1 text-sm text-[#9C6D7F] dark:text-[#D9C2CA]">
                Join the CS Academic Portal.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-[#4A1620] dark:text-[#F4C266] font-heading">Full name</label>
                <div className="relative">
                  <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9C6D7F]" size={16} />
                  <input value={form.name} onChange={(e) => handleChange("name", e.target.value)}
                    className={inputCls}
                    placeholder="Jane Doe" />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-[#4A1620] dark:text-[#F4C266] font-heading">Email</label>
                <div className="relative">
                  <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9C6D7F]" size={16} />
                  <input type="email" value={form.email} onChange={(e) => handleChange("email", e.target.value)}
                    className={inputCls}
                    placeholder="you@college.edu" />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-[#4A1620] dark:text-[#F4C266] font-heading">Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9C6D7F]" size={16} />
                  <input type="password" value={form.password} onChange={(e) => handleChange("password", e.target.value)}
                    className={inputCls}
                    placeholder="••••••••" />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-[#4A1620] dark:text-[#F4C266] font-heading">I am a</label>
                <select value={form.role} onChange={(e) => handleChange("role", e.target.value)}
                  className="w-full rounded-xl border border-[#EDC8D0] dark:border-white/15 bg-white dark:bg-[#22101A] px-4 py-3 text-sm text-[#2A0D13] dark:text-[#F0E2E6] outline-none transition-all focus:border-[#4A1620] focus:ring-2 focus:ring-[#4A1620]/15"
                >
                  <option value="student">Student</option>
                  <option value="faculty">Faculty</option>
                </select>
              </div>

              <button type="submit" disabled={submitting}
                className="group w-full rounded-xl bg-gradient-to-b from-[#61182A] to-[#4A1620] hover:from-[#7E2238] hover:to-[#61182A] px-6 py-3 text-sm font-bold text-white shadow-[0_1px_2px_rgba(28,10,16,0.2),0_6px_20px_rgba(74,22,32,0.35)] transition-all hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:opacity-60 font-heading"
              >
                {submitting ? "Creating account…" : "Create Account"} <FiArrowRight size={16} className="inline group-hover:translate-x-0.5 transition-transform" />
              </button>
            </form>

            <div className="mt-5 flex items-center justify-center gap-2 text-[11px] font-semibold text-[#9C6D7F] dark:text-[#C09DAA]">
              <FiShield size={13} className="text-[#D97706]" />
              Secure · Official College Portal
            </div>

            <p className="mt-4 text-center text-sm text-[#7C4B5E] dark:text-[#D9C2CA]">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-[#4A1620] dark:text-[#F4C266] hover:text-[#7E2238] dark:hover:text-[#F4C266] transition-colors">
                Sign in
              </Link>
            </p>

            <div className="mt-4 text-center">
              <Link to="/" className="inline-flex items-center gap-1 text-xs font-medium text-[#9C6D7F] dark:text-[#C09DAA] hover:text-[#4A1620] dark:hover:text-[#F3E4E8] transition-colors">
                <FiChevronLeft size={14} /> Back to home
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
