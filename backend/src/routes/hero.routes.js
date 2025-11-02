const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const {
  getHero,
  updateHero,
  resetHero,
  getHeroHistory,
  restoreHero,
  uploadHeroImage,
  deleteHeroImage,
  getHeroWithTranslations
} = require('../controllers/hero.controller');
const { protect, authorize } = require('../middleware/auth');
const { testGeminiAPI } = require('../utils/translationService');
const { translateText, detectLanguage } = require('../utils/translationService');
const Translation = require('../models/Translation.model');


const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer configuration for hero image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '..', 'uploads');
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `hero-${uniqueSuffix}${ext}`);
  }
});


// File filter for images only
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedTypes = [
    // Images
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',

    // Videos
    'video/mp4',
    'video/webm',
    'video/ogg',
    'video/quicktime', // .mov
    'video/x-msvideo', // .avi
    'video/x-matroska', // .mkv
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        'Invalid file type. Only images (JPEG, PNG, GIF, WebP) and videos (MP4, WebM, OGG, MOV, AVI, MKV) are allowed.'
      ),
      false
    );
  }
};


// Multer upload configuration
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 200 * 1024 * 1024, // 200MB limit
  },
  fileFilter: fileFilter
});

// Error handling middleware for multer
const handleMulterError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 200MB.'
      });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected field. Only image uploads are allowed.'
      });
    }
  }
  
  if (error.message.includes('Invalid file type')) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
  
  next(error);
};

// Public routes
router.get('/', getHero);

// Protected routes (Moderator/Admin only)
router.put('/', protect, authorize('moderator', 'admin'), upload.single('image'), handleMulterError, updateHero);

// Admin only routes
router.post('/reset', protect, authorize('admin'), resetHero);
router.get('/history', protect, authorize('moderator', 'admin'), getHeroHistory);
router.put('/restore/:id', protect, authorize('admin'), restoreHero);

// Image management routes
router.post('/upload-image', protect, authorize('moderator', 'admin'), upload.single('image'), handleMulterError, uploadHeroImage);
router.delete('/delete-image/:filename', protect, authorize('moderator', 'admin'), deleteHeroImage);

// Additional utility routes for better management

