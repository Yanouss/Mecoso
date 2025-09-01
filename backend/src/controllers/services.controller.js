const Service = require('../models/Services.model');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

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
  // Get the count to set order
  const count = await Service.countDocuments();
  
  const service = await Service.create({
    ...req.body,
    order: count,
    updatedBy: req.user.id
  });
  
  res.status(201).json({
    success: true,
    data: service
  });
});

// @desc    Update service
// @route   PUT /api/services/:id
// @access  Private (Moderator/Admin)
exports.updateService = asyncHandler(async (req, res, next) => {
  let service = await Service.findById(req.params.id);
  
  if (!service) {
    return next(new ErrorResponse(`Service not found with id of ${req.params.id}`, 404));
  }
  
  service = await Service.findByIdAndUpdate(
    req.params.id,
    { 
      ...req.body,
      lastUpdated: Date.now(),
      updatedBy: req.user.id 
    },
    {
      new: true,
      runValidators: true
    }
  );
  
  res.status(200).json({
    success: true,
    data: service
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