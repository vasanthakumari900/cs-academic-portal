// src/components/placements/PlacementHeader.jsx
import { motion } from "framer-motion";
import {
  FiPieChart,
  FiBriefcase,
  FiCheckCircle,
  FiBookOpen,
  FiSearch,
  FiSun,
  FiMoon,
  FiMessageSquare,
  FiPercent,
} from "react-icons/fi";

export const PLACEMENT_TABS = [
  { id: "drives", label: "Live Placement Drives", icon: FiBriefcase },
  { id: "cgpa", label: "CGPA & Percentage Calculator", icon: FiPercent },
  { id: "analytics", label: "Placement Analytics", icon: FiPieChart },
  { id: "prephub", label: "Prep & Practice Hub", icon: FiBookOpen },
  { id: "toolkit", label: "Career Tools & Eligibility", icon: FiCheckCircle },
  { id: "experiences", label: "Interview Logs & Alumni Connect", icon: FiMessageSquare },
];

export default function PlacementHeader({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  isDarkMode,
  setIsDarkMode,
}) {
  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#7F011F] via-[#990227] to-[#B80332] p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute left-1/2 bottom-0 -ml-16 -mb-16 h-48 w-48 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-left">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#F5EBD0] text-[#7F011F] px-3 py-1 text-xs font-black shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
              DDGDVC CS Academic Portal · Official Placement Details
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              Placement Details Portal
            </h1>
            <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-medium">
              Complete career ecosystem with live drive applications, student eligibility calculator, aptitude &amp; coding practice, ATS resume builder, and placement analytics.
            </p>
          </div>

          {/* Quick Actions & Controls */}
          <div className="flex flex-wrap items-center gap-3 self-stretch md:self-auto shrink-0 w-full md:w-auto">
            {/* Global Search input */}
            <div className="relative flex-1 sm:flex-none sm:w-64">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70" size={15} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search drives, skills, role..."
                className="w-full rounded-xl bg-white/15 hover:bg-white/20 focus:bg-white/25 pl-9 pr-3 py-2.5 text-xs font-semibold text-white placeholder-white/70 border border-white/30 focus:border-white/50 focus:outline-none backdrop-blur-md transition-all min-h-[44px]"
              />
            </div>

            {/* Dark/Light Theme Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="flex items-center gap-1.5 rounded-xl bg-[#F5EBD0] hover:bg-[#EBDCAE] px-3.5 py-2.5 text-xs font-black text-[#7F011F] border border-[#E6DAB8] shadow-sm transition-all min-h-[44px]"
              title="Toggle Dark/Light Mode"
            >
              {isDarkMode ? (
                <>
                  <FiSun size={15} className="text-amber-600" /> Light Mode
                </>
              ) : (
                <>
                  <FiMoon size={15} className="text-[#7F011F]" /> Dark Mode
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Streamlined 5 Sub-Tabs Navigation Bar - Horizontal Scroll on Mobile */}
      <div className="overflow-x-auto pb-1 scrollbar-none border-b border-[#E6DAB8]">
        <div className="flex items-center gap-2 min-w-max">
          {PLACEMENT_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 rounded-xl px-4 py-3 text-xs font-bold transition-all duration-200 min-h-[44px] ${
                  isActive
                    ? "bg-[#7F011F] text-white shadow-md"
                    : "text-[#7F011F] bg-white hover:bg-[#F5EBD0] border border-[#E6DAB8]"
                }`}
              >
                <Icon size={16} className={isActive ? "text-white" : "text-[#7F011F]"} />
                {tab.label}

                {isActive && (
                  <motion.div
                    layoutId="placement-tab-indicator"
                    className="absolute -bottom-1 left-2 right-2 h-0.5 rounded-full bg-[#7F011F]"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
