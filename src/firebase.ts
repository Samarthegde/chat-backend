import * as admin from 'firebase-admin';
import * as path from 'path';

// Initialize Firebase Admin SDK
const serviceAccount = path.join(__dirname, '../firestore.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore(); // Reference to Firestore

export { db };
