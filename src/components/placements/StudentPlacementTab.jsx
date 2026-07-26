// src/components/placements/StudentPlacementTab.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import {
  FiUser,
  FiCheckCircle,
  FiClock,
  FiCalendar,
  FiFileText,
  FiDownload,
  FiBriefcase,
  FiAward,
  FiCheck,
  FiAlertCircle,
  FiExternalLink,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { jsPDF } from "jspdf";
import {
  DEMO_STUDENT_PROFILE,
  DEMO_STUDENT_APPLICATIONS,
  DEMO_OFFER_LETTERS,
  DETAILED_COMPANY_DRIVES,
} from "../../utils/placementMockData";

export default function StudentPlacementTab({ onApplyCompany }) {
  const [activeSubTab, setActiveSubTab] = useState("applications");

  // Generate Sample Offer Letter PDF
  function handleDownloadOffer(offer) {
    try {
      const doc = new jsPDF();

      // Header
      doc.setFillColor(2, 28, 79); // #021C4F
      doc.rect(0, 0, 210, 40, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.text("DWARAKA DOSS GOVERDHAN DOSS VAISHNAV COLLEGE", 105, 18, { align: "center" });

      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text("DEPARTMENT OF COMPUTER SCIENCE — PLACEMENT CELL", 105, 28, { align: "center" });

      // Title
      doc.setTextColor(15, 76, 129);
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("OFFICIAL CAMPUS PLACEMENT OFFER LETTER", 105, 55, { align: "center" });

      // Body text
      doc.setTextColor(40, 40, 40);
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");

      doc.text(`Date: ${offer.issueDate}`, 20, 70);
      doc.text(`Ref No: DDGDVC/CS/PLAC/${offer.id.toUpperCase()}/2026`, 20, 78);

      doc.text(`Dear ${DEMO_STUDENT_PROFILE.name},`, 20, 95);
      doc.text(
        `Register Number: ${DEMO_STUDENT_PROFILE.registerNo} (${DEMO_STUDENT_PROFILE.department})`,
        20,
        103
      );

      doc.text(
        `We are pleased to congratulate you on your selection during the Campus Recruitment Drive conducted by ${offer.companyName}.`,
        20,
        118,
        { maxWidth: 170 }
      );

      doc.text("Offer Details:", 20, 138);
      doc.setFont("helvetica", "bold");
      doc.text(`• Company: ${offer.companyName}`, 25, 146);
      doc.text(`• Job Role: ${offer.role}`, 25, 154);
      doc.text(`• Annual CTC Package: ₹${offer.package}`, 25, 162);
      doc.text(`• Joining Location: ${offer.location}`, 25, 170);
      doc.text(`• Expected Joining Date: ${offer.joiningDate}`, 25, 178);

      doc.setFont("helvetica", "normal");
      doc.text(
        "Please accept this official confirmation for your records. Further onboarding details will be sent to your official college email.",
        20,
        195,
        { maxWidth: 170 }
      );

      // Signatures
      doc.setFont("helvetica", "bold");
      doc.text("Prof. Dr. K. Ramanathan", 20, 240);
      doc.setFont("helvetica", "normal");
      doc.text("Head, Placement Cell", 20, 246);
      doc.text("Dept of Computer Science", 20, 252);

      doc.setFont("helvetica", "bold");
      doc.text("Authorized Officer", 140, 240);
      doc.setFont("helvetica", "normal");
      doc.text(`${offer.companyName}`, 140, 246);

      doc.save(`${DEMO_STUDENT_PROFILE.name}_${offer.companyName}_OfferLetter.pdf`);
      toast.success("Offer letter downloaded successfully!");
    } catch (err) {
      toast.error("Failed to generate offer letter PDF");
    }
  }

  // Eligible companies for demo student (CGPA 8.4)
  const eligibleCompanies = DETAILED_COMPANY_DRIVES.filter(
    (c) => DEMO_STUDENT_PROFILE.cgpa >= c.minCgpa && DEMO_STUDENT_PROFILE.activeArrears <= (c.allowedArrears ?? 0)
  );

  return (
    <div className="space-y-6 text-left">
      {/* Student Profile Card */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#021C4F] to-[#C50337] text-white font-extrabold text-2xl shadow-md">
              {DEMO_STUDENT_PROFILE.name[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {DEMO_STUDENT_PROFILE.name}
                </h2>
                <span className="rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-0.5 text-xs font-bold flex items-center gap-1">
                  <FiCheckCircle size={12} /> Eligible for Drives
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Roll No: {DEMO_STUDENT_PROFILE.rollNo} · {DEMO_STUDENT_PROFILE.department} (Sec {DEMO_STUDENT_PROFILE.section}) · Batch {DEMO_STUDENT_PROFILE.graduationYear}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center self-stretch sm:self-auto">
            <div className="rounded-xl bg-slate-50 dark:bg-slate-800 p-2.5">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">CGPA</span>
              <strong className="text-sm font-extrabold text-[#0F4C81] dark:text-sky-400">
                {DEMO_STUDENT_PROFILE.cgpa}
              </strong>
            </div>

            <div className="rounded-xl bg-slate-50 dark:bg-slate-800 p-2.5">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Arrears</span>
              <strong className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                {DEMO_STUDENT_PROFILE.activeArrears}
              </strong>
            </div>

            <div className="rounded-xl bg-slate-50 dark:bg-slate-800 p-2.5">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Applications</span>
              <strong className="text-sm font-extrabold text-[#C50337] dark:text-rose-400">
                {DEMO_STUDENT_APPLICATIONS.length}
              </strong>
            </div>
          </div>
        </div>

        {/* Skill Pills */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2 text-xs">
          <span className="font-bold text-slate-500">Verified Skills:</span>
          {DEMO_STUDENT_PROFILE.skills.map((sk, idx) => (
            <span
              key={idx}
              className="rounded-md bg-sky-500/10 text-sky-700 dark:bg-sky-950 dark:text-sky-300 px-2.5 py-0.5 font-semibold text-[11px]"
            >
              {sk}
            </span>
          ))}
        </div>
      </div>

      {/* Sub-Navigation Buttons */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        {[
          { id: "applications", label: "My Applications", icon: FiBriefcase },
          { id: "eligible", label: `Eligible Drives (${eligibleCompanies.length})`, icon: FiCheckCircle },
          { id: "interviews", label: "Upcoming Interviews", icon: FiCalendar },
          { id: "offers", label: `Offer Letters (${DEMO_OFFER_LETTERS.length})`, icon: FiAward },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                isActive
                  ? "bg-[#0F4C81] text-white shadow-sm"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100"
              }`}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Sub-Tab Content Views */}

      {/* 1. Applications & Tracker */}
      {activeSubTab === "applications" && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
            Application Status & Hiring Stages
          </h3>

          <div className="space-y-4">
            {DEMO_STUDENT_APPLICATIONS.map((app) => (
              <div
                key={app.id}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
                        {app.companyName}
                      </h4>
                      <span className="text-xs text-slate-500">— {app.role}</span>
                    </div>
                    <p className="text-xs text-slate-400">Applied on {app.appliedDate}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-extrabold text-[#C50337] dark:text-rose-400">
                      {app.package}
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        app.status === "Selected"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : app.status === "Interview Scheduled"
                          ? "bg-sky-500/10 text-sky-600 dark:text-sky-400"
                          : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>
                </div>

                {/* Progress Stepper Line */}
                <div className="py-2">
                  <div className="flex items-center justify-between relative">
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 dark:bg-slate-800 -translate-y-1/2 z-0" />
                    <div
                      className="absolute top-1/2 left-0 h-1 bg-[#0F4C81] -translate-y-1/2 z-0 transition-all duration-500"
                      style={{
                        width: `${((app.stage - 1) / (app.totalStages - 1)) * 100}%`,
                      }}
                    />

                    {["Applied", "Shortlisted", "Assessment", "Selection / Offer"].map(
                      (stepName, sIdx) => {
                        const stepNum = sIdx + 1;
                        const isDone = app.stage >= stepNum;
                        return (
                          <div key={sIdx} className="relative z-10 flex flex-col items-center gap-1">
                            <div
                              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all ${
                                isDone
                                  ? "bg-[#0F4C81] text-white shadow-md"
                                  : "bg-slate-200 dark:bg-slate-800 text-slate-500"
                              }`}
                            >
                              {isDone ? <FiCheck size={14} /> : stepNum}
                            </div>
                            <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-400 hidden sm:inline">
                              {stepName}
                            </span>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>

                {/* Next Round Details Footer */}
                <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs gap-2">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    📍 Next Step: <strong>{app.nextRound}</strong>
                  </span>
                  <div className="text-slate-500 flex flex-wrap items-center gap-3">
                    <span>📅 {app.roundDate} ({app.roundTime})</span>
                    <span>🏢 {app.venue}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Eligible Drives */}
      {activeSubTab === "eligible" && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
            Companies Matching Your Academic Criteria (CGPA 8.4)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {eligibleCompanies.map((comp) => (
              <div
                key={comp.id}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm flex items-center justify-between"
              >
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {comp.companyName}
                  </h4>
                  <p className="text-xs text-slate-500">{comp.role}</p>
                  <p className="text-xs font-bold text-[#C50337] mt-1">₹{comp.package} LPA</p>
                </div>
                <button
                  onClick={() => onApplyCompany(comp)}
                  className="rounded-xl bg-[#0F4C81] hover:bg-[#1E88E5] px-4 py-2 text-xs font-bold text-white shadow-sm transition-all"
                >
                  1-Click Apply
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Upcoming Interviews */}
      {activeSubTab === "interviews" && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
            Scheduled Interview Slots
          </h3>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  Zoho Corporation — Advanced Coding & System Module Round
                </h4>
                <p className="text-xs text-slate-500">Candidate Slot ID: ZOHO-2026-CS104</p>
              </div>
              <span className="rounded-lg bg-sky-500/10 text-sky-600 px-3 py-1 text-xs font-bold">
                Aug 02, 2026
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600 dark:text-slate-300">
              <p>⏰ <strong>Time:</strong> 10:00 AM - 01:00 PM IST</p>
              <p>📍 <strong>Venue:</strong> Placement Cell Lab 2</p>
              <p>💻 <strong>Mode:</strong> Hands-on Console Programming</p>
            </div>
          </div>
        </div>
      )}

      {/* 4. Offer Letters */}
      {activeSubTab === "offers" && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
            Issued Campus Placement Offer Letters
          </h3>

          <div className="space-y-3">
            {DEMO_OFFER_LETTERS.map((offer) => (
              <div
                key={offer.id}
                className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <FiAward size={18} className="text-emerald-600" />
                    <h4 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                      {offer.companyName}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Role: <strong>{offer.role}</strong> · CTC Package:{" "}
                    <strong className="text-emerald-700 dark:text-emerald-400">₹{offer.package}</strong>
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Issued on: {offer.issueDate} · Expected Joining: {offer.joiningDate}
                  </p>
                </div>

                <button
                  onClick={() => handleDownloadOffer(offer)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-5 py-2.5 text-xs font-bold text-white shadow-md transition-all active:scale-95 shrink-0"
                >
                  <FiDownload size={14} /> Download Official PDF Offer Letter
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
