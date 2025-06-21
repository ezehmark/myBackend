const { initializeApp, applicationDefault, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const path = require("path");

const serviceAccount = JSON.parse(process.env.firebaseAdmin);
initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

module.exports = db;
