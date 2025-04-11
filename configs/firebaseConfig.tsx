// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Your Firebase configuration for authentication
const authConfig = {
    apiKey: "AIzaSyDNxEYQ9b9-v5A_iNK5VgZr2YdqUH8vALA",
    authDomain: "apollo-fc188.firebaseapp.com",
    projectId: "apollo-fc188",
    storageBucket: "apollo-fc188.firebasestorage.app",
    messagingSenderId: "404144137302",
    appId: "1:404144137302:web:3ed94ee68f2a15122d47f7",
    measurementId: "G-NYCZ8LP3MT"
};

// Storage configuration (keep existing config)
const storageConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MESURMENT_ID
};

// Initialize Firebase apps with distinct names
const authApp = initializeApp(authConfig, 'auth');
const storageApp = initializeApp(storageConfig, 'storage');

// Export the services
export const auth = getAuth(authApp);
export const storage = getStorage(storageApp);