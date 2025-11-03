// src/scripts/backfill-order-items.js
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') }); // ensure correct .env
const mongoose = require('mongoose');
const OrderItem = require('../models/order-items.model');
const Order = require('../models/order.model');

async function main() {
  // Debug: ensure MONGO_URI is loaded
  console.log(
    'Using MONGO_URI:',
    process.env.MONGO_URI ? 'FOUND' : 'NOT FOUND'
  );
  if (!process.env.MONGO_URI) {
    console.error('ERROR: MONGO_URI is missing in .env. Aborting.');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    const items = await OrderItem.find().populate('order_id');

    for (const it of items) {
      if (it.order_id) {
        const parentOrder = it.order_id;
        const parentPayment = parentOrder.paymentStatus || 'Unpaid';
        const itemPayment = parentPayment === 'Paid' ? 'Paid' : 'Unpaid';
        it.paymentStatus = itemPayment;

        if (
          itemPayment === 'Paid' &&
          (!it.orderStatus || it.orderStatus === 'booked')
        ) {
          it.orderStatus = 'active';
          it.activationDate =
            it.activationDate || new Date(parentOrder.createdAt || Date.now());
        }

        await it.save();
        console.log('Backfilled item', it._id.toString(), '->', itemPayment);
      }
    }

    console.log('Backfill complete');
  } catch (err) {
    console.error('Backfill failed:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

main().catch((e) => {
  console.error('Script error:', e);
  process.exit(1);
});
