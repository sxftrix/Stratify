import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAe9pBPq_h9jaHTHjeMLZksWkd4FnaOW0I",
    authDomain: "stratify-237df.firebaseapp.com",
    projectId: "stratify-237df",
    storageBucket: "stratify-237df.firebasestorage.app",
    messagingSenderId: "119018729313",
    appId: "1:119018729313:web:2fa1944c70027bf9c51f20"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);