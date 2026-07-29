// src/services/ciaTimetableService.js
// Service for CIA Examination Timetables, Next Upcoming Exam calculation, and Admin CRUD.

import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { CURRICULUM } from "../utils/curriculum";

const COLLECTION_NAME = "ciaTimetables";

// Year-wise exam timings specification
export const YEAR_EXAM_TIMINGS = {
  1: "10:00 AM – 11:30 AM",
  2: "12:00 PM – 1:30 PM",
  3: "2:00 PM – 3:30 PM",
};

/**
 * Robust day difference calculator using local midnight.
 */
export function calculateDaysRemaining(examDateStr) {
  if (!examDateStr) return 0;
  const parts = examDateStr.split("-").map(Number);
  if (parts.length < 3) return 0;

  const [year, month, day] = parts;
  const examMidnight = new Date(year, month - 1, day, 0, 0, 0, 0);

  const now = new Date();
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);

  const diffTime = examMidnight.getTime() - todayMidnight.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Generate sequential dates starting from 13 August 2026, skipping weekends (Saturday & Sunday).
 */
export function generateExamDates(startDateStr, count) {
  const dates = [];
  const parts = startDateStr.split("-").map(Number);
  let current = new Date(parts[0], parts[1] - 1, parts[2]);

  while (dates.length < count) {
    const dayOfWeek = current.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      dates.push(new Date(current));
    }
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

/**
 * Generate default CIA Semester 1 Timetable for all 3 years starting 13 August 2026.
 */
export function getDefaultCiaTimetables() {
  const timetables = { 1: [], 2: [], 3: [] };
  const startDateStr = "2026-08-13"; // Thursday, 13 August 2026

  [1, 2, 3].forEach((year) => {
    const subjects = CURRICULUM[year]?.semesters?.[1]?.subjects || [];
    const examDates = generateExamDates(startDateStr, subjects.length);

    timetables[year] = subjects.map((subject, index) => {
      const dateObj = examDates[index];
      const y = dateObj.getFullYear();
      const m = String(dateObj.getMonth() + 1).padStart(2, "0");
      const d = String(dateObj.getDate()).padStart(2, "0");
      const isoDate = `${y}-${m}-${d}`;

      const dateDisplay = dateObj.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });

      return {
        id: `default_${year}_${index}`,
        year: parseInt(year),
        semester: 1,
        subject,
        examDate: isoDate,
        dateDisplay,
        timing: YEAR_EXAM_TIMINGS[year],
        college: "Dwaraka Doss Goverdhan Doss Vaishnav College (DDGDVC)",
      };
    });
  });

  return timetables;
}

/**
 * Synchronous upcoming exam calculator for instant 0ms notification triggers.
 */
export function getNextUpcomingCiaExamSync(year) {
  const targetYear = parseInt(year) || 1;
  const defaults = getDefaultCiaTimetables()[targetYear] || [];

  for (const exam of defaults) {
    const daysRemaining = calculateDaysRemaining(exam.examDate);
    if (daysRemaining >= 0) {
      return {
        ...exam,
        daysRemaining,
        isToday: daysRemaining === 0,
      };
    }
  }

  return { completed: true };
}

/**
 * Fetch CIA Timetable for a specific year (Semester 1).
 */
export async function getCiaTimetableForYear(year) {
  const targetYear = parseInt(year);
  const defaults = getDefaultCiaTimetables()[targetYear] || [];

  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where("year", "==", targetYear),
      where("semester", "==", 1),
      orderBy("examDate", "asc")
    );
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      return snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        const parts = (data.examDate || "").split("-").map(Number);
        let dateDisplay = data.examDate;
        if (parts.length === 3) {
          const dObj = new Date(parts[0], parts[1] - 1, parts[2]);
          dateDisplay = dObj.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          });
        }
        return {
          id: docSnap.id,
          ...data,
          timing: YEAR_EXAM_TIMINGS[targetYear],
          dateDisplay,
        };
      });
    }
  } catch (err) {
    console.warn("Firestore CIA timetable fetch fallback to default schedule:", err);
  }

  return defaults;
}

/**
 * Get the next upcoming CIA Exam for a specific student year.
 */
export async function getNextUpcomingCiaExam(year) {
  const timetable = await getCiaTimetableForYear(year);
  if (!timetable || timetable.length === 0) return null;

  for (const exam of timetable) {
    const daysRemaining = calculateDaysRemaining(exam.examDate);

    if (daysRemaining >= 0) {
      return {
        ...exam,
        daysRemaining: daysRemaining,
        isToday: daysRemaining === 0,
      };
    }
  }

  return { completed: true };
}

/**
 * Admin: Add a new CIA exam entry
 */
export async function addCiaExam(data) {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      year: parseInt(data.year),
      semester: 1,
      subject: data.subject,
      examDate: data.examDate,
      timing: YEAR_EXAM_TIMINGS[parseInt(data.year)],
      college: "Dwaraka Doss Goverdhan Doss Vaishnav College (DDGDVC)",
      createdAt: serverTimestamp(),
    });
    return { id: docRef.id, success: true };
  } catch (err) {
    console.error("Error adding CIA exam entry:", err);
    throw err;
  }
}

/**
 * Admin: Edit an existing CIA exam entry
 */
export async function updateCiaExam(id, data) {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      subject: data.subject,
      examDate: data.examDate,
      timing: YEAR_EXAM_TIMINGS[parseInt(data.year)],
      updatedAt: serverTimestamp(),
    });
    return true;
  } catch (err) {
    console.error("Error updating CIA exam entry:", err);
    throw err;
  }
}

/**
 * Admin: Delete a CIA exam entry
 */
export async function deleteCiaExam(id) {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
    return true;
  } catch (err) {
    console.error("Error deleting CIA exam entry:", err);
    throw err;
  }
}
