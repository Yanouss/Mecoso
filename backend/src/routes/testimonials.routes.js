const express = require('express');
const {
  getTestimonials,
  getTestimonial,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  reorderTestimonials
} = require('../controllers/testimonials.controller');
const { protect, authorize } = require('../middleware/auth');
const { uploadTestimonialImage } = require('../middleware/upload');

const router = express.Router();

router
  .route('/')
  .get(getTestimonials)
  .post(protect, authorize('moderator', 'admin'), uploadTestimonialImage, createTestimonial);

router
  .route('/reorder')
  .put(protect, authorize('moderator', 'admin'), reorderTestimonials);

router
  .route('/:id')
  .get(getTestimonial)
  .put(protect, authorize('moderator', 'admin'), uploadTestimonialImage, updateTestimonial)
  .delete(protect, authorize('moderator', 'admin'), deleteTestimonial);

module.exports = router;