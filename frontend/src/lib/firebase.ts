/**
 * Firebase Client Configuration for SCNSWF
 * Project: project-ngo-scnswf
 * Console: https://console.firebase.google.com/u/3/project/project-ngo-scnswf/firestore/databases/-default-/data
 */

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'project-ngo-scnswf.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'project-ngo-scnswf',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'project-ngo-scnswf.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

export const isFirebaseConfigured = Boolean(firebaseConfig.projectId);
