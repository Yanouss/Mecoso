const Contact = require('../models/Contact.model');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const Translation = require('../models/Translation.model');
const { translateText, detectLanguage } = require('../utils/translationService');
const sendEmail = require('../utils/sendEmail');


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


// @desc    Submit contact form
// @route   POST /api/contact/submit
// @access  Public
exports.submitContactForm = asyncHandler(async (req, res, next) => {
  const {
    name,
    email,
    company,
    phone,
    service,
    projectType,
    budget,
    timeline,
    message
  } = req.body;

  // Validation
  if (!name || !email || !service) {
    return next(new ErrorResponse('Please provide name, email, and service', 400));
  }

  // --- 1. Admin Email Content (Professional Table Layout) ---
  const adminEmailContent = `
    <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; max-width: 600px; margin: 20px auto;">
      <h2 style="color: #1a202c; border-bottom: 2px solid #3182ce; padding-bottom: 10px;">New High-Priority Contact Inquiry</h2>
      
      <p style="color: #4a5568; margin-bottom: 20px;">A new prospect has submitted an inquiry via the corporate contact form. Please review the details below and assign for follow-up.</p>

      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color: #f7fafc;">
            <th style="border: 1px solid #e2e8f0; padding: 10px; text-align: left; color: #2d3748; width: 30%;">Field</th>
            <th style="border: 1px solid #e2e8f0; padding: 10px; text-align: left; color: #2d3748; width: 70%;">Detail</th>
          </tr>
        </thead>
        <tbody>
          <tr><td style="border: 1px solid #e2e8f0; padding: 10px; color: #4a5568; font-weight: bold;">Name</td><td style="border: 1px solid #e2e8f0; padding: 10px;">${name}</td></tr>
          <tr><td style="border: 1px solid #e2e8f0; padding: 10px; color: #4a5568; font-weight: bold;">Email</td><td style="border: 1px solid #e2e8f0; padding: 10px;"><a href="mailto:${email}" style="color: #3182ce;">${email}</a></td></tr>
          ${company ? `<tr><td style="border: 1px solid #e2e8f0; padding: 10px; color: #4a5568; font-weight: bold;">Company</td><td style="border: 1px solid #e2e8f0; padding: 10px;">${company}</td></tr>` : ''}
          ${phone ? `<tr><td style="border: 1px solid #e2e8f0; padding: 10px; color: #4a5568; font-weight: bold;">Phone</td><td style="border: 1px solid #e2e8f0; padding: 10px;">${phone}</td></tr>` : ''}
          <tr style="background-color: #edf2f7;"><td style="border: 1px solid #e2e8f0; padding: 10px; color: #4a5568; font-weight: bold;">Service Requested</td><td style="border: 1px solid #e2e8f0; padding: 10px;"><strong>${service}</strong></td></tr>
          ${projectType ? `<tr><td style="border: 1px solid #e2e8f0; padding: 10px; color: #4a5568; font-weight: bold;">Project Type</td><td style="border: 1px solid #e2e8f0; padding: 10px;">${projectType}</td></tr>` : ''}
          ${budget ? `<tr><td style="border: 1px solid #e2e8f0; padding: 10px; color: #4a5568; font-weight: bold;">Budget Range</td><td style="border: 1px solid #e2e8f0; padding: 10px;">${budget}</td></tr>` : ''}
          ${timeline ? `<tr><td style="border: 1px solid #e2e8f0; padding: 10px; color: #4a5568; font-weight: bold;">Target Timeline</td><td style="border: 1px solid #e2e8f0; padding: 10px;">${timeline}</td></tr>` : ''}
        </tbody>
      </table>
      
      ${message ? `
        <h3 style="color: #1a202c; margin-top: 25px; border-top: 1px dashed #e2e8f0; padding-top: 15px;">Prospect Message:</h3>
        <p style="white-space: pre-wrap; background-color: #f7fafc; padding: 15px; border-left: 3px solid #3182ce; color: #4a5568;">${message}</p>
      ` : ''}
      
      <p style="margin-top: 20px; font-size: 14px; color: #718096;">Please initiate contact within one business day to maintain service quality standards.</p>
    </div>
  `;

  // --- 2. User Confirmation Email Content (Modern Branded Template) ---
  const userConfirmationContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 650px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden;">
      <div style="background-color: #3182ce; padding: 30px; text-align: center; border-bottom: 5px solid #2b6cb0;">
        <h1 style="color: white; margin: 0; font-size: 28px; letter-spacing: 1.5px;">MECOSO</h1>
        <p style="color: #e2e8f0; margin-top: 5px; font-size: 16px;">Architectural & Industrial Solutions</p>
      </div>
      
      <div style="padding: 40px; background-color: white;">
        <h2 style="color: #1a202c; margin-top: 0; font-size: 24px;">Inquiry Successfully Received!</h2>
        <p style="color: #4a5568; line-height: 1.7;">Dear ${name},</p>
        <p style="color: #4a5568; line-height: 1.7;">
          Thank you for reaching out to **MECOSO**. Your detailed inquiry has been successfully logged into our system. 
          A dedicated project manager will review your requirements for **${service}** and will be in contact with you shortly.
        </p>
        
        <div style="background: #f7fafc; padding: 25px; border-radius: 8px; margin: 30px 0; border: 1px solid #e2e8f0;">
          <h3 style="color: #2d3748; margin-top: 0; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">Key Submission Details</h3>
          <table style="width: 100%; color: #4a5568; font-size: 14px;">
            <tr><td style="padding: 5px 0; width: 40%; font-weight: bold;">Service Focus:</td><td style="padding: 5px 0;">${service}</td></tr>
            ${projectType ? `<tr><td style="padding: 5px 0; width: 40%; font-weight: bold;">Project Type:</td><td style="padding: 5px 0;">${projectType}</td></tr>` : ''}
            ${budget ? `<tr><td style="padding: 5px 0; width: 40%; font-weight: bold;">Estimated Budget:</td><td style="padding: 5px 0;">${budget}</td></tr>` : ''}
            <tr><td style="padding: 5px 0; width: 40%; font-weight: bold;">Response Time:</td><td style="padding: 5px 0;">1-2 Business Days</td></tr>
          </table>
        </div>
        
        <p style="color: #4a5568; line-height: 1.7;">
          While we process your request, you can explore our portfolio or learn more about our process by visiting our website.
        </p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="[Your Company Website Link]" style="display: inline-block; padding: 12px 25px; background-color: #3182ce; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px rgba(49, 130, 206, 0.3);">
            View Our Portfolio
          </a>
        </div>
        
        <p style="color: #4a5568; line-height: 1.7; margin-top: 30px;">
          For immediate assistance, please call our corporate line at <strong>+212 603301313</strong>.
        </p>
        <p style="color: #4a5568; line-height: 1.7;">Sincerely,<br/>The MECOSO Executive Team</p>
      </div>
      
      <div style="padding: 20px; text-align: center; background-color: #edf2f7; color: #718096; font-size: 12px; border-top: 1px solid #e2e8f0;">
        <p style="margin: 0;">MECOSO | [Your Company Address/Location]</p>
        <p style="margin: 5px 0 0 0;">© ${new Date().getFullYear()} MECOSO. All rights reserved. | <a href="[Unsubscribe Link]" style="color: #718096;">Unsubscribe</a></p>
      </div>
    </div>
  `;

  try {
    // Send email to admin
    await sendEmail({
      email: process.env.EMAIL_USER, // Your admin email
      subject: `[High Priority] New Lead: ${name} (${service})`, // More professional subject
      html: adminEmailContent
    });

    // Send confirmation email to user
    await sendEmail({
      email: email,
      subject: 'Thank You for Contacting MECOSO - Your Inquiry',
      html: userConfirmationContent
    });

    res.status(200).json({
      success: true,
      message: 'Your message has been sent successfully! A confirmation email has been sent to your inbox.'
    });
  } catch (error) {
    console.error('Email sending error:', error);
    return next(new ErrorResponse('An internal error occurred. Failed to send email.', 500));
  }
});