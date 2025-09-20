const express = require('express');
const {
  getTranslations,
  updateTranslation,
  createTranslation,
  deleteTranslation,
  importTranslations,
  exportTranslations
} = require('../controllers/translations.controller');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getTranslations);
router.get('/export', exportTranslations);

// Protected routes (Admin/Moderator only)
router.post('/', protect, authorize('moderator', 'admin'), createTranslation);
router.put('/:key', protect, authorize('moderator', 'admin'), updateTranslation);
router.delete('/:key', protect, authorize('admin'), deleteTranslation);
router.post('/import', protect, authorize('admin'), importTranslations);

module.exports = router;