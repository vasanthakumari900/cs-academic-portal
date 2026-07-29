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
import { db } from "../firebase/config";

export function createCollectionService(collectionName) {
  const colRef = collection(db, collectionName);

  return {
    async create(data) {
      const docRef = await addDoc(colRef, {
        ...data,
        views: 0,
        likes: 0,
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    },

    async update(id, data) {
      await updateDoc(doc(db, collectionName, id), data);
    },

    async remove(id) {
      await deleteDoc(doc(db, collectionName, id));
    },

    async getById(id) {
      const snap = await getDoc(doc(db, collectionName, id));
      return snap.exists() ? { id: snap.id, ...snap.data() } : null;
    },

    async list({ semester, subject, year, videoType, sortBy = "createdAt", max = 50 } = {}) {
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
      await updateDoc(doc(db, collectionName, id), { [field]: increment(by) });
    },
  };
}
