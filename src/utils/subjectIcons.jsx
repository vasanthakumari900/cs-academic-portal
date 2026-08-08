// src/utils/subjectIcons.jsx
import React from "react";

/**
 * Extracts a clean, high-impact subject name abbreviation or acronym to serve as an official subject logo.
 */
export function getSubjectAbbreviation(subjectName) {
  if (!subjectName) return "CS";
  const sub = String(subjectName).toUpperCase().trim();

  if (sub.includes("ADVANCED DESIGN") || sub.includes("DESIGN AND ANALYSIS")) return "ADAA";
  if (sub.includes("ADVANCED SOFTWARE")) return "ASE";
  if (sub.includes("MOBILE NETWORK")) return "MNS";
  if (sub.includes("NEURAL NETWORK") || sub.includes("NEURAL")) return "ANN";
  if (sub.includes("CONTEMPORARY WEB") && sub.includes("LAB")) return "CWT LAB";
  if (sub.includes("CONTEMPORARY WEB")) return "CWT";
  if (sub.includes("DATA COMMUNICATION")) return "DCN";
  if (sub.includes("PYTHON FOR DATA SCIENCE") && sub.includes("LAB")) return "PY LAB";
  if (sub.includes("PYTHON FOR DATA SCIENCE")) return "PY DATA";
  if (sub.includes("PYTHON")) return "PYTHON";
  if (sub.includes("ENTERPRISE") || sub.includes("JEE")) return "JEE";
  if (sub.includes("INTERNET OF THINGS") || sub.includes("IOT")) return "IOT";
  if (sub.includes("ADVANCED DATABASE")) return "ADBMS";
  if (sub.includes("DISTRIBUTED DATABASE")) return "DDB";
  if (sub.includes("MACHINE LEARNING") || (sub.includes("ARTIFICIAL") && sub.includes("MACHINE"))) return "AIML";
  if (sub.includes("DOT NET")) return "DOTNET";
  if (sub.includes("BIG DATA")) return "BDA";
  if (sub.includes("CYBER FORENSICS")) return "CF";
  if (sub.includes("ETHICAL HACKING")) return "EH";
  if (sub.includes("INFORMATION SECURITY")) return "IS";
  if (sub.includes("HIGH SPEED")) return "HSN";
  if (sub.includes("SOCIAL NETWORK")) return "SNA";
  if (sub.includes("JAVA") && !sub.includes("SCRIPT")) return "JAVA";
  if (sub.includes("C++") || sub.includes("CPP")) return "C++";
  if (sub.includes("DBMS") || sub.includes("DATABASE")) return "DBMS";
  if (sub.includes("OPERATING") || sub.includes("OS")) return "OS";
  if (sub.includes("ASP.NET") || sub.includes(".NET")) return "ASP.NET";
  if (sub.includes("DATA MINING") || sub.includes("DMT")) return "DMT";
  if (sub.includes("CLOUD")) return "CLOUD";
  if (sub.includes("NETWORK")) return "CN";
  if (sub.includes("PHP")) return "PHP";
  if (sub.includes("DATA SCIENCE")) return "DATA SCI";
  if (sub.includes("ARTIFICIAL") || sub.includes("EXPERT") || sub.includes("AI")) return "AI";
  if (sub.includes("SOFTWARE") && sub.includes("ENGINEERING")) return "SE";
  if (sub.includes("UML") || sub.includes("UNIFIED")) return "UML";
  if (sub.includes("IMAGE") || sub.includes("DIGITAL")) return "DIP";
  if (sub.includes("STRUCTURES") || sub.includes("ALGORITHM")) return "DS";
  if (sub.includes("ANDROID")) return "ANDROID";
  if (sub.includes("WEB TECHNOLOGY") || sub.includes("WEB TECH")) return "WEB";
  if (sub.includes("REACT")) return "REACT";
  if (sub.includes("ANGULAR") || sub.includes("NODE")) return "WEB DEV";
  if (sub.includes("MATH")) return "MATH";
  if (sub.includes("STATISTICAL") || sub.includes("STATS")) return "STATS";
  if (sub.includes("TAMIL")) return "TAMIL";
  if (sub.includes("ENGLISH")) return "ENG";

  // Fallback: generate acronym from words (e.g. Computer Networks -> CN)
  const words = sub.replace(/[^A-Z0-9\s]/g, "").split(/\s+/).filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 6);
  if (words.length === 2) return (words[0][0] + words[1][0]).toUpperCase();
  return words.slice(0, 3).map(w => w[0]).join("").toUpperCase();
}

/**
 * Returns a stylized subject logo emblem badge displaying the subject name/abbreviation.
 */
export function getSubjectIcon(subjectName, size = 24, className = "") {
  const abbr = getSubjectAbbreviation(subjectName);
  
  // Choose font size based on text length to ensure clean fit inside logo badge
  const fontSizeClass =
    abbr.length <= 3
      ? "text-sm font-black sm:text-base tracking-wider"
      : abbr.length <= 5
      ? "text-xs font-black sm:text-sm tracking-tight"
      : abbr.length <= 7
      ? "text-[10px] font-black sm:text-xs tracking-tighter"
      : "text-[9px] font-extrabold tracking-tighter";

  return (
    <div
      className={`flex h-full w-full items-center justify-center rounded-xl bg-gradient-to-br from-[#7F011F] via-[#990227] to-[#590015] text-[#F5EBD0] shadow-sm border border-[#7F011F]/30 p-1 text-center select-none ${fontSizeClass} ${className}`}
      title={subjectName}
    >
      {abbr}
    </div>
  );
}
