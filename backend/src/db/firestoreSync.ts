import admin from 'firebase-admin';
import { DatabaseState, getInitialSeedData } from './seedData';
import { getFirestoreDb, isFirestoreActive } from './firebase';

export type FirestoreCollectionKey = keyof DatabaseState;

export const FIRESTORE_COLLECTIONS: { key: FirestoreCollectionKey; name: string }[] = [
  { key: 'programs', name: 'programs' },
  { key: 'programServices', name: 'programServices' },
  { key: 'impactMetrics', name: 'impactMetrics' },
  { key: 'impactStories', name: 'impactStories' },
  { key: 'galleryAlbums', name: 'galleryAlbums' },
  { key: 'galleryImages', name: 'galleryImages' },
  { key: 'events', name: 'events' },
  { key: 'partners', name: 'partners' },
  { key: 'teamMembers', name: 'teamMembers' },
  { key: 'volunteerApplications', name: 'volunteerApplications' },
  { key: 'internshipApplications', name: 'internshipApplications' },
  { key: 'partnershipRequests', name: 'partnershipRequests' },
  { key: 'contactMessages', name: 'contactMessages' },
  { key: 'donations', name: 'donations' },
  { key: 'donationTransactions', name: 'donationTransactions' },
  { key: 'documents', name: 'documents' },
  { key: 'annualReports', name: 'annualReports' },
  { key: 'newsletterSubscribers', name: 'newsletterSubscribers' },
  { key: 'users', name: 'users' },
  { key: 'adminProfiles', name: 'adminProfiles' },
  { key: 'auditLogs', name: 'auditLogs' },
];

/**
 * Persist or update a single document in Firestore
 */
export async function syncDocToFirestore(
  collectionName: string,
  docId: string,
  data: Record<string, any>
): Promise<void> {
  const db = getFirestoreDb();
  if (!db || !isFirestoreActive()) return;

  try {
    await db.collection(collectionName).doc(docId).set(data, { merge: true });
  } catch (err: any) {
    console.warn(`[Firestore] Failed to sync document ${docId} to ${collectionName}:`, err.message || err);
  }
}

/**
 * Remove a document from Firestore
 */
export async function deleteDocFromFirestore(collectionName: string, docId: string): Promise<void> {
  const db = getFirestoreDb();
  if (!db || !isFirestoreActive()) return;

  try {
    await db.collection(collectionName).doc(docId).delete();
  } catch (err: any) {
    console.warn(`[Firestore] Failed to delete document ${docId} from ${collectionName}:`, err.message || err);
  }
}

/**
 * Seed all collections and initial NGO data into Cloud Firestore
 */
export async function seedFirestoreDatabase(
  db: admin.firestore.Firestore,
  seedData?: DatabaseState
): Promise<{ totalDocuments: number; collectionsPopulated: number }> {
  const data = seedData || getInitialSeedData();
  let totalDocs = 0;
  let populatedCount = 0;

  console.log('🚀 Seeding initial collections into Cloud Firestore...');

  for (const { key, name } of FIRESTORE_COLLECTIONS) {
    const items = data[key] as any[];
    if (!items || items.length === 0) continue;

    // Firestore batch limit is 500 operations
    const batchSize = 450;
    for (let i = 0; i < items.length; i += batchSize) {
      const chunk = items.slice(i, i + batchSize);
      const batch = db.batch();

      for (const item of chunk) {
        const id = item.id || admin.firestore().collection(name).doc().id;
        const ref = db.collection(name).doc(String(id));
        batch.set(ref, item, { merge: true });
        totalDocs++;
      }

      await batch.commit();
    }

    populatedCount++;
    console.log(`  ✓ Collection '${name}': seeded ${items.length} document(s)`);
  }

  console.log(`🎉 Seeding complete: ${totalDocs} total documents across ${populatedCount} collections in Firestore.`);
  return { totalDocuments: totalDocs, collectionsPopulated: populatedCount };
}

/**
 * Pull all collections from Cloud Firestore into in-memory database state
 */
export async function loadStateFromFirestore(db: admin.firestore.Firestore): Promise<DatabaseState> {
  const state: any = getInitialSeedData();

  for (const { key, name } of FIRESTORE_COLLECTIONS) {
    try {
      const snapshot = await db.collection(name).get();
      if (!snapshot.empty) {
        state[key] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      }
    } catch (err: any) {
      console.warn(`[Firestore] Error loading collection '${name}':`, err.message || err);
    }
  }

  return state as DatabaseState;
}
