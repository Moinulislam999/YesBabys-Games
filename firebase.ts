
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAs0uW66HRjY-9casRNCzh6mZ-1qClKhQ8",
  authDomain: "yesbabys-games.firebaseapp.com",
  projectId: "yesbabys-games",
  storageBucket: "yesbabys-games.firebasestorage.app",
  messagingSenderId: "636655886274",
  appId: "1:636655886274:web:8bb3d8d6727e397c51805b",
  measurementId: "G-CRKZEXHHBV"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
