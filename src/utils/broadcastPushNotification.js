const sendPushNotification = require('./sendPushNotification');
const User = require('../models/user.model');

async function broadcastPushNotification(title, body) {
  const customersWithToken = await User.find({
    role: 'customer',
    deviceToken: { $exists: true, $ne: null },
  });

  const promises = customersWithToken.map((user) =>
    sendPushNotification(user.deviceToken, title, body)
  );

  try {
    await Promise.all(promises);
    console.log(`✅ Broadcast sent to ${customersWithToken.length} customers.`);
  } catch (err) {
    console.error('❌ Error broadcasting notification:', err.message);
  }
}

module.exports = broadcastPushNotification;
