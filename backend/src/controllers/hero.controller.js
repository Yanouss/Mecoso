const Hero = require('../models/Hero.model');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const path = require('path');
const fs = require('fs');
const Translation = require('../models/Translation.model');
const { translateText, detectLanguage } = require('../utils/translationService');


// @desc    Get hero content
// @route   GET /api/hero
// @access  Public
exports.getHero = asyncHandler(async (req, res, next) => {
  let hero = await Hero.findOne({ isActive: true });
  
  if (!hero) {
    hero = await Hero.create({});
  }
  
  res.status(200).json({
    success: true,
    data: hero
  });
});


// @desc    Update hero content with INTELLIGENT AUTO-TRANSLATION & AUTO-CORRECTION
// @route   PUT /api/hero
// @access  Private (Moderator/Admin)
exports.updateHero = asyncHandler(async (req, res, next) => {
  const {
    badge,
    heading,
    description,
    imageAlt,
    primaryButtonText,
    primaryButtonUrl,
    secondaryButtonText,
    secondaryButtonUrl,
  } = req.body;

  const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
  let hero = await Hero.findOne({ isActive: true });
  
  if (!hero) {
    hero = new Hero({});
  }
  
  // Update base content in Hero model
  if (badge !== undefined) hero.badge = badge;
  if (heading !== undefined) hero.heading = heading;
  if (description !== undefined) hero.description = description;
  if (imageAlt !== undefined) hero.image.alt = imageAlt;
  
  if (primaryButtonText !== undefined || primaryButtonUrl !== undefined) {
    if (!hero.buttons) hero.buttons = { primary: {}, secondary: {} };
    if (!hero.buttons.primary) hero.buttons.primary = {};
    
    if (primaryButtonText !== undefined) hero.buttons.primary.text = primaryButtonText;
    if (primaryButtonUrl !== undefined) hero.buttons.primary.url = primaryButtonUrl;
  }
  
  if (secondaryButtonText !== undefined || secondaryButtonUrl !== undefined) {
    if (!hero.buttons) hero.buttons = { primary: {}, secondary: {} };
    if (!hero.buttons.secondary) hero.buttons.secondary = {};
    
    if (secondaryButtonText !== undefined) hero.buttons.secondary.text = secondaryButtonText;
    if (secondaryButtonUrl !== undefined) hero.buttons.secondary.url = secondaryButtonUrl;
  }
  
  // Handle file upload
  if (req.file) {
    if (hero.image && hero.image.src && hero.image.src.includes('/uploads/')) {
      const filename = hero.image.src.split('/').pop();
      const oldImagePath = path.join(__dirname, '..', 'uploads', filename);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }
    hero.image.src = `${baseUrl}/uploads/${req.file.filename}`;
  }
  
  hero.lastUpdated = Date.now();
  hero.updatedBy = req.user.id;
  
  await hero.save();

  // 🧠 INTELLIGENT AUTO-TRANSLATION WITH AUTO-CORRECTION
  const fieldsToTranslate = [
    { key: 'hero.badge', value: badge },
    { key: 'hero.heading', value: heading },
    { key: 'hero.description', value: description },
    { key: 'hero.primary_button', value: primaryButtonText },
    { key: 'hero.secondary_button', value: secondaryButtonText }
  ];

  console.log(`\n🔄 ========== INTELLIGENT TRANSLATION START ==========`);

  let correctedFields = [];

  // Process each field
  for (const field of fieldsToTranslate) {
    if (!field.value) continue;
    
    console.log(`\n📝 Processing: ${field.key}`);
    console.log(`   Input: "${field.value}"`);
    
    // 1. Detect language of the input text
    const inputLang = detectLanguage(field.value);
    console.log(`   Detected input language: ${inputLang.toUpperCase()}`);
    
    // 2. Determine what language we need to translate TO
    const targetLang = inputLang === 'en' ? 'fr' : 'en';
    console.log(`   Will translate to: ${targetLang.toUpperCase()}`);
    
    // 3. Check existing translation in database
    let existingTranslation = await Translation.findOne({ key: field.key });
    
    if (existingTranslation) {
      console.log(`   Found existing translation in database`);
      
      // Check the language of existing EN field
      const existingEnLang = detectLanguage(existingTranslation.translations.en);
      const existingFrLang = detectLanguage(existingTranslation.translations.fr);
      
      console.log(`   Existing EN field language: ${existingEnLang.toUpperCase()}`);
      console.log(`   Existing FR field language: ${existingFrLang.toUpperCase()}`);
      
      // 🔧 AUTO-FIX: If EN contains French or FR contains English, SWAP THEM
      if (existingEnLang === 'fr' && existingFrLang === 'en') {
        console.log(`   🔄 SWAPPING! EN and FR fields are reversed!`);
        const temp = existingTranslation.translations.en;
        existingTranslation.translations.en = existingTranslation.translations.fr;
        existingTranslation.translations.fr = temp;
        correctedFields.push(`${field.key} (swapped)`);
        console.log(`   ✅ Swapped: EN="${existingTranslation.translations.en}" | FR="${existingTranslation.translations.fr}"`);
      }
      
      // 🔧 AUTO-FIX: If EN field contains French, translate it to English
      if (existingEnLang === 'fr' && existingFrLang === 'fr') {
        console.log(`   🔄 Both fields are French! Translating one to English...`);
        const translatedToEn = await translateText(existingTranslation.translations.en, 'en');
        existingTranslation.translations.en = translatedToEn;
        correctedFields.push(`${field.key} (fixed EN)`);
        console.log(`   ✅ Fixed EN field: "${translatedToEn}"`);
      }
      
      // 🔧 AUTO-FIX: If FR field contains English, translate it to French
      if (existingEnLang === 'en' && existingFrLang === 'en') {
        console.log(`   🔄 Both fields are English! Translating one to French...`);
        const translatedToFr = await translateText(existingTranslation.translations.fr, 'fr');
        existingTranslation.translations.fr = translatedToFr;
        correctedFields.push(`${field.key} (fixed FR)`);
        console.log(`   ✅ Fixed FR field: "${translatedToFr}"`);
      }
    }
    
    // 4. Now handle the NEW input and translate it
    console.log(`   🌐 Translating new input to ${targetLang.toUpperCase()}...`);
    const translatedValue = await translateText(field.value, targetLang);
    console.log(`   ✅ Translation: "${translatedValue}"`);
    
    // 5. Verify the translation is correct
    const translatedLang = detectLanguage(translatedValue);
    if (translatedLang !== targetLang) {
      console.warn(`   ⚠️  Translation verification failed! Got ${translatedLang}, expected ${targetLang}`);
      console.warn(`   🔄 Retrying with stronger prompt...`);
      
      // Retry once more
      const retryTranslation = await translateText(field.value, targetLang);
      const retryLang = detectLanguage(retryTranslation);
      
      if (retryLang === targetLang) {
        console.log(`   ✅ Retry successful!`);
        await Translation.findOneAndUpdate(
          { key: field.key },
          {
            key: field.key,
            translations: {
              [inputLang]: field.value,
              [targetLang]: retryTranslation
            },
            category: 'hero',
            isEditable: true,
            lastUpdated: Date.now(),
            updatedBy: req.user.id
          },
          { upsert: true, new: true }
        );
      } else {
        console.warn(`   ⚠️  Retry also failed. Using best attempt.`);
        await Translation.findOneAndUpdate(
          { key: field.key },
          {
            key: field.key,
            translations: {
              [inputLang]: field.value,
              [targetLang]: translatedValue
            },
            category: 'hero',
            isEditable: true,
            lastUpdated: Date.now(),
            updatedBy: req.user.id
          },
          { upsert: true, new: true }
        );
      }
    } else {
      // Save the correct translation
      console.log(`   💾 Saving translation...`);
      await Translation.findOneAndUpdate(
        { key: field.key },
        {
          key: field.key,
          translations: {
            [inputLang]: field.value,
            [targetLang]: translatedValue
          },
          category: 'hero',
          isEditable: true,
          lastUpdated: Date.now(),
          updatedBy: req.user.id
        },
        { upsert: true, new: true }
      );
      console.log(`   ✅ Saved successfully!`);
    }
  }
  
  console.log(`\n✅ ========== TRANSLATION COMPLETED ==========`);
  if (correctedFields.length > 0) {
    console.log(`🔧 Auto-corrected fields: ${correctedFields.join(', ')}`);
  }
  
  res.status(200).json({
    success: true,
    data: hero,
    translationInfo: {
      autoTranslated: true,
      correctedFields: correctedFields.length > 0 ? correctedFields : undefined,
      message: correctedFields.length > 0 
        ? `Successfully translated and auto-corrected ${correctedFields.length} field(s)!`
        : 'Successfully translated all fields!'
    }
  });
});


