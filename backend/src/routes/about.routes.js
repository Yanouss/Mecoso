const express = require('express');
const {
  getAbout,
  updateAbout
} = require('../controllers/about.controller');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .get(getAbout)
  .put(protect, authorize('moderator', 'admin'), updateAbout);

module.exports = router;