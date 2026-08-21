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

export function formatShortSubject(subject) {
  if (!subject || typeof subject !== "string") return "document";

  // Strip .pdf extensions, CIA 1/2 prefixes, and replace underscores/dashes with spaces
  let s = subject
    .replace(/\.pdf$/i, "")
    .replace(/^CIA[_\s]*\d+[_\s]*[-–—]?[_\s]*/i, "")
    .replace(/_/g, " ")
    .trim();

  const upper = s.toUpperCase();

  // Combined papers check
  if (upper.includes(",") || upper.includes("COMBINED")) {
    if (upper.includes("PYTHON") && upper.includes("MATH")) return "Combined (Tamil, Eng, Python, Maths)";
    if (upper.includes("JAVA") && upper.includes("STAT")) return "Combined (Tamil, Eng, Java, Web, Stats)";
    if (upper.includes("ANDROID") && upper.includes("STAT")) return "Combined (Tamil, Eng, Android, SE, Stats)";
    return "Combined Papers";
  }

  // Individual subjects
  if (upper.includes("ALGORITHM")) return "Algorithms";
  if (upper.includes("PYTHON")) return "Python";
  if (upper.includes("DIGITAL ELECTRONIC") || upper.includes("DIGITAL")) return "Digital Electronics";
  if (upper.includes("MATHEMATICS PAPER - I") || upper.includes("MATHEMATICS PAPER I") || upper.includes("ALLIED MATHEMATICS I") || upper.includes("MATHS - I") || upper.includes("MATHS 1")) return "Maths - I";
  if (upper.includes("MATHEMATICS PAPER - II") || upper.includes("MATHEMATICS PAPER II") || upper.includes("ALLIED MATHEMATICS II") || upper.includes("MATHS - II") || upper.includes("MATHS 2")) return "Maths - II";
  if (upper.includes("STATISTICAL METHODS") && (upper.includes("II") || upper.includes("2"))) return "Statistics - II";
  if (upper.includes("STATISTICAL METHODS")) return "Statistics - I";
  if (upper.includes("C++")) return "C++";
  if (upper.includes("JAVA")) return "Java";
  if (upper.includes("PHP")) return "PHP";
  if (upper.includes("REACT") || upper.includes("NODE")) return "React & Node";
  if (upper.includes("ANGULAR")) return "Angular & Node";
  if (upper.includes("CONTEMPORARY WEB") || upper.includes("WEB TECHNOLOGY")) return "Web Tech";
  if (upper.includes("OPERATING SYSTEM")) return "Operating System";
  if (upper.includes("ADVANCED DATABASE")) return "Advanced DBMS";
  if (upper.includes("DISTRIBUTED DATABASE")) return "Distributed DB";
  if (upper.includes("DATABASE MANAGEMENT")) return "DBMS";
  if (upper.includes("DATA MINING")) return "Data Mining";
  if (upper.includes("DATA STRUCTURES")) return "Data Structures";
  if (upper.includes("ADVANCED SOFTWARE")) return "Advanced SE";
  if (upper.includes("SOFTWARE ENGINEERING")) return "Software Eng.";
  if (upper.includes("ANDROID")) return "Android Dev";
  if (upper.includes("ARTIFICIAL INTELLIGENCE AND MACHINE")) return "AI & ML";
  if (upper.includes("ARTIFICIAL INTELLIGENCE")) return "AI & Expert Sys";
  if (upper.includes("CLOUD COMPUTING")) return "Cloud Computing";
  if (upper.includes("CLOUD WEB")) return "Cloud Web Services";
  if (upper.includes("DATA COMMUNICATION") || upper.includes("NETWORKING")) return "Networking";
  if (upper.includes("MOBILE NETWORK")) return "Mobile Networks";
  if (upper.includes("NEURAL NETWORK")) return "Neural Networks";
  if (upper.includes("DATA SCIENCE")) return "Data Science";
  if (upper.includes("IMAGE PROCESSING")) return "Image Processing";
  if (upper.includes("MODELING LANGUAGE") || upper.includes("UML")) return "UML";
  if (upper.includes("DOT NET") || upper.includes(".NET")) return ".NET Tech";
  if (upper.includes("ASP.NET")) return "ASP.NET";
  if (upper.includes("BIG DATA")) return "Big Data";
  if (upper.includes("CYBER FORENSICS")) return "Cyber Forensics";
  if (upper.includes("INFORMATION SECURITY")) return "Info Security";
  if (upper.includes("SOCIAL NETWORK")) return "Social Net Analysis";
  if (upper.includes("TAMIL")) return "Tamil";
  if (upper.includes("ENGLISH")) return "English";

  return s.length > 25 ? s.substring(0, 22) + "..." : s;
}
