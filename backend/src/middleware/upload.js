const multer = require('multer');
const path = require('path');
const ErrorResponse = require('../utils/errorResponse');

// Ensure uploads directory exists - FIXED PATH
const fs = require('fs');
const uploadsDir = path.join(__dirname, '..', 'uploads'); 
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Set storage engine
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `service-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// Check file type
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif|webp/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new ErrorResponse('Error: Images only! (JPEG, JPG, PNG, GIF, WebP)', 400));
  }
}

// Init upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 200 * 1024 * 1024 }, // 200MB limit
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
});

// Middleware function
exports.uploadServiceImage = upload.single('image');

// Middleware for multiple files (if needed in future)
exports.uploadMultiple = upload.array('images', 10);

// ... existing code ...

// Testimonial image upload
const testimonialStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `testimonial-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const uploadTestimonial = multer({
  storage: testimonialStorage,
  limits: { fileSize: 200 * 1024 * 1024 },
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
});

// Middleware functions
exports.uploadTestimonialImage = uploadTestimonial.single('image');