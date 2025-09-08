// src/scripts/modules.seed.js
require('dotenv').config({ path: '../../.env' });
const mongoose = require('mongoose');
const Module = require('../models/module.model');

const modulesList = [
  { name: 'dashboard', displayName: 'Dashboard' },
  { name: 'projects', displayName: 'Projects' },
  { name: 'categories', displayName: 'Categories' },
  { name: 'orders', displayName: 'Orders' },
  { name: 'faqs', displayName: 'FAQs' },
  { name: 'blogs', displayName: 'Blogs' },
  { name: 'users', displayName: 'Users' },
  { name: 'headercards', displayName: 'Header Cards' },
  { name: 'works', displayName: 'Works' },
];

async function seedModules() {
  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI is undefined! Check your .env file');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  await Module.deleteMany({}); // optional: remove old
  await Module.insertMany(modulesList);

  console.log('Modules seeded successfully!');
  process.exit(0);
}

seedModules();
