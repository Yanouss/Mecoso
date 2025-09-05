const express = require('express');
const {
  getAbout,
  updateAbout,
  uploadPortfolio
} = require('../controllers/about.controller');
const { protect, authorize } = require('../middleware/auth');
const { 
  uploadAboutFiles, 
  uploadPortfolioFile,
  handleUploadError 
} = require('../middleware/upload');

const router = express.Router();

// Get about content (public)
router.get('/', getAbout);

// Update about content (private - moderator/admin only)
router.put('/', 
  protect, 
  authorize('moderator', 'admin'), 
  uploadAboutFiles,
  handleUploadError,
  updateAbout
);

// Upload portfolio file separately (private - moderator/admin only)
router.post('/portfolio',
  protect,
  authorize('moderator', 'admin'),
  uploadPortfolioFile,
  handleUploadError,
  uploadPortfolio
);

module.exports = router;