// @desc    Reset hero to default
// @route   POST /api/hero/reset
// @access  Private (Admin only)
exports.resetHero = asyncHandler(async (req, res, next) => {
  let hero = await Hero.findOne({ isActive: true });
  
  if (hero) {
    if (hero.image && hero.image.src && hero.image.src.includes('/uploads/')) {
      const filename = hero.image.src.split('/').pop();
      const imagePath = path.join(__dirname, '..', 'uploads', filename);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    await Hero.findByIdAndDelete(hero._id);
  }
  
  hero = await Hero.create({
    lastUpdated: Date.now(),
    updatedBy: req.user.id
  });
  
  res.status(200).json({
    success: true,
    message: 'Hero section has been reset to default values',
    data: hero
  });
});

// @desc    Get hero history/versions
// @route   GET /api/hero/history
// @access  Private (Moderator/Admin)
exports.getHeroHistory = asyncHandler(async (req, res, next) => {
  const heroes = await Hero.find()
    .sort({ lastUpdated: -1 })
    .populate('updatedBy', 'name email')
    .limit(10);
  
  res.status(200).json({
    success: true,
    count: heroes.length,
    data: heroes
  });
});

// @desc    Restore hero from history
// @route   PUT /api/hero/restore/:id
// @access  Private (Admin only)
exports.restoreHero = asyncHandler(async (req, res, next) => {
  const heroToRestore = await Hero.findById(req.params.id);
  
  if (!heroToRestore) {
    return next(new ErrorResponse(`Hero version not found with id of ${req.params.id}`, 404));
  }
  
  await Hero.updateMany({}, { isActive: false });
  
  const restoredHero = await Hero.create({
    badge: heroToRestore.badge,
    heading: heroToRestore.heading,
    description: heroToRestore.description,
    image: heroToRestore.image,
    buttons: heroToRestore.buttons,
    isActive: true,
    lastUpdated: Date.now(),
    updatedBy: req.user.id
  });
  
  res.status(200).json({
    success: true,
    message: 'Hero section has been restored from history',
    data: restoredHero
  });
});

// @desc    Upload hero image
// @route   POST /api/hero/upload-image
// @access  Private (Moderator/Admin)
exports.uploadHeroImage = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new ErrorResponse('Please upload an image', 400));
  }
  
  const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
  const imageUrl = `${baseUrl}/uploads/${req.file.filename}`;
  
  res.status(200).json({
    success: true,
    message: 'Image uploaded successfully',
    data: {
      url: imageUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size
    }
  });
});

