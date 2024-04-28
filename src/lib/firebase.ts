// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBCtXQpCvMxR2d60zscP6yZPxSZp0qjM4M",
  authDomain: "message-app-3.firebaseapp.com",
  projectId: "message-app-3",
  storageBucket: "message-app-3.appspot.com",
  messagingSenderId: "1015700024209",
  appId: "1:1015700024209:web:9e58f2b0833208f6c64830",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();
