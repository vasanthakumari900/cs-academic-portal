// src/pages/faculty/FacultyAssignments.jsx
// Faculty Assignment Management Portal: Post coursework, review student submissions, grade & submit feedback.

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiPlus, FiFileText, FiUserCheck, FiClock, FiAward, 
  FiCheckCircle, FiX, FiDownload, FiTrash2, FiExternalLink
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { 
  createAssignment, getAssignments, deleteAssignment, 
  getSubmissionsForAssignment, gradeSubmission 
} from "../../services/assignmentService";
import { uploadFile } from "../../services/storageService";
import GlassCard from "../../components/ui/GlassCard";
import Button from "../../components/ui/Button";
import toast from "react-hot-toast";

const CS_SUBJECTS_BY_YEAR = {
  "1": [
    "Programming in C & Data Structures",
    "Problem Solving Techniques & C Lab",
    "Digital Logic & Computer Fundamentals",
    "Programming in C++",
    "Object Oriented Programming (OOP)",
    "Discrete Mathematics"
  ],
  "2": [
    "Java Programming",
    "Database Management Systems (DBMS)",
    "Data Structures & Algorithms",
    "Python Programming",
    "Computer Networks & Security",
    "Operating Systems (OS)",
    "Microprocessors & Assembly Language"
  ],
  "3": [
    "Web Technology & UI Development",
    "Software Engineering & Testing",
    "Machine Learning & AI",
    "Cloud Computing & Distributed Systems",
    "Compiler Design",
    "Information & Cyber Security",
    "Mobile Application Development",
    "Main Project Work & Viva-Voce"
  ]
};

