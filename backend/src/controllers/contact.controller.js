const Contact = require('../models/Contact.model');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const Translation = require('../models/Translation.model');
const { translateText, detectLanguage } = require('../utils/translationService');


// @desc    Get contact information
// @route   GET /api/contact
// @access  Public
exports.getContact = asyncHandler(async (req, res, next) => {
  // Get the latest contact info or create default if none exists
  let contact = await Contact.findOne().sort({ createdAt: -1 });
  
  if (!contact) {
    // Create default contact information
    contact = await Contact.create({
      badge: "Get In Touch",
      heading: "Let's Build Something Amazing Together",
      description: "Ready to start your next construction project? Our expert team is here to turn your vision into reality with professional consultation and tailored solutions.",
      contactInfo: [
        {
          iconType: "MapPin",
          title: "Visit Our Atelier",
          details: [
            "Zone industrielle siege aprt 2 imm H 465 op raja",
            "Massira II, Marrakech 40000",
            "Morocco"
          ],
          accent: true
        },
        {
          iconType: "Phone",
          title: "Call Us",
          details: ["+212 603301313", "+212 808612536"]
        },
        {
          iconType: "Mail",
          title: "Email Us",
          details: ["entreprisemecoso@gmail.com"]
        },
        {
          iconType: "Clock",
          title: "Business Hours",
          details: ["Mon - Sat: 9:00 AM - 6:00 PM", "Sunday: Closed"]
        }
      ]
    });
  }
  
  res.status(200).json({
    success: true,
    data: contact
  });
});


// @desc    Update contact information with AUTO-TRANSLATION
// @route   PUT /api/contact
// @access  Private (Moderator/Admin)
exports.updateContact = asyncHandler(async (req, res, next) => {
  let contact = await Contact.findOne().sort({ createdAt: -1 });
  
  if (!contact) {
    return next(new ErrorResponse('Contact information not found', 404));
  }
  
  const updateData = {
    ...req.body,
    lastUpdated: Date.now(),
    updatedBy: req.user.id
  };
  
  contact = await Contact.findByIdAndUpdate(
    contact._id,
    updateData,
    {
      new: true,
      runValidators: true
    }
  );

  // 🧠 INTELLIGENT AUTO-TRANSLATION
  console.log(`\n📄 ========== CONTACT TRANSLATION START ==========`);
  
  const fieldsToTranslate = [
    { key: 'contact.badge', value: req.body.badge },
    { key: 'contact.heading', value: req.body.heading },
    { key: 'contact.description', value: req.body.description }
  ];

  // Add contact info fields
  if (req.body.contactInfo && Array.isArray(req.body.contactInfo)) {
    req.body.contactInfo.forEach((info, index) => {
      fieldsToTranslate.push(
        { key: `contact.info_${index}.title`, value: info.title }
      );
      info.details.forEach((detail, detailIndex) => {
        fieldsToTranslate.push(
          { key: `contact.info_${index}.detail_${detailIndex}`, value: detail }
        );
      });
    });
  }

  let correctedFields = [];

  for (const field of fieldsToTranslate) {
    if (!field.value || field.value.trim() === '') continue;
    
    console.log(`\n🔍 Processing: ${field.key}`);
    console.log(`   Input: "${field.value}"`);
    
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
    console.log(`   🌐 Translating new input to ${targetLang.toUpperCase()}...`);
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
        category: 'contact',
        isEditable: true,
        lastUpdated: Date.now(),
        updatedBy: req.user.id
      },
      { upsert: true, new: true }
    );
  }
  
  console.log(`\n✅ ========== TRANSLATION COMPLETED ==========`);
  if (correctedFields.length > 0) {
    console.log(`🔧 Auto-corrected fields: ${correctedFields.join(', ')}`);
  }
  
  res.status(200).json({
    success: true,
    data: contact,
    translationInfo: {
      autoTranslated: true,
      correctedFields: correctedFields.length > 0 ? correctedFields : undefined,
      message: correctedFields.length > 0 
        ? `Successfully translated and auto-corrected ${correctedFields.length} field(s)!`
        : 'Successfully translated all fields!'
    }
  });
});


// @desc    Get contact information with translations
// @route   GET /api/contact/:lang
// @access  Public
exports.getContactWithTranslations = asyncHandler(async (req, res, next) => {
  const lang = req.params.lang || req.query.lang || 'en';
  
  if (!['en', 'fr'].includes(lang)) {
    return next(new ErrorResponse('Invalid language. Supported: en, fr', 400));
  }

  let contact = await Contact.findOne().sort({ createdAt: -1 });
  
  if (!contact) {
    contact = await Contact.create({
      badge: "Get In Touch",
      heading: "Let's Build Something Amazing Together",
      description: "Ready to start your next construction project?",
      contactInfo: []
    });
  }

  // Get translations
  const translationKeys = [
    'contact.badge',
    'contact.heading',
    'contact.description'
  ];

  // Add contact info translation keys
  contact.contactInfo.forEach((info, index) => {
    translationKeys.push(`contact.info_${index}.title`);
    info.details.forEach((_, detailIndex) => {
      translationKeys.push(`contact.info_${index}.detail_${detailIndex}`);
    });
  });

  const translations = await Translation.find({ 
    key: { $in: translationKeys } 
  });

  // Build translated response
  const translatedContact = {
    _id: contact._id,
    badge: translations.find(t => t.key === 'contact.badge')?.translations[lang] || contact.badge,
    heading: translations.find(t => t.key === 'contact.heading')?.translations[lang] || contact.heading,
    description: translations.find(t => t.key === 'contact.description')?.translations[lang] || contact.description,
    contactInfo: contact.contactInfo.map((info, index) => ({
      iconType: info.iconType,
      title: translations.find(t => t.key === `contact.info_${index}.title`)?.translations[lang] || info.title,
      details: info.details.map((detail, detailIndex) => {
        const trans = translations.find(t => t.key === `contact.info_${index}.detail_${detailIndex}`);
        return trans?.translations[lang] || detail;
      }),
      accent: info.accent
    })),
    lastUpdated: contact.lastUpdated
  };

  res.status(200).json({
    success: true,
    data: translatedContact
  });
});