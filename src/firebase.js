import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

// ─────────────────────────────────────────────────────────────────────────────
// PASTE YOUR FIREBASE CONFIG HERE
// Go to: Firebase Console → Project Settings → Your apps → Web app → SDK setup
// ─────────────────────────────────────────────────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyDOCsgWmYZoBHFukhIyTdoi_Or4pKXKnwg",
  authDomain: "my-portfolio-c4c1f.firebaseapp.com",
  projectId: "my-portfolio-c4c1f",
  storageBucket: "my-portfolio-c4c1f.firebasestorage.app",
  messagingSenderId: "956301095231",
  appId: "1:956301095231:web:11231d1df2084fbf0e238a",
  measurementId: "G-N48JVRLBF3"
};
// ─────────────────────────────────────────────────────────────────────────────

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export const subscribeToAuth = (callback) => onAuthStateChanged(auth, callback);

export const adminSignIn = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

export const adminSignOut = () => signOut(auth);

/**
 * Generates a short human-readable reference ID.
 * Format: MN-YYYY-XXXX  (e.g. MN-2026-0384)
 */
export const generateRefId = () => {
  const year = new Date().getFullYear();
  const num  = String(Math.floor(1000 + Math.random() * 9000));
  return `MN-${year}-${num}`;
};

/**
 * Saves an inquiry to Firestore and returns the reference ID.
 * @param {Object} payload
 * @returns {Promise<string>} refId
 */
export const submitInquiry = async (payload) => {
  const refId = generateRefId();

  await addDoc(collection(db, "inquiries"), {
    ...payload,
    refId,
    status: "received",
    createdAt: serverTimestamp(),
  });

  return refId;
};

/**
 * Fetches all inquiries, newest first.
 * Requires Firebase Auth + Firestore rules that allow read for authenticated users.
 */
export const fetchInquiries = async () => {
  const q = query(collection(db, "inquiries"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      ...data,
      createdAt: data.createdAt?.toDate?.() ?? null,
    };
  });
};

/**
 * Updates inquiry status (e.g. received → under_review → replied).
 */
export const updateInquiryStatus = async (id, status) => {
  await updateDoc(doc(db, "inquiries", id), { status });
};
