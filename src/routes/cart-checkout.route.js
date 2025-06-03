// routes/category.routes.js
const express = require('express');
const router = express.Router();
const cartCheckoutController = require('../controllers/cart-checkout.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post(
  '/checkout',
  authMiddleware.authenticate,
  authMiddleware.authorizeRoles('customer'),
  cartCheckoutController.checkout
);

module.exports = router;
