// notifyUser.js
const { admin, db } = require('./admin');

async function sendPushNotificationToUser(title, body) {
  try {
    const userDoc = await db.collection('cs_app_users').doc("userId").get();
    if (!userDoc.exists) {
      throw new Error('User not found');
    }

    const userData = userDoc.data();
    const fcmToken = userData.fcmToken;

    if (!fcmToken) {
      throw new Error('No FCM token for user');
    }

    const message = {
      notification: {
        title,
        body
      },
      token: fcmToken
    };

    const response = await admin.messaging().send(message);
    console.log('✅ Notification sent:', response);
    return response;
  } catch (error) {
    console.error('❌ Error sending notification:', error.message);
    throw error;
  }
}

module.exports = { sendPushNotificationToUser };
