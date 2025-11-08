// src/routes/lessonRoutes.js
const express = require('express');
const router = express.Router();
const lessonCtrl = require('../controllers/lessonController');
const authMiddleware = require('../middleware/authmiddleware');

// GET /lessons/:courseId
router.get('/:courseId', lessonCtrl.getLessonsByCourse);
// GET /lessons/lesson/:id
router.get('/lesson/:id', lessonCtrl.getLesson);
// POST /lessons/:courseId (create lesson)
router.post('/:courseId', authMiddleware, lessonCtrl.createLesson);

module.exports = router;
