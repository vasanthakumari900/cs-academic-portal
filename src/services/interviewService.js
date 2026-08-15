// src/services/interviewService.js
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  increment,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/config";

const INTERVIEWS_COLLECTION = "interviewExperiences";

export const MOCK_INTERVIEW_EXPERIENCES = [
  {
    id: "exp-1",
    company: "Zoho Corporation",
    role: "Member Technical Staff (MTS)",
    batch: "2025",
    ctc: "12.0 LPA",
    difficulty: "Hard",
    verdict: "Selected",
    roundsCount: 4,
    roundsDetail: "Round 1: Written C & Aptitude Test (No compiler, hand-traced pointers & loops).\nRound 2: Basic Programming (5 questions on arrays, string manipulation).\nRound 3: Advanced System Design (Console application: Railway Reservation System in Java without external libraries).\nRound 4: HR & Technical Discussion.",
    questionsAsked: "1. Implement a custom string split without using built-in methods.\n2. Design a Call Taxi Booking system in console Java.\n3. Explain object-oriented encapsulation and garbage collection memory model.",
    preparationTips: "Practice building complete OOPs applications on paper and console. Avoid using string regex or high-level library shortcuts during coding rounds.",
    studentName: "Subramanian K",
    upvotes: 24,
  },
  {
    id: "exp-2",
    company: "TCS Digital",
    role: "Systems Engineer (Digital)",
    batch: "2025",
    ctc: "7.5 LPA",
    difficulty: "Medium",
    verdict: "Selected",
    roundsCount: 3,
    roundsDetail: "Round 1: TCS NQT Online Test (Numerical, Verbal, Advanced Coding).\nRound 2: Technical Interview at TCS Siruseri (SQL JOINs, Final Year Academic Project deep dive).\nRound 3: Managerial & HR Round.",
    questionsAsked: "1. Write SQL query to find 2nd highest salary using Subquery.\n2. Explain your final year project architecture & database schema.\n3. Difference between process and thread in OS.",
    preparationTips: "Be 100% thorough with your final year project code. Practice past TCS NQT national mock test papers.",
    studentName: "Deepika R",
    upvotes: 18,
  },
  {
    id: "exp-3",
    company: "Kaar Technologies",
    role: "SAP Technical Consultant",
    batch: "2024",
    ctc: "6.5 LPA",
    difficulty: "Medium",
    verdict: "Selected",
    roundsCount: 4,
    roundsDetail: "Round 1: Aptitude & C/C++ Test.\nRound 2: Database Schema & SQL Querying.\nRound 3: Technical HR.\nRound 4: Management Discussion.",
    questionsAsked: "1. Explain Primary Keys, Foreign Keys, and Cascade Delete.\n2. Write SQL query for INNER vs LEFT JOIN with NULL checks.\n3. Explain ABAP cloud fundamentals.",
    preparationTips: "Focus heavily on DBMS concepts, normalization, and relational algebra.",
    studentName: "Barath Raj S",
    upvotes: 15,
  },
  {
    id: "exp-4",
    company: "Accenture India",
    role: "Advanced Application Associate",
    batch: "2024",
    ctc: "6.5 LPA",
    difficulty: "Easy",
    verdict: "Selected",
    roundsCount: 3,
    roundsDetail: "Round 1: Cognitive & Pseudocode Test.\nRound 2: Technical & Pseudocode Debugging.\nRound 3: HR Round.",
    questionsAsked: "1. Debug C/Java pseudocode loops.\n2. Explain networking IP addressing and DNS.\n3. Tell me about a time you solved a technical bug under pressure.",
    preparationTips: "Practice pseudocode tracing speed and verbal clarity.",
    studentName: "Sowmya N",
    upvotes: 12,
  },
];

/**
 * Get all interview experiences with optional filtering
 */
export async function getInterviewExperiences(filters = {}) {
  try {
    const constraints = [];
    if (filters.company) {
      constraints.push(where("company", "==", filters.company));
    }
    if (filters.role) {
      constraints.push(where("role", "==", filters.role));
    }
    constraints.push(orderBy("createdAt", "desc"));

    const q = query(collection(db, INTERVIEWS_COLLECTION), ...constraints);
    const snapshot = await getDocs(q);

    const list = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
      createdAt: docSnap.data().createdAt?.toDate()?.toISOString() || new Date().toISOString(),
    }));

    return list.length > 0 ? list : MOCK_INTERVIEW_EXPERIENCES;
  } catch (error) {
    console.error("Error fetching interview experiences:", error);
    return MOCK_INTERVIEW_EXPERIENCES;
  }
}

/**
 * Share a new interview experience
 */
export async function createInterviewExperience(data) {
  try {
    const docRef = await addDoc(collection(db, INTERVIEWS_COLLECTION), {
      company: data.company,
      role: data.role || "Software Development Engineer",
      batch: data.batch || "2025",
      difficulty: data.difficulty || "Medium", // Easy, Medium, Hard
      verdict: data.verdict || "Selected", // Selected, Rejected, Pending
      ctc: data.ctc || "N/A",
      roundsCount: parseInt(data.roundsCount) || 3,
      roundsDetail: data.roundsDetail || "", // Detailed explanation of rounds
      questionsAsked: data.questionsAsked || "",
      preparationTips: data.preparationTips || "",
      studentName: data.studentName || "Anonymous Student",
      studentId: data.studentId || null,
      upvotes: 0,
      createdAt: serverTimestamp(),
    });
    return { id: docRef.id, success: true };
  } catch (error) {
    console.error("Error creating interview experience:", error);
    throw error;
  }
}

/**
 * Upvote an interview experience
 */
export async function upvoteInterviewExperience(id) {
  try {
    const docRef = doc(db, INTERVIEWS_COLLECTION, id);
    await updateDoc(docRef, {
      upvotes: increment(1),
    });
    return true;
  } catch (error) {
    console.error("Error upvoting interview experience:", error);
    throw error;
  }
}
