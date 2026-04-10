import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA57niX6P5KBGV0m4Pv8_T6SfpS6PTwAFM",
  authDomain: "movie-ticket-app-8710a.firebaseapp.com",
  projectId: "movie-ticket-app-8710a",
  storageBucket: "movie-ticket-app-8710a.firebasestorage.app",
  messagingSenderId: "312525278818",
  appId: "1:312525278818:web:f98e02d2e41ad86e5c8b3b",
  measurementId: "G-15XY4WX5N2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;