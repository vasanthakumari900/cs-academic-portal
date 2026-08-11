import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { FiMail, FiArrowLeft, FiShield } from "react-icons/fi";

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
    <div className="relative flex min-h-screen overflow-hidden bg-[#FBF7F2] dark:bg-[#190B13] items-center justify-center px-4 py-12">
      {/* Ambient background orbs */}
      <div className="pointer-events-none absolute -top-24 left-1/4 h-96 w-96 rounded-full bg-[#D97706]/10 blur-[110px]" />
      <div className="pointer-events-none absolute -bottom-32 right-1/4 h-[28rem] w-[28rem] rounded-full bg-[#4A1620]/15 blur-[130px]" />

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-md">
        <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-[#22101A] border border-[#F0E2E6]/80 dark:border-white/10 shadow-[0_2px_4px_rgba(28,10,16,0.05),0_16px_48px_rgba(28,10,16,0.10)] p-8">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-b from-[#61182A] to-[#4A1620] text-white shadow-[0_4px_14px_rgba(74,22,32,0.35)] border border-[#C96A7E]/40">
              <FiMail size={24} />
            </div>
            <h1 className="font-heading text-2xl font-bold text-[#3A101A] dark:text-[#F3E4E8]">Reset your password</h1>
            <p className="mt-1 text-sm text-[#9C6D7F] dark:text-[#D9C2CA]">Enter your email and we'll send you a reset link.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-[#4A1620] dark:text-[#F4C266] font-heading">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9C6D7F]" size={16} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-[#EDC8D0] dark:border-white/15 bg-white dark:bg-[#22101A] px-10 py-3 text-sm text-[#2A0D13] dark:text-[#F0E2E6] placeholder:text-[#9C6D7F] outline-none transition-all focus:border-[#4A1620] focus:ring-2 focus:ring-[#4A1620]/15"
                  placeholder="you@college.edu"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-gradient-to-b from-[#61182A] to-[#4A1620] hover:from-[#7E2238] hover:to-[#61182A] px-6 py-3 text-sm font-bold text-white shadow-[0_1px_2px_rgba(28,10,16,0.2),0_6px_20px_rgba(74,22,32,0.35)] transition-all hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] disabled:opacity-60 font-heading"
            >
              {submitting ? "Sending…" : "Send Reset Link"}
            </button>
          </form>

          <div className="mt-5 flex items-center justify-center gap-2 text-[11px] font-semibold text-[#9C6D7F] dark:text-[#C09DAA]">
            <FiShield size={13} className="text-[#D97706]" />
            Secure · Official College Portal
          </div>

          <p className="mt-4 text-center text-sm text-[#7C4B5E] dark:text-[#D9C2CA]">
            Remembered it?{" "}
            <Link to="/login" className="font-semibold text-[#4A1620] dark:text-[#F4C266] hover:text-[#7E2238] transition-colors">
              Back to login
            </Link>
          </p>

          <div className="mt-4 text-center">
            <Link to="/" className="inline-flex items-center gap-1 text-xs font-medium text-[#9C6D7F] dark:text-[#C09DAA] hover:text-[#4A1620] dark:hover:text-[#F3E4E8] transition-colors">
              <FiArrowLeft size={14} /> Back to home
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
