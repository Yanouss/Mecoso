const express = require('express');
const {
  getMachinesPage,
  updateMachinesPage,
  getMachines,
  getMachine,
  createMachine,
  updateMachine,
  deleteMachine,
  uploadMachineImage,
  getMachineCategories,
  getMachineStatistics
} = require('../controllers/machines.controller');

const { uploadMachineImage: uploadMiddleware, handleUploadError } = require('../middleware/upload');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/page', getMachinesPage);
router.get('/categories', getMachineCategories);
router.get('/statistics', getMachineStatistics);
router.get('/', getMachines);
router.get('/:id', getMachine);

// Protected routes (require authentication and moderator role)
router.use(protect); // Apply authentication to all routes below
router.use(authorize('moderator', 'admin')); // Apply authorization to all routes below

router.put('/page', updateMachinesPage);
router.post('/', createMachine);
router.put('/:id', updateMachine);
router.delete('/:id', deleteMachine);

// Fix the upload route - use the correct middleware
router.post('/upload', uploadMiddleware, handleUploadError, uploadMachineImage);

module.exports = router;