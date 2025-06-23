const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

let db;

try {
    console.log("Attempting to initialize Firebase Admin SDK using environment variable...");
    const serviceAccountJson = process.env.serviceAccountString;


    if (!serviceAccountJson) {
        throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON environment variable is not set!");
    }

    const serviceAccount = JSON.parse(serviceAccountJson);

    initializeApp({
        credential: cert(serviceAccount)
    });

    db = getFirestore();
    console.log("Firebase Admin SDK initialized successfully via environment variable.");
} catch (error) {
    console.error("🚨🚨🚨 FATAL ERROR: Firebase Admin SDK initialization failed: 🚨🚨🚨", error);
    // This is a critical error, the app cannot proceed without auth
    process.exit(1);
}

module.exports = db; // Export db only after successful initialization
