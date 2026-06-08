import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

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
