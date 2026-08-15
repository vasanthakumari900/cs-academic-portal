// src/services/firestoreService.js
// Generic layer over Firestore & Local Storage sync so faculty uploads
// instantly appear in student portals across all modules (notes, question papers, videos, etc.)
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit as fsLimit,
  serverTimestamp,
  increment,
  onSnapshot,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "../firebase/config";

function getLocalStorageItems(collectionName) {
  try {
    const raw = localStorage.getItem(`cs_portal_uploads_${collectionName}`);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    return [];
  }
}

function saveLocalStorageItems(collectionName, items) {
  try {
    localStorage.setItem(`cs_portal_uploads_${collectionName}`, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent("cs_portal_content_updated", { detail: { collectionName } }));
  } catch (err) {
    console.warn("saveLocalStorageItems error:", err.message);
  }
}

export function createCollectionService(collectionName) {
  const colRef = isFirebaseConfigured && db ? collection(db, collectionName) : null;

  return {
    async create(data) {
      const newItem = {
        id: `local-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        ...data,
        views: 0,
        likes: 0,
        createdAt: new Date().toISOString(),
      };

      // 1. Save to Local Storage immediately
      const existing = getLocalStorageItems(collectionName);
      const updated = [newItem, ...existing];
      saveLocalStorageItems(collectionName, updated);

      // 2. Try Firestore upload if available
      if (colRef) {
        try {
          const docRef = await addDoc(colRef, {
            ...data,
            views: 0,
            likes: 0,
            createdAt: serverTimestamp(),
          });
          newItem.id = docRef.id;
        } catch (err) {
          console.warn(`[firestoreService] Firestore save error for ${collectionName}:`, err.message);
        }
      }

      return newItem.id;
    },

    async update(id, data) {
      const existing = getLocalStorageItems(collectionName);
      const updated = existing.map((item) => (item.id === id ? { ...item, ...data } : item));
      saveLocalStorageItems(collectionName, updated);

      if (colRef && !id.startsWith("local-")) {
        try {
          await updateDoc(doc(db, collectionName, id), data);
        } catch (err) {
          console.warn("updateDoc warning:", err.message);
        }
      }
    },

    async remove(id) {
      const existing = getLocalStorageItems(collectionName);
      const updated = existing.filter((item) => item.id !== id);
      saveLocalStorageItems(collectionName, updated);

      if (colRef && !id.startsWith("local-")) {
        try {
          await deleteDoc(doc(db, collectionName, id));
        } catch (err) {
          console.warn("deleteDoc warning:", err.message);
        }
      }
    },

    async getById(id) {
      const localItems = getLocalStorageItems(collectionName);
      const found = localItems.find((i) => i.id === id);
      if (found) return found;

      if (colRef && !id.startsWith("local-")) {
        const snap = await getDoc(doc(db, collectionName, id));
        return snap.exists() ? { id: snap.id, ...snap.data() } : null;
      }
      return null;
    },

    async list({ semester, subject, year, videoType, sortBy = "createdAt", max = 50 } = {}) {
      let localItems = getLocalStorageItems(collectionName);

      // Filter local items
      if (semester) localItems = localItems.filter((i) => Number(i.semester) === Number(semester));
      if (subject) localItems = localItems.filter((i) => i.subject?.toUpperCase() === subject.toUpperCase());
      if (year) localItems = localItems.filter((i) => Number(i.year) === Number(year) || Number(i.academicYear) === Number(year));
      if (videoType) localItems = localItems.filter((i) => i.videoType === videoType);

      if (!colRef) return localItems;

      try {
        const clauses = [];
        if (semester) clauses.push(where("semester", "==", Number(semester)));
        if (subject) clauses.push(where("subject", "==", subject));
        if (year) clauses.push(where("year", "==", Number(year)));
        if (videoType) clauses.push(where("videoType", "==", videoType));

        const q = query(colRef, ...clauses, orderBy(sortBy, "desc"), fsLimit(max));
        const snap = await getDocs(q);
        const fsItems = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

        // Deduplicate local and firestore items by ID
        const combined = [...localItems];
        fsItems.forEach((f) => {
          if (!combined.some((c) => c.id === f.id)) {
            combined.push(f);
          }
        });
        return combined;
      } catch (err) {
        console.warn(`[firestoreService] list fallback for ${collectionName}:`, err.message);
        return localItems;
      }
    },

    /**
     * Real-time subscription listener for student content mapping
     */
    subscribe({ semester, subject, year, videoType, callback }) {
      const getMergedData = (fsItems = []) => {
        let localItems = getLocalStorageItems(collectionName);
        if (semester) localItems = localItems.filter((i) => Number(i.semester) === Number(semester));
        if (subject) localItems = localItems.filter((i) => i.subject?.toUpperCase() === subject.toUpperCase());
        if (year) localItems = localItems.filter((i) => Number(i.year) === Number(year) || Number(i.academicYear) === Number(year));
        if (videoType) localItems = localItems.filter((i) => i.videoType === videoType);

        const combined = [...localItems];
        fsItems.forEach((f) => {
          if (!combined.some((c) => c.id === f.id)) {
            combined.push(f);
          }
        });
        return combined;
      };

      // Initial callback with local items
      callback(getMergedData([]));

      // Listen for window update events
      const handleLocalUpdate = () => {
        callback(getMergedData([]));
      };
      window.addEventListener("cs_portal_content_updated", handleLocalUpdate);

      if (!colRef) {
        return () => window.removeEventListener("cs_portal_content_updated", handleLocalUpdate);
      }

      try {
        const clauses = [];
        if (semester) clauses.push(where("semester", "==", Number(semester)));
        if (subject) clauses.push(where("subject", "==", subject));
        if (year) clauses.push(where("year", "==", Number(year)));
        if (videoType) clauses.push(where("videoType", "==", videoType));

        const q = query(colRef, ...clauses, orderBy("createdAt", "desc"));
        const unsub = onSnapshot(
          q,
          (snapshot) => {
            const fsItems = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
            callback(getMergedData(fsItems));
          },
          (err) => {
            console.warn(`Subscription warning for ${collectionName}:`, err.message);
            callback(getMergedData([]));
          }
        );

        return () => {
          unsub();
          window.removeEventListener("cs_portal_content_updated", handleLocalUpdate);
        };
      } catch (err) {
        return () => window.removeEventListener("cs_portal_content_updated", handleLocalUpdate);
      }
    },

    async incrementField(id, field, by = 1) {
      if (colRef && !id.startsWith("local-")) {
        try {
          await updateDoc(doc(db, collectionName, id), { [field]: increment(by) });
        } catch (e) {
          console.warn("incrementField error:", e.message);
        }
      }
    },
  };
}
