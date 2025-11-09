const express = require('express');
const {
  getGalleryPage,
  updateGalleryPage,
  getGalleryItems,
  getGalleryItem,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  getGalleryCategories,
  getGalleryWithTranslations
} = require('../controllers/gallery.controller');

const { uploadGalleryImage, handleUploadError } = require('../middleware/upload');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/page', getGalleryPage);
router.get('/categories', getGalleryCategories);
router.get('/items', getGalleryItems);
router.get('/items/:id', getGalleryItem);
router.get('/translated', getGalleryWithTranslations);

// Protected routes (require authentication and moderator role)
router.use(protect);
router.use(authorize('moderator', 'admin'));

router.put('/page', updateGalleryPage);
router.post('/items', createGalleryItem);
router.put('/items/:id', updateGalleryItem);
router.delete('/items/:id', deleteGalleryItem);

router.post('/upload', uploadGalleryImage, handleUploadError, (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'Please upload an image'
    });
  }

  const file = req.file;
  const fileUrl = `/uploads/${file.filename}`;

  res.status(200).json({
    success: true,
    message: 'Image uploaded successfully',
    data: {
      filename: file.filename,
      originalName: file.originalname,
      url: fileUrl,
      size: file.size,
      mimetype: file.mimetype
    }
  });
});

module.exports = router;