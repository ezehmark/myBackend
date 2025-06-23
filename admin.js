const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

let db;

try {
  console.log("Attempting to initialize Firebase Admin SDK using service account...");

  const serviceAccount = require("./firebaseAdmin.json");

  initializeApp({
    credential: cert(serviceAccount),
  });

  db = getFirestore();
  console.log("Firebase Admin SDK initialized successfully.");
} catch (error) {
  console.error("🚨🚨🚨 FATAL ERROR: Firebase Admin SDK initialization failed: 🚨🚨🚨", error);
  // This is a critical error; the app cannot proceed without a Firestore instance
  process.exit(1);
}

module.exports = db; // Export Firestore instance after successful initialization
