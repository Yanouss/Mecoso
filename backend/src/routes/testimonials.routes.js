const express = require('express');
const {
  getTestimonials,
  getTestimonial,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  getTestimonialsWithTranslations,
  getTestimonialWithTranslations
} = require('../controllers/testimonials.controller');
const { protect, authorize } = require('../middleware/auth');
const { uploadTestimonialImage } = require('../middleware/upload');

const router = express.Router();

// ✅ CRITICAL: Translation routes MUST come BEFORE /:id routes
// Get all testimonials with translations (public)
router.get('/translated', getTestimonialsWithTranslations);

// Base routes - Get all and Create
router
  .route('/')
  .get(getTestimonials)
  .post(protect, authorize('moderator', 'admin'), uploadTestimonialImage, createTestimonial);

// ⚠️ IMPORTANT: /:id routes MUST come AFTER all specific routes
// Individual testimonial routes - Get, Update, Delete
router
  .route('/:id')
  .get(getTestimonial)
  .put(protect, authorize('moderator', 'admin'), uploadTestimonialImage, updateTestimonial)
  .delete(protect, authorize('moderator', 'admin'), deleteTestimonial);

// Get single testimonial with translations (public)
router.get('/:id/:lang', getTestimonialWithTranslations);

module.exports = router;