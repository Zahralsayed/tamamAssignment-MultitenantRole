import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize the Firebase Admin SDK
if (!initializeApp.apps.length) {
    initializeApp();
}

export const db = getFirestore();