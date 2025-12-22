const express = require('express');
const router = express.Router();
const investmentController = require('../controllers/investment.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');

const {
  createInvestmentSchema,
  updateInvestmentSchema,
} = require('../validations/investment.validation');

// ✅ Admin adds investment to investor
router.post(
  '/:id/investments',
  authMiddleware.authenticate,
  authMiddleware.authorizeRoles('admin', 'super_admin'),
  validate(createInvestmentSchema),
  investmentController.create
);

// ✅ Admin updates investment
router.patch(
  '/:id',
  authMiddleware.authenticate,
  authMiddleware.authorizeRoles('admin', 'super_admin'),
  validate(updateInvestmentSchema),
  investmentController.update
);

// ✅ Admin gets all investments of an investor
router.get(
  '/investor/:investorId',
  authMiddleware.authenticate,
  authMiddleware.authorizeRoles('admin', 'super_admin'),
  investmentController.getByInvestor
);

module.exports = router;
