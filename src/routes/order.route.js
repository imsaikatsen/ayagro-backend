const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const validate = require('../middlewares/validate.middleware');
const orderValidationSchema = require('../validations/order.validation');

router.post(
  '/',
  authMiddleware.authenticate,
  authMiddleware.authorizeRoles('admin'),
  validate(orderValidationSchema.createOrderSchema),
  orderController.create
);
router.get('/', authMiddleware.authenticate, orderController.getAll);
router.get('/:id', authMiddleware.authenticate, orderController.getById);
router.put(
  '/:id',
  authMiddleware.authenticate,
  authMiddleware.authorizeRoles('admin'),
  orderController.update
);
router.delete(
  '/:id',
  authMiddleware.authenticate,
  authMiddleware.authorizeRoles('admin'),
  orderController.delete
);

module.exports = router;