export default function FacultyAssignments() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Create Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    subject: "Programming in C & Data Structures",
    year: "1",
    semester: "2",
    description: "",
    dueDate: "",
    maxMarks: "100",
  });
  const [attachment, setAttachment] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Submissions Modal
  const [activeAssignment, setActiveAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [gradingSubmissionId, setGradingSubmissionId] = useState(null);
  const [gradeInput, setGradeInput] = useState("");
  const [feedbackInput, setFeedbackInput] = useState("");

  useEffect(() => {
    fetchAssignments();
  }, []);

  async function fetchAssignments() {
    setLoading(true);
    try {
      const data = await getAssignments();
      setAssignments(data);
    } catch (err) {
      console.error("Error fetching assignments:", err);
      toast.error("Failed to load assignments");
    } finally {
      setLoading(false);
    }
  }

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      let attachmentUrl = null;
      let attachmentName = null;

      if (attachment) {
        toast.loading("Uploading attachment...", { id: "attach" });
        attachmentUrl = await uploadFile(attachment, `assignments/${Date.now()}_${attachment.name}`);
        attachmentName = attachment.name;
        toast.dismiss("attach");
      }

      await createAssignment({
        ...formData,
        attachmentUrl,
        attachmentName,
        createdBy: user.uid,
        createdByName: user.displayName || user.email?.split("@")[0] || "Faculty",
      });

      toast.success("Assignment published successfully! 🚀");
      setShowCreateModal(false);
      setFormData({
        title: "",
        subject: "DATA STRUCTURES",
        year: "1",
        semester: "2",
        description: "",
        dueDate: "",
        maxMarks: "100",
      });
      setAttachment(null);
      fetchAssignments();
    } catch (err) {
      console.error("Error creating assignment:", err);
      toast.error("Failed to create assignment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this assignment?")) return;
    try {
      await deleteAssignment(id);
      toast.success("Assignment deleted");
      fetchAssignments();
    } catch (err) {
      toast.error("Failed to delete assignment");
    }
  };

  const handleOpenSubmissions = async (asgn) => {
    setActiveAssignment(asgn);
    setLoadingSubmissions(true);
    try {
      const subs = await getSubmissionsForAssignment(asgn.id);
      setSubmissions(subs);
    } catch (err) {
      console.error("Error fetching submissions:", err);
      toast.error("Failed to load submissions");
    } finally {
      setLoadingSubmissions(false);
    }
  };

  const handleGradeSubmit = async (subId) => {
    if (!gradeInput) {
      toast.error("Please enter a numeric grade");
      return;
    }
    try {
      await gradeSubmission(subId, gradeInput, feedbackInput);
      toast.success("Grade saved!");
      setGradingSubmissionId(null);
      setGradeInput("");
      setFeedbackInput("");
      handleOpenSubmissions(activeAssignment);
    } catch (err) {
      toast.error("Failed to submit grade");
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#021C4F]">Faculty Assignment Manager</h1>
          <p className="text-sm text-slate-500">
            Publish course tasks, review student submissions, and grade work.
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="gap-2 self-start md:self-auto">
          <FiPlus size={16} /> Create Assignment
        </Button>
      </div>

      {/* Grid of assignments */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-40 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : assignments.length === 0 ? (
        <GlassCard className="text-center py-12">
          <FiFileText className="mx-auto text-slate-300 mb-2" size={40} />
          <h3 className="text-base font-bold text-slate-700">No Assignments Posted Yet</h3>
          <p className="text-xs text-slate-500 mt-1">Click "Create Assignment" to post coursework for your students.</p>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assignments.map((asgn) => (
            <GlassCard key={asgn.id} className="flex flex-col justify-between hover:shadow-lg transition-all">
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="inline-block px-2 py-0.5 text-[10px] font-semibold bg-blue-50 text-blue-700 rounded-md">
                      Year {asgn.year} • {asgn.subject}
                    </span>
                    <h3 className="text-base font-bold text-[#021C4F] mt-1">{asgn.title}</h3>
                  </div>
                  <button
                    onClick={() => handleDelete(asgn.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2">{asgn.description || "No description provided."}</p>

                <div className="flex items-center gap-4 text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <span className="flex items-center gap-1"><FiClock size={12} /> Due: {asgn.dueDate || "N/A"}</span>
                  <span className="flex items-center gap-1"><FiAward size={12} /> Max: {asgn.maxMarks} Marks</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">By: {asgn.createdByName || "Faculty"}</span>
                <Button onClick={() => handleOpenSubmissions(asgn)} size="sm" variant="outline" className="gap-1.5">
                  <FiUserCheck size={14} /> Review Submissions
                </Button>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Create Assignment Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b pb-3 border-slate-100">
                <h2 className="text-lg font-bold text-[#021C4F]">Publish New Assignment</h2>
                <button onClick={() => setShowCreateModal(false)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-500">
                  <FiX size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateAssignment} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Assignment Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Data Structures Binary Trees Implementation"
                    className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#021C4F]/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Year</label>
                    <select
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      className="w-full p-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none"
                    >
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Respected CS Subject</label>
                    <select
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full p-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none font-medium text-xs text-[#021C4F]"
                    >
                      <optgroup label="🎓 1st Year CS Subjects">
                        {CS_SUBJECTS_BY_YEAR["1"].map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </optgroup>
                      <optgroup label="🎓 2nd Year CS Subjects">
                        {CS_SUBJECTS_BY_YEAR["2"].map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </optgroup>
                      <optgroup label="🎓 3rd Year CS Subjects">
                        {CS_SUBJECTS_BY_YEAR["3"].map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </optgroup>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Due Date</label>
                    <input
                      type="date"
                      required
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                      className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Max Marks</label>
                    <input
                      type="number"
                      required
                      value={formData.maxMarks}
                      onChange={(e) => setFormData({ ...formData, maxMarks: e.target.value })}
                      className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Instructions / Description</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Provide details or questions..."
                    className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Attachment File (Optional PDF/Doc)</label>
                  <input
                    type="file"
                    onChange={(e) => setAttachment(e.target.files?.[0] || null)}
                    className="w-full text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t">
                  <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)}>Cancel</Button>
                  <Button type="submit" disabled={submitting}>{submitting ? "Publishing..." : "Publish Assignment"}</Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Submissions Review Modal */}
      <AnimatePresence>
        {activeAssignment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col"
            >
              <div className="flex items-center justify-between border-b pb-3 border-slate-100 shrink-0">
                <div>
                  <h2 className="text-lg font-bold text-[#021C4F]">Student Submissions</h2>
                  <p className="text-xs text-slate-500">{activeAssignment.title} ({submissions.length} submitted)</p>
                </div>
                <button onClick={() => setActiveAssignment(null)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-500">
                  <FiX size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {loadingSubmissions ? (
                  <p className="text-xs text-slate-500 py-4 text-center">Loading submissions...</p>
                ) : submissions.length === 0 ? (
                  <p className="text-xs text-slate-500 py-8 text-center">No student submissions yet for this assignment.</p>
                ) : (
                  submissions.map((sub) => (
                    <div key={sub.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-[#021C4F]">{sub.studentName} ({sub.studentRegisterNo})</p>
                          <p className="text-[10px] text-slate-400">Submitted: {new Date(sub.submittedAt).toLocaleString()}</p>
                        </div>
                        {sub.status === "Graded" ? (
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                            Graded: {sub.grade} / {activeAssignment.maxMarks}
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px]">
                            Pending Review
                          </span>
                        )}
                      </div>

                      {sub.notes && <p className="text-slate-600 bg-white p-2 rounded border border-slate-100 italic">"{sub.notes}"</p>}

                      <div className="flex items-center justify-between pt-1">
                        {sub.fileUrl ? (
                          <a
                            href={sub.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1 text-blue-600 font-semibold hover:underline text-[11px]"
                          >
                            <FiDownload size={12} /> View Submission File ({sub.fileName || "File"})
                          </a>
                        ) : (
                          <span className="text-slate-400 italic">No file attached</span>
                        )}

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setGradingSubmissionId(sub.id);
                            setGradeInput(sub.grade?.toString() || "");
                            setFeedbackInput(sub.feedback || "");
                          }}
                        >
                          {sub.status === "Graded" ? "Edit Grade" : "Grade Work"}
                        </Button>
                      </div>

                      {/* Inline Grading Form */}
                      {gradingSubmissionId === sub.id && (
                        <div className="mt-2 p-3 bg-white rounded-xl border border-blue-200 space-y-2">
                          <div className="flex gap-2">
                            <input
                              type="number"
                              placeholder="Marks"
                              value={gradeInput}
                              onChange={(e) => setGradeInput(e.target.value)}
                              className="w-24 p-2 border border-slate-200 rounded-lg text-xs"
                            />
                            <input
                              type="text"
                              placeholder="Faculty feedback / comments..."
                              value={feedbackInput}
                              onChange={(e) => setFeedbackInput(e.target.value)}
                              className="flex-1 p-2 border border-slate-200 rounded-lg text-xs"
                            />
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="ghost" onClick={() => setGradingSubmissionId(null)}>Cancel</Button>
                            <Button size="sm" onClick={() => handleGradeSubmit(sub.id)}>Save Grade</Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
