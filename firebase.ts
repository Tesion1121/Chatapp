// firebase.ts
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  CollectionReference,
  DocumentData,
} from "firebase/firestore";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

// ----------- CONFIG DARI PROJECT-MU -----------
const firebaseConfig = {
  apiKey: "AIzaSyDPgDUhbYqjAU2vAHAW2efpxrUjz7Rl_MA",
  authDomain: "tugas3-315e0.firebaseapp.com",
  projectId: "tugas3-315e0",
  storageBucket: "tugas3-315e0.firebasestorage.app",
  messagingSenderId: "530068688868",
  appId: "1:530068688868:android:47ee0d4e9be5a3e73381f1",
};
// ---------------------------------------------

const app = initializeApp(firebaseConfig);

// Firestore
const db = getFirestore(app);
export const messagesCollection = collection(
  db,
  "messages"
) as CollectionReference<DocumentData>;

// Auth
const auth = getAuth(app);

// Storage (untuk upload gambar)
const storage = getStorage(app);

export {
  db,
  auth,
  storage,
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  // auth helpers
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  // storage helpers
  ref,
  uploadBytes,
  getDownloadURL,
};
