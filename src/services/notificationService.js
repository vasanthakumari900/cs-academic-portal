// src/services/notificationService.js
// Firestore-backed notifications + Browser Push Notification API & Web Audio Chimes.
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "../firebase/config";
import { COLLECTIONS } from "../utils/constants";

// Guarded so the module never crashes at import time when Firebase env vars
// are missing (demo mode) — `collection(db, …)` is deferred to first use.
const colRef =
  isFirebaseConfigured && db ? collection(db, COLLECTIONS.NOTIFICATIONS) : null;

function unavailableError() {
  const err = new Error(
    "Firestore is not configured. Add the VITE_FIREBASE_* variables (see .env.example) to enable notifications."
  );
  err.name = "FirestoreUnavailable";
  return err;
}

/**
 * Play iconic iPhone Tri-Tone notification sound using Web Audio API.
 * Synthesizes the exact iOS G5 -> C6 -> E6 crisp marimba/bell sequence.
 * Works across all browsers, smartphones (iOS & Android), and laptops.
 */
export function playNotificationSound() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    if (ctx.state === "suspended") {
      ctx.resume();
    }

    const now = ctx.currentTime;

    // iPhone Tri-Tone Frequencies: G5 (783.99 Hz), C6 (1046.50 Hz), E6 (1318.51 Hz)
    const tones = [
      { freq: 783.99, start: 0.0, duration: 0.12, volume: 0.4 },
      { freq: 1046.50, start: 0.10, duration: 0.14, volume: 0.45 },
      { freq: 1318.51, start: 0.20, duration: 0.28, volume: 0.5 },
    ];

    tones.forEach(({ freq, start, duration, volume }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + start);

      gain.gain.setValueAtTime(0.001, now + start);
      gain.gain.exponentialRampToValueAtTime(volume, now + start + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, now + start + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + start);
      osc.stop(now + start + duration);
    });
  } catch (err) {
    console.warn("Could not play iPhone notification audio chime:", err);
  }
}

/**
 * Request browser push notification permission from the user
 */
export async function requestNotificationPermission() {
  if (!("Notification" in window)) {
    console.warn("This browser does not support desktop notifications.");
    return false;
  }
  if (Notification.permission === "granted") {
    return true;
  }
  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }
  return false;
}

/**
 * Trigger a native browser push notification + audio chime sound
 */
export function triggerBrowserNotification(title, options = {}) {
  // Always play audio sound chime
  playNotificationSound();

  if ("Notification" in window && Notification.permission === "granted") {
    try {
      new Notification(title, {
        icon: "/favicon.ico",
        badge: "/favicon.ico",
        body: options.body || "",
        tag: options.tag || "cs-portal",
        ...options,
      });
    } catch (err) {
      console.warn("Failed to launch native notification:", err);
    }
  }
}

/**
 * Create a new notification (Firestore + optional Push Alert & Audio Chime)
 */
export async function createNotification({ userId, title, message, type = "info", link = "", sendPush = true }) {
  if (!colRef) throw unavailableError();
  await addDoc(colRef, {
    userId,
    title,
    message,
    type,
    link,
    read: false,
    createdAt: serverTimestamp(),
  });

  if (sendPush) {
    triggerBrowserNotification(title, { body: message });
  }
}

export async function getUserNotifications(userId, max = 20) {
  if (!colRef) return [];
  const q = query(
    colRef,
    where("userId", "==", userId),
    orderBy("createdAt", "desc"),
    limit(max)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function markAsRead(notificationId) {
  if (!isFirebaseConfigured) throw unavailableError();
  await updateDoc(doc(db, COLLECTIONS.NOTIFICATIONS, notificationId), { read: true });
}

export async function markAllAsRead(userId) {
  const items = await getUserNotifications(userId, 50);
  await Promise.all(items.filter((n) => !n.read).map((n) => markAsRead(n.id)));
}
