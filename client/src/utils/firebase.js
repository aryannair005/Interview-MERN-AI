import { initializeApp } from "firebase/app";
import {getAuth , GoogleAuthProvider} from "firebase/auth"

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "interview-mern-ai.firebaseapp.com",
  projectId: "interview-mern-ai",
  storageBucket: "interview-mern-ai.firebasestorage.app",
  messagingSenderId: "299324749548",
  appId: "1:299324749548:web:a777415a18f63a893417c9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth =getAuth(app)

const provider = new GoogleAuthProvider()

export {auth , provider}