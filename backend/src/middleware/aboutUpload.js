const multer = require('multer');
const path = require('path');
const ErrorResponse = require('../utils/errorResponse');

// Ensure uploads directory exists
const fs = require('fs');
const uploadsDir = path.join(__dirname, '..', 'uploads'); 
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Set storage engine for about uploads
const aboutStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    let prefix = 'about';
    
    // Determine file prefix based on fieldname
    if (file.fieldname === 'image') {
      prefix = 'about-main';
    } else if (file.fieldname.includes('backgroundImage')) {
      const index = file.fieldname.match(/stat_(\d+)_backgroundImage/)?.[1] || '0';
      prefix = `about-stat-${index}-bg`;
    } else if (file.fieldname.includes('popupImage')) {
      const index = file.fieldname.match(/stat_(\d+)_popupImage/)?.[1] || '0';
      prefix = `about-stat-${index}-popup`;
    } else if (file.fieldname.includes('video') || file.fieldname.includes('videoUrl')) {
      // Handle both 'value_X_video' and 'value_X_videoUrl' patterns
      const index = file.fieldname.match(/value_(\d+)_(?:video|videoUrl)/)?.[1] || '0';
      prefix = `about-value-${index}-video`;
    }
    
    cb(null, `${prefix}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// Check file type
function checkAboutFileType(file, cb) {
  // Allowed file types (extensions and mimetypes)
  const filetypes = /jpeg|jpg|png|gif|webp|mp4|webm|ogg|mov|avi|mkv/;
  const mimetypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'video/mp4',
    'video/webm',
    'video/ogg',
    'video/quicktime',   // .mov
    'video/x-msvideo',   // .avi
    'video/x-matroska'   // .mkv
  ];

  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = mimetypes.includes(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new ErrorResponse(
      'Error: Only images (JPEG, PNG, GIF, WebP) and videos (MP4, WebM, OGG, MOV, AVI, MKV) are allowed!',
      400
    ));
  }
}

// Configure multer for about uploads
const uploadAbout = multer({
  storage: aboutStorage,
  limits: { fileSize: 200 * 1024 * 1024 }, // 200MB limit
  fileFilter: function(req, file, cb) {
    checkAboutFileType(file, cb);
  }
});

// Dynamic fields configuration for about section
const aboutFields = [
  // Main image
  { name: 'image', maxCount: 1 },
  
  // Stats images (support up to 10 stats)
  ...Array.from({ length: 10 }, (_, i) => [
    { name: `stat_${i}_backgroundImage`, maxCount: 1 },
    { name: `stat_${i}_popupImage`, maxCount: 1 }
  ]).flat(),
  
  // Values videos (support both naming patterns)
  ...Array.from({ length: 10 }, (_, i) => [
    { name: `value_${i}_video`, maxCount: 1 },
    { name: `value_${i}_videoUrl`, maxCount: 1 } // Add support for videoUrl pattern
  ]).flat()
];

// Middleware function for about uploads
exports.uploadAboutFiles = uploadAbout.fields(aboutFields);

// Error handling middleware for multer errors
exports.handleAboutUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return next(new ErrorResponse('File too large. Maximum size is 200MB.', 400));
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return next(new ErrorResponse('Too many files uploaded.', 400));
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      console.log('Unexpected field name:', error.field); // Debug log
      return next(new ErrorResponse(`Unexpected field name in file upload: ${error.field}`, 400));
    }
  }
  
  if (error && error.message && error.message.includes('Only images')) {
    return next(new ErrorResponse(error.message, 400));
  }
  
  next(error);
};