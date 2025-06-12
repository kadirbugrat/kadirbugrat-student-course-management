const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { enrollCourse, getMyCourses, unenrollCourse } = require('../controllers/enrollmentController');

router.post('/', verifyToken, enrollCourse); // derse kayıt
router.get('/my-courses', verifyToken, getMyCourses); // sadece giriş yapan öğrenci
router.delete('/:courseId', verifyToken, unenrollCourse); // dersten çıkma


module.exports = router;
