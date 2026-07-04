// src/pages/NotFound.jsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiHome } from "react-icons/fi";
import Button from "../components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <motion.h1
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        className="font-display text-8xl font-extrabold text-gradient"
      >
        404
      </motion.h1>
      <p className="mt-3 text-lg font-semibold">Page not found</p>
      <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
        The page you're looking for doesn't exist or may have moved.
      </p>
      <Button as={Link} to="/" className="mt-6">
        <FiHome /> Back to Home
      </Button>
    </div>
  );
}
