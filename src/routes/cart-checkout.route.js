// routes/category.routes.js
const express = require('express');
const router = express.Router();
const checkoutController = require('../controllers/checkout.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post(
  '/',
  authMiddleware.authenticate,
  authMiddleware.authorizeRoles('customer'),
  checkoutController.checkout
);

module.exports = router;
