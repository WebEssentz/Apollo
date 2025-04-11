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
    apiKey: "AIzaSyCl3k8Ts8NLObfER3BZffb9zc_gB47p9oc",
    authDomain: "projects-2025-71366.firebaseapp.com",
    projectId: "projects-2025-71366",
    storageBucket: "projects-2025-71366.firebasestorage.app",
    messagingSenderId: "149678326698",
    appId: "1:149678326698:web:65b7d59f37e4e6b3c1a1d3",
    measurementId: "G-YMEDGHS7H"
};

// AIzaSyCl3k8Ts8NLObfER3BZffb9zc_gB47p9oc
// projects-2025-71366.firebaseapp.com
// projects-2025-71366
// projects-2025-71366.firebasestorage.app
// 149678326698
// 1:149678326698:web:65b7d59f37e4e6b3c1a1d3
// G-YMEDGHS7H

// Initialize Firebase apps with distinct names
const authApp = initializeApp(authConfig, 'auth');
const storageApp = initializeApp(storageConfig, 'storage');

// Export the services
export const auth = getAuth(authApp);
export const storage = getStorage(storageApp);