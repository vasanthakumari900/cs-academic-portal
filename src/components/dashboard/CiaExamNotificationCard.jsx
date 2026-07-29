// src/components/dashboard/CiaExamNotificationCard.jsx
// Modern, responsive notification card for Student Dashboard displaying upcoming CIA Exam & full timetable modal.

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiBell, FiCalendar, FiClock, FiBookOpen, 
  FiCheckCircle, FiX, FiChevronRight, FiAward
} from "react-icons/fi";
import { 
  getNextUpcomingCiaExam, getNextUpcomingCiaExamSync, getCiaTimetableForYear, getDefaultCiaTimetables, YEAR_EXAM_TIMINGS 
} from "../../services/ciaTimetableService";
import { triggerBrowserNotification, playNotificationSound } from "../../services/notificationService";
import Button from "../ui/Button";
import toast from "react-hot-toast";

export default function CiaExamNotificationCard({ studentYear = 3 }) {
  const yearNum = parseInt(studentYear) || 1;

  // Initialize with synchronous default calculation so card render, notification, and full timetable work IMMEDIATELY (0ms delay)
  const initialExam = getNextUpcomingCiaExamSync(yearNum);
  const initialTimetable = getDefaultCiaTimetables()[yearNum] || [];

  const [upcomingExam, setUpcomingExam] = useState(initialExam);
  const [fullTimetable, setFullTimetable] = useState(initialTimetable);
  const [showModal, setShowModal] = useState(false);
  const notifiedRef = useRef(false);

  useEffect(() => {
    // Update local state when studentYear changes
    const syncExam = getNextUpcomingCiaExamSync(yearNum);
    const syncTimetable = getDefaultCiaTimetables()[yearNum] || [];
    setUpcomingExam(syncExam);
    setFullTimetable(syncTimetable);

    // Trigger notification toast & sound IMMEDIATELY on mount
    triggerImmediateNotification(syncExam);

    // Then fetch any Firestore overrides in background
    fetchCiaData();
  }, [studentYear]);

  function triggerImmediateNotification(exam) {
    if (exam && !exam.completed && !notifiedRef.current) {
      notifiedRef.current = true;
      playNotificationSound();

      const daysText = exam.isToday ? "Today!" : `${exam.daysRemaining} days remaining`;

      // Instant Toast Pop-up Notification
      toast.custom(
        (t) => (
          <div
            className={`${
              t.visible ? "animate-enter" : "animate-leave"
            } max-w-md w-full bg-[#021C4F] shadow-2xl rounded-2xl pointer-events-auto flex ring-1 ring-black ring-opacity-5 p-4 text-white border border-[#C50337]/40`}
          >
            <div className="flex-1 w-0 flex items-center">
              <div className="flex-shrink-0 pt-0.5">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C50337] text-white shadow-md">
                  <FiBell size={20} className="animate-bounce" />
                </span>
              </div>
              <div className="ml-3 flex-1 text-left">
                <p className="text-xs font-bold uppercase tracking-wider text-rose-300">
                  Upcoming CIA Examination Notification
                </p>
                <p className="mt-0.5 text-xs font-extrabold text-white">
                  {exam.subject}
                </p>
                <p className="text-[11px] text-slate-200 mt-1">
                  📅 {exam.dateDisplay || exam.examDate} · 🕒 {YEAR_EXAM_TIMINGS[yearNum]}
                </p>
                <p className="text-[10px] font-bold text-amber-300 mt-0.5">
                  ⏳ {daysText}
                </p>
              </div>
            </div>
            <div className="flex border-l border-white/10 pl-3">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="w-full border border-transparent rounded-none rounded-r-lg p-1 flex items-center justify-center text-xs font-medium text-slate-300 hover:text-white"
              >
                <FiX size={16} />
              </button>
            </div>
          </div>
        ),
        { duration: 6000, id: `cia_alert_${exam.id || yearNum}` }
      );

      // Trigger native browser notification
      triggerBrowserNotification("🔔 Upcoming CIA Examination Notification", {
        body: `${exam.subject} — ${exam.dateDisplay || exam.examDate} (${YEAR_EXAM_TIMINGS[yearNum]}). ${daysText}`,
      });
    }
  }

  async function fetchCiaData() {
    try {
      const next = await getNextUpcomingCiaExam(yearNum);
      const timetable = await getCiaTimetableForYear(yearNum);
      if (next) setUpcomingExam(next);
      if (timetable && timetable.length > 0) setFullTimetable(timetable);
    } catch (err) {
      console.error("Error syncing CIA data:", err);
    }
  }

  const isCompleted = upcomingExam?.completed;

  return (
    <>
      {/* Top-Right Responsive Notification Card */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full sm:w-88 md:w-96 rounded-2xl border border-rose-100 bg-gradient-to-br from-white via-rose-50/40 to-amber-50/50 p-4 sm:p-5 shadow-lg relative overflow-hidden backdrop-blur-sm"
      >
        {/* Ambient background glow */}
        <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-rose-500/10 blur-xl pointer-events-none" />

        {/* Card Header */}
        <div className="flex items-center justify-between gap-2 border-b border-rose-100 pb-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-r from-[#C50337] to-rose-600 text-white shadow-sm">
              <FiBell size={16} />
              {!isCompleted && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-amber-400 ring-2 ring-white">
                  <span className="h-1.5 w-1.5 animate-ping rounded-full bg-white opacity-75" />
                </span>
              )}
            </div>
            <div className="text-left">
              <h3 className="text-xs sm:text-sm font-extrabold text-[#021C4F] tracking-tight">
                🔔 Upcoming CIA Examination
              </h3>
              <p className="text-[10px] font-bold text-rose-600">
                Semester 1 · {yearNum === 1 ? "1st" : yearNum === 2 ? "2nd" : "3rd"} Year
              </p>
            </div>
          </div>

          <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[9px] font-bold text-rose-800 border border-rose-200">
            Internal Exam
          </span>
        </div>

        {/* Card Body */}
        {isCompleted ? (
          <div className="py-4 text-center space-y-2">
            <FiCheckCircle className="mx-auto text-emerald-500" size={32} />
            <p className="text-xs font-bold text-slate-800">
              All CIA Semester 1 examinations have been completed.
            </p>
            <p className="text-[10px] text-slate-500">
              Great job! Stay tuned for internal assessment results.
            </p>
          </div>
        ) : upcomingExam ? (
          <div className="space-y-2.5 text-xs text-slate-700 text-left">
            {/* College Name */}
            <div className="flex items-start gap-2">
              <span className="text-slate-400 shrink-0 font-bold">🏫</span>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">College</span>
                <span className="font-semibold text-slate-800 leading-tight block">
                  Dwaraka Doss Goverdhan Doss Vaishnav College (DDGDVC)
                </span>
              </div>
            </div>

            {/* Subject */}
            <div className="flex items-start gap-2 bg-white/80 p-2.5 rounded-xl border border-rose-100 shadow-2xs">
              <FiBookOpen className="text-[#C50337] shrink-0 mt-0.5" size={15} />
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Subject</span>
                <span className="font-extrabold text-[#021C4F] text-xs sm:text-sm block">
                  {upcomingExam.subject}
                </span>
              </div>
            </div>

            {/* Date & Time Grid */}
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="bg-white/80 p-2 rounded-xl border border-slate-100">
                <span className="text-[9px] uppercase font-bold text-slate-400 flex items-center gap-1">
                  <FiCalendar size={11} className="text-blue-600" /> Exam Date
                </span>
                <span className="font-bold text-slate-800 block mt-0.5">
                  {upcomingExam.dateDisplay || upcomingExam.examDate}
                </span>
              </div>

              <div className="bg-white/80 p-2 rounded-xl border border-slate-100">
                <span className="text-[9px] uppercase font-bold text-slate-400 flex items-center gap-1">
                  <FiClock size={11} className="text-amber-600" /> Time
                </span>
                <span className="font-bold text-slate-800 block mt-0.5">
                  {YEAR_EXAM_TIMINGS[yearNum]}
                </span>
              </div>
            </div>

            {/* Semester & Automatic Days Remaining */}
            <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px]">
              <span className="font-medium text-slate-500">
                📚 Semester: <strong className="text-slate-800">Semester 1</strong>
              </span>

              <span
                className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] shadow-2xs ${
                  upcomingExam.isToday
                    ? "bg-rose-600 text-white animate-pulse"
                    : "bg-amber-100 text-amber-900 border border-amber-200"
                }`}
              >
                ⏳ {upcomingExam.isToday ? "Exam Today!" : `${upcomingExam.daysRemaining} Days Remaining`}
              </span>
            </div>
          </div>
        ) : null}

        {/* View Full Timetable Action Button */}
        <button
          onClick={() => setShowModal(true)}
          className="mt-3.5 flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#021C4F] hover:bg-[#C50337] py-2 text-xs font-bold text-white shadow-sm transition-all duration-200 active:scale-98"
        >
          <span>View Full Timetable</span>
          <FiChevronRight size={14} />
        </button>
      </motion.div>

      {/* Full Timetable Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] flex flex-col text-left"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b pb-3 border-slate-100 shrink-0">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#C50337] text-white">
                      <FiAward size={16} />
                    </span>
                    <h2 className="text-lg font-bold text-[#021C4F]">
                      CIA Semester 1 Examination Timetable
                    </h2>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Dwaraka Doss Goverdhan Doss Vaishnav College (DDGDVC) · {yearNum === 1 ? "1st" : yearNum === 2 ? "2nd" : "3rd"} Year B.Sc. CS
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500"
                >
                  <FiX size={18} />
                </button>
              </div>

              {/* Timing Badge Banner */}
              <div className="flex items-center justify-between bg-blue-50/80 p-3 rounded-xl border border-blue-100 text-xs shrink-0">
                <span className="font-semibold text-blue-900">
                  Exam Timing ({yearNum === 1 ? "1st" : yearNum === 2 ? "2nd" : "3rd"} Year):
                </span>
                <span className="font-bold text-[#C50337] bg-white px-2.5 py-1 rounded-lg border border-blue-200">
                  🕒 {YEAR_EXAM_TIMINGS[yearNum]}
                </span>
              </div>

              {/* Timetable Table List */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {fullTimetable.length === 0 ? (
                  <p className="text-xs text-slate-500 py-8 text-center">
                    No examination timetable scheduled.
                  </p>
                ) : (
                  fullTimetable.map((item, idx) => {
                    const isNext = upcomingExam?.id === item.id || upcomingExam?.subject === item.subject;

                    return (
                      <div
                        key={item.id || idx}
                        className={`flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border text-xs gap-2 transition-all ${
                          isNext
                            ? "bg-rose-50/60 border-rose-300 ring-2 ring-rose-500/20 shadow-xs"
                            : "bg-slate-50 border-slate-200"
                        }`}
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-400">Day {idx + 1}</span>
                            {isNext && (
                              <span className="px-2 py-0.5 rounded-md bg-[#C50337] text-white text-[9px] font-bold">
                                NEXT EXAM
                              </span>
                            )}
                          </div>
                          <h4 className="font-bold text-[#021C4F] text-xs sm:text-sm">
                            {item.subject}
                          </h4>
                        </div>

                        <div className="flex items-center gap-3 text-[11px] shrink-0">
                          <span className="flex items-center gap-1 text-slate-700 font-semibold bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                            <FiCalendar size={12} className="text-blue-600" />
                            {item.dateDisplay || item.examDate}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 shrink-0 text-xs text-slate-500">
                <span>Note: Saturday and Sunday are exam holidays.</span>
                <Button size="sm" onClick={() => setShowModal(false)}>
                  Close Timetable
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