// @desc    Delete uploaded image
// @route   DELETE /api/hero/delete-image/:filename
// @access  Private (Moderator/Admin)
exports.deleteHeroImage = asyncHandler(async (req, res, next) => {
  const { filename } = req.params;
  
  if (!filename) {
    return next(new ErrorResponse('Please provide a filename', 400));
  }
  
  const imagePath = path.join(__dirname, '..', 'uploads', filename);
  
  if (!fs.existsSync(imagePath)) {
    return next(new ErrorResponse('Image file not found', 404));
  }
  
  const hero = await Hero.findOne({ 
    isActive: true,
    'image.src': { $regex: filename }
  });
  
  if (hero) {
    return next(new ErrorResponse('Cannot delete image that is currently in use by the hero section', 400));
  }
  
  fs.unlinkSync(imagePath);
  
  res.status(200).json({
    success: true,
    message: 'Image deleted successfully'
  });
});


// @desc    Get hero content with translations
// @route   GET /api/hero/:lang
// @access  Public
exports.getHeroWithTranslations = asyncHandler(async (req, res, next) => {
  const lang = req.params.lang || req.query.lang || 'en';
  
  if (!['en', 'fr'].includes(lang)) {
    return next(new ErrorResponse('Invalid language. Supported: en, fr', 400));
  }

  let hero = await Hero.findOne({ isActive: true });
  
  if (!hero) {
    hero = await Hero.create({});
  }

  // Get translations for hero content
  const translationKeys = [
    'hero.badge',
    'hero.heading',
    'hero.description',
    'hero.primary_button',
    'hero.secondary_button'
  ];

  const translations = await Translation.find({ 
    key: { $in: translationKeys } 
  });

  // Build translated response
  const translatedHero = {
    _id: hero._id,
    badge: translations.find(t => t.key === 'hero.badge')?.translations[lang] || hero.badge,
    heading: translations.find(t => t.key === 'hero.heading')?.translations[lang] || hero.heading,
    description: translations.find(t => t.key === 'hero.description')?.translations[lang] || hero.description,
    image: hero.image,
    buttons: {
      primary: {
        text: translations.find(t => t.key === 'hero.primary_button')?.translations[lang] || hero.buttons?.primary?.text,
        url: hero.buttons?.primary?.url
      },
      secondary: {
        text: translations.find(t => t.key === 'hero.secondary_button')?.translations[lang] || hero.buttons?.secondary?.text,
        url: hero.buttons?.secondary?.url
      }
    },
    isActive: hero.isActive,
    lastUpdated: hero.lastUpdated
  };

  res.status(200).json({
    success: true,
    data: translatedHero
  });
});