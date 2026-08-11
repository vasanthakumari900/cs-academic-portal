// src/services/firestoreService.js
// A small generic layer over Firestore so every module (videos, notes,
// question papers, placements) shares the same CRUD + query logic
// instead of re-implementing it.
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

function unavailableError(collectionName) {
  const err = new Error(
    `Firestore is not configured. Add the VITE_FIREBASE_* variables (see .env.example) to enable \`${collectionName}\`.`
  );
  err.name = "FirestoreUnavailable";
  return err;
}

export function createCollectionService(collectionName) {
  // `collection(db, …)` must never run at module-load time when Firebase is
  // unavailable — that would crash every page that imports these services.
  const colRef = isFirebaseConfigured && db ? collection(db, collectionName) : null;

  return {
    async create(data) {
      if (!colRef) throw unavailableError(collectionName);
      const docRef = await addDoc(colRef, {
        ...data,
        views: 0,
        likes: 0,
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    },

    async update(id, data) {
      if (!colRef) throw unavailableError(collectionName);
      await updateDoc(doc(db, collectionName, id), data);
    },

    async remove(id) {
      if (!colRef) throw unavailableError(collectionName);
      await deleteDoc(doc(db, collectionName, id));
    },

    async getById(id) {
      if (!colRef) throw unavailableError(collectionName);
      const snap = await getDoc(doc(db, collectionName, id));
      return snap.exists() ? { id: snap.id, ...snap.data() } : null;
    },

    async list({ semester, subject, year, videoType, sortBy = "createdAt", max = 50 } = {}) {
      if (!colRef) return [];
      const clauses = [];
      if (semester) clauses.push(where("semester", "==", Number(semester)));
      if (subject) clauses.push(where("subject", "==", subject));
      if (year) clauses.push(where("year", "==", Number(year)));
      if (videoType) clauses.push(where("videoType", "==", videoType));
      const q = query(colRef, ...clauses, orderBy(sortBy, "desc"), fsLimit(max));
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    },

    /**
     * Real-time subscription listener for student content mapping
     */
    subscribe({ semester, subject, year, videoType, callback }) {
      if (!colRef) {
        // Offline mode: resolve immediately with an empty list and a no-op
        // unsubscribe so consumers (hooks) settle cleanly.
        callback([]);
        return () => {};
      }
      const clauses = [];
      if (semester) clauses.push(where("semester", "==", Number(semester)));
      if (subject) clauses.push(where("subject", "==", subject));
      if (year) clauses.push(where("year", "==", Number(year)));
      if (videoType) clauses.push(where("videoType", "==", videoType));
      
      const q = query(colRef, ...clauses, orderBy("createdAt", "desc"));
      return onSnapshot(
        q,
        (snapshot) => {
          const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
          callback(items);
        },
        (err) => {
          console.warn(`Real-time subscription warning for ${collectionName}:`, err);
        }
      );
    },

    async incrementField(id, field, by = 1) {
      if (!colRef) throw unavailableError(collectionName);
      await updateDoc(doc(db, collectionName, id), { [field]: increment(by) });
    },
  };
}
