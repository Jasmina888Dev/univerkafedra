const express = require('express');
const {
  getGrades,
  getGradesByStudent,
  createGrade,
  updateGrade,
  deleteGrade
} = require('../controllers/gradeController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/student/:studentId', protect, getGradesByStudent);

router.route('/')
  .get(protect, getGrades)
  .post(protect, authorize('ADMIN', 'TEACHER'), createGrade);

router.route('/:id')
  .put(protect, authorize('ADMIN', 'TEACHER'), updateGrade)
  .delete(protect, authorize('ADMIN', 'TEACHER'), deleteGrade);

module.exports = router;
