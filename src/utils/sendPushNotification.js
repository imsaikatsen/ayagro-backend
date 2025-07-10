// utils/sendPushNotification.js
const admin = require('../config/firebase');

async function sendPushNotification(deviceToken, title, body) {
  const message = {
    notification: {
      title,
      body,
    },
    token: deviceToken,
  };

  try {
    const response = await admin.messaging().send(message);
    console.log('✅ Push notification sent:', response);
  } catch (error) {
    console.error('❌ Push notification error:', error.message);
  }
}

module.exports = sendPushNotification;
