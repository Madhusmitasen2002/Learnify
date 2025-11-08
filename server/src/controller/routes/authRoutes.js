// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authmiddleware');

router.post('/signup', authController.signupValidators, authController.signup);
router.post('/login', authController.loginValidators, authController.login);
router.get('/profile', authMiddleware, authController.getProfile);

module.exports = router;
