const express = require('express');
const {
  getStudyPlans,
  getStudyPlanById,
  createStudyPlan,
  updateStudyPlan,
  deleteStudyPlan
} = require('../controllers/studyPlanController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(protect, getStudyPlans)
  .post(protect, authorize('ADMIN'), createStudyPlan);

router.route('/:id')
  .get(protect, getStudyPlanById)
  .put(protect, authorize('ADMIN'), updateStudyPlan)
  .delete(protect, authorize('ADMIN'), deleteStudyPlan);

module.exports = router;
