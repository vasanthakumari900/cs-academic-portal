// src/services/notificationService.js
// Firestore-backed notifications for dashboard users.
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

export async function createNotification({ userId, title, message, type = "info", link = "" }) {
  await addDoc(colRef, {
    userId,
    title,
    message,
    type,
    link,
    read: false,
    createdAt: serverTimestamp(),
  });
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
