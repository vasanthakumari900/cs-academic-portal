// src/components/placements/PlacementDashboardTab.jsx
import { motion } from "framer-motion";
import {
  FiBriefcase,
  FiUserCheck,
  FiTrendingUp,
  FiAward,
  FiCalendar,
  FiArrowRight,
  FiCheckCircle,
  FiBell,
} from "react-icons/fi";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import { PLACEMENT_STATS, PLACEMENT_NEWS, DETAILED_COMPANY_DRIVES } from "../../utils/placementMockData";

export default function PlacementDashboardTab({ onNavigateTab, onSelectCompany }) {
  const upcomingDrives = DETAILED_COMPANY_DRIVES.filter((d) => d.status !== "Closed");

  return (
    <div className="space-y-8 text-left">
      {/* 4 Stat Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm hover:shadow-md transition-all flex items-center justify-between"
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Companies
            </p>
            <h3 className="mt-1 text-3xl font-extrabold text-[#021C4F] dark:text-sky-300">
              {PLACEMENT_STATS.totalCompanies}+
            </h3>
            <p className="mt-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <FiTrendingUp size={12} /> +14% vs last year
            </p>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
            <FiBriefcase size={26} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm hover:shadow-md transition-all flex items-center justify-between"
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Students Placed
            </p>
            <h3 className="mt-1 text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {PLACEMENT_STATS.studentsPlaced}
            </h3>
            <p className="mt-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              {PLACEMENT_STATS.placementRate}% Placement Rate
            </p>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <FiUserCheck size={26} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm hover:shadow-md transition-all flex items-center justify-between"
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Highest Package
            </p>
            <h3 className="mt-1 text-3xl font-extrabold text-[#C50337] dark:text-rose-400">
              ₹{PLACEMENT_STATS.highestPackage} <span className="text-sm font-bold">LPA</span>
            </h3>
            <p className="mt-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              Atlassian / Google Offer
            </p>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 text-[#C50337]">
            <FiAward size={26} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm hover:shadow-md transition-all flex items-center justify-between"
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Average Package
            </p>
            <h3 className="mt-1 text-3xl font-extrabold text-amber-600 dark:text-amber-400">
              ₹{PLACEMENT_STATS.averagePackage} <span className="text-sm font-bold">LPA</span>
            </h3>
            <p className="mt-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              Across CS Departments
            </p>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <FiTrendingUp size={26} />
          </div>
        </motion.div>
      </div>

      {/* Interactive Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Year-Wise Placements */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                Year-wise Placement Trend (2022 - 2026)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Total students placed & average package growth
              </p>
            </div>
            <span className="rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 px-2.5 py-1 text-xs font-bold">
              5-Year Growth
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={PLACEMENT_STATS.yearWise}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="left" orientation="left" stroke="#0F4C81" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="right" orientation="right" stroke="#C50337" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#021C4F",
                    borderColor: "#0F4C81",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                />
                <Bar yAxisId="left" dataKey="placed" name="Placed Students" fill="#0F4C81" radius={[6, 6, 0, 0]} />
                <Bar yAxisId="right" dataKey="avg" name="Avg Package (LPA)" fill="#C50337" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Package Distribution */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                Salary Package Range Distribution
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Offers breakdown across salary bands
              </p>
            </div>
            <span className="rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 text-xs font-bold">
              Batch 2025-26
            </span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={PLACEMENT_STATS.packageDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="count"
                  nameKey="range"
                >
                  {PLACEMENT_STATS.packageDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#021C4F",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
            {PLACEMENT_STATS.packageDistribution.map((item, idx) => (
              <span key={idx} className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                {item.range}: <strong>{item.count}</strong>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Top Recruiters & News Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Recruiters List */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <FiAward className="text-[#C50337]" /> Top Recruiting Partners
            </h3>
            <button
              onClick={() => onNavigateTab("drives")}
              className="text-xs font-bold text-[#0F4C81] dark:text-sky-400 hover:underline flex items-center gap-1"
            >
              View All Drives <FiArrowRight size={12} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PLACEMENT_STATS.topRecruiters.map((rec, rIdx) => (
              <div
                key={rIdx}
                className="flex items-center justify-between rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-3.5"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#021C4F] text-white font-bold text-sm">
                    {rec.name[0]}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">{rec.name}</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Avg: {rec.avgPackage}</p>
                  </div>
                </div>
                <span className="rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 text-xs font-extrabold">
                  {rec.hires} Hires
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent News Feed */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <FiBell className="text-[#C50337]" /> Placement News
            </h3>
            <span className="text-xs text-slate-400">Live</span>
          </div>

          <div className="space-y-3">
            {PLACEMENT_NEWS.map((news) => (
              <div
                key={news.id}
                className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-3.5 space-y-1 hover:border-[#0F4C81]/30 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-[#C50337]/10 text-[#C50337] px-2 py-0.5 text-[10px] font-bold">
                    {news.tag}
                  </span>
                  <span className="text-[10px] text-slate-400">{news.date}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-1">
                  {news.title}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {news.summary}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Placement Drives Quick Slider/Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <FiCalendar className="text-[#0F4C81] dark:text-sky-400" /> Upcoming Placement Drives
          </h3>
          <button
            onClick={() => onNavigateTab("drives")}
            className="text-xs font-bold text-[#0F4C81] dark:text-sky-400 hover:underline flex items-center gap-1"
          >
            Explore All Drives ({upcomingDrives.length}) <FiArrowRight size={12} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {upcomingDrives.slice(0, 3).map((drive) => (
            <div
              key={drive.id}
              onClick={() => onSelectCompany(drive)}
              className="group cursor-pointer rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm hover:shadow-lg hover:border-[#0F4C81]/40 transition-all duration-300 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#021C4F] text-white font-bold text-base shadow-sm">
                    {drive.companyName?.[0]}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-[#0F4C81] dark:group-hover:text-sky-400 transition-colors">
                      {drive.companyName}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{drive.role}</p>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1 text-xs font-extrabold">
                  ₹{drive.package} LPA
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 text-[11px]">
                <span className="rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 font-medium">
                  {drive.eligibility}
                </span>
                <span className="rounded-md bg-sky-500/10 text-sky-600 dark:text-sky-400 px-2 py-0.5 font-medium">
                  {drive.location || "Pan India"}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                <span className="text-slate-400">Deadline: {drive.deadline}</span>
                <span className="font-bold text-[#C50337] group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
                  View Details <FiArrowRight size={12} />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
