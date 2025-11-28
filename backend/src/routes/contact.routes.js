const express = require('express');
const {
  getContact,
  updateContact,
  getContactWithTranslations,
  submitContactForm  // Add this
} = require('../controllers/contact.controller');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .get(getContact)
  .put(protect, authorize('moderator', 'admin'), updateContact);

// Add this new route
router.post('/submit', submitContactForm);

router.get('/:lang', getContactWithTranslations);

module.exports = router;