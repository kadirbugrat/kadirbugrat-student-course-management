const express = require('express');
const router = express.Router();
const { addCourse } = require('../controllers/courseController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.post('/', verifyToken, isAdmin, addCourse); // sadece admin

module.exports = router;
