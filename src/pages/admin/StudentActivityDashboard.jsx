// src/pages/admin/StudentActivityDashboard.jsx
// Complete Student Activity & Login Monitoring Dashboard for Administrators.

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FiUsers, FiClock, FiActivity, FiDownload, FiSearch,
  FiFilter, FiCalendar, FiSmartphone, FiGlobe, FiFileText,
  FiPrinter, FiFile, FiCheckCircle, FiAlertCircle, FiRefreshCw, FiEye, FiX, FiShield, FiInfo,
  FiUserCheck, FiVideo, FiLayers, FiChevronDown, FiChevronUp
} from "react-icons/fi";
import {
  getStudentLogins,
  getStudentActivities,
  listenToStudentLogins
} from "../../services/activityLoggerService";
import GlassCard from "../../components/ui/GlassCard";
import Button from "../../components/ui/Button";
import toast from "react-hot-toast";

export default function StudentActivityDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("logins"); // "logins" | "activities"
  const [logins, setLogins] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showProjectDetails, setShowProjectDetails] = useState(true);

  // Selected Record for Inspector Modal
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Filters state
  const [filters, setFilters] = useState({
    year: "all",
    semester: "all",
    date: "",
    rollNumber: "",
  });

  // Listener flag to prevent toast on first load
  const isFirstLoadRef = useRef(true);

  useEffect(() => {
    fetchData();

    // Listen for real-time student logins for Admin Notification pop-ups
    const unsubscribe = listenToStudentLogins((latestLogins) => {
      if (isFirstLoadRef.current) {
        isFirstLoadRef.current = false;
        return;
      }
      if (latestLogins.length > 0) {
        const latest = latestLogins[0];
        // Trigger live admin toast notification
        toast.custom(
          (t) => (
            <div
              className={`${
                t.visible ? "animate-enter" : "animate-leave"
              } max-w-md w-full bg-[#021C4F] shadow-2xl rounded-2xl p-4 text-white border border-[#C50337]/40 flex items-center gap-3`}
            >
              <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-xl bg-[#C50337] text-white">
                <FiUsers size={20} />
              </div>
              <div className="flex-1 text-left text-xs">
                <p className="font-bold text-rose-300 uppercase text-[10px] tracking-wider">
                  🔔 New Student Login Alert
                </p>
                <p className="font-extrabold text-white mt-0.5">
                  Student {latest.rollNumber} ({latest.studentName})
                </p>
                <p className="text-[11px] text-slate-200 mt-0.5">
                  Year {latest.year} · Sec {latest.section} logged in at {latest.loginTime}
                </p>
              </div>
            </div>
          ),
          { duration: 5000, id: `login_alert_${latest.id}` }
        );
      }
    });

    return () => unsubscribe();
  }, [filters]);

  async function fetchData(isManualRefresh = false) {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const loginData = await getStudentLogins(filters);
      const activityData = await getStudentActivities(filters);
      setLogins(loginData);
      setActivities(activityData);
      if (isManualRefresh) {
        toast.success("Activity Dashboard logs refreshed!");
      }
    } catch (err) {
      console.error("Error fetching activity dashboard data:", err);
      toast.error("Failed to load activity monitoring logs");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  // Calculate Dashboard Statistics
  const todayStr = new Date().toISOString().split("T")[0];
  const loginsToday = logins.filter((l) => l.loginDate === todayStr).length;
  
  // Unique active students
  const activeStudentsSet = new Set(logins.map((l) => l.rollNumber));
  const activeStudentsCount = activeStudentsSet.size;

  // Most visited page calculation
  const pageCounts = {};
  activities.forEach((a) => {
    if (a.pageVisited) {
      pageCounts[a.pageVisited] = (pageCounts[a.pageVisited] || 0) + 1;
    }
  });
  const sortedPages = Object.entries(pageCounts).sort((a, b) => b[1] - a[1]);
  const mostVisitedPage = sortedPages.length > 0 ? sortedPages[0][0] : "Student Dashboard";

  // Most downloaded subject calculation
  const downloadCounts = {};
  activities.forEach((a) => {
    if (a.action === "Downloaded" && a.targetItem) {
      downloadCounts[a.targetItem] = (downloadCounts[a.targetItem] || 0) + 1;
    }
  });
  const sortedDownloads = Object.entries(downloadCounts).sort((a, b) => b[1] - a[1]);
  const mostDownloadedSubject = sortedDownloads.length > 0 ? sortedDownloads[0][0] : "Operating Systems PDF";

  // Export to CSV / Excel
  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";

    if (activeTab === "logins") {
      csvContent += "Roll Number,Student Name,Year,Semester,Section,Login Date,Login Time,Logout Time,Device,Browser,Status\n";
      logins.forEach((item) => {
        csvContent += `"${item.rollNumber}","${item.studentName}","${item.year}","${item.semester}","${item.section || "Sec B"}","${item.loginDate}","${item.loginTime}","${item.logoutTime || "Active"}","${item.deviceType}","${item.browserName}","${item.status}"\n`;
      });
    } else {
      csvContent += "Roll Number,Student Name,Year,Semester,Page Visited,File/Subject,Action,Date,Time\n";
      activities.forEach((item) => {
        csvContent += `"${item.rollNumber}","${item.studentName}","${item.year}","${item.semester}","${item.pageVisited}","${item.targetItem || "-"}","${item.action}","${item.activityDate}","${item.activityTime}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Student_${activeTab === "logins" ? "Logins" : "Activities"}_Audit_Report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${activeTab === "logins" ? "Login History" : "Activity Audit"} to CSV! 📊`);
  };

  // Export to PDF / Print
  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12 text-left">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#021C4F] text-white shadow-xs">
              <FiActivity size={18} />
            </span>
            <h1 className="text-2xl font-extrabold text-[#021C4F]">Student Activity &amp; Login Audit Dashboard</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time administrative monitoring of student logins, active sessions, page visits, and file download audits.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportCSV} className="gap-1.5 text-xs">
            <FiDownload size={14} /> Export Excel / CSV
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrintPDF} className="gap-1.5 text-xs">
            <FiPrinter size={14} /> Export PDF / Print
          </Button>
          <Button
            size="sm"
            onClick={() => fetchData(true)}
            disabled={refreshing}
            className="gap-1.5 text-xs bg-[#021C4F] hover:bg-[#C50337]"
          >
            <FiRefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
            {refreshing ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
      </div>

      {/* Admin Management Quick Action Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-2">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <span className="text-xs font-bold text-[#021C4F] flex items-center gap-1.5">
            <FiShield className="text-[#C50337]" size={14} /> Admin Quick Management Console
          </span>
          <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">
            Exclusive Admin Tools
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 pt-1">
          <button
            onClick={() => navigate("/admin/users")}
            className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-blue-50/80 hover:bg-[#021C4F] text-blue-900 hover:text-white border border-blue-100 font-extrabold text-xs transition-all active:scale-95 shadow-2xs"
          >
            <FiUsers size={15} />
            <span>Manage Users</span>
          </button>

          <button
            onClick={() => navigate("/admin/faculty")}
            className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-indigo-50/80 hover:bg-[#021C4F] text-indigo-900 hover:text-white border border-indigo-100 font-extrabold text-xs transition-all active:scale-95 shadow-2xs"
          >
            <FiUserCheck size={15} />
            <span>Manage Faculty</span>
          </button>

          <button
            onClick={() => navigate("/admin/question-papers")}
            className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-amber-50/80 hover:bg-[#021C4F] text-amber-900 hover:text-white border border-amber-100 font-extrabold text-xs transition-all active:scale-95 shadow-2xs"
          >
            <FiFileText size={15} />
            <span>Manage Q Papers</span>
          </button>

          <button
            onClick={() => navigate("/admin/videos")}
            className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-[#C50337]/10 hover:bg-[#C50337] text-[#C50337] hover:text-white border border-[#C50337]/20 font-extrabold text-xs transition-all active:scale-95 shadow-2xs"
          >
            <FiVideo size={15} />
            <span>Manage Videos</span>
          </button>

          <button
            onClick={() => navigate("/admin/notes")}
            className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-emerald-50/80 hover:bg-[#021C4F] text-emerald-900 hover:text-white border border-emerald-100 font-extrabold text-xs transition-all active:scale-95 shadow-2xs"
          >
            <FiLayers size={15} />
            <span>Manage Notes</span>
          </button>
        </div>
      </div>

      {/* Project Details Banner */}
      <GlassCard className="p-4 border border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#021C4F] text-white">
              <FiInfo size={15} />
            </span>
            <h3 className="text-xs font-extrabold text-[#021C4F] uppercase tracking-wider">
              Project Specification &amp; System Architecture Details
            </h3>
          </div>
          <button
            onClick={() => setShowProjectDetails(!showProjectDetails)}
            className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-[#C50337]"
          >
            <span>{showProjectDetails ? "Hide Details" : "View Project Details"}</span>
            {showProjectDetails ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
          </button>
        </div>

        {showProjectDetails && (
          <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-700">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="font-bold text-[#021C4F] block mb-1">🏫 Academic Portal System</span>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Department of Computer Science (DDGDVC). Built for 1st Year (Semester 1), 2nd Year (Semester 1/3), and 3rd Year (Semester 1/5) students.
              </p>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="font-bold text-[#021C4F] block mb-1">🔐 Real-Time Audit Engine</span>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Uses Firebase Firestore collections (<code className="text-[#C50337]">studentLogins</code> and <code className="text-[#C50337]">studentActivities</code>) with <code className="text-[#021C4F]">onSnapshot</code> listeners for zero-delay live tracking.
              </p>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="font-bold text-[#021C4F] block mb-1">👑 Restricted Administrator Access</span>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Exclusive access for roll number <strong className="text-[#021C4F]">24E3006 (THARUN B S)</strong> and designated portal admins. Regular students have zero access.
              </p>
            </div>
          </div>
        )}
      </GlassCard>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard className="p-4 flex items-center gap-4 border border-blue-100 bg-gradient-to-br from-white to-blue-50/30">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-[#021C4F] shadow-xs">
            <FiClock size={24} />
          </div>
          <div>
            <p className="text-[11px] uppercase font-bold text-slate-400">Total Logins Today</p>
            <h3 className="text-2xl font-black text-[#021C4F]">{loginsToday}</h3>
            <p className="text-[10px] text-blue-600 font-semibold mt-0.5">Live Firestore Feed</p>
          </div>
        </GlassCard>

        <GlassCard className="p-4 flex items-center gap-4 border border-indigo-100 bg-gradient-to-br from-white to-indigo-50/30">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-800 shadow-xs">
            <FiUsers size={24} />
          </div>
          <div>
            <p className="text-[11px] uppercase font-bold text-slate-400">Active Students</p>
            <h3 className="text-2xl font-black text-[#021C4F]">{activeStudentsCount}</h3>
            <p className="text-[10px] text-indigo-600 font-semibold mt-0.5">Unique Roll Numbers</p>
          </div>
        </GlassCard>

        <GlassCard className="p-4 flex items-center gap-4 border border-emerald-100 bg-gradient-to-br from-white to-emerald-50/30">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800 shadow-xs">
            <FiEye size={24} />
          </div>
          <div>
            <p className="text-[11px] uppercase font-bold text-slate-400">Most Visited Section</p>
            <h3 className="text-sm font-extrabold text-[#021C4F] truncate max-w-[150px]">{mostVisitedPage}</h3>
            <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">Top Traffic Module</p>
          </div>
        </GlassCard>

        <GlassCard className="p-4 flex items-center gap-4 border border-rose-100 bg-gradient-to-br from-white to-rose-50/30">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-[#C50337] shadow-xs">
            <FiDownload size={24} />
          </div>
          <div>
            <p className="text-[11px] uppercase font-bold text-slate-400">Top Downloaded File</p>
            <h3 className="text-sm font-extrabold text-[#021C4F] truncate max-w-[150px]">{mostDownloadedSubject}</h3>
            <p className="text-[10px] text-rose-600 font-semibold mt-0.5">Highest Student Demand</p>
          </div>
        </GlassCard>
      </div>

      {/* Filter Control Bar */}
      <GlassCard className="p-4 space-y-3 border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <span className="text-xs font-bold text-[#021C4F] flex items-center gap-1.5">
            <FiFilter size={14} className="text-[#C50337]" /> Filter &amp; Search Audit Logs
          </span>
          <button
            onClick={() => setFilters({ year: "all", semester: "all", date: "", rollNumber: "" })}
            className="text-[11px] text-slate-500 hover:text-[#C50337] font-semibold"
          >
            Reset Filters
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Roll Number Search */}
          <div>
            <label className="block font-semibold text-slate-600 mb-1">Roll Number / Student Name</label>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input
                type="text"
                placeholder="Search Roll No (e.g. 24E3006)"
                value={filters.rollNumber}
                onChange={(e) => setFilters({ ...filters, rollNumber: e.target.value })}
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none focus:border-[#021C4F]"
              />
            </div>
          </div>

          {/* Year Filter */}
          <div>
            <label className="block font-semibold text-slate-600 mb-1">Student Cohort Year</label>
            <select
              value={filters.year}
              onChange={(e) => setFilters({ ...filters, year: e.target.value })}
              className="w-full p-2 border border-slate-200 rounded-xl bg-white focus:outline-none"
            >
              <option value="all">All Years (1st, 2nd, 3rd Year)</option>
              <option value="1">1st Year (26E Cohort)</option>
              <option value="2">2nd Year (25E Cohort)</option>
              <option value="3">3rd Year (24E Cohort)</option>
            </select>
          </div>

          {/* Semester Filter */}
          <div>
            <label className="block font-semibold text-slate-600 mb-1">Semester</label>
            <select
              value={filters.semester}
              onChange={(e) => setFilters({ ...filters, semester: e.target.value })}
              className="w-full p-2 border border-slate-200 rounded-xl bg-white focus:outline-none"
            >
              <option value="all">All Semesters</option>
              <option value="1">Semester 1</option>
              <option value="2">Semester 2</option>
              <option value="3">Semester 3</option>
              <option value="4">Semester 4</option>
              <option value="5">Semester 5</option>
              <option value="6">Semester 6</option>
            </select>
          </div>

          {/* Date Filter */}
          <div>
            <label className="block font-semibold text-slate-600 mb-1">Specific Audit Date</label>
            <input
              type="date"
              value={filters.date}
              onChange={(e) => setFilters({ ...filters, date: e.target.value })}
              className="w-full p-2 border border-slate-200 rounded-xl bg-white focus:outline-none"
            />
          </div>
        </div>
      </GlassCard>

      {/* Main Tabs Navigation */}
      <div className="flex items-center gap-3 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab("logins")}
          className={`px-5 py-2.5 text-xs font-extrabold rounded-xl transition-all ${
            activeTab === "logins"
              ? "bg-[#021C4F] text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          🔑 Student Login History ({logins.length})
        </button>

        <button
          onClick={() => setActiveTab("activities")}
          className={`px-5 py-2.5 text-xs font-extrabold rounded-xl transition-all ${
            activeTab === "activities"
              ? "bg-[#021C4F] text-white shadow-sm"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          📌 Page Visits &amp; Download Audit Logs ({activities.length})
        </button>
      </div>

      {/* Tab 1: Student Login History Table */}
      {activeTab === "logins" && (
        <GlassCard className="overflow-hidden p-0 border border-slate-200">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h3 className="text-xs font-bold text-[#021C4F] uppercase tracking-wider">
              Student Login Audit Records
            </h3>
            <span className="text-[11px] text-slate-500 font-semibold">
              Showing {logins.length} login attempts
            </span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs text-slate-400">Loading student logins...</div>
          ) : logins.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No student login logs recorded for the selected filters.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/70 text-slate-700 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Roll Number</th>
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-4">Year &amp; Sem</th>
                    <th className="py-3 px-4">Login Date &amp; Time</th>
                    <th className="py-3 px-4">Logout Time</th>
                    <th className="py-3 px-4">Device &amp; Browser</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Inspect</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {logins.map((item, idx) => (
                    <tr key={item.id || idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-extrabold text-[#021C4F]">
                        {item.rollNumber}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-800">
                        {item.studentName}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 font-bold text-[10px] border border-blue-100">
                          {item.year === 1 ? "1st Yr" : item.year === 2 ? "2nd Yr" : "3rd Yr"} · Sem {item.semester}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-700">
                        <div className="flex items-center gap-1.5">
                          <FiCalendar size={12} className="text-slate-400" />
                          <span>{item.loginDate}</span>
                          <span className="text-slate-300">|</span>
                          <span className="font-bold text-[#021C4F]">{item.loginTime}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {item.logoutTime ? (
                          <span className="text-slate-700 font-semibold">{item.logoutTime}</span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-[10px] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                            Active Session
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1 font-medium bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                            <FiSmartphone size={11} className="text-slate-500" /> {item.deviceType}
                          </span>
                          <span className="flex items-center gap-1 font-medium bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                            <FiGlobe size={11} className="text-slate-500" /> {item.browserName}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {item.status === "Failed" ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                            <FiAlertCircle size={11} /> Failed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <FiCheckCircle size={11} /> Success
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedRecord({ ...item, recordType: "login" })}
                          className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-blue-50 text-blue-700 hover:bg-[#021C4F] hover:text-white transition-all"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </GlassCard>
      )}

      {/* Tab 2: Student Activities & Downloads Audit Table */}
      {activeTab === "activities" && (
        <GlassCard className="overflow-hidden p-0 border border-slate-200">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h3 className="text-xs font-bold text-[#021C4F] uppercase tracking-wider">
              Student Page Visits &amp; Download Audit Logs
            </h3>
            <span className="text-[11px] text-slate-500 font-semibold">
              Showing {activities.length} activity records
            </span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs text-slate-400">Loading student activities...</div>
          ) : activities.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No activity logs recorded for the selected filters.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/70 text-slate-700 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Roll Number</th>
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-4">Page Visited</th>
                    <th className="py-3 px-4">File / Subject Accessed</th>
                    <th className="py-3 px-4">Action</th>
                    <th className="py-3 px-4">Date &amp; Time</th>
                    <th className="py-3 px-4 text-right">Inspect</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {activities.map((item, idx) => (
                    <tr key={item.id || idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-extrabold text-[#021C4F]">
                        {item.rollNumber}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-800">
                        {item.studentName}
                      </td>
                      <td className="py-3 px-4 font-semibold text-[#021C4F]">
                        {item.pageVisited}
                      </td>
                      <td className="py-3 px-4 text-slate-700 font-medium">
                        {item.targetItem || "—"}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded font-bold text-[10px] border ${
                            item.action === "Downloaded"
                              ? "bg-rose-100 text-rose-800 border-rose-200"
                              : item.action === "Searched"
                              ? "bg-amber-100 text-amber-800 border-amber-200"
                              : "bg-blue-50 text-blue-800 border-blue-100"
                          }`}
                        >
                          {item.action}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <span>{item.activityDate}</span>
                          <span className="text-slate-300">|</span>
                          <span className="font-bold text-[#021C4F]">{item.activityTime}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedRecord({ ...item, recordType: "activity" })}
                          className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-blue-50 text-blue-700 hover:bg-[#021C4F] hover:text-white transition-all"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </GlassCard>
      )}

      {/* Admin Audit Inspector Detail Modal */}
      <AnimatePresence>
        {selectedRecord && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-4 text-left"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b pb-3 border-slate-100">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#021C4F] text-white">
                    <FiShield size={18} />
                  </span>
                  <div>
                    <h2 className="text-base font-bold text-[#021C4F]">
                      Administrative Audit Inspector
                    </h2>
                    <p className="text-[11px] text-slate-500">
                      {selectedRecord.recordType === "login" ? "Student Login Session Metadata" : "Student Activity & Resource Log"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-500"
                >
                  <FiX size={18} />
                </button>
              </div>

              {/* Student Identity Card */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Student Name</span>
                  <span className="font-extrabold text-[#021C4F] text-sm">{selectedRecord.studentName}</span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                  <span className="text-slate-500 font-medium">Roll Number:</span>
                  <span className="font-mono font-bold bg-white px-2 py-0.5 rounded border border-slate-200 text-[#021C4F]">{selectedRecord.rollNumber}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Cohort &amp; Semester:</span>
                  <span className="font-bold text-slate-700">
                    Year {selectedRecord.year} · Semester {selectedRecord.semester} · {selectedRecord.section || "Sec B"}
                  </span>
                </div>
                {selectedRecord.dob && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Date of Birth (Auth):</span>
                    <span className="font-semibold text-slate-700">{selectedRecord.dob}</span>
                  </div>
                )}
              </div>

              {/* Session / Activity Details */}
              <div className="space-y-2 text-xs">
                <p className="font-bold text-slate-400 uppercase text-[10px]">Technical Audit Metadata</p>
                <div className="grid grid-cols-2 gap-2 text-slate-700">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Device Type</span>
                    <span className="font-bold text-[#021C4F] flex items-center gap-1 mt-0.5">
                      <FiSmartphone size={12} className="text-blue-600" /> {selectedRecord.deviceType || "Desktop"}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Browser Name</span>
                    <span className="font-bold text-[#021C4F] flex items-center gap-1 mt-0.5">
                      <FiGlobe size={12} className="text-indigo-600" /> {selectedRecord.browserName || "Chrome"}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Client IP Address</span>
                    <span className="font-mono font-bold text-slate-800 block mt-0.5">
                      {selectedRecord.ipAddress || "127.0.0.1 (Client)"}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Session Status</span>
                    <span className="font-bold text-emerald-600 block mt-0.5">
                      {selectedRecord.status || "Success"}
                    </span>
                  </div>
                </div>

                {selectedRecord.recordType === "login" ? (
                  <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-blue-900">Login Timestamp:</span>
                      <span className="font-bold text-[#021C4F]">{selectedRecord.loginDate} · {selectedRecord.loginTime}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-blue-900">Logout Timestamp:</span>
                      <span className="font-bold text-[#C50337]">{selectedRecord.logoutTime || "Active Session (Still logged in)"}</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-100 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-rose-900">Page Visited:</span>
                      <span className="font-extrabold text-[#021C4F]">{selectedRecord.pageVisited}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-rose-900">Resource / File:</span>
                      <span className="font-bold text-slate-800">{selectedRecord.targetItem || "—"}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs pt-1 border-t border-rose-200/50">
                      <span className="font-semibold text-rose-900">Action &amp; Timestamp:</span>
                      <span className="font-bold text-rose-700">{selectedRecord.action} on {selectedRecord.activityDate} at {selectedRecord.activityTime}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <FiInfo size={12} /> Encrypted Administrator Log
                </span>
                <Button size="sm" onClick={() => setSelectedRecord(null)}>
                  Close Inspector
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
