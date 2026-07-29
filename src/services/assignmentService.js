// src/services/assignmentService.js
import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/config";

const ASSIGNMENTS_COLLECTION = "assignments";
const SUBMISSIONS_COLLECTION = "submissions";

/**
 * Create a new assignment (Faculty/Admin)
 */
export async function createAssignment(data) {
  try {
    const docRef = await addDoc(collection(db, ASSIGNMENTS_COLLECTION), {
      title: data.title,
      subject: data.subject,
      year: parseInt(data.year),
      semester: parseInt(data.semester),
      description: data.description || "",
      dueDate: data.dueDate, // ISO string or YYYY-MM-DD
      maxMarks: parseInt(data.maxMarks) || 100,
      attachmentUrl: data.attachmentUrl || null,
      attachmentName: data.attachmentName || null,
      createdBy: data.createdBy,
      createdByName: data.createdByName || "Faculty",
      createdAt: serverTimestamp(),
    });
    return { id: docRef.id, success: true };
  } catch (error) {
    console.error("Error creating assignment:", error);
    throw error;
  }
}

/**
 * Real-time listener for assignments matching student year & semester
 */
export function subscribeAssignments(filters = {}, callback) {
  try {
    const constraints = [];
    if (filters.year) {
      constraints.push(where("year", "==", parseInt(filters.year)));
    }
    if (filters.semester) {
      constraints.push(where("semester", "==", parseInt(filters.semester)));
    }
    if (filters.subject) {
      constraints.push(where("subject", "==", filters.subject));
    }
    constraints.push(orderBy("createdAt", "desc"));

    const q = query(collection(db, ASSIGNMENTS_COLLECTION), ...constraints);
    return onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
          createdAt: docSnap.data().createdAt?.toDate()?.toISOString() || new Date().toISOString(),
        }));
        callback(items);
      },
      (err) => {
        console.warn("Assignment subscription warning:", err);
      }
    );
  } catch (err) {
    console.error("Error setting up assignment subscription:", err);
    return () => {};
  }
}

/**
 * Get all assignments with optional year/subject filters
 */
export async function getAssignments(filters = {}) {
  try {
    const constraints = [];
    if (filters.year) {
      constraints.push(where("year", "==", parseInt(filters.year)));
    }
    if (filters.semester) {
      constraints.push(where("semester", "==", parseInt(filters.semester)));
    }
    if (filters.subject) {
      constraints.push(where("subject", "==", filters.subject));
    }
    constraints.push(orderBy("createdAt", "desc"));

    const q = query(collection(db, ASSIGNMENTS_COLLECTION), ...constraints);
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
      createdAt: docSnap.data().createdAt?.toDate()?.toISOString() || new Date().toISOString(),
    }));
  } catch (error) {
    console.error("Error fetching assignments:", error);
    return [];
  }
}

/**
 * Delete an assignment
 */
export async function deleteAssignment(id) {
  try {
    await deleteDoc(doc(db, ASSIGNMENTS_COLLECTION, id));
    return true;
  } catch (error) {
    console.error("Error deleting assignment:", error);
    throw error;
  }
}

/**
 * Submit work for an assignment (Student)
 */
export async function submitAssignment(submissionData) {
  try {
    // Check if submission already exists
    const q = query(
      collection(db, SUBMISSIONS_COLLECTION),
      where("assignmentId", "==", submissionData.assignmentId),
      where("studentId", "==", submissionData.studentId)
    );
    const existing = await getDocs(q);

    if (!existing.empty) {
      // Update existing submission
      const existingDoc = existing.docs[0];
      await updateDoc(doc(db, SUBMISSIONS_COLLECTION, existingDoc.id), {
        fileUrl: submissionData.fileUrl || "",
        fileName: submissionData.fileName || "",
        notes: submissionData.notes || "",
        submittedAt: serverTimestamp(),
        status: "Submitted",
      });
      return { id: existingDoc.id, success: true, updated: true };
    }

    const docRef = await addDoc(collection(db, SUBMISSIONS_COLLECTION), {
      assignmentId: submissionData.assignmentId,
      studentId: submissionData.studentId,
      studentName: submissionData.studentName || "Student",
      studentRegisterNo: submissionData.studentRegisterNo || "N/A",
      fileUrl: submissionData.fileUrl || "",
      fileName: submissionData.fileName || "",
      notes: submissionData.notes || "",
      submittedAt: serverTimestamp(),
      status: "Submitted", // Submitted, Graded
      grade: null,
      feedback: "",
    });
    return { id: docRef.id, success: true };
  } catch (error) {
    console.error("Error submitting assignment:", error);
    throw error;
  }
}

/**
 * Get all submissions for a given assignment (Faculty)
 */
export async function getSubmissionsForAssignment(assignmentId) {
  try {
    const q = query(
      collection(db, SUBMISSIONS_COLLECTION),
      where("assignmentId", "==", assignmentId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
      submittedAt: docSnap.data().submittedAt?.toDate()?.toISOString() || new Date().toISOString(),
    }));
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return [];
  }
}

/**
 * Get student's submission for a specific assignment
 */
export async function getStudentSubmission(assignmentId, studentId) {
  try {
    const q = query(
      collection(db, SUBMISSIONS_COLLECTION),
      where("assignmentId", "==", assignmentId),
      where("studentId", "==", studentId)
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    const docSnap = snapshot.docs[0];
    return {
      id: docSnap.id,
      ...docSnap.data(),
      submittedAt: docSnap.data().submittedAt?.toDate()?.toISOString() || new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error fetching student submission:", error);
    return null;
  }
}

/**
 * Grade a student's submission (Faculty)
 */
export async function gradeSubmission(submissionId, grade, feedback) {
  try {
    await updateDoc(doc(db, SUBMISSIONS_COLLECTION, submissionId), {
      grade: parseInt(grade),
      feedback: feedback || "",
      status: "Graded",
      gradedAt: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error("Error grading submission:", error);
    throw error;
  }
}
