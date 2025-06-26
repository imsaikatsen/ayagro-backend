const mongoose = require('mongoose');
const User = require('../models/user.model');

const MONGODB_URI = 'mongodb://localhost:27017/ayagro';

async function cleanup() {
  try {
    await mongoose.connect(MONGODB_URI);

    const result = await User.deleteMany({
      $and: [
        {
          $or: [{ email: null }, { email: '' }, { email: { $exists: false } }],
        },
        {
          $or: [{ phone: null }, { phone: '' }, { phone: { $exists: false } }],
        },
      ],
    });

    console.log(
      `✅ Deleted users with no email or phone: ${result.deletedCount}`
    );
  } catch (err) {
    console.error('❌ Cleanup error:', err);
  } finally {
    await mongoose.disconnect();
  }
}

cleanup();
