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
import { db } from "../firebase/config";
import { COLLECTIONS } from "../utils/constants";

const colRef = collection(db, COLLECTIONS.NOTIFICATIONS);

/**
 * Play pleasant cross-platform notification chime sound using Web Audio API.
 * Works across all mobile phones (iOS & Android) and laptops/desktops.
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

    // Tone 1: C5 (523.25 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(523.25, now);
    gain1.gain.setValueAtTime(0.3, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.3);

    // Tone 2: G5 (783.99 Hz) chime right after
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(783.99, now + 0.15);
    gain2.gain.setValueAtTime(0.4, now + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.15);
    osc2.stop(now + 0.55);
  } catch (err) {
    console.warn("Could not play notification audio chime:", err);
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
  await updateDoc(doc(db, COLLECTIONS.NOTIFICATIONS, notificationId), { read: true });
}

export async function markAllAsRead(userId) {
  const items = await getUserNotifications(userId, 50);
  await Promise.all(items.filter((n) => !n.read).map((n) => markAsRead(n.id)));
}
