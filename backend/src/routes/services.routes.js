const express = require('express');
const {
  getServices,
  getService,
  createService,
  updateService,
  deleteService,
  reorderServices,
  getServiceWithTranslations,
  getServicesWithTranslations
} = require('../controllers/services.controller');
const { protect, authorize } = require('../middleware/auth');
const { uploadServiceImage } = require('../middleware/upload');

const router = express.Router();

// Base routes - Get all and Create
router
  .route('/')
  .get(getServices)
  .post(protect, authorize('moderator', 'admin'), uploadServiceImage, createService);

// Reorder route
router
  .route('/reorder')
  .put(protect, authorize('moderator', 'admin'), reorderServices);

// ✅ CRITICAL: Translation routes MUST come BEFORE /:id routes
// Get all services with translations (public)
router.get('/translated', getServicesWithTranslations);

// Fix translations route (admin only)
router.post('/fix-translations', protect, authorize('moderator', 'admin'), async (req, res) => {
  try {
    const Translation = require('../models/Translation.model');
    const Service = require('../models/Services.model');
    const { detectLanguage, translateText } = require('../utils/translationService');
    
    console.log('\n🔧 ========== FIXING ALL SERVICE TRANSLATIONS ==========\n');
    
    const services = await Service.find({ isActive: true });
    const fixedFields = [];
    const report = [];
    
    for (const service of services) {
      const translationKeys = [
        `service.${service._id}.title`,
        `service.${service._id}.description`,
        ...service.features.map((_, index) => `service.${service._id}.feature_${index}`)
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

// ⚠️ IMPORTANT: /:id routes MUST come AFTER all specific routes
// Individual service routes - Get, Update, Delete
router
  .route('/:id')
  .get(getService)
  .put(protect, authorize('moderator', 'admin'), uploadServiceImage, updateService)
  .delete(protect, authorize('moderator', 'admin'), deleteService);

// Get single service with translations (public)
// This also uses :id but with :lang parameter, so it's more specific
router.get('/:id/:lang', getServiceWithTranslations);

module.exports = router;