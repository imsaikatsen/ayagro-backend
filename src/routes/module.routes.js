const express = require('express');
const router = express.Router();
const moduleController = require('../controllers/module.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/', authMiddleware.authenticate, moduleController.getModules);
router.put(
  '/user/:id',
  authMiddleware.authenticate,
  authMiddleware.authorizeRoles('super_admin'),
  moduleController.updateUserModules
);

module.exports = router;
