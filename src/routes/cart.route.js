const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
// const authMiddleware = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const {
  createCartSchema,
  updateCartSchema,
} = require('../validations/cart.validation');

router.post('/', validate(createCartSchema), cartController.create);

router.get('/', cartController.getAll);
router.get('/:id', cartController.getById);

router.put('/:id', validate(updateCartSchema), cartController.update);

router.delete('/:id', cartController.delete);
router.delete('/', cartController.clear);

module.exports = router;
