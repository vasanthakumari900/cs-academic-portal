// src/pages/auth/ForgotPassword.jsx
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { FiMail } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/ui/Button";
import GlassCard from "../../components/ui/GlassCard";

export default function ForgotPassword() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const { resetPassword } = useAuth();

  async function onSubmit({ email }) {
    try {
      await resetPassword(email);
      toast.success("Password reset email sent");
    } catch {
      toast.error("Couldn't send reset email. Check the address and try again.");
    }
  }

  return (
    <div className="flex min-h-[85vh] items-center justify-center bg-orbs dark:bg-orbs-dark bg-bg dark:bg-dark px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <GlassCard hover={false}>
          <h1 className="mb-1 font-display text-2xl font-bold">Reset your password</h1>
          <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
            Enter your email and we'll send you a reset link.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  {...register("email", { required: "Email is required" })}
                  className="input-field pl-10"
                  placeholder="you@college.edu"
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-danger">{errors.email.message}</p>}
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Sending…" : "Send Reset Link"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            Remembered it? <Link to="/login" className="font-semibold text-maroon dark:text-gold hover:underline">Back to login</Link>
          </p>
        </GlassCard>
      </motion.div>
    </div>
  );
}
