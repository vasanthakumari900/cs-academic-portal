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

    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
      createdAt: docSnap.data().createdAt?.toDate()?.toISOString() || new Date().toISOString(),
    }));
  } catch (error) {
    console.error("Error fetching interview experiences:", error);
    return [];
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
