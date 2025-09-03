require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');

async function seedSuperAdmin() {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const existingAdmin = await User.findOne({ role: 'super_admin' });
  if (existingAdmin) {
    console.log('Super Admin already exists!');
    return process.exit(0);
  }

  const hashedPassword = await bcrypt.hash(
    process.env.SUPER_ADMIN_PASSWORD,
    10
  );
  const superAdmin = new User({
    firstName: 'Saikat',
    lastName: 'Sen',
    email: process.env.SUPER_ADMIN_EMAIL,
    password: hashedPassword,
    role: 'super_admin',
    isVerified: true,
  });

  await superAdmin.save();
  console.log('Super Admin created successfully!');
  process.exit(0);
}

seedSuperAdmin();
