const Machine = require('../models/Machines.model');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');
const { deleteFile } = require('../utils/fileUtils');

// Default page data
const defaultPageData = {
  badge: "Our Equipment",
  heading: "Industrial Machinery Fleet",
  description: "MECOSO operates state-of-the-art industrial machinery for manufacturing, fabrication, and assembly operations. Our equipment fleet ensures precision, efficiency, and reliability in every project we undertake.",
  stats: [
    { number: "25+", label: "Active Machines" },
    { number: "99.5%", label: "Uptime Rate" },
    { number: "15+", label: "Years Service" },
    { number: "24/7", label: "Operations" }
  ]
};

// @desc    Get machines page content
// @route   GET /api/machines/page
// @access  Public
exports.getMachinesPage = asyncHandler(async (req, res, next) => {
  // Get all machines
  const machines = await Machine.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: {
      page: defaultPageData,
      machines: machines
    }
  });
});

// @desc    Update machines page content
// @route   PUT /api/machines/page
// @access  Private (Moderator)
exports.updateMachinesPage = asyncHandler(async (req, res, next) => {
  const { badge, heading, description, stats, machines } = req.body;

  // Validate input
  if (!badge || !heading || !description) {
    return next(new ErrorResponse('Badge, heading, and description are required', 400));
  }

  if (!stats || !Array.isArray(stats) || stats.length < 1 || stats.length > 10) {
    return next(new ErrorResponse('Stats must be an array with 1-10 items', 400));
  }

  // Validate stats
  for (let stat of stats) {
    if (!stat.number || !stat.label) {
      return next(new ErrorResponse('Each stat must have number and label', 400));
    }
  }

  // Handle machines if provided
  if (machines && Array.isArray(machines)) {
    // Get existing machines
    const existingMachines = await Machine.find();
    const existingMachineIds = new Set(existingMachines.map(m => m.id));
    const newMachineIds = new Set(machines.map(m => m.id));

    // Delete machines not in the new list
    const machinesToDelete = existingMachines.filter(m => !newMachineIds.has(m.id));
    for (let machine of machinesToDelete) {
      if (machine.image) {
        deleteFile(machine.image);
      }
      await Machine.findByIdAndDelete(machine._id);
    }

    // Update or create machines
    for (let machineData of machines) {
      const { id, title, description, image, specifications, capacity, powerRequirement, category, model, yearManufactured, status } = machineData;

      // Validate machine data
      if (!id || !title || !description || !image || !specifications || !Array.isArray(specifications) || 
          !capacity || !powerRequirement || !category || !model || !yearManufactured || !status) {
        continue; // Skip invalid machines
      }

      if (existingMachineIds.has(id)) {
        // Update existing machine
        await Machine.findOneAndUpdate(
          { id: id },
          {
            title,
            description,
            image,
            specifications: specifications.filter(spec => spec.trim() !== ''),
            capacity,
            powerRequirement,
            category,
            model,
            yearManufactured,
            status
          },
          { new: true, runValidators: true }
        );
      } else {
        // Create new machine
        await Machine.create({
          id,
          title,
          description,
          image,
          specifications: specifications.filter(spec => spec.trim() !== ''),
          capacity,
          powerRequirement,
          category,
          model,
          yearManufactured,
          status
        });
      }
    }
  }

  // Return updated data
  const updatedMachines = await Machine.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    message: 'Machines page updated successfully',
    data: {
      page: {
        badge,
        heading,
        description,
        stats
      },
      machines: updatedMachines
    }
  });
});

// @desc    Get all machines
// @route   GET /api/machines
// @access  Public
exports.getMachines = asyncHandler(async (req, res, next) => {
  const { category, status, search } = req.query;
  let query = {};

  // Apply filters
  if (category && category !== 'All') {
    query.category = category;
  }

  if (status) {
    query.status = status;
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { model: { $regex: search, $options: 'i' } }
    ];
  }

  const machines = await Machine.find(query).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: machines.length,
    data: machines
  });
});

