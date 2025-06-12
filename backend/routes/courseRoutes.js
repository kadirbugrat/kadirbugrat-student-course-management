const express = require('express');
const router = express.Router();
const { addCourse, getAllCourses, deleteCourse, updateCourse } = require('../controllers/courseController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// Sadece admin ders ekler
router.post('/', verifyToken, isAdmin, addCourse);

// Tüm kullanıcılar dersleri görebilir
router.get('/', verifyToken, getAllCourses);

// Sadece admin ders siler
router.delete('/:id', verifyToken, isAdmin, deleteCourse);

router.put('/:id', verifyToken, isAdmin, updateCourse);

module.exports = router;
