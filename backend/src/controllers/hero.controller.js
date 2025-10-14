const Hero = require('../models/Hero.model');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const path = require('path');
const fs = require('fs');
const Translation = require('../models/Translation.model');

// @desc    Get hero content
// @route   GET /api/hero
// @access  Public
exports.getHero = asyncHandler(async (req, res, next) => {
  let hero = await Hero.findOne({ isActive: true });
  
  // If no hero content exists, create default
  if (!hero) {
    hero = await Hero.create({});
  }
  
  res.status(200).json({
    success: true,
    data: hero
  });
});

// @desc    Update hero content
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
    secondaryButtonUrl
  } = req.body;

  const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
  let hero = await Hero.findOne({ isActive: true });
  
  if (!hero) {
    hero = new Hero({});
  }
  
  // Update text fields if provided
  if (badge !== undefined) hero.badge = badge;
  if (heading !== undefined) hero.heading = heading;
  if (description !== undefined) hero.description = description;
  if (imageAlt !== undefined) hero.image.alt = imageAlt;
  
  // Update button configurations
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
  
  // Handle file upload if new file is provided
  if (req.file) {
    // Delete old image if it exists and it's a local upload
    if (hero.image && hero.image.src && hero.image.src.includes('/uploads/')) {
      const filename = hero.image.src.split('/').pop();
      const oldImagePath = path.join(__dirname, '..', 'uploads', filename);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }
    
    // Set new image
    hero.image.src = `${baseUrl}/uploads/${req.file.filename}`;
  }
  
  hero.lastUpdated = Date.now();
  hero.updatedBy = req.user.id;
  
  await hero.save();
  
  res.status(200).json({
    success: true,
    data: hero
  });
});

// @desc    Reset hero to default
// @route   POST /api/hero/reset
// @access  Private (Admin only)
exports.resetHero = asyncHandler(async (req, res, next) => {
  let hero = await Hero.findOne({ isActive: true });
  
  if (hero) {
    // Delete associated image if it's a local upload
    if (hero.image && hero.image.src && hero.image.src.includes('/uploads/')) {
      const filename = hero.image.src.split('/').pop();
      const imagePath = path.join(__dirname, '..', 'uploads', filename);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    await Hero.findByIdAndDelete(hero._id);
  }
  
  // Create new default hero
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
  
  // Deactivate current hero
  await Hero.updateMany({}, { isActive: false });
  
  // Create new hero with restored data
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
  
  // Check if the image is currently being used by the hero
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


// Add this new method
// @desc    Get hero content with translations
// @route   GET /api/hero/:lang?
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

// Update the existing updateHero method to also update translations
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
    // New translation fields
    badgeFr,
    headingFr,
    descriptionFr,
    primaryButtonTextFr,
    secondaryButtonTextFr
  } = req.body;

  const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
  let hero = await Hero.findOne({ isActive: true });
  
  if (!hero) {
    hero = new Hero({});
  }
  
  // Update English content in Hero model (keep as base)
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

  // Update translations in Translation model
  const translationUpdates = [];

  if (badge !== undefined || badgeFr !== undefined) {
    translationUpdates.push({
      key: 'hero.badge',
      en: badge || hero.badge,
      fr: badgeFr || badge || hero.badge
    });
  }

  if (heading !== undefined || headingFr !== undefined) {
    translationUpdates.push({
      key: 'hero.heading',
      en: heading || hero.heading,
      fr: headingFr || heading || hero.heading
    });
  }

  if (description !== undefined || descriptionFr !== undefined) {
    translationUpdates.push({
      key: 'hero.description',
      en: description || hero.description,
      fr: descriptionFr || description || hero.description
    });
  }

  if (primaryButtonText !== undefined || primaryButtonTextFr !== undefined) {
    translationUpdates.push({
      key: 'hero.primary_button',
      en: primaryButtonText || hero.buttons.primary.text,
      fr: primaryButtonTextFr || primaryButtonText || hero.buttons.primary.text
    });
  }

  if (secondaryButtonText !== undefined || secondaryButtonTextFr !== undefined) {
    translationUpdates.push({
      key: 'hero.secondary_button',
      en: secondaryButtonText || hero.buttons.secondary.text,
      fr: secondaryButtonTextFr || secondaryButtonText || hero.buttons.secondary.text
    });
  }

  // Update all translations
  for (const update of translationUpdates) {
    await Translation.findOneAndUpdate(
      { key: update.key },
      {
        key: update.key,
        translations: {
          en: update.en,
          fr: update.fr
        },
        category: 'hero',
        isEditable: true,
        lastUpdated: Date.now(),
        updatedBy: req.user.id
      },
      { upsert: true, new: true }
    );
  }
  
  res.status(200).json({
    success: true,
    data: hero
  });
});