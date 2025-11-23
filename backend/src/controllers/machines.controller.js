const Machine = require('../models/Machines.model');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');
const { deleteFile } = require('../utils/fileUtils');
const Translation = require('../models/Translation.model');
const { translateText, detectLanguage } = require('../utils/translationService');

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

// 🧠 INTELLIGENT AUTO-TRANSLATION for Machines
const handleMachineTranslations = async (machineId, machineData, userId) => {
  console.log(`\n📄 ========== MACHINE TRANSLATION START ==========`);
  
  const fieldsToTranslate = [
    { key: `machine.${machineId}.title`, value: machineData.title },
    { key: `machine.${machineId}.description`, value: machineData.description },
    ...machineData.specifications.map((spec, index) => ({
      key: `machine.${machineId}.spec_${index}`,
      value: spec
    })),
    { key: `machine.${machineId}.capacity`, value: machineData.capacity },
    { key: `machine.${machineId}.powerRequirement`, value: machineData.powerRequirement },
    { key: `machine.${machineId}.model`, value: machineData.model }
  ];

  let correctedFields = [];

  for (const field of fieldsToTranslate) {
    if (!field.value || field.value.trim() === '') continue;
    
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
        category: 'machines',
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

    // Update or create machines with translations
    for (let machineData of machines) {
      const { id, title, description, image, specifications, capacity, powerRequirement, category, model, yearManufactured, status } = machineData;

      // Validate only essential machine data
      if (!id || !title || !category) {
        continue; // Skip invalid machines
      }

      // Ensure specifications array exists and has at least one valid entry
      if (!specifications || !Array.isArray(specifications) || 
          specifications.filter(spec => spec && spec.trim() !== '').length === 0) {
        continue; // Skip machines without specifications
      }

      let savedMachine;
      if (existingMachineIds.has(id)) {
        // Update existing machine
        savedMachine = await Machine.findOneAndUpdate(
          { id: id },
          {
            title,
            description: description || '',
            image: image || '',
            specifications: specifications.filter(spec => spec && spec.trim() !== ''),
            capacity: capacity || '',
            powerRequirement: powerRequirement || '',
            category,
            model: model || '',
            yearManufactured: yearManufactured || '',
            status: status || 'Available'
          },
          { new: true, runValidators: true }
        );
      } else {
        // Create new machine
        savedMachine = await Machine.create({
          id,
          title,
          description: description || '',
          image: image || '',
          specifications: specifications.filter(spec => spec && spec.trim() !== ''),
          capacity: capacity || '',
          powerRequirement: powerRequirement || '',
          category,
          model: model || '',
          yearManufactured: yearManufactured || '',
          status: status || 'Available'
        });
      }

      // 🧠 INTELLIGENT AUTO-TRANSLATION
      await handleMachineTranslations(
        savedMachine._id,
        {
          title: savedMachine.title,
          description: savedMachine.description,
          specifications: savedMachine.specifications,
          capacity: savedMachine.capacity,
          powerRequirement: savedMachine.powerRequirement,
          model: savedMachine.model
        },
        req.user.id
      );
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

  // Validate only essential fields
  if (!id || !title || !category) {
    return next(new ErrorResponse('ID, title, and category are required', 400));
  }

  // Validate specifications
  if (!specifications || !Array.isArray(specifications) || 
      specifications.filter(spec => spec && spec.trim() !== '').length === 0) {
    return next(new ErrorResponse('At least one specification is required', 400));
  }

  // Check if machine with ID already exists
  const existingMachine = await Machine.findOne({ id });
  if (existingMachine) {
    return next(new ErrorResponse('Machine with this ID already exists', 400));
  }

  const machine = await Machine.create({
    id,
    title,
    description: description || '',
    image: image || '',
    specifications: specifications.filter(spec => spec && spec.trim() !== ''),
    capacity: capacity || '',
    powerRequirement: powerRequirement || '',
    category,
    model: model || '',
    yearManufactured: yearManufactured || '',
    status: status || 'Available'
  });

  // 🧠 INTELLIGENT AUTO-TRANSLATION
  const translationInfo = await handleMachineTranslations(
    machine._id,
    {
      title: machine.title,
      description: machine.description,
      specifications: machine.specifications,
      capacity: machine.capacity,
      powerRequirement: machine.powerRequirement,
      model: machine.model
    },
    req.user.id
  );

  res.status(201).json({
    success: true,
    message: 'Machine created successfully',
    data: machine,
    translationInfo
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

  // Validate only essential fields if they're being updated
  if (title !== undefined && !title) {
    return next(new ErrorResponse('Title cannot be empty', 400));
  }

  if (category !== undefined && !category) {
    return next(new ErrorResponse('Category cannot be empty', 400));
  }

  if (specifications !== undefined && (!Array.isArray(specifications) || 
      specifications.filter(spec => spec && spec.trim() !== '').length === 0)) {
    return next(new ErrorResponse('At least one specification is required', 400));
  }

  // Store old image for cleanup
  const oldImage = machine.image;

  // Update machine
  machine = await Machine.findByIdAndUpdate(
    machine._id,
    {
      title: title !== undefined ? title : machine.title,
      description: description !== undefined ? description : machine.description,
      image: image !== undefined ? image : machine.image,
      specifications: specifications ? specifications.filter(spec => spec && spec.trim() !== '') : machine.specifications,
      capacity: capacity !== undefined ? capacity : machine.capacity,
      powerRequirement: powerRequirement !== undefined ? powerRequirement : machine.powerRequirement,
      category: category !== undefined ? category : machine.category,
      model: model !== undefined ? model : machine.model,
      yearManufactured: yearManufactured !== undefined ? yearManufactured : machine.yearManufactured,
      status: status !== undefined ? status : machine.status
    },
    { new: true, runValidators: true }
  );

  // Clean up old image if it changed
  if (oldImage && image && oldImage !== image) {
    deleteFile(oldImage);
  }

  // 🧠 INTELLIGENT AUTO-TRANSLATION
  const translationInfo = await handleMachineTranslations(
    machine._id,
    {
      title: req.body.title || machine.title,
      description: req.body.description || machine.description,
      specifications: req.body.specifications || machine.specifications,
      capacity: req.body.capacity || machine.capacity,
      powerRequirement: req.body.powerRequirement || machine.powerRequirement,
      model: req.body.model || machine.model
    },
    req.user.id
  );

  res.status(200).json({
    success: true,
    message: 'Machine updated successfully',
    data: machine,
    translationInfo
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

// @desc    Get single machine with translations
// @route   GET /api/machines/:id/:lang
// @access  Public
exports.getMachineWithTranslations = asyncHandler(async (req, res, next) => {
  const lang = req.params.lang || req.query.lang || 'en';
  const machineId = req.params.id;
  
  if (!['en', 'fr'].includes(lang)) {
    return next(new ErrorResponse('Invalid language. Supported: en, fr', 400));
  }

  const machine = await Machine.findOne({ id: machineId });
  
  if (!machine) {
    return next(new ErrorResponse(`Machine not found with id of ${machineId}`, 404));
  }

  // Get translations
  const translationKeys = [
    `machine.${machine._id}.title`,
    `machine.${machine._id}.description`,
    ...machine.specifications.map((_, index) => `machine.${machine._id}.spec_${index}`),
    `machine.${machine._id}.capacity`,
    `machine.${machine._id}.powerRequirement`,
    `machine.${machine._id}.model`
  ];

  const translations = await Translation.find({ 
    key: { $in: translationKeys } 
  });

  // Build translated response
  const translatedMachine = {
    ...machine.toObject(),
    title: translations.find(t => t.key === `machine.${machine._id}.title`)?.translations[lang] || machine.title,
    description: translations.find(t => t.key === `machine.${machine._id}.description`)?.translations[lang] || machine.description,
    specifications: machine.specifications.map((spec, index) => {
      const trans = translations.find(t => t.key === `machine.${machine._id}.spec_${index}`);
      return trans?.translations[lang] || spec;
    }),
    capacity: translations.find(t => t.key === `machine.${machine._id}.capacity`)?.translations[lang] || machine.capacity,
    powerRequirement: translations.find(t => t.key === `machine.${machine._id}.powerRequirement`)?.translations[lang] || machine.powerRequirement,
    model: translations.find(t => t.key === `machine.${machine._id}.model`)?.translations[lang] || machine.model
  };

  res.status(200).json({
    success: true,
    data: translatedMachine
  });
});

// @desc    Get all machines with translations
// @route   GET /api/machines/translated
// @access  Public
exports.getMachinesWithTranslations = asyncHandler(async (req, res, next) => {
  const lang = req.query.lang || 'en';
  
  if (!['en', 'fr'].includes(lang)) {
    return next(new ErrorResponse('Invalid language. Supported: en, fr', 400));
  }

  const machines = await Machine.find().sort({ createdAt: -1 });
  
  // Get all translation keys for all machines
  const allTranslationKeys = machines.flatMap(machine => [
    `machine.${machine._id}.title`,
    `machine.${machine._id}.description`,
    ...machine.specifications.map((_, index) => `machine.${machine._id}.spec_${index}`),
    `machine.${machine._id}.capacity`,
    `machine.${machine._id}.powerRequirement`,
    `machine.${machine._id}.model`
  ]);

  const translations = await Translation.find({ 
    key: { $in: allTranslationKeys } 
  });

  // Build translated machines
  const translatedMachines = machines.map(machine => {
    const machineId = machine._id;
    return {
      ...machine.toObject(),
      title: translations.find(t => t.key === `machine.${machineId}.title`)?.translations[lang] || machine.title,
      description: translations.find(t => t.key === `machine.${machineId}.description`)?.translations[lang] || machine.description,
      specifications: machine.specifications.map((spec, index) => {
        const trans = translations.find(t => t.key === `machine.${machineId}.spec_${index}`);
        return trans?.translations[lang] || spec;
      }),
      capacity: translations.find(t => t.key === `machine.${machineId}.capacity`)?.translations[lang] || machine.capacity,
      powerRequirement: translations.find(t => t.key === `machine.${machineId}.powerRequirement`)?.translations[lang] || machine.powerRequirement,
      model: translations.find(t => t.key === `machine.${machineId}.model`)?.translations[lang] || machine.model
    };
  });

  res.status(200).json({
    success: true,
    count: translatedMachines.length,
    data: translatedMachines
  });
});