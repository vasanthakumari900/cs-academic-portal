// src/services/projectHubService.js
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
  increment,
  onSnapshot,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "../firebase/config";

const PROJECTS_COLLECTION = "student_projects";
const INVITES_COLLECTION = "team_invites";

export const projectHubService = {
  /**
   * Subscribe to real-time updates for projects from Firebase Firestore
   */
  subscribeProjects(callback) {
    if (!isFirebaseConfigured || !db) {
      callback([]);
      return () => {};
    }

    try {
      const colRef = collection(db, PROJECTS_COLLECTION);
      const q = query(colRef, orderBy("createdAt", "desc"));
      return onSnapshot(
        q,
        (snapshot) => {
          const items = snapshot.docs.map((d) => ({
            id: d.id,
            ...d.data(),
            isFirebase: true,
          }));
          callback(items);
        },
        (error) => {
          console.warn("[ProjectHub] Firestore projects subscription fallback:", error.message);
          getDocs(colRef)
            .then((snap) => {
              const items = snap.docs.map((d) => ({
                id: d.id,
                ...d.data(),
                isFirebase: true,
              }));
              callback(items);
            })
            .catch(() => callback([]));
        }
      );
    } catch (err) {
      console.warn("[ProjectHub] Firebase subscription error:", err);
      callback([]);
      return () => {};
    }
  },

  /**
   * Subscribe to real-time updates for team invites from Firebase Firestore
   */
  subscribeInvites(callback) {
    if (!isFirebaseConfigured || !db) {
      callback([]);
      return () => {};
    }

    try {
      const colRef = collection(db, INVITES_COLLECTION);
      const q = query(colRef, orderBy("createdAt", "desc"));
      return onSnapshot(
        q,
        (snapshot) => {
          const items = snapshot.docs.map((d) => ({
            id: d.id,
            ...d.data(),
            isFirebase: true,
          }));
          callback(items);
        },
        (error) => {
          console.warn("[ProjectHub] Firestore invites subscription fallback:", error.message);
          getDocs(colRef)
            .then((snap) => {
              const items = snap.docs.map((d) => ({
                id: d.id,
                ...d.data(),
                isFirebase: true,
              }));
              callback(items);
            })
            .catch(() => callback([]));
        }
      );
    } catch (err) {
      console.warn("[ProjectHub] Firebase subscription error:", err);
      callback([]);
      return () => {};
    }
  },

  /**
   * Save a new project to Firebase Firestore
   */
  async createProject(projectData) {
    if (!isFirebaseConfigured || !db) {
      return null;
    }
    const colRef = collection(db, PROJECTS_COLLECTION);
    const docRef = await addDoc(colRef, {
      ...projectData,
      stars: projectData.stars || 1,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  },

  /**
   * Update an existing project in Firebase Firestore
   */
  async updateProject(id, updatedData) {
    if (!isFirebaseConfigured || !db) return;
    try {
      const docRef = doc(db, PROJECTS_COLLECTION, id);
      await updateDoc(docRef, {
        ...updatedData,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.warn("[ProjectHub] Could not update project in Firebase:", err.message);
    }
  },

  /**
   * Delete a project from Firebase Firestore
   */
  async deleteProject(id) {
    if (!isFirebaseConfigured || !db) return;
    try {
      const docRef = doc(db, PROJECTS_COLLECTION, id);
      await deleteDoc(docRef);
    } catch (err) {
      console.warn("[ProjectHub] Could not delete project in Firebase:", err.message);
    }
  },

  /**
   * Save a new teammate invite to Firebase Firestore
   */
  async createInvite(inviteData) {
    if (!isFirebaseConfigured || !db) {
      return null;
    }
    const colRef = collection(db, INVITES_COLLECTION);
    const docRef = await addDoc(colRef, {
      ...inviteData,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  },

  /**
   * Toggle star on a project in Firebase
   */
  async starProject(id, delta = 1) {
    if (!isFirebaseConfigured || !db) return;
    try {
      const docRef = doc(db, PROJECTS_COLLECTION, id);
      await updateDoc(docRef, {
        stars: increment(delta),
      });
    } catch (err) {
      console.warn("[ProjectHub] Could not update star count in Firebase:", err.message);
    }
  },
};
