const express = require('express');
const authController = require('../controllers/auth.controller');

const authMiddleware = require('../middlewares/auth.middleware');

const { registerSchema } = require('../validations/auth.validation');
const validate = require('../middlewares/validate.middleware');

const router = express.Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', authController.login);

//...... USER ..........//

router.get(
  '/users',
  authMiddleware.authenticate,
  authMiddleware.authorizeRoles('admin'),
  authController.getUserList
);

router.put(
  '/users/:id',
  authMiddleware.authenticate,
  authMiddleware.authorizeRoles('admin'),
  authController.updateUser
);

router.delete(
  '/users/:id',
  authMiddleware.authenticate,
  authMiddleware.authorizeRoles('admin'),
  authController.deleteUser
);

module.exports = router;
