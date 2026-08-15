// src/components/placements/ResumeBuilderTab.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import {
  FiFileText,
  FiDownload,
  FiEye,
  FiCheckCircle,
  FiUser,
  FiMail,
  FiPhone,
  FiBookOpen,
  FiCode,
  FiBriefcase,
  FiAward,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { jsPDF } from "jspdf";
import { LOGO_TRANS_BASE64 } from "../../assets/logoBase64";
import { RESUME_TEMPLATES, DEMO_STUDENT_PROFILE } from "../../utils/placementMockData";

const JOB_ROLES = {
  sde: {
    title: "Software Development Engineer (SDE-1)",
    keywords: ["DSA", "Python", "Java", "C++", "Data Structures", "Algorithms", "OOPs", "Git", "REST API", "SQL", "DBMS", "Problem Solving"],
  },
  webdev: {
    title: "Full-Stack Web Developer",
    keywords: ["React", "JavaScript", "HTML5", "CSS3", "Node.js", "Express", "MongoDB", "REST API", "Git", "Tailwind", "Web Technology"],
  },
  data: {
    title: "Data Analyst & Data Scientist",
    keywords: ["Python", "SQL", "Pandas", "NumPy", "Data Mining", "Data Science", "Machine Learning", "Statistics", "PowerBI", "Matplotlib"],
  },
  cloud: {
    title: "Cloud & DevOps Engineer",
    keywords: ["AWS", "Cloud Computing", "Docker", "Kubernetes", "Linux", "CI/CD", "Git", "Python", "Networking", "Security"],
  },
};

