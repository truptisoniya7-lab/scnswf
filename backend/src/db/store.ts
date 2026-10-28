import fs from 'fs';
import path from 'path';
import { DatabaseState, getInitialSeedData } from './seedData';
import { env } from '../config/env';
import { getFirestoreDb, isFirestoreActive } from './firebase';
import {
  syncDocToFirestore,
  deleteDocFromFirestore,
  seedFirestoreDatabase,
  loadStateFromFirestore,
  FIRESTORE_COLLECTIONS,
} from './firestoreSync';

class UnifiedStore {
  private data: DatabaseState;
  private filePath: string;
  private isFirestoreSynced = false;

  constructor() {
    const dataDir = path.resolve(__dirname, '../../data');
    if (!fs.existsSync(dataDir)) {
      try {
        fs.mkdirSync(dataDir, { recursive: true });
      } catch (err) {
        console.warn('Could not create data directory, using memory only:', err);
      }
    }
    this.filePath = path.join(dataDir, 'db.json');
    this.data = this.loadData();
  }

  private loadData(): DatabaseState {
    try {
      if (fs.existsSync(this.filePath)) {
        const fileContent = fs.readFileSync(this.filePath, 'utf-8');
        const parsed = JSON.parse(fileContent);
        const initial = getInitialSeedData();
        const state: DatabaseState = {
          ...initial,
          ...parsed,
        };

        // Ensure default admin from env exists and credentials match current env
        if (state.users && initial.users.length > 0) {
          const defaultAdmin = initial.users[0];
          const adminIdx = state.users.findIndex(
            (u) => u.id === defaultAdmin.id || u.email.toLowerCase() === defaultAdmin.email.toLowerCase()
          );
          if (adminIdx === -1) {
            state.users.push(defaultAdmin);
          } else {
            state.users[adminIdx].email = defaultAdmin.email;
            state.users[adminIdx].passwordHash = defaultAdmin.passwordHash;
            state.users[adminIdx].salt = defaultAdmin.salt;
            state.users[adminIdx].isActive = true;
          }
        }

        return state;
      }
    } catch (err) {
      console.warn('Error reading db.json, initializing fresh store:', err);
    }
    const seed = getInitialSeedData();
    this.saveData(seed);
    return seed;
  }

  private saveData(state: DatabaseState): void {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(state, null, 2), 'utf-8');
    } catch (err) {
      console.warn('Warning: Failed to persist db.json to disk:', err);
    }
  }

  public getState(): DatabaseState {
    return this.data;
  }

  public update(updater: (state: DatabaseState) => void): DatabaseState {
    updater(this.data);
    this.saveData(this.data);
    return this.data;
  }

  /**
   * Initialize Firestore connection and synchronize state
   */
  public async initFirestore(): Promise<void> {
    if (this.isFirestoreSynced) return;

    const db = getFirestoreDb();
    if (!db || !isFirestoreActive()) {
      return;
    }

    try {
      console.log('🔄 Checking Firestore collections in project-ngo-scnswf...');
      const programsCheck = await db.collection('programs').limit(1).get();

      if (programsCheck.empty) {
        console.log('🌱 Firestore collections are empty. Auto-seeding initial NGO data...');
        await seedFirestoreDatabase(db, this.data);
      } else {
        console.log('📥 Loading existing collections from Cloud Firestore...');
        const remoteState = await loadStateFromFirestore(db);
        this.data = {
          ...this.data,
          ...remoteState,
        };
        this.saveData(this.data);
        console.log('✅ Local state synchronized with Cloud Firestore.');
      }

      this.isFirestoreSynced = true;
    } catch (err: any) {
      console.warn('⚠️ Cloud Firestore sync deferred (service credentials required):', err.message || err);
    }
  }

  /**
   * Helper to write a single document to Firestore
   */
  public syncDocument(collectionName: string, docId: string, data: Record<string, any>): void {
    if (env.DATA_STORE === 'firebase' || isFirestoreActive()) {
      syncDocToFirestore(collectionName, docId, data).catch((err) => {
        console.warn(`[Store] Firestore sync error for ${collectionName}/${docId}:`, err);
      });
    }
  }

  /**
   * Helper to delete a single document from Firestore
   */
  public deleteDocument(collectionName: string, docId: string): void {
    if (env.DATA_STORE === 'firebase' || isFirestoreActive()) {
      deleteDocFromFirestore(collectionName, docId).catch((err) => {
        console.warn(`[Store] Firestore delete error for ${collectionName}/${docId}:`, err);
      });
    }
  }
}

export const dbStore = new UnifiedStore();
