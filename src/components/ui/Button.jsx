// src/components/ui/Button.jsx
import { motion } from "framer-motion";
import { classNames } from "../../utils/helpers";

const variants = {
  primary: "bg-gradient-to-r from-maroon to-gold text-white shadow-glow",
  ghost: "bg-transparent text-dark hover:bg-maroon/5 dark:text-white/80 dark:hover:bg-white/10",
  outline: "border border-maroon/20 text-dark hover:bg-maroon/5 dark:border-gold/20 dark:text-white/80 dark:hover:bg-white/5",
  danger: "bg-danger text-white",
};

const MotionButton = motion.button;

export default function Button({
  children,
  variant = "primary",
  className = "",
  as: Component = "button",
  ...props
}) {
  const baseClasses = classNames(
    "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 disabled:opacity-50",
    variants[variant],
    className
  );

  if (Component === "button") {
    return (
      <MotionButton
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className={classNames(baseClasses, "hover:brightness-110 active:brightness-95")}
        {...props}
      >
        {children}
      </MotionButton>
    );
  }

  return (
    <Component
      className={classNames(baseClasses, "hover:brightness-110 active:brightness-95")}
      {...props}
    >
      {children}
    </Component>
  );
}
