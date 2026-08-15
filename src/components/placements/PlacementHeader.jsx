// src/components/placements/PlacementHeader.jsx
import { motion } from "framer-motion";
import {
  FiBriefcase,
  FiMapPin,
  FiTrendingUp,
  FiAward,
  FiBookOpen,
  FiCheckCircle,
  FiDollarSign,
  FiUsers,
  FiPieChart,
  FiTool,
} from "react-icons/fi";

const PLACEMENT_TABS = [
  { id: "drives", label: "Campus Drives", icon: FiBriefcase, count: 6 },
  { id: "chennai-mnc", label: "Chennai MNC Directory", icon: FiMapPin, count: 16 },
  { id: "cgpa", label: "Overall CGPA Calculator", icon: FiCheckCircle },
  { id: "analytics", label: "Placement Stats", icon: FiPieChart },
  { id: "prephub", label: "Prep & Mock Tests", icon: FiBookOpen },
  { id: "toolkit", label: "Career Toolkit", icon: FiTool },
  { id: "experiences", label: "Senior Experiences", icon: FiUsers },
];

export default function PlacementHeader({ activeTab, onSelectTab, setActiveTab }) {
  const handleSelect = onSelectTab || setActiveTab || (() => {});
  return (
    <div className="space-y-6 text-left">
      {/* Classic Placement Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#7F011F] via-[#990227] to-[#021C4F] p-6 sm:p-8 text-white shadow-xl border border-white/10">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-extrabold text-amber-300 border border-white/15 backdrop-blur-md">
              <FiAward size={14} className="text-amber-400" />
              <span>DDGDVC Department of Computer Science</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Campus Placement Portal &amp; Career Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed">
              Live recruitment drives, AI voice interview screening, MNC tech directory, CGPA calculator &amp; senior experiences.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="rounded-2xl bg-white/10 p-3.5 backdrop-blur-md border border-white/15 text-center">
              <div className="flex items-center justify-center gap-1 text-emerald-400 text-sm font-black">
                <FiTrendingUp size={15} /> 94.2%
              </div>
              <p className="text-[10px] uppercase font-extrabold text-slate-300">Placement Rate</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-3.5 backdrop-blur-md border border-white/15 text-center">
              <div className="flex items-center justify-center gap-1 text-amber-300 text-sm font-black">
                <FiDollarSign size={15} /> ₹12 LPA
              </div>
              <p className="text-[10px] uppercase font-extrabold text-slate-300">Highest Package</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Module Tabs */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2.5 shadow-sm">
        {/* Desktop & Tablet Flex-Wrap Grid */}
        <div className="hidden sm:flex flex-wrap items-center gap-2">
          {PLACEMENT_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleSelect(tab.id)}
                className={`relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-extrabold transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#7F011F] text-white shadow-md font-black"
                    : "text-slate-800 dark:text-slate-100 hover:bg-rose-50 dark:hover:bg-slate-800 hover:text-[#7F011F] dark:hover:text-amber-300"
                }`}
              >
                <Icon size={16} className={isActive ? "text-amber-300" : "text-slate-600 dark:text-slate-300"} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Mobile Dropdown Selector */}
        <div className="sm:hidden">
          <label className="mb-1 block text-[10px] font-extrabold uppercase text-slate-400">
            Select Placement Module:
          </label>
          <select
            value={activeTab}
            onChange={(e) => handleSelect(e.target.value)}
            className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 text-xs font-bold text-slate-800 dark:text-slate-100"
          >
            {PLACEMENT_TABS.map((tab) => (
              <option key={tab.id} value={tab.id}>
                {tab.label} {tab.count !== undefined ? `(${tab.count})` : ""}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
