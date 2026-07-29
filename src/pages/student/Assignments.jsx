// src/pages/student/Assignments.jsx
// Student Assignments Portal: View assigned homework, upload solutions, and view grades & faculty feedback.

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiFileText, FiUploadCloud, FiClock, FiCheckCircle, FiAlertCircle, 
  FiAward, FiDownload, FiExternalLink, FiX, FiCheck, FiSearch, FiFilter
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { getAssignments, subscribeAssignments, submitAssignment, getStudentSubmission } from "../../services/assignmentService";
import { uploadFile } from "../../services/storageService";
import GlassCard from "../../components/ui/GlassCard";
import Button from "../../components/ui/Button";
import toast from "react-hot-toast";

export default function StudentAssignments() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [submissionsMap, setSubmissionsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all, pending, submitted, graded

  // Modal State
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [file, setFile] = useState(null);
  const [submissionNotes, setSubmissionNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;
    setLoading(true);

    // Attach real-time subscription for matching year assignments
    const unsubscribe = subscribeAssignments({ year: user?.year }, (data) => {
      setAssignments(data);
      setLoading(false);

      if (user?.uid) {
        const map = {};
        Promise.all(
          data.map(async (asgn) => {
            const sub = await getStudentSubmission(asgn.id, user.uid);
            if (sub) {
              map[asgn.id] = sub;
            }
          })
        ).then(() => setSubmissionsMap(map));
      }
    });

    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, [user]);

  const handleOpenSubmitModal = (asgn) => {
    setSelectedAssignment(asgn);
    const existing = submissionsMap[asgn.id];
    if (existing) {
      setSubmissionNotes(existing.notes || "");
    } else {
      setSubmissionNotes("");
    }
    setFile(null);
  };

  const handleCloseModal = () => {
    setSelectedAssignment(null);
    setFile(null);
    setSubmissionNotes("");
  };

  const handleSubmitWork = async (e) => {
    e.preventDefault();
    if (!selectedAssignment) return;

    setSubmitting(true);
    try {
      let fileUrl = "";
      let fileName = "";

      if (file) {
        toast.loading("Uploading submission file...", { id: "upload" });
        fileUrl = await uploadFile(file, `submissions/${user.uid}/${Date.now()}_${file.name}`);
        fileName = file.name;
        toast.dismiss("upload");
      } else {
        const existing = submissionsMap[selectedAssignment.id];
        fileUrl = existing?.fileUrl || "";
        fileName = existing?.fileName || "";
      }

      await submitAssignment({
        assignmentId: selectedAssignment.id,
        studentId: user.uid,
        studentName: user.displayName || user.email?.split("@")[0] || "Student",
        studentRegisterNo: user.registerNo || user.regNo || "CS-2025",
        fileUrl,
        fileName,
        notes: submissionNotes,
      });

      toast.success("Assignment submitted successfully! 🎉");
      handleCloseModal();
      fetchAssignmentsAndSubmissions();
    } catch (err) {
      console.error("Submission failed:", err);
      toast.error("Failed to submit assignment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredAssignments = assignments.filter((asgn) => {
    const matchesSearch =
      asgn.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asgn.subject.toLowerCase().includes(searchQuery.toLowerCase());

    const sub = submissionsMap[asgn.id];
    let matchesStatus = true;
    if (filterStatus === "pending") matchesStatus = !sub;
    if (filterStatus === "submitted") matchesStatus = sub && sub.status === "Submitted";
    if (filterStatus === "graded") matchesStatus = sub && sub.status === "Graded";

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#021C4F]">Course Assignments</h1>
          <p className="text-sm text-slate-500">
            Submit coursework, track deadlines, and view grades & feedback from faculty.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100">
            Cohort: Year {user?.year || 1}
          </span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3.5 top-3 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search by assignment title or subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#021C4F]/20"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#021C4F]/20 text-slate-700"
        >
          <option value="all">All Statuses</option>
          <option value="pending">⏳ Pending</option>
          <option value="submitted">📤 Submitted</option>
          <option value="graded">🎯 Graded</option>
        </select>
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-44 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filteredAssignments.length === 0 ? (
        <GlassCard className="text-center py-12">
          <FiFileText className="mx-auto text-slate-300 mb-2" size={40} />
          <h3 className="text-base font-bold text-slate-700">No Assignments Found</h3>
          <p className="text-xs text-slate-500 mt-1">
            There are currently no assignments matching your criteria.
          </p>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAssignments.map((asgn) => {
            const sub = submissionsMap[asgn.id];
            const isGraded = sub?.status === "Graded";
            const isSubmitted = !!sub;

            return (
              <GlassCard key={asgn.id} className="flex flex-col justify-between hover:shadow-lg transition-all">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="inline-block px-2.5 py-0.5 text-[10px] font-semibold bg-slate-100 text-slate-700 rounded-md">
                        {asgn.subject}
                      </span>
                      <h3 className="text-base font-bold text-[#021C4F] mt-1">{asgn.title}</h3>
                    </div>

                    {/* Status Badge */}
                    {isGraded ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <FiCheckCircle size={12} /> Graded
                      </span>
                    ) : isSubmitted ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                        <FiClock size={12} /> Submitted
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        <FiAlertCircle size={12} /> Pending
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {asgn.description || "No description provided."}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1 border-t border-slate-100">
                    <span className="flex items-center gap-1">
                      <FiClock size={13} className="text-slate-400" /> Due: {asgn.dueDate || "No deadline"}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiAward size={13} className="text-slate-400" /> Max Marks: {asgn.maxMarks || 100}
                    </span>
                  </div>
                </div>

                {/* Grade & Action Section */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  {isGraded ? (
                    <div>
                      <p className="text-xs font-bold text-emerald-700">
                        Score: {sub.grade} / {asgn.maxMarks}
                      </p>
                      {sub.feedback && (
                        <p className="text-[11px] text-slate-500 italic">"{sub.feedback}"</p>
                      )}
                    </div>
                  ) : isSubmitted ? (
                    <p className="text-xs text-slate-500">Submitted on: {new Date(sub.submittedAt).toLocaleDateString()}</p>
                  ) : (
                    <span className="text-xs text-amber-600 font-medium">Action Required</span>
                  )}

                  <Button
                    onClick={() => handleOpenSubmitModal(asgn)}
                    variant={isSubmitted ? "outline" : "primary"}
                    size="sm"
                    className="gap-1.5"
                  >
                    <FiUploadCloud size={14} /> {isSubmitted ? "Update Submission" : "Submit Assignment"}
                  </Button>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}

      {/* Submission Modal */}
      <AnimatePresence>
        {selectedAssignment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b pb-3 border-slate-100">
                <div>
                  <h2 className="text-lg font-bold text-[#021C4F]">Submit Assignment</h2>
                  <p className="text-xs text-slate-500">{selectedAssignment.title} ({selectedAssignment.subject})</p>
                </div>
                <button onClick={handleCloseModal} className="p-1 rounded-lg hover:bg-slate-100 text-slate-500">
                  <FiX size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmitWork} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Upload Solution File (PDF, Code, ZIP, DOC)
                  </label>
                  <input
                    type="file"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {submissionsMap[selectedAssignment.id]?.fileName && (
                    <p className="text-[11px] text-slate-500 mt-1">
                      Current file: <span className="font-semibold text-slate-700">{submissionsMap[selectedAssignment.id].fileName}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Notes / Comments for Faculty (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={submissionNotes}
                    onChange={(e) => setSubmissionNotes(e.target.value)}
                    placeholder="Add any notes or solution links..."
                    className="w-full p-3 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#021C4F]/20"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <Button type="button" variant="outline" size="sm" onClick={handleCloseModal}>
                    Cancel
                  </Button>
                  <Button type="submit" size="sm" disabled={submitting}>
                    {submitting ? "Uploading..." : "Confirm & Submit"}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
