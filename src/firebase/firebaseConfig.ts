import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDWH-nqRvwu55BJOb5K_nQxIkajbeaeZTI",
  authDomain: "pasaj-ef737.firebaseapp.com",
  projectId: "pasaj-ef737",
  storageBucket: "pasaj-ef737.firebasestorage.app",
  messagingSenderId: "521296537141",
  appId: "1:521296537141:web:25ed5ad47005ad831f337c",
  measurementId: "G-DJ2JP0BV4S"
};

// Firebase'i başlat
const app = initializeApp(firebaseConfig);

// Firestore'u dışa aktar
export const db = getFirestore(app);
