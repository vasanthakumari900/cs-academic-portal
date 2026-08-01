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

// Year-wise exam timings specification (Shift II - Evening Shift)
export const YEAR_EXAM_TIMINGS = {
  1: "02.00 p.m – 04.00 p.m",
  2: "02.00 p.m – 04.00 p.m",
  3: "04.30 p.m – 06.30 p.m",
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
 * Official CIA - I August 2026 Timetable for UG (Shift II - Evening Shift)
 */
export const OFFICIAL_CIA_UG_TIMETABLES = {
  1: [
    {
      id: "ug1_1",
      year: 1,
      semester: 1,
      subject: "Language",
      examDate: "2026-08-13",
      dateDisplay: "13 August 2026 (Thursday)",
      timing: "02.00 p.m – 04.00 p.m",
      college: "Dwaraka Doss Goverdhan Doss Vaishnav College (DDGDVC)",
    },
    {
      id: "ug1_2",
      year: 1,
      semester: 1,
      subject: "English",
      examDate: "2026-08-14",
      dateDisplay: "14 August 2026 (Friday)",
      timing: "02.00 p.m – 04.00 p.m",
      college: "Dwaraka Doss Goverdhan Doss Vaishnav College (DDGDVC)",
    },
    {
      id: "ug1_3",
      year: 1,
      semester: 1,
      subject: "Python Programming Essentials",
      examDate: "2026-08-17",
      dateDisplay: "17 August 2026 (Monday)",
      timing: "02.00 p.m – 04.00 p.m",
      college: "Dwaraka Doss Goverdhan Doss Vaishnav College (DDGDVC)",
    },
    {
      id: "ug1_4",
      year: 1,
      semester: 1,
      subject: "Mathematics I",
      examDate: "2026-08-18",
      dateDisplay: "18 August 2026 (Tuesday)",
      timing: "02.00 p.m – 04.00 p.m",
      college: "Dwaraka Doss Goverdhan Doss Vaishnav College (DDGDVC)",
    },
  ],
  2: [
    {
      id: "ug2_1",
      year: 2,
      semester: 1,
      subject: "Language",
      examDate: "2026-08-13",
      dateDisplay: "13 August 2026 (Thursday)",
      timing: "02.00 p.m – 04.00 p.m",
      college: "Dwaraka Doss Goverdhan Doss Vaishnav College (DDGDVC)",
    },
    {
      id: "ug2_2",
      year: 2,
      semester: 1,
      subject: "English",
      examDate: "2026-08-14",
      dateDisplay: "14 August 2026 (Friday)",
      timing: "02.00 p.m – 04.00 p.m",
      college: "Dwaraka Doss Goverdhan Doss Vaishnav College (DDGDVC)",
    },
    {
      id: "ug2_3",
      year: 2,
      semester: 1,
      subject: "Object Oriented Programming Concepts using Java",
      examDate: "2026-08-17",
      dateDisplay: "17 August 2026 (Monday)",
      timing: "02.00 p.m – 04.00 p.m",
      college: "Dwaraka Doss Goverdhan Doss Vaishnav College (DDGDVC)",
    },
    {
      id: "ug2_4",
      year: 2,
      semester: 1,
      subject: "Principles of Operating Systems",
      examDate: "2026-08-18",
      dateDisplay: "18 August 2026 (Tuesday)",
      timing: "02.00 p.m – 04.00 p.m",
      college: "Dwaraka Doss Goverdhan Doss Vaishnav College (DDGDVC)",
    },
    {
      id: "ug2_5",
      year: 2,
      semester: 1,
      subject: "DSE I(A) - Web Application Development Using REACTJS and NODE.JS / DSE I(B) - Web Application Development Using AngularJS and NodeJS",
      examDate: "2026-08-19",
      dateDisplay: "19 August 2026 (Wednesday)",
      timing: "02.00 p.m – 04.00 p.m",
      college: "Dwaraka Doss Goverdhan Doss Vaishnav College (DDGDVC)",
    },
    {
      id: "ug2_6",
      year: 2,
      semester: 1,
      subject: "Statistics I",
      examDate: "2026-08-20",
      dateDisplay: "20 August 2026 (Thursday)",
      timing: "02.00 p.m – 04.00 p.m",
      college: "Dwaraka Doss Goverdhan Doss Vaishnav College (DDGDVC)",
    },
  ],
  3: [
    {
      id: "ug3_1",
      year: 3,
      semester: 1,
      subject: "Operating Systems",
      examDate: "2026-08-13",
      dateDisplay: "13 August 2026 (Thursday)",
      timing: "04.30 p.m – 06.30 p.m",
      college: "Dwaraka Doss Goverdhan Doss Vaishnav College (DDGDVC)",
    },
    {
      id: "ug3_2",
      year: 3,
      semester: 1,
      subject: "Database Management Systems",
      examDate: "2026-08-14",
      dateDisplay: "14 August 2026 (Friday)",
      timing: "04.30 p.m – 06.30 p.m",
      college: "Dwaraka Doss Goverdhan Doss Vaishnav College (DDGDVC)",
    },
    {
      id: "ug3_3",
      year: 3,
      semester: 1,
      subject: "Data Mining Techniques",
      examDate: "2026-08-17",
      dateDisplay: "17 August 2026 (Monday)",
      timing: "04.30 p.m – 06.30 p.m",
      college: "Dwaraka Doss Goverdhan Doss Vaishnav College (DDGDVC)",
    },
    {
      id: "ug3_4",
      year: 3,
      semester: 1,
      subject: "ASP DOT NET Programming",
      examDate: "2026-08-18",
      dateDisplay: "18 August 2026 (Tuesday)",
      timing: "04.30 p.m – 06.30 p.m",
      college: "Dwaraka Doss Goverdhan Doss Vaishnav College (DDGDVC)",
    },
  ],
};

/**
 * Return official CIA UG Timetables
 */
export function getDefaultCiaTimetables() {
  return OFFICIAL_CIA_UG_TIMETABLES;
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
