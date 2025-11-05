const Service = require('../models/Services.model');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const path = require('path');
const fs = require('fs');
const Translation = require('../models/Translation.model');
const { translateText, detectLanguage } = require('../utils/translationService');


const handleServiceTranslations = async (serviceId, serviceData, userId) => {
  console.log(`\n🔄 ========== SERVICE TRANSLATION START ==========`);
  
  const fieldsToTranslate = [
    { key: `service.${serviceId}.title`, value: serviceData.title },
    { key: `service.${serviceId}.description`, value: serviceData.description },
    ...serviceData.features.map((feature, index) => ({
      key: `service.${serviceId}.feature_${index}`,
      value: feature
    }))
  ];

  let correctedFields = [];

  for (const field of fieldsToTranslate) {
    if (!field.value) continue;
    
    console.log(`\n🔍 Processing: ${field.key}`);
    console.log(`   Input: "${field.value}"`);
    
    // Detect language
    const inputLang = detectLanguage(field.value);
    console.log(`   Detected input language: ${inputLang.toUpperCase()}`);
    
    const targetLang = inputLang === 'en' ? 'fr' : 'en';
    console.log(`   Will translate to: ${targetLang.toUpperCase()}`);
    
    // Check existing translation
    let existingTranslation = await Translation.findOne({ key: field.key });
    
    if (existingTranslation) {
      const existingEnLang = detectLanguage(existingTranslation.translations.en);
      const existingFrLang = detectLanguage(existingTranslation.translations.fr);
      
      // Auto-fix swapped fields
      if (existingEnLang === 'fr' && existingFrLang === 'en') {
        console.log(`   🔄 SWAPPING! EN and FR fields are reversed!`);
        const temp = existingTranslation.translations.en;
        existingTranslation.translations.en = existingTranslation.translations.fr;
        existingTranslation.translations.fr = temp;
        correctedFields.push(`${field.key} (swapped)`);
      }
      
      // Auto-fix both French
      if (existingEnLang === 'fr' && existingFrLang === 'fr') {
        console.log(`   🔄 Both fields are French! Translating one to English...`);
        const translatedToEn = await translateText(existingTranslation.translations.en, 'en');
        existingTranslation.translations.en = translatedToEn;
        correctedFields.push(`${field.key} (fixed EN)`);
      }
      
      // Auto-fix both English
      if (existingEnLang === 'en' && existingFrLang === 'en') {
        console.log(`   🔄 Both fields are English! Translating one to French...`);
        const translatedToFr = await translateText(existingTranslation.translations.fr, 'fr');
        existingTranslation.translations.fr = translatedToFr;
        correctedFields.push(`${field.key} (fixed FR)`);
      }
      
      await existingTranslation.save();
    }
    
    // Translate new input
    console.log(`   🌍 Translating new input to ${targetLang.toUpperCase()}...`);
    const translatedValue = await translateText(field.value, targetLang);
    console.log(`   ✅ Translation: "${translatedValue}"`);
    
    // Save translation
    await Translation.findOneAndUpdate(
      { key: field.key },
      {
        key: field.key,
        translations: {
          [inputLang]: field.value,
          [targetLang]: translatedValue
        },
        category: 'services',
        isEditable: true,
        lastUpdated: Date.now(),
        updatedBy: userId
      },
      { upsert: true, new: true }
    );
  }
  
  console.log(`\n✅ ========== TRANSLATION COMPLETED ==========`);
  if (correctedFields.length > 0) {
    console.log(`🔧 Auto-corrected fields: ${correctedFields.join(', ')}`);
  }
  
  return {
    autoTranslated: true,
    correctedFields: correctedFields.length > 0 ? correctedFields : undefined,
    message: correctedFields.length > 0 
      ? `Successfully translated and auto-corrected ${correctedFields.length} field(s)!`
      : 'Successfully translated all fields!'
  };
};

// @desc    Get all services
// @route   GET /api/services
// @access  Public
exports.getServices = asyncHandler(async (req, res, next) => {
  const services = await Service.find({ isActive: true }).sort({ order: 1 });
  
  res.status(200).json({
    success: true,
    count: services.length,
    data: services
  });
});

// @desc    Get single service
// @route   GET /api/services/:id
// @access  Public
exports.getService = asyncHandler(async (req, res, next) => {
  const service = await Service.findById(req.params.id);
  
  if (!service) {
    return next(new ErrorResponse(`Service not found with id of ${req.params.id}`, 404));
  }
  
  res.status(200).json({
    success: true,
    data: service
  });
});

// @desc    Create new service
// @route   POST /api/services
// @access  Private (Moderator/Admin)
exports.createService = asyncHandler(async (req, res, next) => {
  const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
  const count = await Service.countDocuments();
  
  if (!req.file) {
    return next(new ErrorResponse('Please upload an image', 400));
  }
  
  const service = await Service.create({
    ...req.body,
    image: `${baseUrl}/uploads/${req.file.filename}`,
    order: count,
    updatedBy: req.user.id
  });
  
  // 🧠 INTELLIGENT AUTO-TRANSLATION
  const translationInfo = await handleServiceTranslations(
    service._id,
    {
      title: service.title,
      description: service.description,
      features: service.features
    },
    req.user.id
  );
  
  res.status(201).json({
    success: true,
    data: service,
    translationInfo
  });
});

