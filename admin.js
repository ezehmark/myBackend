const { initializeApp, applicationDefault, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

const serviceAccount = JSON.stringify(process.env.firebaseAdmin);
initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

module.exports = db;
