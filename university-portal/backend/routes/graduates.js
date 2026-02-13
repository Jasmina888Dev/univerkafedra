const express = require('express');
const {
  getGraduates,
  getGraduateById,
  createGraduate,
  updateGraduate,
  deleteGraduate
} = require('../controllers/graduateController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', getGraduates);
router.get('/:id', getGraduateById);
router.post('/', protect, authorize('ADMIN'), createGraduate);
router.put('/:id', protect, authorize('ADMIN'), updateGraduate);
router.delete('/:id', protect, authorize('ADMIN'), deleteGraduate);

module.exports = router;
