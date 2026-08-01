// src/components/admin/AdminFeedbackViewer.jsx
import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/config";
import {
  FiShield, FiUser, FiBookOpen, FiBriefcase,
  FiStar, FiClock, FiTrash2, FiMessageSquare, FiFilter, FiRefreshCw
} from "react-icons/fi";
import toast from "react-hot-toast";

export default function AdminFeedbackViewer() {
  const [feedbackList, setFeedbackList] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [loading, setLoading] = useState(true);

  const fetchFeedback = async () => {
    setLoading(true);
    let items = [];

    try {
      // 1. Fetch from Firestore
      const q = query(collection(db, "cs_portal_project_feedback"), orderBy("timestamp", "desc"));
      const snapshot = await getDocs(q);
      snapshot.forEach((d) => {
        items.push({ id: d.id, ...d.data() });
      });
    } catch (err) {
      console.warn("Firestore fetch error, falling back to local:", err);
    }

    // 2. Combine with LocalStorage fallback
    const local = JSON.parse(localStorage.getItem("cs_portal_admin_feedback_submissions") || "[]");
    local.forEach((loc, idx) => {
      if (!items.some((it) => it.submittedAt === loc.submittedAt && it.submittedBy === loc.submittedBy)) {
        items.push({ id: `local_${idx}`, ...loc });
      }
    });

    setFeedbackList(items);
    setLoading(false);
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  const handleDelete = async (item) => {
    if (!window.confirm("Are you sure you want to delete this feedback entry?")) return;

    if (item.id && !item.id.startsWith("local_")) {
      try {
        await deleteDoc(doc(db, "cs_portal_project_feedback", item.id));
      } catch (e) {
        console.error(e);
      }
    }

    // Update local storage
    const local = JSON.parse(localStorage.getItem("cs_portal_admin_feedback_submissions") || "[]");
    const updatedLocal = local.filter((loc) => loc.submittedAt !== item.submittedAt);
    localStorage.setItem("cs_portal_admin_feedback_submissions", JSON.stringify(updatedLocal));

    setFeedbackList((prev) => prev.filter((it) => it.id !== item.id));
    toast.success("Feedback deleted!");
  };

  const filteredItems = filterType === "all"
    ? feedbackList
    : feedbackList.filter((it) => it.feedbackType === filterType);

  const getBadgeColor = (type) => {
    if (type === "student") return "bg-blue-100 text-blue-800 border-blue-200";
    if (type === "faculty") return "bg-rose-100 text-rose-800 border-rose-200";
    return "bg-amber-100 text-amber-800 border-amber-200";
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
      {/* Top Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#C50337] px-3 py-0.5 text-[10px] font-extrabold uppercase tracking-widest text-white shadow-xs">
              <FiShield size={12} /> Confidential Admin Access
            </span>
            <span className="text-xs font-bold text-slate-500">
              Total Responses: {feedbackList.length}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#021C4F]">
            Submitted Project Feedback Submissions
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Exclusively visible to Admin. Review Student, Faculty &amp; Alumni portal feedback.
          </p>
        </div>

        <button
          onClick={fetchFeedback}
          className="inline-flex items-center gap-2 rounded-2xl bg-slate-100 hover:bg-slate-200 px-4 py-2 text-xs font-bold text-[#021C4F] transition-all self-start sm:self-auto"
        >
          <FiRefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh List
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-200">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-600 px-2">
          <FiFilter size={14} className="text-[#021C4F]" /> Filter By Category:
        </div>
        <div className="flex flex-wrap gap-1.5">
          {[
            { id: "all", label: "All Feedback", count: feedbackList.length },
            { id: "student", label: "Student", count: feedbackList.filter((i) => i.feedbackType === "student").length },
            { id: "faculty", label: "Faculty", count: feedbackList.filter((i) => i.feedbackType === "faculty").length },
            { id: "alumni", label: "Alumni", count: feedbackList.filter((i) => i.feedbackType === "alumni").length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                filterType === tab.id
                  ? "bg-[#021C4F] text-white shadow-xs"
                  : "bg-white text-slate-700 hover:bg-slate-200"
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Feedback Submissions List */}
      {loading ? (
        <div className="text-center py-12 text-xs font-bold text-slate-400">
          Loading feedback responses...
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-12 space-y-2 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
          <FiMessageSquare size={32} className="mx-auto text-slate-300" />
          <h3 className="text-sm font-bold text-slate-700">No Feedback Submitted Yet</h3>
          <p className="text-xs text-slate-500">
            {filterType === "all"
              ? "No project feedback submissions found."
              : `No ${filterType} feedback submissions yet.`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredItems.map((item, idx) => (
            <div
              key={item.id || idx}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-4"
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-[#021C4F] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                    {item.submittedBy?.charAt(0) || "U"}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-[#021C4F]">{item.submittedBy}</h3>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Roll No: <span className="font-bold text-slate-700">{item.userRollNumber || "N/A"}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase border ${getBadgeColor(item.feedbackType)}`}>
                    {item.feedbackTitle || item.feedbackType}
                  </span>
                  <button
                    onClick={() => handleDelete(item)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                    title="Delete Feedback"
                  >
                    <FiTrash2 size={15} />
                  </button>
                </div>
              </div>

              {/* Answers Grid */}
              <div className="space-y-2 text-xs text-slate-700">
                {item.answers && Object.keys(item.answers).length > 0 ? (
                  Object.entries(item.answers).map(([qKey, val]) => (
                    <div key={qKey} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                      <span className="font-bold text-[#021C4F] block mb-1 uppercase text-[10px] tracking-wider">
                        {qKey.replace(/_/g, " ")}:
                      </span>
                      {typeof val === "number" ? (
                        <div className="flex items-center gap-1 text-amber-500 font-bold">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <FiStar key={s} size={14} className={val >= s ? "fill-amber-400 text-amber-400" : "text-slate-300"} />
                          ))}
                          <span className="ml-1 text-[11px] text-slate-600">({val} / 5 Stars)</span>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-800 font-medium leading-relaxed">{val}</p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">No answers provided</p>
                )}
              </div>

              {/* Footer Timestamp */}
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                <FiClock size={12} />
                <span>Submitted: {item.submittedAt || "Recently"}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
