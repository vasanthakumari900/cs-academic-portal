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

export default function ResumeBuilderTab() {
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
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

  function handleChange(field, value) {
    setResumeData((prev) => ({ ...prev, [field]: value }));
  }

  function handleDownloadPDF() {
    try {
      const doc = new jsPDF();

      // Top Accent Line
      doc.setFillColor(2, 28, 79); // #021C4F
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
      doc.setTextColor(197, 3, 55); // #C50337
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("PROFESSIONAL SUMMARY", 20, 52);

      doc.setTextColor(50, 50, 50);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(resumeData.summary, 20, 60, { maxWidth: 170 });

      // Section: Technical Skills
      doc.setTextColor(197, 3, 55);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("TECHNICAL SKILLS", 20, 80);

      doc.setTextColor(50, 50, 50);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(resumeData.skills, 20, 88, { maxWidth: 170 });

      // Section: Projects
      doc.setTextColor(197, 3, 55);
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
      doc.setTextColor(197, 3, 55);
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
      {/* Top Header */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <FiFileText className="text-[#0F4C81] dark:text-sky-400" /> Professional Resume Builder
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Create ATS-friendly resumes with live preview and instant 1-click PDF download.
            </p>
          </div>

          <button
            onClick={handleDownloadPDF}
            className="inline-flex items-center gap-2 rounded-xl bg-[#C50337] hover:bg-[#a0022b] px-6 py-2.5 text-xs font-bold text-white shadow-md transition-all active:scale-95 shrink-0"
          >
            <FiDownload size={16} /> Download Resume PDF
          </button>
        </div>

        {/* Template Selector */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          <span className="font-bold text-slate-500">Choose Template:</span>
          {RESUME_TEMPLATES.map((tmpl) => (
            <button
              key={tmpl.id}
              onClick={() => setSelectedTemplate(tmpl.id)}
              className={`rounded-xl border px-3.5 py-1.5 font-bold transition-all ${
                selectedTemplate === tmpl.id
                  ? "border-[#0F4C81] bg-[#0F4C81]/10 text-[#0F4C81] dark:text-sky-300"
                  : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
              }`}
            >
              {tmpl.name}
            </button>
          ))}
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
        <div className="lg:col-span-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white text-slate-900 p-8 shadow-xl space-y-6">
          <div className="border-b-2 border-[#021C4F] pb-3 text-left">
            <h2 className="text-2xl font-extrabold text-[#021C4F] tracking-tight">
              {resumeData.fullName || "YOUR NAME"}
            </h2>
            <p className="text-xs text-slate-600 font-medium mt-0.5">
              {resumeData.email} · {resumeData.phone} · {resumeData.department} (CGPA: {resumeData.cgpa})
            </p>
          </div>

          <div className="space-y-4 text-left text-xs">
            <div>
              <h3 className="font-bold text-[#C50337] uppercase text-[11px] tracking-wider border-b border-slate-200 pb-1 mb-1">
                Professional Summary
              </h3>
              <p className="text-slate-700 leading-relaxed">{resumeData.summary}</p>
            </div>

            <div>
              <h3 className="font-bold text-[#C50337] uppercase text-[11px] tracking-wider border-b border-slate-200 pb-1 mb-1">
                Technical Skills
              </h3>
              <div className="flex flex-wrap gap-1 mt-1">
                {resumeData.skills.split(",").map((s, idx) => (
                  <span
                    key={idx}
                    className="rounded bg-slate-100 text-slate-800 px-2 py-0.5 text-[10px] font-semibold"
                  >
                    {s.trim()}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-[#C50337] uppercase text-[11px] tracking-wider border-b border-slate-200 pb-1 mb-1">
                Academic Projects
              </h3>
              <p className="text-slate-700 whitespace-pre-line font-mono text-[11px] leading-relaxed">
                {resumeData.projects}
              </p>
            </div>

            <div>
              <h3 className="font-bold text-[#C50337] uppercase text-[11px] tracking-wider border-b border-slate-200 pb-1 mb-1">
                Certifications
              </h3>
              <p className="text-slate-700 whitespace-pre-line font-mono text-[11px] leading-relaxed">
                {resumeData.certifications}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
