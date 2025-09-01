const express = require('express');
const {
  getHero,
  updateHero
} = require('../controllers/hero.controller');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .get(getHero)
  .put(protect, authorize('moderator', 'admin'), updateHero);

module.exports = router;