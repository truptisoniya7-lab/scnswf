import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { env } from '../config/env';

let firestore: admin.firestore.Firestore | null = null;
let isFirebaseInitialized = false;
let initError: Error | null = null;

export const initFirebase = (): { isInitialized: boolean; db: admin.firestore.Firestore | null; error?: Error } => {
  if (isFirebaseInitialized) {
    return { isInitialized: true, db: firestore };
  }

  if (env.DATA_STORE !== 'firebase' && !env.FIREBASE_PROJECT_ID) {
    return { isInitialized: false, db: null };
  }

  try {
    if (admin.apps.length === 0) {
      let credentialLoaded = false;

      // 1. Check for service account file path
      const candidatePaths = [
        env.FIREBASE_SERVICE_ACCOUNT_PATH ? path.resolve(process.cwd(), env.FIREBASE_SERVICE_ACCOUNT_PATH) : null,
        env.FIREBASE_SERVICE_ACCOUNT_PATH ? path.resolve(__dirname, '../../', env.FIREBASE_SERVICE_ACCOUNT_PATH) : null,
        path.resolve(process.cwd(), 'serviceAccountKey.json'),
        path.resolve(__dirname, '../../serviceAccountKey.json'),
      ].filter((p): p is string => Boolean(p));

      for (const filePath of candidatePaths) {
        if (fs.existsSync(filePath)) {
          try {
            const raw = fs.readFileSync(filePath, 'utf-8');
            const sa = JSON.parse(raw);
            admin.initializeApp({
              credential: admin.credential.cert(sa),
              projectId: sa.project_id || env.FIREBASE_PROJECT_ID,
              databaseURL: env.FIREBASE_DATABASE_URL,
            });
            credentialLoaded = true;
            console.log(`🔥 Firebase Admin initialized using service account file: ${path.basename(filePath)}`);
            break;
          } catch (fileErr) {
            console.warn(`⚠️ Found ${filePath} but failed to parse service account JSON:`, fileErr);
          }
        }
      }

      // 2. Check for inline credentials
      if (!credentialLoaded && env.FIREBASE_CLIENT_EMAIL && env.FIREBASE_PRIVATE_KEY) {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId: env.FIREBASE_PROJECT_ID,
            clientEmail: env.FIREBASE_CLIENT_EMAIL,
            privateKey: env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
          }),
          databaseURL: env.FIREBASE_DATABASE_URL,
        });
        credentialLoaded = true;
        console.log('🔥 Firebase Admin initialized using environment service account credentials.');
      }

      // 3. Fallback to Application Default Credentials or default Project ID
      if (!credentialLoaded) {
        if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
          admin.initializeApp({
            credential: admin.credential.applicationDefault(),
            projectId: env.FIREBASE_PROJECT_ID,
          });
          credentialLoaded = true;
          console.log('🔥 Firebase Admin initialized using Application Default Credentials (ADC).');
        } else {
          admin.initializeApp({
            projectId: env.FIREBASE_PROJECT_ID,
          });
          console.log(`🔥 Firebase Admin initialized with Project ID: ${env.FIREBASE_PROJECT_ID}`);
        }
      }
    }

    firestore = admin.firestore();
    // Configure Firestore settings
    firestore.settings({
      ignoreUndefinedProperties: true,
    });

    isFirebaseInitialized = true;
    console.log(`✅ Connected to Cloud Firestore database: (default) on project [${env.FIREBASE_PROJECT_ID}]`);
    return { isInitialized: true, db: firestore };
  } catch (err: any) {
    initError = err;
    console.warn('⚠️ Firebase Admin initialization encountered an issue:', err.message || err);
    console.warn('ℹ️ To connect with full service account permissions, place serviceAccountKey.json in the backend directory or set FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY.');
    return { isInitialized: false, db: null, error: err };
  }
};

export const getFirestoreDb = (): admin.firestore.Firestore | null => {
  if (!isFirebaseInitialized) {
    initFirebase();
  }
  return firestore;
};

export const isFirestoreActive = (): boolean => {
  return isFirebaseInitialized && firestore !== null;
};

export { admin };
