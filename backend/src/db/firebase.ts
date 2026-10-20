import admin from 'firebase-admin';
import { env } from '../config/env';

let firestore: admin.firestore.Firestore | null = null;
let isFirebaseInitialized = false;

export const initFirebase = (): { isInitialized: boolean; db: admin.firestore.Firestore | null } => {
  if (isFirebaseInitialized) {
    return { isInitialized: true, db: firestore };
  }

  if (env.DATA_STORE === 'firebase' || env.FIREBASE_PROJECT_ID) {
    try {
      if (admin.apps.length === 0) {
        if (env.FIREBASE_CLIENT_EMAIL && env.FIREBASE_PRIVATE_KEY) {
          admin.initializeApp({
            credential: admin.credential.cert({
              projectId: env.FIREBASE_PROJECT_ID,
              clientEmail: env.FIREBASE_CLIENT_EMAIL,
              privateKey: env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            }),
            databaseURL: env.FIREBASE_DATABASE_URL,
          });
        } else {
          admin.initializeApp({
            projectId: env.FIREBASE_PROJECT_ID,
          });
        }
      }
      firestore = admin.firestore();
      isFirebaseInitialized = true;
      console.log('🔥 Firebase Admin successfully initialized.');
      return { isInitialized: true, db: firestore };
    } catch (err) {
      console.warn('⚠️ Firebase initialization failed, falling back to local store:', err);
      return { isInitialized: false, db: null };
    }
  }

  return { isInitialized: false, db: null };
};

export { admin };
