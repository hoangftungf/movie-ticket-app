import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

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

// Initialize Auth with persistence for React Native
let auth;
if (Platform.OS === 'web') {
  const { getAuth } = require("firebase/auth");
  auth = getAuth(app);
} else {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
}

// Initialize Firestore
export const db = getFirestore(app);
export { auth };

export default app;