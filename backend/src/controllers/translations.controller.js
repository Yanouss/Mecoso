const Translation = require('../models/Translation.model');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all translations
// @route   GET /api/translations
// @access  Public
exports.getTranslations = asyncHandler(async (req, res, next) => {
  const { category, format } = req.query;
  
  let query = {};
  if (category) {
    query.category = category;
  }
  
  const translations = await Translation.find(query, { key: 1, translations: 1, category: 1, _id: 0 });
  
  // Format for frontend consumption
  if (format === 'frontend') {
    const formatted = {
      en: {},
      fr: {}
    };
    
    translations.forEach(item => {
      formatted.en[item.key] = item.translations.en;
      formatted.fr[item.key] = item.translations.fr;
    });
    
    return res.status(200).json({
      success: true,
      data: formatted
    });
  }
  
  res.status(200).json({
    success: true,
    count: translations.length,
    data: translations
  });
});

// @desc    Create new translation
// @route   POST /api/translations
// @access  Private (Moderator/Admin)
exports.createTranslation = asyncHandler(async (req, res, next) => {
  const { key, translations, category } = req.body;
  
  // Validation
  if (!key || !translations || !translations.en || !translations.fr) {
    return next(new ErrorResponse('Key and translations for both languages are required', 400));
  }
  
  // Check if key already exists
  const existingTranslation = await Translation.findOne({ key });
  if (existingTranslation) {
    return next(new ErrorResponse('Translation key already exists', 400));
  }
  
  const translation = await Translation.create({
    key,
    translations,
    category: category || 'common',
    updatedBy: req.user.id
  });
  
  res.status(201).json({
    success: true,
    data: translation
  });
});

// @desc    Update translation
// @route   PUT /api/translations/:key
// @access  Private (Moderator/Admin)
exports.updateTranslation = asyncHandler(async (req, res, next) => {
  const { key } = req.params;
  const { translations, category } = req.body;
  
  let translation = await Translation.findOne({ key });
  
  if (!translation) {
    return next(new ErrorResponse(`Translation not found with key ${key}`, 404));
  }
  
  // Check if translation is editable
  if (!translation.isEditable) {
    return next(new ErrorResponse('This translation is not editable', 403));
  }
  
  // Update fields
  if (translations) {
    if (translations.en) translation.translations.en = translations.en;
    if (translations.fr) translation.translations.fr = translations.fr;
  }
  
  if (category) translation.category = category;
  
  translation.lastUpdated = Date.now();
  translation.updatedBy = req.user.id;
  
  await translation.save();
  
  res.status(200).json({
    success: true,
    data: translation
  });
});

// @desc    Delete translation
// @route   DELETE /api/translations/:key
// @access  Private (Admin only)
exports.deleteTranslation = asyncHandler(async (req, res, next) => {
  const { key } = req.params;
  
  const translation = await Translation.findOne({ key });
  
  if (!translation) {
    return next(new ErrorResponse(`Translation not found with key ${key}`, 404));
  }
  
  // Check if translation is editable
  if (!translation.isEditable) {
    return next(new ErrorResponse('This translation cannot be deleted', 403));
  }
  
  await Translation.findOneAndDelete({ key });
  
  res.status(200).json({
    success: true,
    message: 'Translation deleted successfully'
  });
});

// @desc    Import translations from JSON
// @route   POST /api/translations/import
// @access  Private (Admin only)
exports.importTranslations = asyncHandler(async (req, res, next) => {
  const { translations, overwrite = false } = req.body;
  
  if (!translations || typeof translations !== 'object') {
    return next(new ErrorResponse('Invalid translations data', 400));
  }
  
  const results = {
    created: 0,
    updated: 0,
    skipped: 0,
    errors: []
  };
  
  for (const [key, data] of Object.entries(translations)) {
    try {
      const existingTranslation = await Translation.findOne({ key });
      
      if (existingTranslation && !overwrite) {
        results.skipped++;
        continue;
      }
      
      if (existingTranslation && overwrite) {
        existingTranslation.translations = data.translations;
        existingTranslation.category = data.category || existingTranslation.category;
        existingTranslation.lastUpdated = Date.now();
        existingTranslation.updatedBy = req.user.id;
        await existingTranslation.save();
        results.updated++;
      } else {
        await Translation.create({
          key,
          translations: data.translations,
          category: data.category || 'common',
          updatedBy: req.user.id
        });
        results.created++;
      }
    } catch (error) {
      results.errors.push(`Error processing key "${key}": ${error.message}`);
    }
  }
  
  res.status(200).json({
    success: true,
    message: 'Translation import completed',
    results
  });
});

// @desc    Export translations to JSON
// @route   GET /api/translations/export
// @access  Public
exports.exportTranslations = asyncHandler(async (req, res, next) => {
  const { category } = req.query;
  
  let query = {};
  if (category) {
    query.category = category;
  }
  
  const translations = await Translation.find(query);
  
  const exportData = {
    exportDate: new Date().toISOString(),
    totalCount: translations.length,
    data: {}
  };
  
  translations.forEach(item => {
    exportData.data[item.key] = {
      translations: item.translations,
      category: item.category
    };
  });
  
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename=translations-${Date.now()}.json`);
  
  res.status(200).json(exportData);
});