// @desc    Update service
// @route   PUT /api/services/:id
// @access  Private (Moderator/Admin)
exports.updateService = asyncHandler(async (req, res, next) => {
  let service = await Service.findById(req.params.id);
  const baseUrl = process.env.BASE_URL || 'http://localhost:5000';

  if (!service) {
    return next(new ErrorResponse(`Service not found with id of ${req.params.id}`, 404));
  }
  
  const updateData = { 
    ...req.body,
    lastUpdated: Date.now(),
    updatedBy: req.user.id 
  };
  
  if (req.file) {
    if (service.image) {
      const filename = service.image.split('/').pop();
      const oldImagePath = path.join(__dirname, '..', 'uploads', filename);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }
    updateData.image = `${baseUrl}/uploads/${req.file.filename}`;
  }
  
  service = await Service.findByIdAndUpdate(
    req.params.id,
    updateData,
    {
      new: true,
      runValidators: true
    }
  );
  
  // 🧠 INTELLIGENT AUTO-TRANSLATION
  const translationInfo = await handleServiceTranslations(
    service._id,
    {
      title: req.body.title || service.title,
      description: req.body.description || service.description,
      features: req.body.features || service.features
    },
    req.user.id
  );
  
  res.status(200).json({
    success: true,
    data: service,
    translationInfo
  });
});

// @desc    Delete service
// @route   DELETE /api/services/:id
// @access  Private (Moderator/Admin)
exports.deleteService = asyncHandler(async (req, res, next) => {
  const service = await Service.findById(req.params.id);
  
  if (!service) {
    return next(new ErrorResponse(`Service not found with id of ${req.params.id}`, 404));
  }
  
  // Delete associated image
  if (service.image) {
    const filename = service.image.split('/').pop(); // Get just the filename
    const imagePath = path.join(__dirname, '..', 'uploads', filename);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }

  await Service.findByIdAndDelete(req.params.id);
  
  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Reorder services
// @route   PUT /api/services/reorder
// @access  Private (Moderator/Admin)
exports.reorderServices = asyncHandler(async (req, res, next) => {
  const { services } = req.body;
  
  if (!services || !Array.isArray(services)) {
    return next(new ErrorResponse('Please provide an array of services with ids and orders', 400));
  }
  
  const bulkOps = services.map(service => ({
    updateOne: {
      filter: { _id: service.id },
      update: { 
        order: service.order,
        lastUpdated: Date.now(),
        updatedBy: req.user.id
      }
    }
  }));
  
  await Service.bulkWrite(bulkOps);
  
  const updatedServices = await Service.find().sort({ order: 1 });
  
  res.status(200).json({
    success: true,
    data: updatedServices
  });
});


exports.getServiceWithTranslations = asyncHandler(async (req, res, next) => {
  const lang = req.params.lang || req.query.lang || 'en';
  const serviceId = req.params.id;
  
  if (!['en', 'fr'].includes(lang)) {
    return next(new ErrorResponse('Invalid language. Supported: en, fr', 400));
  }

  const service = await Service.findById(serviceId);
  
  if (!service) {
    return next(new ErrorResponse(`Service not found with id of ${serviceId}`, 404));
  }

  // Get translations
  const translationKeys = [
    `service.${serviceId}.title`,
    `service.${serviceId}.description`,
    ...service.features.map((_, index) => `service.${serviceId}.feature_${index}`)
  ];

  const translations = await Translation.find({ 
    key: { $in: translationKeys } 
  });

  // Build translated response
  const translatedService = {
    ...service.toObject(),
    title: translations.find(t => t.key === `service.${serviceId}.title`)?.translations[lang] || service.title,
    description: translations.find(t => t.key === `service.${serviceId}.description`)?.translations[lang] || service.description,
    features: service.features.map((feature, index) => {
      const trans = translations.find(t => t.key === `service.${serviceId}.feature_${index}`);
      return trans?.translations[lang] || feature;
    })
  };

  res.status(200).json({
    success: true,
    data: translatedService
  });
});

// ADD new endpoint to get all services with translations
exports.getServicesWithTranslations = asyncHandler(async (req, res, next) => {
  const lang = req.query.lang || 'en';
  
  if (!['en', 'fr'].includes(lang)) {
    return next(new ErrorResponse('Invalid language. Supported: en, fr', 400));
  }

  const services = await Service.find({ isActive: true }).sort({ order: 1 });
  
  // Get all translation keys for all services
  const allTranslationKeys = services.flatMap(service => [
    `service.${service._id}.title`,
    `service.${service._id}.description`,
    ...service.features.map((_, index) => `service.${service._id}.feature_${index}`)
  ]);

  const translations = await Translation.find({ 
    key: { $in: allTranslationKeys } 
  });

  // Build translated services
  const translatedServices = services.map(service => {
    const serviceId = service._id;
    return {
      ...service.toObject(),
      title: translations.find(t => t.key === `service.${serviceId}.title`)?.translations[lang] || service.title,
      description: translations.find(t => t.key === `service.${serviceId}.description`)?.translations[lang] || service.description,
      features: service.features.map((feature, index) => {
        const trans = translations.find(t => t.key === `service.${serviceId}.feature_${index}`);
        return trans?.translations[lang] || feature;
      })
    };
  });

  res.status(200).json({
    success: true,
    count: translatedServices.length,
    data: translatedServices
  });
});