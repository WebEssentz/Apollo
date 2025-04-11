// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Your Firebase configuration for authentication
const authConfig = {
    apiKey: process.env.FIREBASE_AUTH_API_KEY,
    authDomain: process.env.FIREBASE_DOMAIN,
    projectId: process.env.FIREBASE_ID,
    storageBucket: process.env.FIRE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIRE_MESSAGE,
    appId: process.env.FIRE_APP_ID,
    measurementId: process.env.FIRE_MEASURE_ID
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