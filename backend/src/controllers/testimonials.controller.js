const Testimonial = require('../models/Testimonials.model');
const Translation = require('../models/Translation.model');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const { translateText, detectLanguage } = require('../utils/translationService');
const path = require('path');
const fs = require('fs');

const handleTestimonialTranslations = async (testimonialId, testimonialData, userId) => {
  console.log(`\n📄 ========== TESTIMONIAL TRANSLATION START ==========`);
  
  const fieldsToTranslate = [
    { key: `testimonial.${testimonialId}.name`, value: testimonialData.name },
    { key: `testimonial.${testimonialId}.role`, value: testimonialData.role },
    { key: `testimonial.${testimonialId}.company`, value: testimonialData.company },
    { key: `testimonial.${testimonialId}.content`, value: testimonialData.content }
  ];

  let correctedFields = [];

  for (const field of fieldsToTranslate) {
    if (!field.value) continue;
    
    console.log(`\n🔍 Processing: ${field.key}`);
    console.log(`   Input: "${field.value}"`);
    
    const inputLang = detectLanguage(field.value);
    console.log(`   Detected input language: ${inputLang.toUpperCase()}`);
    
    const targetLang = inputLang === 'en' ? 'fr' : 'en';
    console.log(`   Will translate to: ${targetLang.toUpperCase()}`);
    
    let existingTranslation = await Translation.findOne({ key: field.key });
    
    if (existingTranslation) {
      const existingEnLang = detectLanguage(existingTranslation.translations.en);
      const existingFrLang = detectLanguage(existingTranslation.translations.fr);
      
      if (existingEnLang === 'fr' && existingFrLang === 'en') {
        console.log(`   🔄 SWAPPING! EN and FR fields are reversed!`);
        const temp = existingTranslation.translations.en;
        existingTranslation.translations.en = existingTranslation.translations.fr;
        existingTranslation.translations.fr = temp;
        correctedFields.push(`${field.key} (swapped)`);
      }
      
      if (existingEnLang === 'fr' && existingFrLang === 'fr') {
        console.log(`   🔄 Both fields are French! Translating one to English...`);
        const translatedToEn = await translateText(existingTranslation.translations.en, 'en');
        existingTranslation.translations.en = translatedToEn;
        correctedFields.push(`${field.key} (fixed EN)`);
      }
      
      if (existingEnLang === 'en' && existingFrLang === 'en') {
        console.log(`   🔄 Both fields are English! Translating one to French...`);
        const translatedToFr = await translateText(existingTranslation.translations.fr, 'fr');
        existingTranslation.translations.fr = translatedToFr;
        correctedFields.push(`${field.key} (fixed FR)`);
      }
      
      await existingTranslation.save();
    }
    
    console.log(`   🌐 Translating new input to ${targetLang.toUpperCase()}...`);
    const translatedValue = await translateText(field.value, targetLang);
    console.log(`   ✅ Translation: "${translatedValue}"`);
    
    await Translation.findOneAndUpdate(
      { key: field.key },
      {
        key: field.key,
        translations: {
          [inputLang]: field.value,
          [targetLang]: translatedValue
        },
        category: 'testimonials',
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

// @desc    Get all testimonials
// @route   GET /api/testimonials
// @access  Public
exports.getTestimonials = asyncHandler(async (req, res, next) => {
  const testimonials = await Testimonial.find({ isActive: true }).sort({ createdAt: -1 });
  
  res.status(200).json({
    success: true,
    count: testimonials.length,
    data: testimonials
  });
});

// @desc    Get single testimonial
// @route   GET /api/testimonials/:id
// @access  Public
exports.getTestimonial = asyncHandler(async (req, res, next) => {
  const testimonial = await Testimonial.findById(req.params.id);
  
  if (!testimonial) {
    return next(new ErrorResponse(`Testimonial not found with id of ${req.params.id}`, 404));
  }
  
  res.status(200).json({
    success: true,
    data: testimonial
  });
});

// @desc    Create new testimonial
// @route   POST /api/testimonials
// @access  Private (Moderator/Admin)
exports.createTestimonial = asyncHandler(async (req, res, next) => {
  const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
  
  if (!req.file) {
    return next(new ErrorResponse('Please upload an image', 400));
  }
  
  const testimonial = await Testimonial.create({
    ...req.body,
    image: `${baseUrl}/uploads/${req.file.filename}`,
    updatedBy: req.user.id
  });
  
  const translationInfo = await handleTestimonialTranslations(
    testimonial._id,
    {
      name: testimonial.name,
      role: testimonial.role,
      company: testimonial.company,
      content: testimonial.content
    },
    req.user.id
  );
  
  res.status(201).json({
    success: true,
    data: testimonial,
    translationInfo
  });
});

// @desc    Update testimonial
// @route   PUT /api/testimonials/:id
// @access  Private (Moderator/Admin)
exports.updateTestimonial = asyncHandler(async (req, res, next) => {
  let testimonial = await Testimonial.findById(req.params.id);
  const baseUrl = process.env.BASE_URL || 'http://localhost:5000';

  if (!testimonial) {
    return next(new ErrorResponse(`Testimonial not found with id of ${req.params.id}`, 404));
  }
  
  const updateData = { 
    ...req.body,
    lastUpdated: Date.now(),
    updatedBy: req.user.id 
  };
  
  if (req.file) {
    if (testimonial.image) {
      const filename = testimonial.image.split('/').pop();
      const oldImagePath = path.join(__dirname, '..', 'uploads', filename);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }
    updateData.image = `${baseUrl}/uploads/${req.file.filename}`;
  }
  
  testimonial = await Testimonial.findByIdAndUpdate(
    req.params.id,
    updateData,
    {
      new: true,
      runValidators: true
    }
  );
  
  const translationInfo = await handleTestimonialTranslations(
    testimonial._id,
    {
      name: req.body.name || testimonial.name,
      role: req.body.role || testimonial.role,
      company: req.body.company || testimonial.company,
      content: req.body.content || testimonial.content
    },
    req.user.id
  );
  
  res.status(200).json({
    success: true,
    data: testimonial,
    translationInfo
  });
});

// @desc    Delete testimonial
// @route   DELETE /api/testimonials/:id
// @access  Private (Moderator/Admin)
exports.deleteTestimonial = asyncHandler(async (req, res, next) => {
  const testimonial = await Testimonial.findById(req.params.id);
  
  if (!testimonial) {
    return next(new ErrorResponse(`Testimonial not found with id of ${req.params.id}`, 404));
  }
  
  if (testimonial.image) {
    const filename = testimonial.image.split('/').pop();
    const imagePath = path.join(__dirname, '..', 'uploads', filename);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }

  await Testimonial.findByIdAndDelete(req.params.id);
  
  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get testimonials with translations
// @route   GET /api/testimonials/translated
// @access  Public
exports.getTestimonialsWithTranslations = asyncHandler(async (req, res, next) => {
  const lang = req.query.lang || 'en';
  
  if (!['en', 'fr'].includes(lang)) {
    return next(new ErrorResponse('Invalid language. Supported: en, fr', 400));
  }

  const testimonials = await Testimonial.find({ isActive: true }).sort({ createdAt: -1 });
  
  const allTranslationKeys = testimonials.flatMap(testimonial => [
    `testimonial.${testimonial._id}.name`,
    `testimonial.${testimonial._id}.role`,
    `testimonial.${testimonial._id}.company`,
    `testimonial.${testimonial._id}.content`
  ]);

  const translations = await Translation.find({ 
    key: { $in: allTranslationKeys } 
  });

  const translatedTestimonials = testimonials.map(testimonial => {
    const testimonialId = testimonial._id;
    return {
      ...testimonial.toObject(),
      name: translations.find(t => t.key === `testimonial.${testimonialId}.name`)?.translations[lang] || testimonial.name,
      role: translations.find(t => t.key === `testimonial.${testimonialId}.role`)?.translations[lang] || testimonial.role,
      company: translations.find(t => t.key === `testimonial.${testimonialId}.company`)?.translations[lang] || testimonial.company,
      content: translations.find(t => t.key === `testimonial.${testimonialId}.content`)?.translations[lang] || testimonial.content
    };
  });

  res.status(200).json({
    success: true,
    count: translatedTestimonials.length,
    data: translatedTestimonials
  });
});

// @desc    Get single testimonial with translations
// @route   GET /api/testimonials/:id/:lang
// @access  Public
exports.getTestimonialWithTranslations = asyncHandler(async (req, res, next) => {
  const lang = req.params.lang || req.query.lang || 'en';
  const testimonialId = req.params.id;
  
  if (!['en', 'fr'].includes(lang)) {
    return next(new ErrorResponse('Invalid language. Supported: en, fr', 400));
  }

  const testimonial = await Testimonial.findById(testimonialId);
  
  if (!testimonial) {
    return next(new ErrorResponse(`Testimonial not found with id of ${testimonialId}`, 404));
  }

  const translationKeys = [
    `testimonial.${testimonialId}.name`,
    `testimonial.${testimonialId}.role`,
    `testimonial.${testimonialId}.company`,
    `testimonial.${testimonialId}.content`
  ];

  const translations = await Translation.find({ 
    key: { $in: translationKeys } 
  });

  const translatedTestimonial = {
    ...testimonial.toObject(),
    name: translations.find(t => t.key === `testimonial.${testimonialId}.name`)?.translations[lang] || testimonial.name,
    role: translations.find(t => t.key === `testimonial.${testimonialId}.role`)?.translations[lang] || testimonial.role,
    company: translations.find(t => t.key === `testimonial.${testimonialId}.company`)?.translations[lang] || testimonial.company,
    content: translations.find(t => t.key === `testimonial.${testimonialId}.content`)?.translations[lang] || testimonial.content
  };

  res.status(200).json({
    success: true,
    data: translatedTestimonial
  });
});

// @desc    Reorder testimonials
// @route   PUT /api/testimonials/reorder
// @access  Private (Moderator/Admin)
exports.reorderTestimonials = asyncHandler(async (req, res, next) => {
  const { orderedIds } = req.body;

  if (!orderedIds || !Array.isArray(orderedIds)) {
    return next(new ErrorResponse('Please provide an array of testimonial IDs in the desired order', 400));
  }

  // Update the order of testimonials
  for (let i = 0; i < orderedIds.length; i++) {
    await Testimonial.findByIdAndUpdate(
      orderedIds[i],
      { order: i + 1 },
      { new: true }
    );
  }

  // You might need to add an 'order' field to your Testimonial model
  // or use a different approach for ordering

  res.status(200).json({
    success: true,
    message: 'Testimonials reordered successfully'
  });
});