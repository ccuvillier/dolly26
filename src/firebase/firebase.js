
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore"; // 🔹 Bien importer getFirestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC5E51jZYgQ7xgKxfuxZUXmquUp0SircEo",
  authDomain: "dolly-10206.firebaseapp.com",
  projectId: "dolly-10206",
  storageBucket: "dolly-10206.firebasestorage.app",
  messagingSenderId: "1093314553942",
  appId: "1:1093314553942:web:1542d459945c861f3fb3f7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// 🔹 Initialiser Firestore et l’exporter
export const db = getFirestore(app);