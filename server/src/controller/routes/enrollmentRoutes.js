// src/routes/enrollmentRoutes.js
const express = require('express');
const router = express.Router();
const enrollmentCtrl = require('../controllers/enrollmentController');
const authMiddleware = require('../middleware/authmiddleware');

router.post('/:courseId', authMiddleware, enrollmentCtrl.enroll);
router.get('/:courseId', authMiddleware, enrollmentCtrl.getEnrollment);
router.post('/:courseId/progress', authMiddleware, enrollmentCtrl.updateProgress);

module.exports = router;
