// src/components/placements/EligibilityCheckerTab.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import {
  FiCheckCircle,
  FiXCircle,
  FiAward,
  FiCheck,
  FiAlertTriangle,
  FiSearch,
} from "react-icons/fi";
import { DETAILED_COMPANY_DRIVES } from "../../utils/placementMockData";

export default function EligibilityCheckerTab({ onApplyCompany }) {
  const [department, setDepartment] = useState("B.Sc CS");
  const [year, setYear] = useState("3rd Year");
  const [cgpa, setCgpa] = useState(7.5);
  const [arrears, setArrears] = useState(0);
  const [gradYear, setGradYear] = useState(2026);
  const [userSkills, setUserSkills] = useState(["Java", "Python", "SQL"]);

  // Calculate matching & eligibility status for each company
  const results = DETAILED_COMPANY_DRIVES.map((company) => {
    const cgpaOk = cgpa >= (company.minCgpa || 6.0);
    const arrearsOk = arrears <= (company.allowedArrears ?? 0);
    const deptOk = !company.allowedDepts || company.allowedDepts.includes(department);

    let matchScore = 0;
    if (cgpaOk) matchScore += 40;
    if (arrearsOk) matchScore += 40;
    if (deptOk) matchScore += 20;

    const isFullyEligible = cgpaOk && arrearsOk && deptOk;

    return {
      company,
      cgpaOk,
      arrearsOk,
      deptOk,
      matchScore,
      isFullyEligible,
    };
  });

  const eligibleCount = results.filter((r) => r.isFullyEligible).length;

  return (
    <div className="space-y-6 text-left">
      {/* Tool Header & Form Container */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-6">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FiCheckCircle className="text-[#0F4C81] dark:text-sky-400" /> Student Placement Eligibility Checker
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Input your current academic criteria to instantly evaluate your eligibility across all active campus recruitment drives.
          </p>
        </div>

        {/* Input Fields Form Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Department */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Department / Course</label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none"
            >
              <option value="B.Sc CS">B.Sc Computer Science</option>
              <option value="BCA">BCA (Bachelor of Computer Applications)</option>
              <option value="M.Sc CS">M.Sc Computer Science</option>
            </select>
          </div>

          {/* Year of Study */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Year of Study</label>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none"
            >
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
            </select>
          </div>

          {/* Graduation Year */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Graduation Year</label>
            <select
              value={gradYear}
              onChange={(e) => setGradYear(Number(e.target.value))}
              className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none"
            >
              <option value={2025}>2025</option>
              <option value={2026}>2026</option>
              <option value={2027}>2027</option>
            </select>
          </div>

          {/* CGPA Slider */}
          <div className="space-y-1.5 sm:col-span-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Current CGPA: <span className="text-[#C50337] text-sm font-extrabold">{cgpa}</span>
              </label>
              <span className="text-[11px] text-slate-400">Scale: 0.0 - 10.0</span>
            </div>
            <input
              type="range"
              min="5.0"
              max="10.0"
              step="0.1"
              value={cgpa}
              onChange={(e) => setCgpa(parseFloat(e.target.value))}
              className="w-full accent-[#0F4C81] cursor-pointer"
            />
          </div>

          {/* Active Standing Arrears */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Active Arrears</label>
            <select
              value={arrears}
              onChange={(e) => setArrears(Number(e.target.value))}
              className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none"
            >
              <option value={0}>0 Active Arrears (Clean Record)</option>
              <option value={1}>1 Arrear Standing</option>
              <option value={2}>2 Arrears Standing</option>
              <option value={3}>3+ Arrears</option>
            </select>
          </div>
        </div>

        {/* Dynamic Summary Banner */}
        <div className="rounded-xl bg-gradient-to-r from-[#021C4F] to-[#0F4C81] p-4 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
          <div>
            <h3 className="text-base font-extrabold text-white">
              You are Eligible for {eligibleCount} out of {results.length} Placement Drives!
            </h3>
            <p className="text-xs text-white/80 mt-0.5">
              Based on CGPA {cgpa}, {arrears} Arrears in {department} ({year}).
            </p>
          </div>
          <span className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-extrabold text-white shrink-0">
            {Math.round((eligibleCount / results.length) * 100)}% Match Rate
          </span>
        </div>
      </div>

      {/* Results Breakdown Grid */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
          Drive Eligibility Results Breakdown
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {results.map(({ company, cgpaOk, arrearsOk, deptOk, matchScore, isFullyEligible }) => (
            <div
              key={company.id}
              className={`rounded-2xl border p-5 transition-all space-y-4 ${
                isFullyEligible
                  ? "border-emerald-500/40 bg-white dark:bg-slate-900 shadow-sm"
                  : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 opacity-90"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    {company.companyName}
                  </h4>
                  <p className="text-xs text-slate-500">{company.role}</p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-extrabold flex items-center gap-1 ${
                    isFullyEligible
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                  }`}
                >
                  {isFullyEligible ? (
                    <>
                      <FiCheckCircle size={13} /> Eligible
                    </>
                  ) : (
                    <>
                      <FiXCircle size={13} /> Not Eligible
                    </>
                  )}
                </span>
              </div>

              {/* Criteria Check list */}
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400">
                    Required CGPA: <strong>{company.minCgpa || 6.0}+</strong>
                  </span>
                  <span className={cgpaOk ? "text-emerald-600 font-bold" : "text-rose-500 font-bold"}>
                    {cgpaOk ? `✓ CGPA ${cgpa} Met` : `✗ CGPA ${cgpa} Below Cutoff`}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400">
                    Allowed Arrears: <strong>{company.allowedArrears ?? 0} Max</strong>
                  </span>
                  <span className={arrearsOk ? "text-emerald-600 font-bold" : "text-rose-500 font-bold"}>
                    {arrearsOk ? `✓ Arrears (${arrears}) OK` : `✗ Arrears Exceeded`}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Department Eligibility:</span>
                  <span className={deptOk ? "text-emerald-600 font-bold" : "text-rose-500 font-bold"}>
                    {deptOk ? `✓ ${department} Allowed` : `✗ Course Restricted`}
                  </span>
                </div>
              </div>

              {/* Package & Action */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-[#C50337]">₹{company.package} LPA</span>
                <button
                  disabled={!isFullyEligible}
                  onClick={() => onApplyCompany(company)}
                  className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                    isFullyEligible
                      ? "bg-[#0F4C81] hover:bg-[#1E88E5] text-white shadow-sm active:scale-95"
                      : "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  {isFullyEligible ? "Apply Now" : "Criteria Not Met"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
