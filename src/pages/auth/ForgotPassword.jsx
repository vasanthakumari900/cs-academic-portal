import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { FiMail, FiArrowLeft } from "react-icons/fi";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim()) { toast.error("Please enter your email"); return; }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast.success("Password reset email sent (demo)");
    }, 1000);
  }

  return (
    <div className="flex min-h-[85vh] items-center justify-center px-4 py-12">
      <div className="fixed inset-0 pointer-events-none bg-mesh-deep" />
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-md">
        <div className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-glass p-8">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-md">
              <FiMail size={24} />
            </div>
            <h1 className="font-display text-2xl font-bold text-white">Reset your password</h1>
            <p className="mt-1 text-sm text-white/60">Enter your email and we'll send you a reset link.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-white/60">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border input-premium px-10"
                  placeholder="you@college.edu"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 text-sm font-bold text-white shadow-md transition-all duration-300 hover:shadow-lg hover:from-indigo-500 hover:to-violet-600 active:scale-[0.97] disabled:opacity-60"
            >
              {submitting ? "Sending…" : "Send Reset Link"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-white/60">
            Remembered it?{" "}
            <Link to="/login" className="font-semibold text-cyan-400 hover:text-cyan-300 transition-colors">
              Back to login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
