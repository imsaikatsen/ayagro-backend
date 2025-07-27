// utils/sendPushNotification.js
const admin = require('../config/firebase');

async function sendPushNotification(fcmToken, title, body) {
  const message = {
    notification: {
      title,
      body,
    },
    token: fcmToken,
  };

  try {
    const response = await admin.messaging().send(message);
    console.log('✅ Push notification sent:', response);
    return response;
  } catch (error) {
    console.error('❌ Push notification error:', error.message);
    return null;
  }
}

module.exports = sendPushNotification;
