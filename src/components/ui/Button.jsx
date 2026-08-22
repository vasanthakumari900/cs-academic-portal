// src/components/ui/Button.jsx
import React from "react";

export function PrimaryButton({
  children,
  onClick,
  type = "button",
  disabled = false,
  loading = false,
  className = "",
  ariaLabel,
  ...props
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      className={`inline-flex items-center justify-center gap-2 rounded-xl bg-[#7F011F] hover:bg-[#A0022B] active:bg-[#61182A] text-white px-4 py-2.5 text-xs font-bold transition-all shadow-sm focus-visible:ring-2 focus-visible:ring-[#D97706] focus-visible:outline-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${className}`}
      {...props}
    >
      {loading ? (
        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
      ) : null}
      {children}
    </button>
  );
}

export function SecondaryButton({
  children,
  onClick,
  type = "button",
  disabled = false,
  loading = false,
  className = "",
  ariaLabel,
  ...props
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      className={`inline-flex items-center justify-center gap-2 rounded-xl border border-[#EDC8D0] bg-white hover:bg-[#F6E4E8]/60 text-[#7F011F] px-4 py-2.5 text-xs font-bold transition-all shadow-2xs focus-visible:ring-2 focus-visible:ring-[#D97706] focus-visible:outline-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${className}`}
      {...props}
    >
      {loading ? (
        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-[#7F011F] border-t-transparent" />
      ) : null}
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  onClick,
  type = "button",
  disabled = false,
  loading = false,
  className = "",
  ariaLabel,
  ...props
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      className={`inline-flex items-center justify-center gap-2 rounded-xl text-[#7F011F] hover:bg-[#F6E4E8]/50 px-3.5 py-2 text-xs font-bold transition-all focus-visible:ring-2 focus-visible:ring-[#D97706] focus-visible:outline-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${className}`}
      {...props}
    >
      {loading ? (
        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-[#7F011F] border-t-transparent" />
      ) : null}
      {children}
    </button>
  );
}

export function DangerButton({
  children,
  onClick,
  type = "button",
  disabled = false,
  loading = false,
  className = "",
  ariaLabel,
  ...props
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      className={`inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white px-4 py-2.5 text-xs font-bold transition-all shadow-sm focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:outline-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${className}`}
      {...props}
    >
      {loading ? (
        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
      ) : null}
      {children}
    </button>
  );
}

export function IconButton({
  children,
  onClick,
  type = "button",
  disabled = false,
  loading = false,
  className = "",
  ariaLabel,
  ...props
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      className={`inline-flex items-center justify-center h-9 w-9 rounded-xl border border-[#EDC8D0] bg-white text-[#7F011F] hover:bg-[#F6E4E8]/60 transition-all focus-visible:ring-2 focus-visible:ring-[#D97706] focus-visible:outline-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${className}`}
      {...props}
    >
      {loading ? (
        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-[#7F011F] border-t-transparent" />
      ) : (
        children
      )}
    </button>
  );
}

export default PrimaryButton;
