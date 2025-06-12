const express = require('express');
const router = express.Router();
const { getAllStudents, addStudent, updateStudent, deleteStudent, getMe,getStudentCourses } = require('../controllers/studentController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.get('/', verifyToken, isAdmin, getAllStudents);
router.post('/', verifyToken, isAdmin, addStudent);
router.put('/:id', verifyToken, isAdmin, updateStudent);
router.delete('/:id', verifyToken, isAdmin, deleteStudent);
router.get('/:id/courses', verifyToken, isAdmin, getStudentCourses);

router.get('/me', verifyToken, getMe);



module.exports = router;
