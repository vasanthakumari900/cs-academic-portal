// src/components/placements/PlacementDrivesTab.jsx
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
} from "react-icons/fi";
import { DETAILED_COMPANY_DRIVES } from "../../utils/placementMockData";
import { formatDate } from "../../utils/helpers";

export default function PlacementDrivesTab({ searchQuery, onSelectCompany, onApplyCompany }) {
  const [localSearch, setLocalSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [minPackage, setMinPackage] = useState(0);
  const [selectedSkill, setSelectedSkill] = useState("All");
  const [sortBy, setSortBy] = useState("deadline");

  const query = searchQuery || localSearch;

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
      // Search
      const matchSearch =
        !query ||
        d.companyName.toLowerCase().includes(query.toLowerCase()) ||
        d.role.toLowerCase().includes(query.toLowerCase()) ||
        (d.location && d.location.toLowerCase().includes(query.toLowerCase()));

      // Status Filter
      const matchStatus = selectedStatus === "All" || d.status === selectedStatus;

      // Min Package Filter
      const matchPackage = d.package >= Number(minPackage);

      // Skill Filter
      const skillsArr = Array.isArray(d.skills)
        ? d.skills
        : (d.skills || "").split(",").map((s) => s.trim());
      const matchSkill = selectedSkill === "All" || skillsArr.includes(selectedSkill);

      return matchSearch && matchStatus && matchPackage && matchSkill;
    }).sort((a, b) => {
      if (sortBy === "packageHigh") return b.package - a.package;
      if (sortBy === "packageLow") return a.package - b.package;
      if (sortBy === "name") return a.companyName.localeCompare(b.companyName);
      // default: deadline
      return new Date(a.deadline) - new Date(b.deadline);
    });
  }, [query, selectedStatus, minPackage, selectedSkill, sortBy]);

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
              className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 pl-10 pr-4 py-2.5 text-xs font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0F4C81]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Status Filter */}
            <div className="flex items-center gap-1 text-xs">
              <span className="font-bold text-slate-500 dark:text-slate-400 hidden sm:inline">Status:</span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none"
              >
                <option value="All">All Status</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Closed">Closed</option>
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

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
          <span>
            Showing <strong>{filteredDrives.length}</strong> active placement drives
          </span>
          {(query || selectedStatus !== "All" || minPackage > 0 || selectedSkill !== "All") && (
            <button
              onClick={() => {
                setLocalSearch("");
                setSelectedStatus("All");
                setMinPackage(0);
                setSelectedSkill("All");
              }}
              className="text-[#C50337] font-semibold hover:underline"
            >
              Reset Filters
            </button>
          )}
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
            const skillsArr = Array.isArray(company.skills)
              ? company.skills
              : String(company.skills || "").split(",");

            return (
              <motion.div
                key={company.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                className="group flex flex-col justify-between rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm hover:shadow-xl hover:border-[#0F4C81]/40 transition-all duration-300 space-y-4"
              >
                {/* Top Company Badge & Logo Header */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#021C4F] to-[#0F4C81] text-white font-bold text-xl shadow-md">
                        {company.logoUrl ? (
                          <img
                            src={company.logoUrl}
                            alt={company.companyName}
                            className="h-8 w-8 object-contain"
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.nextSibling.style.display = "block";
                            }}
                          />
                        ) : null}
                        <span className="hidden">{company.companyName?.[0]}</span>
                      </div>
                      <div>
                        <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-[#0F4C81] dark:group-hover:text-sky-400 transition-colors">
                          {company.companyName}
                        </h3>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <FiBriefcase size={12} /> {company.role}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        company.status === "Ongoing"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : company.status === "Closed"
                          ? "bg-slate-100 dark:bg-slate-800 text-slate-500"
                          : "bg-sky-500/10 text-sky-600 dark:text-sky-400"
                      }`}
                    >
                      {company.status || "Upcoming"}
                    </span>
                  </div>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                    <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-2.5">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">
                        Salary Package
                      </span>
                      <strong className="text-sm font-extrabold text-[#C50337] dark:text-rose-400">
                        ₹{company.package} LPA
                      </strong>
                    </div>

                    <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-2.5">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">
                        Eligibility
                      </span>
                      <strong className="text-xs font-bold text-slate-700 dark:text-slate-200">
                        {company.eligibility || "CGPA 6.0+"}
                      </strong>
                    </div>
                  </div>

                  {/* Skills tags */}
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                      <FiCode size={11} /> Required Skills
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {skillsArr.slice(0, 3).map((sk, sIdx) => (
                        <span
                          key={sIdx}
                          className="rounded-md bg-sky-500/10 text-sky-700 dark:bg-sky-950 dark:text-sky-300 px-2 py-0.5 text-[10px] font-semibold"
                        >
                          {sk.trim()}
                        </span>
                      ))}
                      {skillsArr.length > 3 && (
                        <span className="rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 px-1.5 py-0.5 text-[10px]">
                          +{skillsArr.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Location & Drive Date */}
                  <div className="text-xs space-y-1 text-slate-500 dark:text-slate-400 pt-1">
                    <p className="flex items-center gap-1.5">
                      <FiMapPin size={13} className="text-slate-400" /> Location:{" "}
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {company.location || "Pan India"}
                      </span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <FiCalendar size={13} className="text-slate-400" /> Drive Date:{" "}
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {formatDate(company.driveDate || company.deadline)}
                      </span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <FiClock size={13} className="text-amber-500" /> Apply Before:{" "}
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {formatDate(company.deadline)}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                  <button
                    onClick={() => onSelectCompany(company)}
                    className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 transition-all text-center"
                  >
                    View Details
                  </button>

                  <button
                    disabled={isClosed}
                    onClick={() => onApplyCompany(company)}
                    className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-bold text-white shadow-sm transition-all ${
                      isClosed
                        ? "bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed"
                        : "bg-[#0F4C81] hover:bg-[#1E88E5] active:scale-95"
                    }`}
                  >
                    {isClosed ? "Closed" : "Apply Now"} <FiCheckCircle size={13} />
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
