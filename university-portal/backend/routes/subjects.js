const express = require('express');
const {
  getSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject
} = require('../controllers/subjectController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(protect, getSubjects)
  .post(protect, authorize('ADMIN', 'TEACHER'), createSubject);

router.route('/:id')
  .get(protect, getSubjectById)
  .put(protect, authorize('ADMIN', 'TEACHER'), updateSubject)
  .delete(protect, authorize('ADMIN', 'TEACHER'), deleteSubject);

module.exports = router;