// @desc    Get single machine
// @route   GET /api/machines/:id
// @access  Public
exports.getMachine = asyncHandler(async (req, res, next) => {
  const machine = await Machine.findOne({ id: req.params.id });

  if (!machine) {
    return next(new ErrorResponse('Machine not found', 404));
  }

  res.status(200).json({
    success: true,
    data: machine
  });
});

// @desc    Create machine
// @route   POST /api/machines
// @access  Private (Moderator)
exports.createMachine = asyncHandler(async (req, res, next) => {
  const { id, title, description, image, specifications, capacity, powerRequirement, category, model, yearManufactured, status } = req.body;

  // Validate required fields
  if (!id || !title || !description || !image || !specifications || !Array.isArray(specifications) || 
      !capacity || !powerRequirement || !category || !model || !yearManufactured || !status) {
    return next(new ErrorResponse('All fields are required', 400));
  }

  // Check if machine with ID already exists
  const existingMachine = await Machine.findOne({ id });
  if (existingMachine) {
    return next(new ErrorResponse('Machine with this ID already exists', 400));
  }

  const machine = await Machine.create({
    id,
    title,
    description,
    image,
    specifications: specifications.filter(spec => spec.trim() !== ''),
    capacity,
    powerRequirement,
    category,
    model,
    yearManufactured,
    status
  });

  res.status(201).json({
    success: true,
    message: 'Machine created successfully',
    data: machine
  });
});

// @desc    Update machine
// @route   PUT /api/machines/:id
// @access  Private (Moderator)
exports.updateMachine = asyncHandler(async (req, res, next) => {
  const { title, description, image, specifications, capacity, powerRequirement, category, model, yearManufactured, status } = req.body;

  let machine = await Machine.findOne({ id: req.params.id });

  if (!machine) {
    return next(new ErrorResponse('Machine not found', 404));
  }

  // Store old image for cleanup
  const oldImage = machine.image;

  // Update machine
  machine = await Machine.findByIdAndUpdate(
    machine._id,
    {
      title,
      description,
      image,
      specifications: specifications ? specifications.filter(spec => spec.trim() !== '') : machine.specifications,
      capacity,
      powerRequirement,
      category,
      model,
      yearManufactured,
      status
    },
    { new: true, runValidators: true }
  );

  // Clean up old image if it changed
  if (oldImage && image && oldImage !== image) {
    deleteFile(oldImage);
  }

  res.status(200).json({
    success: true,
    message: 'Machine updated successfully',
    data: machine
  });
});

// @desc    Delete machine
// @route   DELETE /api/machines/:id
// @access  Private (Moderator)
exports.deleteMachine = asyncHandler(async (req, res, next) => {
  const machine = await Machine.findOne({ id: req.params.id });

  if (!machine) {
    return next(new ErrorResponse('Machine not found', 404));
  }

  // Delete associated image
  if (machine.image) {
    deleteFile(machine.image);
  }

  await Machine.findByIdAndDelete(machine._id);

  res.status(200).json({
    success: true,
    message: 'Machine deleted successfully'
  });
});

// @desc    Upload machine image
// @route   POST /api/machines/upload
// @access  Private (Moderator)
exports.uploadMachineImage = asyncHandler(async (req, res, next) => {
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

// @desc    Get machine categories
// @route   GET /api/machines/categories
// @access  Public
exports.getMachineCategories = asyncHandler(async (req, res, next) => {
  const categories = await Machine.distinct('category');
  
  res.status(200).json({
    success: true,
    data: ['All', ...categories]
  });
});

// @desc    Get machine statistics
// @route   GET /api/machines/statistics
// @access  Public
exports.getMachineStatistics = asyncHandler(async (req, res, next) => {
  const totalMachines = await Machine.countDocuments();
  const availableMachines = await Machine.countDocuments({ status: 'Available' });
  const inUseMachines = await Machine.countDocuments({ status: 'In Use' });
  const maintenanceMachines = await Machine.countDocuments({ status: 'Maintenance' });
  
  const categoryCounts = await Machine.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);

  res.status(200).json({
    success: true,
    data: {
      total: totalMachines,
      available: availableMachines,
      inUse: inUseMachines,
      maintenance: maintenanceMachines,
      categories: categoryCounts
    }
  });
});