export default function ResumeBuilderTab() {
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [targetRoleKey, setTargetRoleKey] = useState("sde");
  const [resumeData, setResumeData] = useState({
    fullName: DEMO_STUDENT_PROFILE.name,
    email: DEMO_STUDENT_PROFILE.email,
    phone: DEMO_STUDENT_PROFILE.phone,
    department: DEMO_STUDENT_PROFILE.department,
    cgpa: DEMO_STUDENT_PROFILE.cgpa,
    skills: DEMO_STUDENT_PROFILE.skills.join(", "),
    summary:
      "Enthusiastic Computer Science undergraduate with strong problem-solving skills in Data Structures, Python, React, and Database systems. Eager to join a fast-paced software development team.",
    projects:
      "1. CS Academic Portal — Modern web app built with React, Vite & Tailwind CSS.\n2. Smart Placement System — Full-stack eligibility & recruitment tracking software.",
    certifications: "• AWS Certified Cloud Practitioner\n• NPTEL Data Structures & Algorithms (Gold Medalist)",
  });

  const selectedRole = JOB_ROLES[targetRoleKey];

  // ATS Matching Engine
  const fullResumeText = `${resumeData.summary} ${resumeData.skills} ${resumeData.projects} ${resumeData.certifications}`.toLowerCase();
  const matchedKeywords = selectedRole.keywords.filter((kw) =>
    fullResumeText.includes(kw.toLowerCase())
  );
  const missingKeywords = selectedRole.keywords.filter(
    (kw) => !fullResumeText.includes(kw.toLowerCase())
  );
  const atsScore = Math.round((matchedKeywords.length / selectedRole.keywords.length) * 100);

  function handleChange(field, value) {
    setResumeData((prev) => ({ ...prev, [field]: value }));
  }

  function handleDownloadPDF() {
    try {
      const doc = new jsPDF();

      // Top Accent Line
      doc.setFillColor(127, 1, 31); // #7F011F
      doc.rect(0, 0, 210, 15, "F");

      // Department Seal Logo on Top Right
      try {
        doc.addImage(LOGO_TRANS_BASE64, "PNG", 168, 18, 22, 22);
      } catch (err) {
        console.error("Resume PDF logo error:", err);
      }

      // Name & Contact Header
      doc.setTextColor(2, 28, 79);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.text(resumeData.fullName.toUpperCase(), 20, 30);

      doc.setTextColor(100, 100, 100);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(
        `${resumeData.email} | ${resumeData.phone} | ${resumeData.department} (CGPA: ${resumeData.cgpa})`,
        20,
        38
      );

      doc.setDrawColor(200, 200, 200);
      doc.line(20, 42, 190, 42);

      // Section: Summary
      doc.setTextColor(127, 1, 31);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("PROFESSIONAL SUMMARY", 20, 52);

      doc.setTextColor(50, 50, 50);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(resumeData.summary, 20, 60, { maxWidth: 170 });

      // Section: Technical Skills
      doc.setTextColor(127, 1, 31);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("TECHNICAL SKILLS", 20, 80);

      doc.setTextColor(50, 50, 50);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(resumeData.skills, 20, 88, { maxWidth: 170 });

      // Section: Projects
      doc.setTextColor(127, 1, 31);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("KEY PROJECTS", 20, 105);

      doc.setTextColor(50, 50, 50);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      const projectLines = resumeData.projects.split("\n");
      let yPos = 113;
      projectLines.forEach((line) => {
        doc.text(line, 20, yPos);
        yPos += 7;
      });

      // Section: Certifications
      doc.setTextColor(127, 1, 31);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("CERTIFICATIONS & ACHIEVEMENTS", 20, yPos + 10);

      doc.setTextColor(50, 50, 50);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      const certLines = resumeData.certifications.split("\n");
      yPos += 18;
      certLines.forEach((line) => {
        doc.text(line, 20, yPos);
        yPos += 7;
      });

      doc.save(`${resumeData.fullName.replace(/\s+/g, "_")}_Resume.pdf`);
      toast.success("Resume downloaded as PDF!");
    } catch (err) {
      toast.error("Error generating PDF resume");
    }
  }

  return (
    <div className="space-y-6 text-left">
      {/* Top Header & Real-time ATS Scanner Ribbon */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <FiFileText className="text-[#7F011F] dark:text-rose-400" /> Standardized Resume Builder &amp; Real-Time ATS Scanner
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
              Create single-page IT resumes formatted for campus drives with live ATS keyword matching against tech roles.
            </p>
          </div>

          <button
            onClick={handleDownloadPDF}
            className="inline-flex items-center gap-2 rounded-xl bg-[#7F011F] hover:bg-[#990227] px-6 py-3 text-xs font-black text-white shadow-md transition-all cursor-pointer shrink-0"
          >
            <FiDownload size={16} /> Download Resume PDF
          </button>
        </div>

        {/* ATS Score Meter & Target Role Selector */}
        <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/80 p-5 border border-slate-200 dark:border-slate-700 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Target Role Selector */}
          <div className="lg:col-span-7 space-y-3">
            <label className="text-xs font-black uppercase text-slate-500 tracking-wider block">
              Target Job Role for ATS Scan:
            </label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(JOB_ROLES).map(([key, role]) => (
                <button
                  key={key}
                  onClick={() => setTargetRoleKey(key)}
                  className={`rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
                    targetRoleKey === key
                      ? "bg-[#7F011F] text-white shadow-sm font-black"
                      : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-[#7F011F]"
                  }`}
                >
                  {role.title}
                </button>
              ))}
            </div>
          </div>

          {/* ATS Gauge Badge & Keywords */}
          <div className="lg:col-span-5 flex items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="relative flex items-center justify-center h-16 w-16 shrink-0 rounded-2xl bg-[#7F011F]/10 border border-[#7F011F]/20 text-[#7F011F] dark:text-rose-400">
              <span className="text-xl font-black">{atsScore}%</span>
            </div>

            <div className="space-y-1 text-xs">
              <span className="font-black text-slate-800 dark:text-slate-100 block">
                ATS Compatibility Score
              </span>
              <div className="flex flex-wrap gap-1">
                <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                  ✓ {matchedKeywords.length} Matched
                </span>
                <span className="text-[10px] font-extrabold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">
                  ! {missingKeywords.length} Missing
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Matched vs Recommended Missing Keywords Chips */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1.5">
            <span className="font-black text-emerald-600 dark:text-emerald-400 uppercase text-[10px] tracking-wider">
              Matched Keywords in Resume ({matchedKeywords.length}):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {matchedKeywords.map((kw) => (
                <span key={kw} className="rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 px-2.5 py-1 text-[11px] font-black">
                  ✓ {kw}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="font-black text-amber-600 dark:text-amber-400 uppercase text-[10px] tracking-wider">
              Recommended Keywords to Add ({missingKeywords.length}):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {missingKeywords.map((kw) => (
                <span key={kw} className="rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 px-2.5 py-1 text-[11px] font-bold">
                  + {kw}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Split Form & Live Preview Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form (6 cols) */}
        <div className="lg:col-span-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 border-b pb-2">
            Resume Form Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={resumeData.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={resumeData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={resumeData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                Department & CGPA
              </label>
              <input
                type="text"
                value={`${resumeData.department} (${resumeData.cgpa} CGPA)`}
                onChange={(e) => handleChange("department", e.target.value)}
                className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
              Professional Summary
            </label>
            <textarea
              rows={3}
              value={resumeData.summary}
              onChange={(e) => handleChange("summary", e.target.value)}
              className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
              Technical Skills (Comma separated)
            </label>
            <input
              type="text"
              value={resumeData.skills}
              onChange={(e) => handleChange("skills", e.target.value)}
              className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
              Key Projects
            </label>
            <textarea
              rows={3}
              value={resumeData.projects}
              onChange={(e) => handleChange("projects", e.target.value)}
              className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 text-xs font-mono text-slate-800 dark:text-slate-100 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
              Certifications & Achievements
            </label>
            <textarea
              rows={2}
              value={resumeData.certifications}
              onChange={(e) => handleChange("certifications", e.target.value)}
              className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 text-xs font-mono text-slate-800 dark:text-slate-100 focus:outline-none"
            />
          </div>
        </div>

        {/* Right Live Resume Preview (6 cols) */}
        <div className="lg:col-span-6 rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-8 shadow-2xl space-y-6 text-left">
          <div className="border-b-2 border-[#7F011F] dark:border-rose-400 pb-3 text-left">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {resumeData.fullName || "YOUR NAME"}
            </h2>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">
              {resumeData.email} · {resumeData.phone} · {resumeData.department} (CGPA: {resumeData.cgpa})
            </p>
          </div>

          <div className="space-y-5 text-left text-xs">
            <div>
              <h3 className="font-black text-[#7F011F] dark:text-rose-400 uppercase text-xs tracking-wider border-b-2 border-[#7F011F]/30 dark:border-rose-400/30 pb-1 mb-2">
                Professional Summary
              </h3>
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-relaxed">
                {resumeData.summary}
              </p>
            </div>

            <div>
              <h3 className="font-black text-[#7F011F] dark:text-rose-400 uppercase text-xs tracking-wider border-b-2 border-[#7F011F]/30 dark:border-rose-400/30 pb-1 mb-2">
                Technical Skills
              </h3>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {resumeData.skills.split(",").map((s, idx) => (
                  <span
                    key={idx}
                    className="rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-extrabold px-2.5 py-1 text-xs border border-slate-300 dark:border-slate-700"
                  >
                    {s.trim()}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-black text-[#7F011F] dark:text-rose-400 uppercase text-xs tracking-wider border-b-2 border-[#7F011F]/30 dark:border-rose-400/30 pb-1 mb-2">
                Academic Projects
              </h3>
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100 whitespace-pre-line font-mono leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                {resumeData.projects}
              </p>
            </div>

            <div>
              <h3 className="font-black text-[#7F011F] dark:text-rose-400 uppercase text-xs tracking-wider border-b-2 border-[#7F011F]/30 dark:border-rose-400/30 pb-1 mb-2">
                Certifications &amp; Achievements
              </h3>
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100 whitespace-pre-line font-mono leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                {resumeData.certifications}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
