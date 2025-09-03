const Testimonial = require('../models/Testimonials.model');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const path = require('path');
const fs = require('fs');

// @desc    Get all testimonials
// @route   GET /api/testimonials
// @access  Public
exports.getTestimonials = asyncHandler(async (req, res, next) => {
  const testimonials = await Testimonial.find({ isActive: true }).sort({ order: 1 });
  
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
  const count = await Testimonial.countDocuments();
  
  // Handle file upload
  if (!req.file) {
    return next(new ErrorResponse('Please upload an image', 400));
  }
  
  const testimonial = await Testimonial.create({
    ...req.body,
    image: `${baseUrl}/uploads/${req.file.filename}`,
    order: count,
    updatedBy: req.user.id
  });
  
  res.status(201).json({
    success: true,
    data: testimonial
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
  
  // Handle file upload if new file is provided
  const updateData = { 
    ...req.body,
    lastUpdated: Date.now(),
    updatedBy: req.user.id 
  };
  
  if (req.file) {
    // Delete old image if it exists
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
  
  res.status(200).json({
    success: true,
    data: testimonial
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
  
  // Delete associated image
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

// @desc    Reorder testimonials
// @route   PUT /api/testimonials/reorder
// @access  Private (Moderator/Admin)
exports.reorderTestimonials = asyncHandler(async (req, res, next) => {
  const { testimonials } = req.body;
  
  if (!testimonials || !Array.isArray(testimonials)) {
    return next(new ErrorResponse('Please provide an array of testimonials with ids and orders', 400));
  }
  
  const bulkOps = testimonials.map(testimonial => ({
    updateOne: {
      filter: { _id: testimonial.id },
      update: { 
        order: testimonial.order,
        lastUpdated: Date.now(),
        updatedBy: req.user.id
      }
    }
  }));
  
  await Testimonial.bulkWrite(bulkOps);
  
  const updatedTestimonials = await Testimonial.find().sort({ order: 1 });
  
  res.status(200).json({
    success: true,
    data: updatedTestimonials
  });
});