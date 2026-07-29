// src/pages/admin/ManageCiaTimetable.jsx
// Admin & Faculty Management Portal for CIA Examination Timetables.

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiCalendar, FiPlus, FiEdit, FiTrash2, FiClock, 
  FiBookOpen, FiCheck, FiX, FiRefreshCw 
} from "react-icons/fi";
import { 
  getCiaTimetableForYear, addCiaExam, updateCiaExam, deleteCiaExam, YEAR_EXAM_TIMINGS 
} from "../../services/ciaTimetableService";
import { CURRICULUM } from "../../utils/curriculum";
import GlassCard from "../../components/ui/GlassCard";
import Button from "../../components/ui/Button";
import toast from "react-hot-toast";

export default function ManageCiaTimetable() {
  const [selectedYear, setSelectedYear] = useState("1");
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    subject: "",
    examDate: "2026-08-13",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTimetable();
  }, [selectedYear]);

  async function fetchTimetable() {
    setLoading(true);
    try {
      const data = await getCiaTimetableForYear(selectedYear);
      setTimetable(data);
    } catch (err) {
      console.error("Error fetching CIA timetable:", err);
      toast.error("Failed to load timetable");
    } finally {
      setLoading(false);
    }
  }

  const handleOpenAddModal = () => {
    setEditingId(null);
    const subjects = CURRICULUM[selectedYear]?.semesters?.[1]?.subjects || [];
    setFormData({
      subject: subjects[0] || "",
      examDate: "2026-08-13",
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingId(item.id);
    setFormData({
      subject: item.subject,
      examDate: item.examDate || "2026-08-13",
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.subject || !formData.examDate) {
      toast.error("Please fill in subject and exam date");
      return;
    }

    setSubmitting(true);
    try {
      if (editingId && !editingId.startsWith("default_")) {
        await updateCiaExam(editingId, {
          year: selectedYear,
          subject: formData.subject,
          examDate: formData.examDate,
        });
        toast.success("Exam schedule updated! 📝");
      } else {
        await addCiaExam({
          year: selectedYear,
          subject: formData.subject,
          examDate: formData.examDate,
        });
        toast.success("New exam added to CIA timetable! 📅");
      }
      setShowModal(false);
      fetchTimetable();
    } catch (err) {
      console.error("Error saving exam:", err);
      toast.error("Failed to save exam schedule");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (item) => {
    if (!confirm(`Are you sure you want to delete "${item.subject}" from the timetable?`)) return;
    try {
      if (!item.id.startsWith("default_")) {
        await deleteCiaExam(item.id);
      }
      toast.success("Exam schedule removed");
      fetchTimetable();
    } catch (err) {
      toast.error("Failed to delete entry");
    }
  };

  const availableSubjects = CURRICULUM[selectedYear]?.semesters?.[1]?.subjects || [];

  return (
    <div className="space-y-6 pb-12 text-left">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#021C4F]">CIA Examination Timetable Manager</h1>
          <p className="text-sm text-slate-500">
            Configure, edit, and publish CIA Semester 1 exam schedules for 1st, 2nd, and 3rd year students.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={handleOpenAddModal} className="gap-2">
            <FiPlus size={16} /> Schedule Exam
          </Button>
        </div>
      </div>

      {/* Year Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        {["1", "2", "3"].map((yr) => (
          <button
            key={yr}
            onClick={() => setSelectedYear(yr)}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              selectedYear === yr
                ? "bg-[#021C4F] text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            {yr === "1" ? "1st Year (Sem 1)" : yr === "2" ? "2nd Year (Sem 1)" : "3rd Year (Sem 1)"}
          </button>
        ))}
      </div>

      {/* Official Timing Notice Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-blue-900">
        <div>
          <span className="font-extrabold text-[#021C4F] block">
            Official Exam Timing ({selectedYear === "1" ? "1st Year" : selectedYear === "2" ? "2nd Year" : "3rd Year"}):
          </span>
          <span className="text-blue-700">
            {selectedYear === "1" ? "10:00 AM – 11:30 AM" : selectedYear === "2" ? "12:00 PM – 1:30 PM" : "2:00 PM – 3:30 PM"}
          </span>
        </div>
        <span className="px-3 py-1 bg-white rounded-xl border border-blue-200 font-bold text-rose-700 self-start sm:self-auto">
          Start Date: 13 August 2026
        </span>
      </div>

      {/* Timetable List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-16 bg-slate-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : timetable.length === 0 ? (
        <GlassCard className="text-center py-12">
          <FiCalendar className="mx-auto text-slate-300 mb-2" size={40} />
          <h3 className="text-base font-bold text-slate-700">No Timetable Scheduled</h3>
          <p className="text-xs text-slate-500 mt-1">Click "Schedule Exam" to add exams for Year {selectedYear}.</p>
        </GlassCard>
      ) : (
        <div className="space-y-3">
          {timetable.map((item, index) => (
            <GlassCard key={item.id || index} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-3 hover:shadow-md transition-all">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700 font-black text-xs border border-blue-100">
                  #{index + 1}
                </span>
                <div>
                  <h3 className="text-sm font-bold text-[#021C4F]">{item.subject}</h3>
                  <p className="text-xs text-slate-500">
                    College: {item.college || "DDGDVC"} · Semester 1
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs">
                <span className="flex items-center gap-1 font-semibold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl">
                  <FiCalendar size={13} className="text-blue-600" /> {item.dateDisplay || item.examDate}
                </span>

                <span className="flex items-center gap-1 font-semibold text-slate-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-100">
                  <FiClock size={13} className="text-amber-600" /> {YEAR_EXAM_TIMINGS[selectedYear]}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEditModal(item)}
                    className="p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Edit schedule"
                  >
                    <FiEdit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    className="p-2 text-slate-500 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Delete schedule"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Add / Edit Exam Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b pb-3 border-slate-100">
                <h2 className="text-lg font-bold text-[#021C4F]">
                  {editingId ? "Edit Exam Schedule" : "Schedule CIA Exam"}
                </h2>
                <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-500">
                  <FiX size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Year & Semester</label>
                  <input
                    type="text"
                    disabled
                    value={`Year ${selectedYear} · Semester 1 (${YEAR_EXAM_TIMINGS[selectedYear]})`}
                    className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-xl font-bold text-slate-700"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Select Subject</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none"
                  >
                    {availableSubjects.map((sub) => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Exam Date</label>
                  <input
                    type="date"
                    required
                    value={formData.examDate}
                    onChange={(e) => setFormData({ ...formData, examDate: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? "Saving..." : editingId ? "Update Schedule" : "Schedule Exam"}
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
