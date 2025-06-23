const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

let db;

try {
    console.log("Attempting to initialize Firebase Admin SDK using environment variable...");
    const serviceAccount = JSON.parse(process.env.serviceAccountString);

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

module.exports = db;