// @desc    Get hero statistics
// @route   GET /api/hero/stats
// @access  Private (Moderator/Admin)
router.get('/stats', protect, authorize('moderator', 'admin'), async (req, res) => {
  try {
    const Hero = require('../models/Hero.model');
    
    const totalVersions = await Hero.countDocuments();
    const activeHero = await Hero.findOne({ isActive: true });
    const lastUpdated = activeHero ? activeHero.lastUpdated : null;
    const lastUpdatedBy = activeHero ? activeHero.updatedBy : null;
    
    // Get popular button configurations
    const buttonStats = await Hero.aggregate([
      {
        $group: {
          _id: {
            primaryText: '$buttons.primary.text',
            secondaryText: '$buttons.secondary.text'
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        totalVersions,
        isActive: !!activeHero,
        lastUpdated,
        lastUpdatedBy,
        buttonConfigurations: buttonStats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching hero statistics'
    });
  }
});

// @desc    Validate hero data
// @route   POST /api/hero/validate
// @access  Private (Moderator/Admin)
router.post('/validate', protect, authorize('moderator', 'admin'), async (req, res) => {
  try {
    const { heading, description, buttons } = req.body;
    const errors = [];
    
    // Validate required fields
    if (!heading || heading.trim().length < 5) {
      errors.push('Heading must be at least 5 characters long');
    }
    
    if (!description || description.trim().length < 20) {
      errors.push('Description must be at least 20 characters long');
    }
    
    // Validate button URLs
    if (buttons?.primary?.url && !isValidUrl(buttons.primary.url)) {
      errors.push('Primary button URL is not valid');
    }
    
    if (buttons?.secondary?.url && !isValidUrl(buttons.secondary.url)) {
      errors.push('Secondary button URL is not valid');
    }
    
    res.status(200).json({
      success: true,
      isValid: errors.length === 0,
      errors
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error validating hero data'
    });
  }
});

// Helper function to validate URLs
function isValidUrl(string) {
  try {
    // Allow relative paths
    if (string.startsWith('/')) return true;
    
    // Allow full URLs
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

// @desc    Backup hero data
// @route   GET /api/hero/backup
// @access  Private (Admin only)
router.get('/backup', protect, authorize('admin'), async (req, res) => {
  try {
    const Hero = require('../models/Hero.model');
    const heroes = await Hero.find().sort({ lastUpdated: -1 });
    
    const backup = {
      exportDate: new Date().toISOString(),
      totalRecords: heroes.length,
      data: heroes
    };
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=hero-backup-${Date.now()}.json`);
    res.status(200).json(backup);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating backup'
    });
  }
});

router.get('/test-translation', async (req, res) => {
  try {
    const { translateText } = require('../utils/translationService');
    
    const testText = 'Hello world';
    const translation = await translateText(testText, 'fr');
    
    res.json({
      success: true,
      original: testText,
      translated: translation,
      apiKeyPresent: !!process.env.GEMINI_API_KEY,
      apiKeyLength: process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.length : 0
    });
  } catch (error) {
    res.json({
      success: false,
      error: error.message,
      apiKeyPresent: !!process.env.GEMINI_API_KEY
    });
  }
});



// @desc    Fix all broken translations (swaps EN/FR if wrong, re-translates if needed)
// @route   POST /api/hero/fix-translations
// @access  Private (Admin/Moderator)
router.post('/fix-translations', protect, authorize('moderator', 'admin'), async (req, res) => {
  try {
    console.log('\n🔧 ========== FIXING ALL HERO TRANSLATIONS ==========\n');
    
    const heroTranslations = await Translation.find({ category: 'hero' });
    const fixedFields = [];
    const report = [];
    
    for (const trans of heroTranslations) {
      console.log(`\n📝 Checking: ${trans.key}`);
      console.log(`   EN: "${trans.translations.en}"`);
      console.log(`   FR: "${trans.translations.fr}"`);
      
      const enLang = detectLanguage(trans.translations.en);
      const frLang = detectLanguage(trans.translations.fr);
      
      console.log(`   EN field detected as: ${enLang.toUpperCase()}`);
      console.log(`   FR field detected as: ${frLang.toUpperCase()}`);
      
      let fixed = false;
      let action = '';
      
      // Case 1: Both are same language (need to translate one)
      if (enLang === frLang) {
        console.log(`   ⚠️  Both fields are ${enLang.toUpperCase()}!`);
        
        if (enLang === 'fr') {
          // Both French - translate EN to English
          console.log(`   🔄 Translating EN field to English...`);
          const translatedToEn = await translateText(trans.translations.en, 'en');
          trans.translations.en = translatedToEn;
          action = 'Translated EN to English';
          console.log(`   ✅ New EN: "${translatedToEn}"`);
        } else {
          // Both English - translate FR to French
          console.log(`   🔄 Translating FR field to French...`);
          const translatedToFr = await translateText(trans.translations.fr, 'fr');
          trans.translations.fr = translatedToFr;
          action = 'Translated FR to French';
          console.log(`   ✅ New FR: "${translatedToFr}"`);
        }
        fixed = true;
      }
      
      // Case 2: EN contains French and FR contains English (swapped)
      else if (enLang === 'fr' && frLang === 'en') {
        console.log(`   🔄 SWAPPING! Fields are reversed!`);
        const temp = trans.translations.en;
        trans.translations.en = trans.translations.fr;
        trans.translations.fr = temp;
        action = 'Swapped EN ↔ FR';
        console.log(`   ✅ Swapped successfully!`);
        fixed = true;
      }
      
      // Case 3: EN is French but FR is correct
      else if (enLang === 'fr' && frLang === 'fr') {
        console.log(`   🔄 EN field is French, translating to English...`);
        const translatedToEn = await translateText(trans.translations.en, 'en');
        trans.translations.en = translatedToEn;
        action = 'Fixed EN field';
        console.log(`   ✅ New EN: "${translatedToEn}"`);
        fixed = true;
      }
      
      // Case 4: FR is English but EN is correct
      else if (enLang === 'en' && frLang === 'en') {
        console.log(`   🔄 FR field is English, translating to French...`);
        const translatedToFr = await translateText(trans.translations.fr, 'fr');
        trans.translations.fr = translatedToFr;
        action = 'Fixed FR field';
        console.log(`   ✅ New FR: "${translatedToFr}"`);
        fixed = true;
      }
      
      // Save if fixed
      if (fixed) {
        await trans.save();
        fixedFields.push(trans.key);
        report.push({
          key: trans.key,
          action: action,
          en: trans.translations.en,
          fr: trans.translations.fr
        });
        console.log(`   💾 Saved!`);
      } else {
        console.log(`   ✅ Already correct!`);
        report.push({
          key: trans.key,
          action: 'Already correct',
          en: trans.translations.en,
          fr: trans.translations.fr
        });
      }
    }
    
    console.log(`\n✅ ========== FIX COMPLETED ==========`);
    console.log(`Fixed ${fixedFields.length} fields: ${fixedFields.join(', ')}`);
    
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



router.get('/:lang', getHeroWithTranslations);

module.exports = router;