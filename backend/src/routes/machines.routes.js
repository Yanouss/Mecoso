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
  getMachineStatistics,
  getMachineWithTranslations,
  getMachinesWithTranslations
} = require('../controllers/machines.controller');

const { uploadMachineImage: uploadMiddleware, handleUploadError } = require('../middleware/upload');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/page', getMachinesPage);
router.get('/categories', getMachineCategories);
router.get('/statistics', getMachineStatistics);

// ✅ CRITICAL: Translation routes MUST come BEFORE /:id routes
// Get all machines with translations (public)
router.get('/translated', getMachinesWithTranslations);

// Fix translations route (admin only)
router.post('/fix-translations', protect, authorize('moderator', 'admin'), async (req, res) => {
  try {
    const Translation = require('../models/Translation.model');
    const Machine = require('../models/Machines.model');
    const { detectLanguage, translateText } = require('../utils/translationService');
    
    console.log('\n🔧 ========== FIXING ALL MACHINE TRANSLATIONS ==========\n');
    
    const machines = await Machine.find();
    const fixedFields = [];
    const report = [];
    
    for (const machine of machines) {
      const translationKeys = [
        `machine.${machine._id}.title`,
        `machine.${machine._id}.description`,
        ...machine.specifications.map((_, index) => `machine.${machine._id}.spec_${index}`),
        `machine.${machine._id}.capacity`,
        `machine.${machine._id}.powerRequirement`,
        `machine.${machine._id}.model`
      ];
      
      const translations = await Translation.find({ key: { $in: translationKeys } });
      
      for (const trans of translations) {
        console.log(`\n🔍 Checking: ${trans.key}`);
        
        const enLang = detectLanguage(trans.translations.en);
        const frLang = detectLanguage(trans.translations.fr);
        
        let fixed = false;
        let action = '';
        
        if (enLang === frLang) {
          if (enLang === 'fr') {
            const translatedToEn = await translateText(trans.translations.en, 'en');
            trans.translations.en = translatedToEn;
            action = 'Translated EN to English';
          } else {
            const translatedToFr = await translateText(trans.translations.fr, 'fr');
            trans.translations.fr = translatedToFr;
            action = 'Translated FR to French';
          }
          fixed = true;
        } else if (enLang === 'fr' && frLang === 'en') {
          const temp = trans.translations.en;
          trans.translations.en = trans.translations.fr;
          trans.translations.fr = temp;
          action = 'Swapped EN ↔ FR';
          fixed = true;
        }
        
        if (fixed) {
          await trans.save();
          fixedFields.push(trans.key);
          report.push({
            key: trans.key,
            action: action,
            en: trans.translations.en,
            fr: trans.translations.fr
          });
        }
      }
    }
    
    console.log(`\n✅ ========== FIX COMPLETED ==========`);
    
    res.status(200).json({
      success: true,
      message: `Fixed ${fixedFields.length} translation(s)`,
      fixedFields,
      report
    });
    
  } catch (error) {
    console.error('Error fixing translations:', error);
    res.status(500).json({
      success: false,
      message: 'Error fixing translations',
      error: error.message
    });
  }
});

// Regular routes
router.get('/', getMachines);

// ⚠️ IMPORTANT: /:id routes MUST come AFTER all specific routes
router.get('/:id', getMachine);

// Get single machine with translations (public)
// This also uses :id but with :lang parameter, so it's more specific
router.get('/:id/:lang', getMachineWithTranslations);

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