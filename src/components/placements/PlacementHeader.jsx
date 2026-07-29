// src/components/placements/PlacementHeader.jsx
import { motion } from "framer-motion";
import {
  FiPieChart,
  FiBriefcase,
  FiUserCheck,
  FiCheckCircle,
  FiBookOpen,
  FiCode,
  FiFileText,
  FiFolder,
  FiCalendar,
  FiAward,
  FiBell,
  FiHelpCircle,
  FiPhone,
  FiShield,
  FiSearch,
  FiSun,
  FiMoon,
  FiMessageSquare,
} from "react-icons/fi";

export const PLACEMENT_TABS = [
  { id: "dashboard", label: "Dashboard", icon: FiPieChart },
  { id: "drives", label: "Placement Drives", icon: FiBriefcase },
  { id: "student-dash", label: "Student Dashboard", icon: FiUserCheck },
  { id: "eligibility", label: "Eligibility Checker", icon: FiCheckCircle },
  { id: "aptitude", label: "Aptitude Prep", icon: FiBookOpen },
  { id: "coding", label: "Coding Practice", icon: FiCode },
  { id: "interview-exp", label: "Interview Experiences", icon: FiMessageSquare },
  { id: "interview", label: "Interview Prep", icon: FiFileText },
  { id: "resume", label: "Resume Builder", icon: FiFileText },
  { id: "training", label: "Training Materials", icon: FiFolder },
  { id: "calendar", label: "Placement Calendar", icon: FiCalendar },
  { id: "alumni", label: "Alumni Stories", icon: FiAward },
  { id: "notifications", label: "Notifications", icon: FiBell },
  { id: "faq", label: "FAQ", icon: FiHelpCircle },
  { id: "contact", label: "Contact Officer", icon: FiPhone },
  { id: "admin", label: "Admin Panel", icon: FiShield },
];

export default function PlacementHeader({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  isDarkMode,
  setIsDarkMode,
  unreadCount = 2,
}) {
  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#021C4F] via-[#0F4C81] to-[#C50337] p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute left-1/2 bottom-0 -ml-16 -mb-16 h-48 w-48 rounded-full bg-red-500/20 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-left">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              DDGDVC CS Academic Portal · Official Placement Details
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Placement Details Portal
            </h1>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
              Complete career ecosystem with live drive applications, student eligibility calculator, aptitude & coding practice, resume tools, and placement analytics.
            </p>
          </div>

          {/* Quick Actions & Controls */}
          <div className="flex flex-wrap items-center gap-3 self-stretch md:self-auto shrink-0">
            {/* Global Search input */}
            <div className="relative flex-1 sm:flex-none sm:w-64">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60" size={15} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search drives, skills, role..."
                className="w-full rounded-xl bg-white/10 hover:bg-white/15 focus:bg-white/20 pl-9 pr-3 py-2 text-xs font-medium text-white placeholder-white/60 border border-white/20 focus:border-white/40 focus:outline-none backdrop-blur-md transition-all"
              />
            </div>

            {/* Dark/Light Theme Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="flex items-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/20 px-3.5 py-2 text-xs font-semibold text-white border border-white/20 backdrop-blur-md transition-all"
              title="Toggle Dark/Light Mode"
            >
              {isDarkMode ? (
                <>
                  <FiSun size={15} className="text-amber-300" /> Light
                </>
              ) : (
                <>
                  <FiMoon size={15} className="text-sky-200" /> Dark
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Sub-Tabs Scrollable Navigation Bar */}
      <div className="overflow-x-auto pb-1 no-scrollbar border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-1.5 min-w-max">
          {PLACEMENT_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? "bg-[#C50337] text-white shadow-md shadow-[#C50337]/20"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <Icon size={15} className={isActive ? "text-white" : "text-slate-400"} />
                {tab.label}

                {tab.id === "notifications" && unreadCount > 0 && (
                  <span className="ml-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-[10px] font-extrabold text-slate-900">
                    {unreadCount}
                  </span>
                )}

                {isActive && (
                  <motion.div
                    layoutId="placement-tab-indicator"
                    className="absolute -bottom-1 left-2 right-2 h-0.5 rounded-full bg-[#C50337]"
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
