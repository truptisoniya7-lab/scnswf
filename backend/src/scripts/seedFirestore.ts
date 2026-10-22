import { initFirebase } from '../db/firebase';
import { seedFirestoreDatabase } from '../db/firestoreSync';
import { getInitialSeedData } from '../db/seedData';
import { env } from '../config/env';

async function main() {
  console.log('========================================================');
  console.log('🔥 SCNSWF Cloud Firestore Seeder & Migration Tool');
  console.log(`🎯 Target Project:   ${env.FIREBASE_PROJECT_ID}`);
  console.log(`📂 Database:         (default)`);
  console.log('========================================================');

  const { isInitialized, db, error } = initFirebase();

  if (!isInitialized || !db) {
    console.error('❌ Failed to initialize Firebase Admin SDK.');
    if (error) {
      console.error('Error details:', error.message);
    }
    printInstructions();
    process.exit(1);
  }

  try {
    const seed = getInitialSeedData();
    const result = await seedFirestoreDatabase(db, seed);

    console.log('\n========================================================');
    console.log(`🎉 Success! Seeded ${result.totalDocuments} documents across ${result.collectionsPopulated} collections.`);
    console.log('🔗 View live data in Firebase Console:');
    console.log(`   https://console.firebase.google.com/u/3/project/${env.FIREBASE_PROJECT_ID}/firestore/databases/-default-/data`);
    console.log('========================================================\n');
    process.exit(0);
  } catch (err: any) {
    console.error('\n❌ Could not connect/write to Cloud Firestore:', err.message || err);
    printInstructions();
    process.exit(1);
  }
}

function printInstructions() {
  console.log('\n💡 To authorize write access to project-ngo-scnswf:');
  console.log('1. Open Firebase Console Service Accounts:');
  console.log(`   https://console.firebase.google.com/u/3/project/${env.FIREBASE_PROJECT_ID}/settings/serviceaccounts/adminsdk`);
  console.log('2. Click "Generate new private key" to download your service account JSON file.');
  console.log('3. Save it as either:');
  console.log('   d:\\Project-NGO\\scnswf\\backend\\serviceAccountKey.json');
  console.log('   OR set FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY in backend/.env');
  console.log('4. Run again:');
  console.log('   npm run seed:firestore\n');
}

main();
