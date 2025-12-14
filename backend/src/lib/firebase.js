import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize the Firebase Admin SDK
 initializeApp();

export const db = getFirestore();