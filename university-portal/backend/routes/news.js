const express = require('express');
const {
  getNews,
  getAllNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews
} = require('../controllers/newsController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', getNews);
router.get('/all', protect, authorize('ADMIN'), getAllNews);
router.get('/:id', getNewsById);
router.post('/', protect, authorize('ADMIN'), createNews);
router.put('/:id', protect, authorize('ADMIN'), updateNews);
router.delete('/:id', protect, authorize('ADMIN'), deleteNews);

module.exports = router;
