const express = require('express');
const router = express.Router();
const {
  getAllStudents,
  addStudent,
  updateStudent,
  deleteStudent,
  getMe,
  getStudentCourses
} = require('../controllers/studentController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// SADECE ADMIN YETKİSİ OLANLAR:
router.get('/', verifyToken, isAdmin, getAllStudents);
router.post('/', verifyToken, isAdmin, addStudent);
router.delete('/:id', verifyToken, isAdmin, deleteStudent);

// HERKES (ADMIN VEYA KENDİSİ) ERİŞEBİLMELİ:
router.put('/:id', verifyToken, updateStudent); // <-- isAdmin'i kaldırdık
router.get('/:id/courses', verifyToken, getStudentCourses); // <-- isAdmin'i kaldırdık
router.get('/me', verifyToken, getMe);

module.exports = router;
