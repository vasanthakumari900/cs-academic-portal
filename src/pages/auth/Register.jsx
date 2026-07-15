import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { FiUser, FiMail, FiLock, FiArrowRight } from "react-icons/fi";

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

  return (
    <div className="flex min-h-[85vh] items-center justify-center px-4 py-12">
      <div className="fixed inset-0 pointer-events-none bg-mesh-deep" />
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-md">
        <div className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-glass p-8">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-sm">
              <FiUser size={24} />
            </div>
            <h1 className="font-display text-2xl font-bold text-white">Create your account</h1>
            <p className="mt-1 text-sm text-white/60">Join the CS Academic Portal.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-white/60">Full name</label>
              <div className="relative">
                <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                <input value={form.name} onChange={(e) => handleChange("name", e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white/70 px-10 py-3 text-sm outline-none ring-1 ring-gray-200/50 focus:ring-2 focus:ring-indigo-400/30 focus:border-indigo-300 transition-all"
                  placeholder="Jane Doe" />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-white/60">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                <input type="email" value={form.email} onChange={(e) => handleChange("email", e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white/70 px-10 py-3 text-sm outline-none ring-1 ring-gray-200/50 focus:ring-2 focus:ring-indigo-400/30 focus:border-indigo-300 transition-all"
                  placeholder="you@college.edu" />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-white/60">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                <input type="password" value={form.password} onChange={(e) => handleChange("password", e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white/70 px-10 py-3 text-sm outline-none ring-1 ring-gray-200/50 focus:ring-2 focus:ring-indigo-400/30 focus:border-indigo-300 transition-all"
                  placeholder="••••••••" />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-white/60">I am a</label>
              <select value={form.role} onChange={(e) => handleChange("role", e.target.value)}
                className="w-full rounded-xl border input-premium"
              >
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
              </select>
            </div>

            <button type="submit" disabled={submitting}
              className="group w-full rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition-all duration-300 hover:shadow-sm hover:from-indigo-500 hover:to-violet-600 active:scale-[0.97] disabled:opacity-60"
            >
              {submitting ? "Creating account…" : "Create Account"} <FiArrowRight size={16} className="inline group-hover:translate-x-0.5 transition-transform" />
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-white/60">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-cyan-400 hover:text-cyan-300 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
