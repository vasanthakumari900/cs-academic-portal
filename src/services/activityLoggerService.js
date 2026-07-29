// src/services/activityLoggerService.js
// Service for tracking REAL student logins, page visits, downloads, and administrative audits.
// Strictly records and displays ONLY authentic user activities without any mock data.

import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  onSnapshot,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase/config";

const LOGINS_COLLECTION = "studentLogins";
const ACTIVITIES_COLLECTION = "studentActivities";

/**
 * Detect client device type and browser name from userAgent
 */
export function detectDeviceAndBrowser() {
  const ua = navigator.userAgent;
  let deviceType = "Desktop";
  let browserName = "Chrome";

  if (/Mobi|Android|iPhone|iPad|iPod/i.test(ua)) {
    deviceType = /Tablet|iPad/i.test(ua) ? "Tablet" : "Mobile";
  }

  if (ua.includes("Firefox")) browserName = "Firefox";
  else if (ua.includes("SamsungBrowser")) browserName = "Samsung Internet";
  else if (ua.includes("Opera") || ua.includes("OPR")) browserName = "Opera";
  else if (ua.includes("Trident")) browserName = "Internet Explorer";
  else if (ua.includes("Edge") || ua.includes("Edg")) browserName = "Microsoft Edge";
  else if (ua.includes("Safari") && !ua.includes("Chrome")) browserName = "Safari";
  else if (ua.includes("Chrome")) browserName = "Chrome";

  return { deviceType, browserName };
}

/**
 * Record a REAL student login attempt in Firestore
 */
export async function logStudentLogin(studentInfo, status = "Success") {
  try {
    const { deviceType, browserName } = detectDeviceAndBrowser();
    const now = new Date();
    
    const timeDisplay = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const dateDisplay = now.toISOString().split("T")[0]; // YYYY-MM-DD

    const loginRecord = {
      rollNumber: studentInfo.rollNumber || "N/A",
      studentName: studentInfo.name || `Student ${studentInfo.rollNumber || ""}`,
      year: parseInt(studentInfo.year) || 1,
      semester: parseInt(studentInfo.semester) || 1,
      section: studentInfo.section || "Sec B",
      dob: studentInfo.dob || "N/A",
      loginDate: dateDisplay,
      loginTime: timeDisplay,
      logoutTime: null,
      deviceType,
      browserName,
      ipAddress: "127.0.0.1 (Client)",
      status,
      timestamp: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, LOGINS_COLLECTION), loginRecord);
    
    if (status === "Success" && docRef.id) {
      sessionStorage.setItem("activeLoginDocId", docRef.id);
    }

    return { id: docRef.id, ...loginRecord };
  } catch (err) {
    console.error("Error logging student login:", err);
    return null;
  }
}

/**
 * Update logout time when student logs out
 */
export async function logStudentLogout() {
  try {
    const loginId = sessionStorage.getItem("activeLoginDocId");
    if (!loginId) return;

    const now = new Date();
    const logoutTime = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const docRef = doc(db, LOGINS_COLLECTION, loginId);
    await updateDoc(docRef, { logoutTime });
    sessionStorage.removeItem("activeLoginDocId");
  } catch (err) {
    console.warn("Could not log student logout:", err);
  }
}

/**
 * Track REAL student activity (page visit, file download, or search action)
 */
export async function logStudentActivity({
  studentInfo,
  pageVisited,
  targetItem = "",
  action = "Viewed",
}) {
  if (!studentInfo || !studentInfo.rollNumber) return;

  try {
    const now = new Date();
    const timeDisplay = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    const dateDisplay = now.toISOString().split("T")[0];

    await addDoc(collection(db, ACTIVITIES_COLLECTION), {
      rollNumber: studentInfo.rollNumber,
      studentName: studentInfo.name || `Student ${studentInfo.rollNumber}`,
      year: parseInt(studentInfo.year) || 1,
      semester: parseInt(studentInfo.semester) || 1,
      section: studentInfo.section || "Sec B",
      pageVisited,
      targetItem,
      action,
      activityDate: dateDisplay,
      activityTime: timeDisplay,
      timestamp: serverTimestamp(),
    });
  } catch (err) {
    console.warn("Error logging student activity:", err);
  }
}

/**
 * Real-time listener for authentic new student logins in Firestore
 */
export function listenToStudentLogins(callback) {
  try {
    const q = query(
      collection(db, LOGINS_COLLECTION),
      orderBy("timestamp", "desc"),
      limit(10)
    );

    return onSnapshot(
      q,
      (snapshot) => {
        const logins = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        callback(logins);
      },
      (err) => {
        console.warn("Logins snapshot error:", err);
        callback([]);
      }
    );
  } catch (err) {
    console.warn("Error setting up login listener:", err);
    return () => {};
  }
}

/**
 * Fetch all authentic student logins from Firestore with optional filters
 */
export async function getStudentLogins(filters = {}) {
  try {
    let q = query(collection(db, LOGINS_COLLECTION), orderBy("timestamp", "desc"), limit(200));
    const snapshot = await getDocs(q);

    let data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));

    // Filter application
    if (filters.year && filters.year !== "all") {
      data = data.filter((item) => String(item.year) === String(filters.year));
    }
    if (filters.semester && filters.semester !== "all") {
      data = data.filter((item) => String(item.semester) === String(filters.semester));
    }
    if (filters.date) {
      data = data.filter((item) => item.loginDate === filters.date);
    }
    if (filters.rollNumber) {
      const queryStr = filters.rollNumber.toLowerCase();
      data = data.filter(
        (item) =>
          item.rollNumber?.toLowerCase().includes(queryStr) ||
          item.studentName?.toLowerCase().includes(queryStr)
      );
    }

    return data;
  } catch (err) {
    console.error("Firestore student logins fetch error:", err);
    return [];
  }
}

/**
 * Fetch all authentic student activities from Firestore with optional filters
 */
export async function getStudentActivities(filters = {}) {
  try {
    let q = query(collection(db, ACTIVITIES_COLLECTION), orderBy("timestamp", "desc"), limit(300));
    const snapshot = await getDocs(q);

    let data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));

    if (filters.year && filters.year !== "all") {
      data = data.filter((item) => String(item.year) === String(filters.year));
    }
    if (filters.semester && filters.semester !== "all") {
      data = data.filter((item) => String(item.semester) === String(filters.semester));
    }
    if (filters.date) {
      data = data.filter((item) => item.activityDate === filters.date);
    }
    if (filters.rollNumber) {
      const queryStr = filters.rollNumber.toLowerCase();
      data = data.filter(
        (item) =>
          item.rollNumber?.toLowerCase().includes(queryStr) ||
          item.studentName?.toLowerCase().includes(queryStr)
      );
    }

    return data;
  } catch (err) {
    console.error("Firestore student activities fetch error:", err);
    return [];
  }
}
