// routes/investment.routes.js
const express = require('express');
const router = express.Router();
const investmentController = require('../controllers/investment.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post(
  '/:id/investments',
  authMiddleware.authenticate,
  authMiddleware.authorizeRoles('admin', 'super_admin'),
  investmentController.create
);

router.patch(
  '/:id',
  authMiddleware.authenticate,
  authMiddleware.authorizeRoles('admin', 'super_admin'),
  investmentController.update
);

router.get(
  '/investor/:investorId',
  authMiddleware.authenticate,
  authMiddleware.authorizeRoles('admin', 'super_admin'),
  investmentController.getByInvestor
);

module.exports = router;
