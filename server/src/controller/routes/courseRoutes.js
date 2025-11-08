// src/routes/courseRoutes.js
const express = require('express');
const router = express.Router();
const courseCtrl = require('../controllers/courseController');
const authMiddleware = require('../middleware/authmiddleware');

router.get('/', courseCtrl.listCourses);
router.get('/:id', courseCtrl.getCourse);
router.post('/', authMiddleware, courseCtrl.createCourse);
router.put('/:id', authMiddleware, courseCtrl.updateCourse);
router.delete('/:id', authMiddleware, courseCtrl.deleteCourse);

module.exports = router;
