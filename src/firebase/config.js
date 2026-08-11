// src/firebase/config.js
// Central Firebase initialization. All keys come from environment
// variables — never hard-code credentials here.
//
// Resilience: if the VITE_FIREBASE_* variables are missing (e.g. a fresh
// local checkout without a .env file), the app must still boot in demo
// mode. Authentication is fully hard-coded in AuthContext (student
// roll numbers + faculty credentials), so Firebase is only required for
// Firestore/Storage-backed features (search, feedback, admin, bookmarks…).
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

/** True when the required Firebase credentials are present. */
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId
);

let app = null;
let auth = null;
let db = null;
let storage = null;

if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    console.info("[Firebase] Initialized successfully.");
  } catch (err) {
    // A bad/mismatched key must never blank the whole app.
    console.warn("[Firebase] Initialization failed — running in demo mode:", err.message);
    app = null;
    auth = null;
    db = null;
    storage = null;
  }
} else {
  console.warn(
    "[Firebase] VITE_FIREBASE_* environment variables not found. Running in demo mode — Firestore/Storage-backed features are disabled. Copy .env.example to .env and fill in your keys to enable them."
  );
}

export { auth, db, storage };
export default app;
