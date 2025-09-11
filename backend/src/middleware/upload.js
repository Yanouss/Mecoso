const multer = require('multer');
const path = require('path');
const ErrorResponse = require('../utils/errorResponse');

// Ensure uploads directory exists
const fs = require('fs');
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Ensure portfolio directory exists
const portfolioDir = path.join(__dirname, '..', 'public', 'portfolio');
if (!fs.existsSync(portfolioDir)) {
  fs.mkdirSync(portfolioDir, { recursive: true });
}

// Storage configuration for regular uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    // Portfolio files go to portfolio directory
    if (file.fieldname === 'portfolio') {
      cb(null, uploadsDir); // Temp location, will be moved in controller
    } else {
      cb(null, uploadsDir);
    }
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    let prefix = 'file';
    
    // Determine file prefix based on fieldname
    if (file.fieldname === 'image') {
      prefix = 'about-main';
    } else if (file.fieldname === 'heroImage') {
      prefix = 'about-hero';
    } else if (file.fieldname.includes('backgroundImage')) {
      const index = file.fieldname.match(/stat_(\d+)_backgroundImage/)?.[1] || '0';
      prefix = `about-stat-${index}-bg`;
    } else if (file.fieldname.includes('popupImage')) {
      const index = file.fieldname.match(/stat_(\d+)_popupImage/)?.[1] || '0';
      prefix = `about-stat-${index}-popup`;
    } else if (file.fieldname.includes('video') || file.fieldname.includes('videoUrl')) {
      const index = file.fieldname.match(/value_(\d+)_(?:video|videoUrl)/)?.[1] || '0';
      prefix = `about-value-${index}-video`;
    } else if (file.fieldname.includes('team_') && file.fieldname.includes('_image')) {
      const index = file.fieldname.match(/team_(\d+)_image/)?.[1] || '0';
      prefix = `about-team-${index}`;
    } else if (file.fieldname.includes('partner_') && file.fieldname.includes('_src')) {
      const index = file.fieldname.match(/partner_(\d+)_src/)?.[1] || '0';
      prefix = `about-partner-${index}`;
    } else if (file.fieldname === 'portfolio') {
      prefix = 'portfolio-temp';
    } else if (file.fieldname.startsWith('service')) {
      prefix = 'service';
    } else if (file.fieldname.startsWith('testimonial')) {
      prefix = 'testimonial';
    } else if (file.fieldname.startsWith('machine') || file.fieldname === 'machineImage') {
      // Handle machine image uploads
      const index = file.fieldname.match(/machine_(\d+)_image/)?.[1] || '';
      prefix = index ? `machine-${index}` : 'machine';
    }
    
    cb(null, `${prefix}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// File type validation
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif|webp|svg|mp4|webm|ogg|mov|avi|mkv|pptx|ppt|pdf/;
  const imageMimetypes = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml'
  ];
  const videoMimetypes = [
    'video/mp4',
    'video/webm',
    'video/ogg',
    'video/quicktime',
    'video/x-msvideo',
    'video/x-matroska'
  ];
  const documentMimetypes = [
    'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
    'application/vnd.ms-powerpoint', // .ppt
    'application/pdf' // .pdf
  ];

  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = [...imageMimetypes, ...videoMimetypes, ...documentMimetypes].includes(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new ErrorResponse(
      'Error: Only images (JPEG, PNG, GIF, WebP, SVG), videos (MP4, WebM, OGG, MOV, AVI, MKV), and presentations (PPTX, PPT, PDF) are allowed!',
      400
    ));
  }
}

// Configure multer
const upload = multer({
  storage: storage,
  limits: { fileSize: 200 * 1024 * 1024 }, // 200MB limit
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
});

// About section fields configuration
const aboutFields = [
  // Main images
  { name: 'image', maxCount: 1 },
  { name: 'heroImage', maxCount: 1 },
  { name: 'portfolio', maxCount: 1 },
  
  // Stats images (support up to 20 stats)
  ...Array.from({ length: 20 }, (_, i) => [
    { name: `stat_${i}_backgroundImage`, maxCount: 1 },
    { name: `stat_${i}_popupImage`, maxCount: 1 }
  ]).flat(),
  
  // Values videos (support up to 20 values)
  ...Array.from({ length: 20 }, (_, i) => [
    { name: `value_${i}_video`, maxCount: 1 },
    { name: `value_${i}_videoUrl`, maxCount: 1 }
  ]).flat(),
  
  // Team member images (support up to 20 team members)
  ...Array.from({ length: 20 }, (_, i) => [
    { name: `team_${i}_image`, maxCount: 1 }
  ]).flat(),
  
  // Partner logos (support up to 50 partners)
  ...Array.from({ length: 50 }, (_, i) => [
    { name: `partner_${i}_src`, maxCount: 1 }
  ]).flat(),
  
  // Other uploads
  { name: 'images', maxCount: 10 } // For multiple file uploads
];

// Machine fields configuration (support up to 50 machines)
const machineFields = [
  // Individual machine images
  ...Array.from({ length: 50 }, (_, i) => [
    { name: `machine_${i}_image`, maxCount: 1 }
  ]).flat(),
  
  // General machine image upload - ADD THIS FOR SINGLE UPLOADS
  { name: 'image', maxCount: 1 },
  { name: 'machineImage', maxCount: 1 },
  { name: 'images', maxCount: 20 } // For multiple machine images
];

// Middleware functions
exports.uploadSingle = upload.single('image');
exports.uploadMultiple = upload.array('images', 10);
exports.uploadServiceImage = upload.single('image');
exports.uploadTestimonialImage = upload.single('image');
exports.uploadAboutFiles = upload.fields(aboutFields);
exports.uploadPortfolioFile = upload.fields([{ name: 'portfolio', maxCount: 1 }]);
exports.uploadMachineFiles = upload.fields(machineFields);
exports.uploadMachineImage = upload.single('image');

// Error handling middleware
exports.handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return next(new ErrorResponse('File too large. Maximum size is 200MB.', 400));
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return next(new ErrorResponse('Too many files uploaded.', 400));
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      console.log('Unexpected field name:', error.field);
      return next(new ErrorResponse(`Unexpected field name in file upload: ${error.field}`, 400));
    }
  }
  
  if (error && error.message && (error.message.includes('Only images') || error.message.includes('allowed'))) {
    return next(new ErrorResponse(error.message, 400));
  }
  
  next(error);
};