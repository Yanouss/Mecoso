const { GalleryItem, GalleryPage } = require('../models/Gallery.model');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');
const { deleteFile } = require('../utils/fileUtils');
const { uploadGalleryImage, handleUploadError } = require('../middleware/upload');
const Translation = require('../models/Translation.model');
const { translateText, detectLanguage } = require('../utils/translationService');


// Default page data
const defaultPageData = {
  badge: "Our Portfolio",
  heading: "Project Gallery",
  description: "Explore our completed projects and industrial solutions. From mining equipment to steel structures, see the quality and precision that defines MECOSO's work across various industrial sectors."
};


const handleGalleryTranslations = async (galleryItems, userId) => {
  console.log(`\n📄 ========== GALLERY TRANSLATION START ==========`);
  
  const fieldsToTranslate = [];

  // Add gallery item translations
  galleryItems.forEach((item, index) => {
    fieldsToTranslate.push(
      { key: `gallery.item_${item.id}.title`, value: item.title },
      { key: `gallery.item_${item.id}.description`, value: item.description },
      { key: `gallery.item_${item.id}.category`, value: item.category }
    );
  });

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
        category: 'gallery',
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


// @desc    Upload gallery image
// @route   POST /api/gallery/upload
// @access  Private (Moderator)
exports.uploadGalleryImage = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new ErrorResponse('Please upload an image', 400));
  }

  const file = req.file;
  const fileUrl = `/uploads/${file.filename}`;

  res.status(200).json({
    success: true,
    message: 'Image uploaded successfully',
    data: {
      filename: file.filename,
      originalName: file.originalname,
      url: fileUrl,
      size: file.size,
      mimetype: file.mimetype
    }
  });
});

// @desc    Get gallery page content
// @route   GET /api/gallery/page
// @access  Public
exports.getGalleryPage = asyncHandler(async (req, res, next) => {
  // Get page data and items
  const [pageData, galleryItems] = await Promise.all([
    GalleryPage.findOne().sort({ createdAt: -1 }),
    GalleryItem.find().sort({ createdAt: -1 })
  ]);

  res.status(200).json({
    success: true,
    data: {
      page: pageData || defaultPageData,
      galleryItems: galleryItems
    }
  });
});

// @desc    Update gallery page content
// @route   PUT /api/gallery/page
// @access  Private (Moderator)
exports.updateGalleryPage = asyncHandler(async (req, res, next) => {
  const { badge, heading, description, galleryItems } = req.body;

  if (!badge || !heading || !description) {
    return next(new ErrorResponse('Badge, heading, and description are required', 400));
  }

  let pageData = await GalleryPage.findOne();
  if (pageData) {
    pageData.badge = badge;
    pageData.heading = heading;
    pageData.description = description;
    await pageData.save();
  } else {
    pageData = await GalleryPage.create({ badge, heading, description });
  }

  if (galleryItems && Array.isArray(galleryItems)) {
    const existingItems = await GalleryItem.find();
    const existingItemIds = new Set(existingItems.map(item => item.id));
    const newItemIds = new Set(galleryItems.map(item => item.id));

    const itemsToDelete = existingItems.filter(item => !newItemIds.has(item.id));
    for (let item of itemsToDelete) {
      if (item.image) {
        deleteFile(item.image);
      }
      await GalleryItem.findByIdAndDelete(item._id);
    }

    for (let itemData of galleryItems) {
      const { id, title, description, image, category, size } = itemData;

      if (!id || !title || !description || !image || !category || !size) {
        continue;
      }

      if (existingItemIds.has(id)) {
        await GalleryItem.findOneAndUpdate(
          { id: id },
          { title, description, image, category, size },
          { new: true, runValidators: true }
        );
      } else {
        await GalleryItem.create({ id, title, description, image, category, size });
      }
    }
  }

  const updatedItems = await GalleryItem.find().sort({ createdAt: -1 });
  
  // 🧠 INTELLIGENT AUTO-TRANSLATION
  const translationInfo = await handleGalleryTranslations(
    updatedItems,
    req.user.id
  );

  res.status(200).json({
    success: true,
    message: 'Gallery page updated successfully',
    data: {
      page: pageData,
      galleryItems: updatedItems
    },
    translationInfo
  });
});

// @desc    Get all gallery items
// @route   GET /api/gallery/items
// @access  Public
exports.getGalleryItems = asyncHandler(async (req, res, next) => {
  const { category, search } = req.query;
  let query = {};

  // Apply filters
  if (category && category !== 'All') {
    query.category = category;
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { category: { $regex: search, $options: 'i' } }
    ];
  }

  const galleryItems = await GalleryItem.find(query).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: galleryItems.length,
    data: galleryItems
  });
});

// @desc    Get single gallery item
// @route   GET /api/gallery/items/:id
// @access  Public
exports.getGalleryItem = asyncHandler(async (req, res, next) => {
  const galleryItem = await GalleryItem.findOne({ id: req.params.id });

  if (!galleryItem) {
    return next(new ErrorResponse('Gallery item not found', 404));
  }

  res.status(200).json({
    success: true,
    data: galleryItem
  });
});

