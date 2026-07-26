// src/components/placements/AdminPlacementPanel.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import {
  FiShield,
  FiPlus,
  FiTrash2,
  FiEdit,
  FiUploadCloud,
  FiBell,
  FiUsers,
  FiBarChart2,
  FiFileText,
  FiCheckCircle,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { DETAILED_COMPANY_DRIVES, DEMO_STUDENT_APPLICATIONS } from "../../utils/placementMockData";

export default function AdminPlacementPanel() {
  const [drives, setDrives] = useState(DETAILED_COMPANY_DRIVES);
  const [activeAdminSubTab, setActiveAdminSubTab] = useState("drives");

  const [newCompany, setNewCompany] = useState({
    companyName: "",
    role: "",
    package: "",
    eligibility: "CGPA 6.5+",
    minCgpa: 6.5,
    deadline: "",
    location: "Chennai",
  });

  function handleAddCompany(e) {
    e.preventDefault();
    if (!newCompany.companyName || !newCompany.role || !newCompany.package) {
      toast.error("Please fill in company name, role, and package");
      return;
    }

    const created = {
      id: `drive-${Date.now()}`,
      companyName: newCompany.companyName,
      role: newCompany.role,
      package: parseFloat(newCompany.package),
      eligibility: newCompany.eligibility,
      minCgpa: parseFloat(newCompany.minCgpa),
      deadline: newCompany.deadline || "2026-09-30",
      driveDate: newCompany.deadline || "2026-10-05",
      location: newCompany.location,
      status: "Upcoming",
      skills: ["Data Structures", "Java", "SQL"],
    };

    setDrives([created, ...drives]);
    toast.success(`Drive for ${newCompany.companyName} added successfully!`);
    setNewCompany({
      companyName: "",
      role: "",
      package: "",
      eligibility: "CGPA 6.5+",
      minCgpa: 6.5,
      deadline: "",
      location: "Chennai",
    });
  }

  function handleDeleteDrive(id) {
    if (confirm("Delete this placement drive?")) {
      setDrives(drives.filter((d) => d.id !== id));
      toast.success("Placement drive removed");
    }
  }

  function handleBroadcastNotification(e) {
    e.preventDefault();
    toast.success("Broadcast notification sent to all registered students!");
  }

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-r from-[#021C4F] to-[#0F4C81] p-6 text-white shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-0.5 text-[11px] font-bold">
              <FiShield size={12} /> Officer & Admin Control Panel
            </div>
            <h2 className="text-2xl font-extrabold text-white mt-1">
              Placement Officer Management Studio
            </h2>
            <p className="text-xs text-white/80 mt-0.5">
              Add company drives, review applications, publish offer letters, and send student notifications.
            </p>
          </div>

          <span className="rounded-xl bg-white/10 border border-white/20 px-4 py-2 text-xs font-bold text-white shrink-0">
            Authenticated Admin View
          </span>
        </div>
      </div>

      {/* Admin Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        {[
          { id: "drives", label: "Manage Drives", icon: FiPlus },
          { id: "applications", label: "Student Applications", icon: FiUsers },
          { id: "broadcast", label: "Send Notifications", icon: FiBell },
          { id: "results", label: "Upload Results & Offers", icon: FiFileText },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeAdminSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveAdminSubTab(tab.id)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                isActive
                  ? "bg-[#C50337] text-white shadow-sm"
                  : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100"
              }`}
            >
              <Icon size={14} /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Sub-Tab 1: Manage Drives */}
      {activeAdminSubTab === "drives" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Form: Add Drive (4 cols) */}
          <div className="lg:col-span-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 border-b pb-2 flex items-center gap-2">
              <FiPlus className="text-[#C50337]" /> Create Placement Drive
            </h3>

            <form onSubmit={handleAddCompany} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Company Name *</label>
                <input
                  type="text"
                  required
                  value={newCompany.companyName}
                  onChange={(e) => setNewCompany({ ...newCompany, companyName: e.target.value })}
                  placeholder="e.g. Adobe Inc."
                  className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border p-2.5 text-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Job Role *</label>
                <input
                  type="text"
                  required
                  value={newCompany.role}
                  onChange={(e) => setNewCompany({ ...newCompany, role: e.target.value })}
                  placeholder="e.g. Member Technical Staff"
                  className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border p-2.5 text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Package (LPA) *</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={newCompany.package}
                    onChange={(e) => setNewCompany({ ...newCompany, package: e.target.value })}
                    placeholder="15.0"
                    className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border p-2.5 text-slate-800 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Min CGPA</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newCompany.minCgpa}
                    onChange={(e) => setNewCompany({ ...newCompany, minCgpa: e.target.value })}
                    placeholder="7.0"
                    className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border p-2.5 text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Last Date to Apply</label>
                <input
                  type="date"
                  value={newCompany.deadline}
                  onChange={(e) => setNewCompany({ ...newCompany, deadline: e.target.value })}
                  className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border p-2.5 text-slate-800 dark:text-slate-100"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-[#C50337] hover:bg-[#a0022b] py-2.5 font-bold text-white shadow-md transition-all active:scale-95"
              >
                + Add Company Drive
              </button>
            </form>
          </div>

          {/* Right Drives List (8 cols) */}
          <div className="lg:col-span-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 border-b pb-2">
              Active Companies Database ({drives.length})
            </h3>

            <div className="space-y-3">
              {drives.map((d) => (
                <div
                  key={d.id}
                  className="flex items-center justify-between rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-4 text-xs"
                >
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100">
                      {d.companyName} — <span className="text-slate-500">{d.role}</span>
                    </h4>
                    <p className="text-slate-400 mt-0.5">
                      ₹{d.package} LPA · Min CGPA: {d.minCgpa || 6.0} · Deadline: {d.deadline}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDeleteDrive(d.id)}
                    className="rounded-lg p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 2: Student Applications */}
      {activeAdminSubTab === "applications" && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
            Registered Student Applications Table
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold uppercase">
                <tr>
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Target Company</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Applied Date</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {DEMO_STUDENT_APPLICATIONS.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-bold text-slate-800 dark:text-slate-100">Vasanth Kumar</td>
                    <td className="p-3 font-semibold text-[#0F4C81] dark:text-sky-400">{app.companyName}</td>
                    <td className="p-3 text-slate-600 dark:text-slate-300">{app.role}</td>
                    <td className="p-3 text-slate-400">{app.appliedDate}</td>
                    <td className="p-3">
                      <span className="rounded-md bg-emerald-500/10 text-emerald-600 px-2 py-0.5 font-bold text-[10px]">
                        {app.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sub-Tab 3: Broadcast Notifications */}
      {activeAdminSubTab === "broadcast" && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4 max-w-xl">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
            Send Broadcast Notification
          </h3>

          <form onSubmit={handleBroadcastNotification} className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Notification Headline *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Mandatory Pre-Placement Talk for Google"
                className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border p-2.5 text-slate-800 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Message Body *
              </label>
              <textarea
                rows={4}
                required
                placeholder="Enter notice details for students..."
                className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border p-2.5 text-slate-800 dark:text-slate-100"
              />
            </div>

            <button
              type="submit"
              className="rounded-xl bg-[#0F4C81] px-6 py-2.5 font-bold text-white shadow-md"
            >
              Broadcast Notification
            </button>
          </form>
        </div>
      )}

      {/* Sub-Tab 4: Upload Results */}
      {activeAdminSubTab === "results" && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4 max-w-xl">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
            Publish Offer Letters & Drive Results
          </h3>
          <p className="text-xs text-slate-500">
            Select company drive and upload list of selected candidates / offer PDFs.
          </p>

          <div className="space-y-3 text-xs">
            <select className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border p-2.5 text-slate-800 dark:text-slate-100">
              <option>Google — Software Engineer</option>
              <option>Zoho Corp — MTS</option>
              <option>TCS Digital — System Engineer</option>
            </select>

            <input
              type="file"
              className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#0F4C81] file:text-white"
            />

            <button
              onClick={() => toast.success("Results & Offer letters published!")}
              className="rounded-xl bg-emerald-600 px-6 py-2.5 font-bold text-white shadow-md"
            >
              Publish Selected Results
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
