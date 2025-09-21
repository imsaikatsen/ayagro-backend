const express = require('express');
const router = express.Router();
const validate = require('../middlewares/validate.middleware');
const { applicationSchema } = require('../validations/application.validation');
const applicationController = require('../controllers/application.controller');
const uploadCV = require('../config/cvMulterConfig');

// Candidate applies for a job
router.post(
  '/',
  uploadCV.single('cv'),
  validate(applicationSchema),
  applicationController.apply
);

// Admin gets applications for a job
router.get('/:jobId', applicationController.getByJob);

module.exports = router;
