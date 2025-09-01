const express = require('express');
const {
  getServices,
  getService,
  createService,
  updateService,
  deleteService,
  reorderServices
} = require('../controllers/services.controller');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .get(getServices)
  .post(protect, authorize('moderator', 'admin'), createService);

router
  .route('/reorder')
  .put(protect, authorize('moderator', 'admin'), reorderServices);

router
  .route('/:id')
  .get(getService)
  .put(protect, authorize('moderator', 'admin'), updateService)
  .delete(protect, authorize('moderator', 'admin'), deleteService);

module.exports = router;