// src/utils/helpers.js
export function formatDate(value) {
  if (!value) return "—";
  const date = value?.toDate ? value.toDate() : new Date(value);
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function initials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");
}

export function classNames(...args) {
  return args.filter(Boolean).join(" ");
}

export function truncate(text = "", length = 90) {
  return text.length > length ? `${text.slice(0, length)}…` : text;
}

export function formatCount(n) {
  if (!n || n === 0) return "0";
  if (n >= 100000) return `${(n / 1000).toFixed(0)}k+`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n;
}
