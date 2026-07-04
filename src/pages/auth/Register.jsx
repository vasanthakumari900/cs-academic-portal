// src/pages/auth/Register.jsx
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { FiUser, FiMail, FiLock } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { ROLES } from "../../utils/constants";
import Button from "../../components/ui/Button";
import GlassCard from "../../components/ui/GlassCard";

export default function Register() {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { role: ROLES.STUDENT },
  });
  const { register: signUp } = useAuth();
  const navigate = useNavigate();

  async function onSubmit({ name, email, password, role }) {
    try {
      await signUp({ name, email, password, role });
      toast.success("Account created!");
      navigate(`/${role}/dashboard`, { replace: true });
    } catch (err) {
      toast.error(mapAuthError(err.code));
    }
  }

  return (
    <div className="flex min-h-[85vh] items-center justify-center bg-orbs dark:bg-orbs-dark bg-bg dark:bg-dark px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <GlassCard hover={false}>
          <h1 className="mb-1 font-display text-2xl font-bold">Create your account</h1>
          <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">Join the CS Academic Portal.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Full name</label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  {...register("name", { required: "Name is required" })}
                  className="input-field pl-10"
                  placeholder="Jane Doe"
                />
              </div>
              {errors.name && <p className="mt-1 text-xs text-danger">{errors.name.message}</p>}
            </div>

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

            <div>
              <label className="mb-1 block text-sm font-medium">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  {...register("password", { required: "Password is required", minLength: { value: 6, message: "At least 6 characters" } })}
                  className="input-field pl-10"
                  placeholder="••••••••"
                />
              </div>
              {errors.password && <p className="mt-1 text-xs text-danger">{errors.password.message}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">I am a</label>
              <select
                {...register("role")}
                className="input-field"
              >
                <option value={ROLES.STUDENT}>Student</option>
                <option value={ROLES.FACULTY}>Faculty</option>
              </select>
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Creating account…" : "Create Account"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            Already have an account? <Link to="/login" className="font-semibold text-maroon dark:text-gold hover:underline">Sign in</Link>
          </p>
        </GlassCard>
      </motion.div>
    </div>
  );
}

function mapAuthError(code) {
  const map = {
    "auth/email-already-in-use": "An account with this email already exists.",
    "auth/weak-password": "Please choose a stronger password.",
    "auth/invalid-email": "Please enter a valid email address.",
  };
  return map[code] || "Something went wrong. Please try again.";
}
