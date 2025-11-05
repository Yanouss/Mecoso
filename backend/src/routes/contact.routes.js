const express = require('express');
const {
  getContact,
  updateContact,
  getContactWithTranslations
} = require('../controllers/contact.controller');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .get(getContact)
  .put(protect, authorize('moderator', 'admin'), updateContact);


router.get('/:lang', getContactWithTranslations);

module.exports = router;