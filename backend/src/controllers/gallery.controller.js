const { GalleryItem, GalleryPage } = require('../models/Gallery.model');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');
const { deleteFile } = require('../utils/fileUtils');
const { uploadGalleryImage, handleUploadError } = require('../middleware/upload');

// Default page data
const defaultPageData = {
  badge: "Our Portfolio",
  heading: "Project Gallery",
  description: "Explore our completed projects and industrial solutions. From mining equipment to steel structures, see the quality and precision that defines MECOSO's work across various industrial sectors."
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

  // Validate input
  if (!badge || !heading || !description) {
    return next(new ErrorResponse('Badge, heading, and description are required', 400));
  }

  // Update or create page data
  let pageData = await GalleryPage.findOne();
  if (pageData) {
    pageData.badge = badge;
    pageData.heading = heading;
    pageData.description = description;
    await pageData.save();
  } else {
    pageData = await GalleryPage.create({ badge, heading, description });
  }

  // Handle gallery items if provided
  if (galleryItems && Array.isArray(galleryItems)) {
    // Get existing items
    const existingItems = await GalleryItem.find();
    const existingItemIds = new Set(existingItems.map(item => item.id));
    const newItemIds = new Set(galleryItems.map(item => item.id));

    // Delete items not in the new list
    const itemsToDelete = existingItems.filter(item => !newItemIds.has(item.id));
    for (let item of itemsToDelete) {
      if (item.image) {
        deleteFile(item.image);
      }
      await GalleryItem.findByIdAndDelete(item._id);
    }

    // Update or create items
    for (let itemData of galleryItems) {
      const { id, title, description, image, category, size } = itemData;

      // Validate item data
      if (!id || !title || !description || !image || !category || !size) {
        continue; // Skip invalid items
      }

      if (existingItemIds.has(id)) {
        // Update existing item
        await GalleryItem.findOneAndUpdate(
          { id: id },
          {
            title,
            description,
            image,
            category,
            size
          },
          { new: true, runValidators: true }
        );
      } else {
        // Create new item
        await GalleryItem.create({
          id,
          title,
          description,
          image,
          category,
          size
        });
      }
    }
  }

  // Return updated data
  const updatedItems = await GalleryItem.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    message: 'Gallery page updated successfully',
    data: {
      page: pageData,
      galleryItems: updatedItems
    }
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

  // Validate required fields
  if (!id || !title || !description || !image || !category || !size) {
    return next(new ErrorResponse('All fields are required', 400));
  }

  // Check if item with ID already exists
  const existingItem = await GalleryItem.findOne({ id });
  if (existingItem) {
    return next(new ErrorResponse('Gallery item with this ID already exists', 400));
  }

  const galleryItem = await GalleryItem.create({
    id,
    title,
    description,
    image,
    category,
    size
  });

  res.status(201).json({
    success: true,
    message: 'Gallery item created successfully',
    data: galleryItem
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