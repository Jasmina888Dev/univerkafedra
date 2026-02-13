const express = require('express');
const {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getTopStudents
} = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/top', protect, getTopStudents);

router.route('/')
  .get(protect, getStudents)
  .post(protect, authorize('ADMIN'), createStudent);

router.route('/:id')
  .get(protect, getStudentById)
  .put(protect, authorize('ADMIN'), updateStudent)
  .delete(protect, authorize('ADMIN'), deleteStudent);

module.exports = router;