// @desc    Create gallery item
// @route   POST /api/gallery/items
// @access  Private (Moderator)
exports.createGalleryItem = asyncHandler(async (req, res, next) => {
  const { id, title, description, image, category, size } = req.body;

  if (!id || !title || !description || !image || !category || !size) {
    return next(new ErrorResponse('All fields are required', 400));
  }

  const existingItem = await GalleryItem.findOne({ id });
  if (existingItem) {
    return next(new ErrorResponse('Gallery item with this ID already exists', 400));
  }

  const galleryItem = await GalleryItem.create({
    id, title, description, image, category, size
  });

  // Translate the new item
  const translationInfo = await handleGalleryTranslations([galleryItem], req.user.id);

  res.status(201).json({
    success: true,
    message: 'Gallery item created successfully',
    data: galleryItem,
    translationInfo
  });
});

// Update updateGalleryItem similarly
exports.updateGalleryItem = asyncHandler(async (req, res, next) => {
  const { title, description, image, category, size } = req.body;

  let galleryItem = await GalleryItem.findOne({ id: req.params.id });

  if (!galleryItem) {
    return next(new ErrorResponse('Gallery item not found', 404));
  }

  const oldImage = galleryItem.image;

  galleryItem = await GalleryItem.findByIdAndUpdate(
    galleryItem._id,
    { title, description, image, category, size },
    { new: true, runValidators: true }
  );

  if (oldImage && image && oldImage !== image) {
    deleteFile(oldImage);
  }

  // Translate the updated item
  const translationInfo = await handleGalleryTranslations([galleryItem], req.user.id);

  res.status(200).json({
    success: true,
    message: 'Gallery item updated successfully',
    data: galleryItem,
    translationInfo
  });
});

// @desc    Update gallery item
// @route   PUT /api/gallery/items/:id
// @access  Private (Moderator)
exports.updateGalleryItem = asyncHandler(async (req, res, next) => {
  const { title, description, image, category, size } = req.body;

  let galleryItem = await GalleryItem.findOne({ id: req.params.id });

  if (!galleryItem) {
    return next(new ErrorResponse('Gallery item not found', 404));
  }

  // Store old image for cleanup
  const oldImage = galleryItem.image;

  // Update item
  galleryItem = await GalleryItem.findByIdAndUpdate(
    galleryItem._id,
    {
      title,
      description,
      image,
      category,
      size
    },
    { new: true, runValidators: true }
  );

  // Clean up old image if it changed
  if (oldImage && image && oldImage !== image) {
    deleteFile(oldImage);
  }

  res.status(200).json({
    success: true,
    message: 'Gallery item updated successfully',
    data: galleryItem
  });
});

// @desc    Delete gallery item
// @route   DELETE /api/gallery/items/:id
// @access  Private (Moderator)
exports.deleteGalleryItem = asyncHandler(async (req, res, next) => {
  const galleryItem = await GalleryItem.findOne({ id: req.params.id });

  if (!galleryItem) {
    return next(new ErrorResponse('Gallery item not found', 404));
  }

  // Delete associated image
  if (galleryItem.image) {
    deleteFile(galleryItem.image);
  }

  await GalleryItem.findByIdAndDelete(galleryItem._id);

  res.status(200).json({
    success: true,
    message: 'Gallery item deleted successfully'
  });
});

// @desc    Get gallery categories
// @route   GET /api/gallery/categories
// @access  Public
exports.getGalleryCategories = asyncHandler(async (req, res, next) => {
  const categories = await GalleryItem.distinct('category');
  
  res.status(200).json({
    success: true,
    data: ['All', ...categories]
  });
});


// @desc    Get gallery with translations
// @route   GET /api/gallery/translated
// @access  Public
exports.getGalleryWithTranslations = asyncHandler(async (req, res, next) => {
  const lang = req.query.lang || 'en';
  
  if (!['en', 'fr'].includes(lang)) {
    return next(new ErrorResponse('Invalid language. Supported: en, fr', 400));
  }

  const [pageData, galleryItems] = await Promise.all([
    GalleryPage.findOne().sort({ createdAt: -1 }),
    GalleryItem.find().sort({ createdAt: -1 })
  ]);

  // Get all translation keys
  const translationKeys = galleryItems.flatMap(item => [
    `gallery.item_${item.id}.title`,
    `gallery.item_${item.id}.description`,
    `gallery.item_${item.id}.category`
  ]);

  const translations = await Translation.find({ 
    key: { $in: translationKeys } 
  });

  // Build translated items
  const translatedItems = galleryItems.map(item => {
    return {
      ...item.toObject(),
      title: translations.find(t => t.key === `gallery.item_${item.id}.title`)?.translations[lang] || item.title,
      description: translations.find(t => t.key === `gallery.item_${item.id}.description`)?.translations[lang] || item.description,
      category: translations.find(t => t.key === `gallery.item_${item.id}.category`)?.translations[lang] || item.category
    };
  });

  res.status(200).json({
    success: true,
    data: {
      page: pageData || defaultPageData,
      galleryItems: translatedItems
    }
  });
});