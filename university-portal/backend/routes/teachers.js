const express = require('express');
const {
  getTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher
} = require('../controllers/teacherController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(protect, authorize('ADMIN'), getTeachers)
  .post(protect, authorize('ADMIN'), createTeacher);

router.route('/:id')
  .get(protect, getTeacherById)
  .put(protect, authorize('ADMIN'), updateTeacher)
  .delete(protect, authorize('ADMIN'), deleteTeacher);

module.exports = router;
