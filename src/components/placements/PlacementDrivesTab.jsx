import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  FiBriefcase,
  FiMapPin,
  FiCalendar,
  FiExternalLink,
  FiCheckCircle,
  FiSearch,
  FiFilter,
  FiCode,
  FiClock,
  FiDollarSign,
  FiAward,
  FiShield,
  FiAlertCircle,
} from "react-icons/fi";
import { DETAILED_COMPANY_DRIVES } from "../../utils/placementMockData";
import { formatDate } from "../../utils/helpers";
import { useAuth } from "../../context/AuthContext";

export default function PlacementDrivesTab({ searchQuery, onSelectCompany, onApplyCompany }) {
  const { user } = useAuth();
  const [localSearch, setLocalSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [minPackage, setMinPackage] = useState(0);
  const [selectedSkill, setSelectedSkill] = useState("All");
  const [sortBy, setSortBy] = useState("deadline");
  const [showOnlyEligible, setShowOnlyEligible] = useState(false);

  const query = searchQuery || localSearch;

  // Student Academic Attributes for Eligibility Matching
  const studentCgpa = parseFloat(user?.cgpa || "8.42");
  const studentBacklogs = user?.backlogs !== undefined ? Number(user.backlogs) : 0;

  // Parse required CGPA cutoff from company eligibility string (e.g. "CGPA 7.5+" -> 7.5)
  const getRequiredCutoff = (eligibilityStr) => {
    const match = String(eligibilityStr || "").match(/(\d+\.\d+|\d+)/);
    return match ? parseFloat(match[1]) : 6.0;
  };

  // Check if student meets CGPA & Backlog cutoff
  const checkDriveEligibility = (company) => {
    const requiredCgpa = getRequiredCutoff(company.eligibility);
    const isCgpaEligible = studentCgpa >= requiredCgpa;
    const isBacklogEligible = studentBacklogs <= 0; // standard 0 standing backlogs rule
    return {
      isEligible: isCgpaEligible && isBacklogEligible,
      requiredCgpa,
      isCgpaEligible,
      isBacklogEligible,
    };
  };

  // Extract unique skills
  const allSkills = useMemo(() => {
    const skillsSet = new Set();
    DETAILED_COMPANY_DRIVES.forEach((d) => {
      if (Array.isArray(d.skills)) {
        d.skills.forEach((s) => skillsSet.add(s.trim()));
      } else if (d.skills) {
        d.skills.split(",").forEach((s) => skillsSet.add(s.trim()));
      }
    });
    return ["All", ...Array.from(skillsSet)];
  }, []);

  // Filter and Sort logic
  const filteredDrives = useMemo(() => {
    return DETAILED_COMPANY_DRIVES.filter((d) => {
      const matchSearch =
        !query ||
        d.companyName.toLowerCase().includes(query.toLowerCase()) ||
        d.role.toLowerCase().includes(query.toLowerCase()) ||
        (d.location && d.location.toLowerCase().includes(query.toLowerCase()));

      const matchStatus = selectedStatus === "All" || d.status === selectedStatus;
      const matchPackage = d.package >= Number(minPackage);

      const skillsArr = Array.isArray(d.skills)
        ? d.skills
        : (d.skills || "").split(",").map((s) => s.trim());
      const matchSkill = selectedSkill === "All" || skillsArr.includes(selectedSkill);

      const eligibility = checkDriveEligibility(d);
      const matchEligible = !showOnlyEligible || eligibility.isEligible;

      return matchSearch && matchStatus && matchPackage && matchSkill && matchEligible;
    }).sort((a, b) => {
      if (sortBy === "packageHigh") return b.package - a.package;
      if (sortBy === "packageLow") return a.package - b.package;
      if (sortBy === "name") return a.companyName.localeCompare(b.companyName);
      return new Date(a.deadline) - new Date(b.deadline);
    });
  }, [query, selectedStatus, minPackage, selectedSkill, sortBy, showOnlyEligible, studentCgpa, studentBacklogs]);

  // Read applied drive IDs from localStorage
  const appliedDriveIds = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("ddgdvc_applied_drives") || "[]");
    } catch {
      return [];
    }
  }, []);

  const eligibleCount = useMemo(() => {
    return DETAILED_COMPANY_DRIVES.filter((d) => checkDriveEligibility(d).isEligible).length;
  }, [studentCgpa, studentBacklogs]);

  return (
    <div className="space-y-6 text-left">
      {/* Controls & Filter Bar */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Local Search input */}
          <div className="relative flex-1">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search companies, job roles, locations..."
              className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 pl-10 pr-4 py-2.5 text-xs font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#7F011F]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Status Filter */}
            <div className="flex items-center gap-1 text-xs">
              <span className="font-bold text-slate-500 dark:text-slate-400 hidden sm:inline">Drive Status:</span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none"
              >
                <option value="All">All Drives ({DETAILED_COMPANY_DRIVES.length})</option>
                <option value="Ongoing">🟢 Live &amp; Ongoing ({DETAILED_COMPANY_DRIVES.filter(d => d.status === "Ongoing").length})</option>
                <option value="Upcoming">📅 Upcoming ({DETAILED_COMPANY_DRIVES.filter(d => d.status === "Upcoming").length})</option>
                <option value="Closed">Closed Drives ({DETAILED_COMPANY_DRIVES.filter(d => d.status === "Closed").length})</option>
              </select>
            </div>

            {/* Min Package Filter */}
            <div className="flex items-center gap-1 text-xs">
              <span className="font-bold text-slate-500 dark:text-slate-400 hidden sm:inline">Min Package:</span>
              <select
                value={minPackage}
                onChange={(e) => setMinPackage(e.target.value)}
                className="rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none"
              >
                <option value={0}>All Packages</option>
                <option value={6}>6+ LPA</option>
                <option value={10}>10+ LPA</option>
                <option value={20}>20+ LPA</option>
              </select>
            </div>

            {/* Skill Filter */}
            <div className="flex items-center gap-1 text-xs">
              <span className="font-bold text-slate-500 dark:text-slate-400 hidden sm:inline">Skill:</span>
              <select
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
                className="rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none max-w-[130px]"
              >
                {allSkills.map((sk) => (
                  <option key={sk} value={sk}>
                    {sk}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Options */}
            <div className="flex items-center gap-1 text-xs">
              <span className="font-bold text-slate-500 dark:text-slate-400 hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none"
              >
                <option value="deadline">Deadline (Earliest)</option>
                <option value="packageHigh">Package (High to Low)</option>
                <option value="packageLow">Package (Low to High)</option>
                <option value="name">Company Name</option>
              </select>
            </div>
          </div>
        </div>

        {/* Quick Filter Pills & Automated Eligibility Filter Toggle */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex-wrap text-xs">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
            <span className="font-bold text-slate-400 shrink-0">Quick Filter:</span>
            {["All", "Ongoing", "Upcoming", "Closed"].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`rounded-full px-3 py-1 font-extrabold transition-all shrink-0 cursor-pointer ${
                  selectedStatus === st
                    ? "bg-[#7F011F] text-white shadow-sm"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                }`}
              >
                {st === "Ongoing" ? "🟢 Live & Ongoing" : st === "Upcoming" ? "📅 Upcoming" : st}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowOnlyEligible(!showOnlyEligible)}
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 font-black transition-all shrink-0 cursor-pointer ${
              showOnlyEligible
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 hover:bg-emerald-500/20"
            }`}
          >
            <FiShield size={14} />
            <span>Show Eligible Drives Only ({eligibleCount}/{DETAILED_COMPANY_DRIVES.length})</span>
          </button>
        </div>
      </div>

      {/* Dynamic Company Card Grid */}
      {filteredDrives.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center space-y-3">
          <FiBriefcase className="mx-auto text-slate-400" size={40} />
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-200">
            No Placement Drives Found
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search criteria or resetting filters to see available recruitment drives.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDrives.map((company, idx) => {
            const isClosed = company.status === "Closed";
            const hasApplied = appliedDriveIds.includes(company.id);
            const skillsArr = Array.isArray(company.skills)
              ? company.skills
              : String(company.skills || "").split(",");

            return (
              <motion.div
                key={company.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                className="group flex flex-col justify-between rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm hover:shadow-xl hover:border-[#7F011F]/30 transition-all duration-300 space-y-4 text-left"
              >
                {/* Top Company Badge & Logo Header */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 shadow-md">
                        {company.logoUrl ? (
                          <img
                            src={company.logoUrl}
                            alt={company.companyName}
                            className="h-8 w-8 object-contain"
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.nextSibling.style.display = "flex";
                            }}
                          />
                        ) : null}
                        <div
                          className="hidden h-full w-full items-center justify-center rounded-xl bg-gradient-to-tr from-[#7F011F] to-amber-500 text-white font-black text-lg"
                        >
                          {company.companyName?.[0]}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-base font-black text-slate-900 dark:text-white group-hover:text-[#7F011F] dark:group-hover:text-sky-400 transition-colors">
                          {company.companyName}
                        </h3>
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                          <FiBriefcase size={12} className="text-[#7F011F] dark:text-sky-400" /> {company.role}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-black ${
                        hasApplied
                          ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40"
                          : company.status === "Ongoing"
                          ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30"
                          : company.status === "Closed"
                          ? "bg-slate-100 dark:bg-slate-800 text-slate-500"
                          : "bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30"
                      }`}
                    >
                      {hasApplied ? "✓ Registered" : company.status === "Ongoing" ? "🟢 Live & Ongoing" : company.status || "Upcoming"}
                    </span>
                  </div>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                    <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-2.5 border border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase font-extrabold block">
                        Salary CTC
                      </span>
                      <strong className="text-sm font-black text-[#7F011F] dark:text-rose-400">
                        ₹{company.package} LPA
                      </strong>
                    </div>

                    <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-2.5 border border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase font-extrabold block">
                        Eligibility Cutoff
                      </span>
                      <strong className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {company.eligibility || "CGPA 6.0+"}
                      </strong>
                    </div>
                  </div>

                  {/* Automated Student Eligibility Status Banner */}
                  {(() => {
                    const eligibility = checkDriveEligibility(company);
                    return (
                      <div
                        className={`rounded-xl p-2.5 flex items-center justify-between text-xs font-black border ${
                          eligibility.isEligible
                            ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20"
                            : "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20"
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          {eligibility.isEligible ? <FiShield size={15} /> : <FiAlertCircle size={15} />}
                          <span>
                            {eligibility.isEligible
                              ? "Eligible to Apply"
                              : `Ineligible (Min ${eligibility.requiredCgpa} CGPA)`}
                          </span>
                        </span>
                        <span className="text-[10px] font-extrabold uppercase opacity-80">
                          Your CGPA: {studentCgpa}
                        </span>
                      </div>
                    );
                  })()}

                  {/* Skills tags */}
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                      <FiCode size={11} /> Key Skillsets
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {skillsArr.slice(0, 3).map((sk, sIdx) => (
                        <span
                          key={sIdx}
                          className="rounded-md bg-sky-500/10 text-sky-800 dark:bg-sky-950 dark:text-sky-300 px-2 py-0.5 text-[10px] font-extrabold border border-sky-500/20"
                        >
                          {sk.trim()}
                        </span>
                      ))}
                      {skillsArr.length > 3 && (
                        <span className="rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 px-1.5 py-0.5 text-[10px] font-bold">
                          +{skillsArr.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Location & Drive Date */}
                  <div className="space-y-1.5 pt-1 text-left">
                    <p className="flex items-center gap-1.5 leading-tight">
                      <FiMapPin size={13} className="text-slate-500 dark:text-slate-400 shrink-0" />
                      <span>
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">Location:</span>{" "}
                        <span className="text-[11px] font-extrabold text-slate-800 dark:text-slate-100">
                          {company.location || "Chennai / Pan India"}
                        </span>
                      </span>
                    </p>
                    <p className="flex items-center gap-1.5 leading-tight">
                      <FiCalendar size={13} className="text-slate-500 dark:text-slate-400 shrink-0" />
                      <span>
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">Drive Date:</span>{" "}
                        <span className="text-[11px] font-extrabold text-slate-800 dark:text-slate-100">
                          {formatDate(company.driveDate || company.deadline)}
                        </span>
                      </span>
                    </p>
                    <p className="flex items-center gap-1.5 leading-tight">
                      <FiClock size={13} className="text-amber-500 shrink-0" />
                      <span>
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">Apply Before:</span>{" "}
                        <span className="text-[11px] font-extrabold text-[#7F011F] dark:text-rose-400">
                          {formatDate(company.deadline)}
                        </span>
                      </span>
                    </p>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                  <button
                    onClick={() => onSelectCompany(company)}
                    className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 py-2.5 text-xs font-extrabold text-slate-700 dark:text-slate-200 transition-all text-center cursor-pointer"
                  >
                    View Details
                  </button>

                  <button
                    disabled={isClosed || hasApplied}
                    onClick={() => onApplyCompany(company)}
                    className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-extrabold transition-all cursor-pointer ${
                      hasApplied
                        ? "bg-emerald-600 text-white cursor-default shadow-sm"
                        : isClosed
                        ? "bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed"
                        : "bg-gradient-to-r from-[#7F011F] to-[#021C4F] hover:from-[#990227] hover:to-[#0F4C81] text-white shadow-md active:scale-95"
                    }`}
                  >
                    {hasApplied ? (
                      <>
                        Applied <FiCheckCircle size={13} />
                      </>
                    ) : isClosed ? (
                      "Closed"
                    ) : (
                      <>
                        Apply Now <FiCheckCircle size={13} />
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
