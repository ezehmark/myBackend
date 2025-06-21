const { initializeApp, applicationDefault, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
//Service acc
const serviceAccount = require('./firebaseAdmin.json');
initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

module.exports = db;
