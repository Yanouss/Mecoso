const About = require('../models/About.model');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const { deleteFile } = require('../utils/fileUtils');
const path = require('path');
const fs = require('fs');
const Translation = require('../models/Translation.model');
const { translateText, detectLanguage } = require('../utils/translationService');


const handleAboutTranslations = async (aboutId, aboutData, userId) => {
  console.log(`\n📄 ========== ABOUT TRANSLATION START ==========`);
  
  const fieldsToTranslate = [
    { key: `about.badge`, value: aboutData.badge },
    { key: `about.heading`, value: aboutData.heading },
    { key: `about.description`, value: aboutData.description },
    { key: `about.story`, value: aboutData.story },
    { key: `about.mission`, value: aboutData.mission },
    { key: `about.vision`, value: aboutData.vision }
  ];

  // Add stats translations
  if (aboutData.stats && Array.isArray(aboutData.stats)) {
    aboutData.stats.forEach((stat, index) => {
      fieldsToTranslate.push(
        { key: `about.stat_${index}.label`, value: stat.label },
        { key: `about.stat_${index}.popupTitle`, value: stat.popupTitle },
        { key: `about.stat_${index}.popupDescription`, value: stat.popupDescription }
      );
    });
  }

  // Add values translations
  if (aboutData.values && Array.isArray(aboutData.values)) {
    aboutData.values.forEach((value, index) => {
      fieldsToTranslate.push(
        { key: `about.value_${index}.title`, value: value.title },
        { key: `about.value_${index}.description`, value: value.description }
      );
    });
  }

  // Add team translations
  if (aboutData.team && Array.isArray(aboutData.team)) {
    aboutData.team.forEach((member, index) => {
      fieldsToTranslate.push(
        { key: `about.team_${index}.name`, value: member.name },
        { key: `about.team_${index}.role`, value: member.role },
        { key: `about.team_${index}.bio`, value: member.bio }
      );
      
      // Also handle expertise array if it exists
      if (member.expertise && Array.isArray(member.expertise)) {
        member.expertise.forEach((skill, skillIndex) => {
          fieldsToTranslate.push({
            key: `about.team_${index}.expertise_${skillIndex}`,
            value: skill
          });
        });
      }
    });
  }

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
    
    console.log(`   🌍 Translating new input to ${targetLang.toUpperCase()}...`);
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
        category: 'about',
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


// @desc    Get about content
// @route   GET /api/about
// @access  Public
exports.getAbout = asyncHandler(async (req, res, next) => {
  let about = await About.findOne();
  
  // If no about content exists, create default
  if (!about) {
    about = await About.create({});
  }
  
  res.status(200).json({
    success: true,
    data: about
  });
});

// @desc    Update about content
// @route   PUT /api/about
// @access  Private (Moderator/Admin)
exports.updateAbout = asyncHandler(async (req, res, next) => {
  const {
    badge,
    heading,
    description,
    story,
    mission,
    vision,
    portfolioFileName,
    heroImage
  } = req.body;

  // Parse JSON strings for complex objects
  let stats, values, team, partners;
  try {
    stats = req.body.stats ? JSON.parse(req.body.stats) : undefined;
    values = req.body.values ? JSON.parse(req.body.values) : undefined;
    team = req.body.team ? JSON.parse(req.body.team) : undefined;
    partners = req.body.partners ? JSON.parse(req.body.partners) : undefined;
  } catch (error) {
    return next(new ErrorResponse('Invalid JSON format in request data', 400));
  }

  let about = await About.findOne();
  
  if (!about) {
    about = new About({});
  }
  
  // Handle main image upload (for home section)
  if (req.files && req.files.image) {
    deleteFile(about.image);
    about.image = `/uploads/${req.files.image[0].filename}`;
  }

  // Handle hero image upload (for full page)
  if (req.files && req.files.heroImage) {
    deleteFile(about.heroImage);
    about.heroImage = `/uploads/${req.files.heroImage[0].filename}`;
  }

  // Handle stats with image uploads
  if (stats && Array.isArray(stats)) {
    const updatedStats = [];
    
    for (let i = 0; i < stats.length; i++) {
      const stat = { ...stats[i] };
      
      // Handle background image upload for this stat
      if (req.files && req.files[`stat_${i}_backgroundImage`]) {
        if (about.stats && about.stats[i]) {
          deleteFile(about.stats[i].backgroundImage);
        }
        stat.backgroundImage = `/uploads/${req.files[`stat_${i}_backgroundImage`][0].filename}`;
      }
      
      // Handle popup image upload for this stat
      if (req.files && req.files[`stat_${i}_popupImage`]) {
        if (about.stats && about.stats[i]) {
          deleteFile(about.stats[i].popupImage);
        }
        stat.popupImage = `/uploads/${req.files[`stat_${i}_popupImage`][0].filename}`;
      }
      
      updatedStats.push(stat);
    }
    
    about.stats = updatedStats;
  }

  // Handle values with video uploads
  if (values && Array.isArray(values)) {
    const updatedValues = [];
    
    for (let i = 0; i < values.length; i++) {
      const value = { ...values[i] };
      
      // Handle video upload for this value
      const videoFieldName = req.files && (req.files[`value_${i}_video`] || req.files[`value_${i}_videoUrl`]);
      
      if (videoFieldName) {
        console.log('Video upload detected:', {
          fieldName: Object.keys(req.files).find(key => key.includes(`value_${i}`)),
          fileName: videoFieldName[0].filename,
          originalName: videoFieldName[0].originalname,
          mimetype: videoFieldName[0].mimetype
        });
        
        if (about.values && about.values[i]) {
          deleteFile(about.values[i].videoUrl);
        }
        value.videoUrl = `/uploads/${videoFieldName[0].filename}`;
      }
      
      updatedValues.push(value);
    }
    
    about.values = updatedValues;
  }

  // Handle team members with image uploads
  if (team && Array.isArray(team)) {
    const updatedTeam = [];
    
    for (let i = 0; i < team.length; i++) {
      const member = { ...team[i] };
      
      // Handle team member image upload
      if (req.files && req.files[`team_${i}_image`]) {
        if (about.team && about.team[i]) {
          deleteFile(about.team[i].image);
        }
        member.image = `/uploads/${req.files[`team_${i}_image`][0].filename}`;
      }
      
      updatedTeam.push(member);
    }
    
    about.team = updatedTeam;
  }

  // Handle partners with logo uploads
  if (partners && Array.isArray(partners)) {
    const updatedPartners = [];
    
    for (let i = 0; i < partners.length; i++) {
      const partner = { ...partners[i] };
      
      // Handle partner logo upload
      if (req.files && req.files[`partner_${i}_src`]) {
        if (about.partners && about.partners[i]) {
          deleteFile(about.partners[i].src);
        }
        partner.src = `/uploads/${req.files[`partner_${i}_src`][0].filename}`;
      }
      
      updatedPartners.push(partner);
    }
    
    about.partners = updatedPartners;
  }
  
  // Update text fields if provided
  if (badge !== undefined) about.badge = badge;
  if (heading !== undefined) about.heading = heading;
  if (description !== undefined) about.description = description;
  if (story !== undefined) about.story = story;
  if (mission !== undefined) about.mission = mission;
  if (vision !== undefined) about.vision = vision;
  if (portfolioFileName !== undefined) about.portfolioFileName = portfolioFileName;
  if (heroImage !== undefined && !req.files?.heroImage) about.heroImage = heroImage;
  
  about.lastUpdated = Date.now();
  about.updatedBy = req.user.id;
  
  await about.save();
  
  const translationInfo = await handleAboutTranslations(
    about._id,
    {
      badge: about.badge,
      heading: about.heading,
      description: about.description,
      story: about.story,
      mission: about.mission,
      vision: about.vision,
      stats: about.stats,
      values: about.values,
      team: about.team
    },
    req.user.id
  );
  
  res.status(200).json({
    success: true,
    data: about,
    translationInfo  
  });

});


// @desc    Upload portfolio file
// @route   POST /api/about/portfolio
// @access  Private (Moderator/Admin)
exports.uploadPortfolio = asyncHandler(async (req, res, next) => {
  if (!req.files || !req.files.portfolio) {
    return next(new ErrorResponse('Please upload a portfolio file', 400));
  }

  const file = req.files.portfolio[0];
  
  // Validate file type (presentations only)
  const allowedTypes = ['.pptx', '.ppt', '.pdf'];
  const fileExt = path.extname(file.originalname).toLowerCase();
  
  if (!allowedTypes.includes(fileExt)) {
    return next(new ErrorResponse('Please upload a valid portfolio file (PPTX, PPT, or PDF)', 400));
  }

  let about = await About.findOne();
  
  if (!about) {
    about = new About({});
  }

  // Delete old portfolio file if it exists
  if (about.portfolioFileName) {
    const oldPortfolioPath = path.join(__dirname, '..', 'public', 'portfolio', about.portfolioFileName);
    if (fs.existsSync(oldPortfolioPath)) {
      fs.unlinkSync(oldPortfolioPath);
    }
  }

  // Move file to portfolio directory
  const portfolioDir = path.join(__dirname, '..', 'public', 'portfolio');
  if (!fs.existsSync(portfolioDir)) {
    fs.mkdirSync(portfolioDir, { recursive: true });
  }

  const fileName = `MECOSO-Portfolio-${Date.now()}${fileExt}`;
  const filePath = path.join(portfolioDir, fileName);
  
  fs.copyFileSync(file.path, filePath);
  fs.unlinkSync(file.path); // Remove from uploads temp location

  about.portfolioFileName = fileName;
  about.lastUpdated = Date.now();
  about.updatedBy = req.user.id;
  
  await about.save();
  
  res.status(200).json({
    success: true,
    data: {
      portfolioFileName: fileName,
      message: 'Portfolio file uploaded successfully'
    }
  });
});

// @desc    Get about with translations
// @route   GET /api/about/:lang
// @access  Public
exports.getAboutWithTranslations = asyncHandler(async (req, res, next) => {
  const lang = req.params.lang || req.query.lang || 'en';
  
  if (!['en', 'fr'].includes(lang)) {
    return next(new ErrorResponse('Invalid language. Supported: en, fr', 400));
  }

  let about = await About.findOne();
  
  if (!about) {
    about = await About.create({});
  }

  // Get all translation keys
  const translationKeys = [
    'about.badge',
    'about.heading',
    'about.description',
    'about.story',
    'about.mission',
    'about.vision'
  ];

  // Add stats keys
  if (about.stats) {
    about.stats.forEach((_, index) => {
      translationKeys.push(
        `about.stat_${index}.label`,
        `about.stat_${index}.popupTitle`,
        `about.stat_${index}.popupDescription`
      );
    });
  }

  // Add values keys
  if (about.values) {
    about.values.forEach((_, index) => {
      translationKeys.push(
        `about.value_${index}.title`,
        `about.value_${index}.description`
      );
    });
  }

  // Add team keys
  if (about.team) {
    about.team.forEach((_, index) => {
      translationKeys.push(
        `about.team_${index}.name`,
        `about.team_${index}.role`,
        `about.team_${index}.bio`
      );
    });
  }

  const translations = await Translation.find({ 
    key: { $in: translationKeys } 
  });

  // Build translated response
  const translatedAbout = {
    ...about.toObject(),
    badge: translations.find(t => t.key === 'about.badge')?.translations[lang] || about.badge,
    heading: translations.find(t => t.key === 'about.heading')?.translations[lang] || about.heading,
    description: translations.find(t => t.key === 'about.description')?.translations[lang] || about.description,
    story: translations.find(t => t.key === 'about.story')?.translations[lang] || about.story,
    mission: translations.find(t => t.key === 'about.mission')?.translations[lang] || about.mission,
    vision: translations.find(t => t.key === 'about.vision')?.translations[lang] || about.vision,
    stats: about.stats?.map((stat, index) => ({
      ...stat.toObject(),
      label: translations.find(t => t.key === `about.stat_${index}.label`)?.translations[lang] || stat.label,
      popupTitle: translations.find(t => t.key === `about.stat_${index}.popupTitle`)?.translations[lang] || stat.popupTitle,
      popupDescription: translations.find(t => t.key === `about.stat_${index}.popupDescription`)?.translations[lang] || stat.popupDescription
    })),
    values: about.values?.map((value, index) => ({
      ...value.toObject(),
      title: translations.find(t => t.key === `about.value_${index}.title`)?.translations[lang] || value.title,
      description: translations.find(t => t.key === `about.value_${index}.description`)?.translations[lang] || value.description
    })),
    team: about.team?.map((member, index) => ({
    ...member.toObject(),
    name: translations.find(t => t.key === `about.team_${index}.name`)?.translations[lang] || member.name,
    role: translations.find(t => t.key === `about.team_${index}.role`)?.translations[lang] || member.role,
    bio: translations.find(t => t.key === `about.team_${index}.bio`)?.translations[lang] || member.bio,
    expertise: member.expertise?.map((skill, skillIndex) => 
      translations.find(t => t.key === `about.team_${index}.expertise_${skillIndex}`)?.translations[lang] || skill
    )
  }))
  };

  res.status(200).json({
    success: true,
    data: translatedAbout
  });
});