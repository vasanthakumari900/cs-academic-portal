// src/components/ui/GlassCard.jsx
import { classNames } from "../../utils/helpers";

const cardStyles = {
  glass: "rounded-2xl border border-maroon/10 bg-white/80 p-6 shadow-glass backdrop-blur-xl dark:border-gold/[0.08] dark:bg-dark-card/70 dark:shadow-glass-dark",
  elevated: "rounded-2xl bg-white p-6 shadow-card dark:bg-dark-card dark:shadow-card-dark dark:border dark:border-gold/10",
  flat: "rounded-2xl border border-maroon/10 bg-white/95 p-6 dark:border-gold/10 dark:bg-dark-card/95",
};

export default function GlassCard({ children, className = "", hover = true, variant = "glass" }) {
  return (
    <div
      className={classNames(
        cardStyles[variant] || cardStyles.glass,
        hover && "transition-all duration-300 hover:shadow-card-hover hover:-translate-y-0.5 dark:hover:shadow-none dark:hover:border-gold/20",
        className
      )}
    >
      {children}
    </div>
  );
}
