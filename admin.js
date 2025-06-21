const { initializeApp, applicationDefault, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const path = require("path");

const serviceAccount = require(path.resolve(__dirname, "blocavax-firebase-adminsdk-fbsvc-24f722cc43.json"));
initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

module.exports = db;
