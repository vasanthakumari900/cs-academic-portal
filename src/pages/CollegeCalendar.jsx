// src/pages/CollegeCalendar.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCalendar,
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiAward,
  FiAlertCircle,
  FiGrid,
  FiList,
  FiFilter,
  FiDownload,
  FiStar,
} from "react-icons/fi";
import {
  ACADEMIC_CALENDAR_YEAR,
  MONTHS_LIST,
  CALENDAR_DATA,
} from "../data/academicCalendarData";
import toast from "react-hot-toast";

import { jsPDF } from "jspdf";

export default function CollegeCalendar() {
  const [selectedMonthId, setSelectedMonthId] = useState("aug-26"); // Default August 2026
  const [semesterFilter, setSemesterFilter] = useState("all"); // "all" | "odd" | "even"
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "table"
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMonths = MONTHS_LIST.filter((m) => {
    if (semesterFilter === "odd") return m.semester === "odd";
    if (semesterFilter === "even") return m.semester === "even";
    return true;
  });

  const currentMonthData = CALENDAR_DATA[selectedMonthId] || CALENDAR_DATA["aug-26"];

  const currentMonthIndex = filteredMonths.findIndex((m) => m.id === selectedMonthId);

  const handlePrevMonth = () => {
    if (currentMonthIndex > 0) {
      setSelectedMonthId(filteredMonths[currentMonthIndex - 1].id);
    }
  };

  const handleNextMonth = () => {
    if (currentMonthIndex < filteredMonths.length - 1) {
      setSelectedMonthId(filteredMonths[currentMonthIndex + 1].id);
    }
  };

  // Filter days by search query if user is searching
  const searchedDays = searchQuery.trim()
    ? currentMonthData.days.filter(
        (d) =>
          (d.event && d.event.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (d.dayOrder && d.dayOrder.toLowerCase().includes(searchQuery.toLowerCase())) ||
          String(d.date).includes(searchQuery)
      )
    : currentMonthData.days;

  // Generate Official PDF File Download using jsPDF
  const handleDownloadPdfCalendar = () => {
    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Header Banner
      doc.setFillColor(15, 76, 129); // #0F4C81 Navy
      doc.rect(0, 0, 210, 26, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(15);
      doc.setFont("helvetica", "bold");
      doc.text("OFFICIAL COLLEGE ACADEMIC CALENDAR 2026 - 2027", 105, 11, { align: "center" });

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text("Computer Science Academic Portal | Full 12-Month Schedule (June 2026 - May 2027)", 105, 19, { align: "center" });

      let yPos = 33;

      MONTHS_LIST.forEach((m) => {
        const monthData = CALENDAR_DATA[m.id];
        if (!monthData) return;

        if (yPos > 245) {
          doc.addPage();
          yPos = 18;
        }

        // Month Header Banner
        doc.setFillColor(197, 3, 55); // #C50337 Crimson
        doc.rect(10, yPos, 190, 7, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text(`${monthData.month.toUpperCase()} (${m.semester.toUpperCase()} SEMESTER)`, 14, yPos + 5);

        yPos += 10;

        // Table Column Headers
        doc.setFillColor(241, 245, 249);
        doc.rect(10, yPos, 190, 6, "F");
        doc.setTextColor(15, 76, 129);
        doc.setFontSize(8);
        doc.setFont("helvetica", "bold");

        doc.text("Date", 13, yPos + 4.2);
        doc.text("Day", 26, yPos + 4.2);
        doc.text("Day Order", 56, yPos + 4.2);
        doc.text("Working Day #", 86, yPos + 4.2);
        doc.text("Events & Academic Milestones", 122, yPos + 4.2);

        yPos += 7;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);

        monthData.days.forEach((d) => {
          if (yPos > 275) {
            doc.addPage();
            yPos = 18;
          }

          if (d.isHoliday) {
            doc.setFillColor(254, 242, 242);
            doc.rect(10, yPos - 3.5, 190, 5, "F");
            doc.setTextColor(225, 29, 72);
          } else if (d.isImportant) {
            doc.setFillColor(254, 243, 199);
            doc.rect(10, yPos - 3.5, 190, 5, "F");
            doc.setTextColor(180, 83, 9);
          } else {
            doc.setTextColor(30, 41, 59);
          }

          doc.text(String(d.date), 14, yPos);
          doc.text(d.day, 26, yPos);
          doc.text(d.dayOrder ? `Day Order ${d.dayOrder}` : "-", 56, yPos);
          doc.text(d.workingDay ? `Day #${d.workingDay}` : "-", 88, yPos);
          doc.text(d.event ? d.event.slice(0, 42) : d.isHoliday ? "[Holiday]" : "-", 122, yPos);

          yPos += 5.2;
        });

        yPos += 6;
      });

      doc.save(`Official_College_Academic_Calendar_${ACADEMIC_CALENDAR_YEAR.replace("-", "_")}.pdf`);
      toast.success("Official College Academic Calendar downloaded in PDF format!");
    } catch (err) {
      console.error("PDF download error:", err);
      toast.error("Error creating PDF. Please try again.");
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 bg-[#F8FAFC] dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100">
      {/* ─── Hero Banner ─── */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#021C4F] via-[#0F4C81] to-[#C50337] p-6 sm:p-8 text-white shadow-2xl mb-8 border border-amber-400/40"
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-amber-400 text-slate-950 font-black text-[11px] px-3 py-1 rounded-full uppercase tracking-wider font-mono shadow-md">
                Official Academic Year {ACADEMIC_CALENDAR_YEAR}
              </span>
              <span className="bg-teal-500 text-white font-bold text-[11px] px-3 py-1 rounded-full font-mono">
                12 Months Calendar
              </span>
            </div>
            <h1 className="font-sans text-2xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <FiCalendar className="text-amber-400" size={32} />
              College Academic Calendar
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 font-medium max-w-2xl leading-relaxed">
              Full 12-month schedule including CIA Tests, End-Semester Practical & Theory Examinations, Working Days (1-95), Day Orders (I - VI), and Official Holidays.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleDownloadPdfCalendar}
              className="inline-flex items-center gap-2 rounded-2xl bg-amber-400 text-slate-950 px-4 py-2.5 text-xs font-black hover:bg-amber-300 transition-all shadow-lg cursor-pointer font-mono active:scale-95 border border-amber-300"
              title="Download Official 12-Month Calendar in PDF format"
            >
              <FiDownload size={16} /> Download Calendar PDF
            </button>
          </div>
        </div>
      </motion.div>

      {/* ─── Search & Semester Filters ─── */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Semester Filter Tabs */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl font-mono text-xs shrink-0 overflow-x-auto">
          <button
            onClick={() => setSemesterFilter("all")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              semesterFilter === "all"
                ? "bg-[#0F4C81] text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            All Months (12)
          </button>
          <button
            onClick={() => setSemesterFilter("odd")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              semesterFilter === "odd"
                ? "bg-[#C50337] text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            ODD Semester (Jun - Oct '26)
          </button>
          <button
            onClick={() => setSemesterFilter("even")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              semesterFilter === "even"
                ? "bg-teal-600 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            EVEN Semester (Nov '26 - May '27)
          </button>
        </div>

        {/* Search Input Box */}
        <div className="relative min-w-[240px] flex-1 max-w-md">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events (e.g. CIA, ESE Exam, Deepavali)..."
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 pl-10 pr-4 py-2 text-xs font-mono text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:border-[#0F4C81] focus:bg-white outline-none transition-all"
          />
        </div>

        {/* View Mode Toggle (Grid vs Table) */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl shrink-0">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg transition-all cursor-pointer ${
              viewMode === "grid" ? "bg-white dark:bg-slate-700 text-[#0F4C81] shadow-sm" : "text-slate-400"
            }`}
            title="Grid View"
          >
            <FiGrid size={16} />
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`p-2 rounded-lg transition-all cursor-pointer ${
              viewMode === "table" ? "bg-white dark:bg-slate-700 text-[#0F4C81] shadow-sm" : "text-slate-400"
            }`}
            title="Table View"
          >
            <FiList size={16} />
          </button>
        </div>
      </div>

      {/* ─── Month Navigation Carousel / Selector ─── */}
      <div className="mb-6 flex items-center justify-between gap-3 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={handlePrevMonth}
          disabled={currentMonthIndex === 0}
          className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 disabled:opacity-30 cursor-pointer shrink-0"
        >
          <FiChevronLeft size={20} />
        </button>

        <div className="flex items-center gap-2 overflow-x-auto">
          {filteredMonths.map((m) => {
            const isSelected = m.id === selectedMonthId;
            return (
              <button
                key={m.id}
                onClick={() => setSelectedMonthId(m.id)}
                className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer shrink-0 border ${
                  isSelected
                    ? "bg-[#0F4C81] text-white border-amber-400 shadow-md scale-105"
                    : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100"
                }`}
              >
                {m.label}
              </button>
            );
          })}
        </div>

        <button
          onClick={handleNextMonth}
          disabled={currentMonthIndex === filteredMonths.length - 1}
          className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 disabled:opacity-30 cursor-pointer shrink-0"
        >
          <FiChevronRight size={20} />
        </button>
      </div>

      {/* ─── Selected Month Header Summary (Neumorphic Glow) ─── */}
      <motion.div
        key={selectedMonthId + "-summary"}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between bg-white dark:bg-slate-900 p-5 rounded-2xl border border-amber-400/40 shadow-neu-raised"
      >
        <div>
          <span className="text-[10px] font-black uppercase font-mono tracking-widest text-[#0F4C81] dark:text-amber-400">
            Selected Academic Month
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#021C4F] dark:text-white font-mono flex items-center gap-2">
            <span>{currentMonthData.month}</span>
            <span className="text-xs text-amber-500 font-bold px-2 py-0.5 rounded-lg bg-amber-400/10 border border-amber-400/30">
              {currentMonthData.days.length} Days
            </span>
          </h2>
        </div>

        <div className="flex items-center gap-3 mt-3 sm:mt-0 font-mono text-xs">
          <span className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 px-3.5 py-1.5 rounded-xl font-bold border border-emerald-500/30 shadow-neu-flat">
            Working Days: {currentMonthData.days.filter((d) => d.workingDay).length}
          </span>
          <span className="bg-rose-500/15 text-rose-700 dark:text-rose-300 px-3.5 py-1.5 rounded-xl font-bold border border-rose-500/30 shadow-neu-flat">
            Holidays: {currentMonthData.days.filter((d) => d.isHoliday).length}
          </span>
        </div>
      </motion.div>

      {/* ─── Grid View (Animated Neumorphic Cards) ─── */}
      <AnimatePresence mode="wait">
        {viewMode === "grid" && (
          <motion.div
            key={selectedMonthId + "-grid"}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8"
          >
            {searchedDays.map((d, i) => {
              return (
                <motion.div
                  key={d.date}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.025, 0.3) }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className={`rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 ${
                    d.isHoliday
                      ? "bg-rose-50/80 dark:bg-rose-950/30 border-2 border-rose-300 dark:border-rose-900 shadow-neu-raised"
                      : d.isImportant
                      ? "bg-amber-50/90 dark:bg-amber-950/30 border-2 border-amber-400 dark:border-amber-700 shadow-neu-glow ring-2 ring-amber-400/40"
                      : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-neu-raised hover:shadow-neu-raised-lg hover:border-[#0F4C81]/50"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#021C4F] text-amber-300 font-black font-mono text-sm shadow-neu-raised border border-amber-400/30">
                          {d.date}
                        </span>
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-400 font-mono">
                          {d.day}
                        </span>
                      </div>

                      {d.dayOrder ? (
                        <span className="bg-gradient-to-r from-amber-400 via-amber-500 to-[#D97706] text-slate-950 text-[10px] font-black px-2.5 py-1 rounded-xl font-mono shadow-neu-raised border border-amber-300 ring-2 ring-amber-400/40 tracking-wider">
                          DAY ORDER {d.dayOrder}
                        </span>
                      ) : null}
                    </div>

                    {d.event ? (
                      <div className="mt-2.5 p-2.5 rounded-xl bg-amber-400/20 border border-amber-400/50 text-amber-950 dark:text-amber-200 text-xs font-mono font-bold leading-snug shadow-neu-flat">
                        🎯 {d.event}
                      </div>
                    ) : d.isHoliday ? (
                      <p className="text-[11px] font-bold text-rose-500 font-mono mt-2 flex items-center gap-1">
                        🌴 Sunday / Holiday
                      </p>
                    ) : (
                      <p className="text-[11px] text-slate-400 font-mono mt-2">
                        Regular Working Day
                      </p>
                    )}
                  </div>

                  {d.workingDay && (
                    <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-500">
                      <span>Working Day</span>
                      <span className="font-extrabold text-[#0F4C81] dark:text-amber-400 bg-teal-500/10 px-2 py-0.5 rounded-md border border-teal-500/20">
                        Day #{d.workingDay}
                      </span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Table View (Neumorphic Table Container) ─── */}
      <AnimatePresence mode="wait">
        {viewMode === "table" && (
          <motion.div
            key={selectedMonthId + "-table"}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="overflow-x-auto rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-neu-raised mb-8"
          >
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="bg-[#0F4C81] text-white">
                  <th className="px-5 py-4 font-black tracking-wider">Date</th>
                  <th className="px-5 py-4 font-black tracking-wider">Day</th>
                  <th className="px-5 py-4 font-black tracking-wider">Events &amp; Academic Milestones</th>
                  <th className="px-5 py-4 font-black text-center">Day Order</th>
                  <th className="px-5 py-4 font-black text-center">Working Day #</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {searchedDays.map((d) => (
                  <tr
                    key={d.date}
                    className={`hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors ${
                      d.isHoliday
                        ? "bg-rose-50/60 dark:bg-rose-950/30 font-semibold"
                        : d.isImportant
                        ? "bg-amber-50/70 dark:bg-amber-950/30 font-semibold"
                        : ""
                    }`}
                  >
                    <td className="px-5 py-3.5 font-black text-[#0F4C81] dark:text-amber-400 text-sm">
                      {d.date}
                    </td>
                    <td className="px-5 py-3.5 font-bold text-slate-700 dark:text-slate-300">
                      {d.day}
                    </td>
                    <td className="px-5 py-3.5 font-bold text-slate-800 dark:text-slate-100 leading-snug">
                      {d.event ? (
                        <span className="text-amber-800 dark:text-amber-300 font-extrabold bg-amber-400/20 px-2.5 py-1 rounded-lg border border-amber-400/40 inline-block">
                          🎯 {d.event}
                        </span>
                      ) : d.isHoliday ? (
                        <span className="text-rose-600 font-bold">🌴 Holiday</span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      {d.dayOrder ? (
                        <span className="inline-block bg-gradient-to-r from-[#0F4C81] via-[#1E88E5] to-[#0F4C81] text-white text-[11px] font-black px-3 py-1 rounded-xl font-mono shadow-neu-raised border border-cyan-400/40 ring-1 ring-cyan-400/30">
                          DAY ORDER {d.dayOrder}
                        </span>
                      ) : (
                        <span className="text-slate-400 font-mono">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-center font-black text-slate-700 dark:text-slate-300">
                      {d.workingDay ? `#${d.workingDay}` : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
