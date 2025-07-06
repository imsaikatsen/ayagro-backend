const express = require('express');
const router = express.Router();
const faqController = require('../controllers/faq.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const {
  createFaqSchema,
  updateFaqSchema,
} = require('../validations/faq.validation');

// Create FAQ - Admin only
router.post(
  '/',
  authMiddleware.authenticate,
  authMiddleware.authorizeRoles('admin'),
  validate(createFaqSchema),
  faqController.create
);

// Get all FAQs - Public
router.get('/', faqController.getAll);

// Get FAQ by ID -
router.get('/:id', faqController.getById);

// Update FAQ - Admin only
router.put(
  '/:id',
  authMiddleware.authenticate,
  authMiddleware.authorizeRoles('admin'),
  validate(updateFaqSchema),
  faqController.update
);

// Delete FAQ - Admin only
router.delete(
  '/:id',
  authMiddleware.authenticate,
  authMiddleware.authorizeRoles('admin'),
  faqController.delete
);

module.exports = router;
