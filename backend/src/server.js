const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth.routes');
const aboutRoutes = require('./routes/about.routes');
const heroRoutes = require('./routes/hero.routes');
const servicesRoutes = require('./routes/services.routes');
const testimonialsRoutes = require('./routes/testimonials.routes');
const machinesRoutes = require('./routes/machines.routes'); // Add machines routes
const galleryRoutes = require('./routes/gallery.routes');

// Import middleware
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow cross-origin resources
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:", "http:"],
      mediaSrc: ["'self'", "https:", "http:"],
    },
  },
}));

// Rate limiting - Separate limits for uploads vs regular API calls
// const generalLimiter = rateLimit({
//   windowMs: process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000, // 15 minutes
//   max: process.env.RATE_LIMIT_MAX_REQUESTS || 100,
//   message: 'Too many requests from this IP, please try again later.',
//   standardHeaders: true,
//   legacyHeaders: false,
// });

// const uploadLimiter = rateLimit({
//   windowMs: process.env.UPLOAD_RATE_LIMIT_WINDOW_MS || 60 * 60 * 1000, // 1 hour
//   max: process.env.UPLOAD_RATE_LIMIT_MAX_REQUESTS || 20, // More restrictive for uploads
//   message: 'Too many upload requests from this IP, please try again later.',
//   standardHeaders: true,
//   legacyHeaders: false,
// });

// Apply general rate limiting to all requests
// app.use(generalLimiter);

// CORS configuration - Updated to support multiple origins
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173', // Vite default port
  'http://localhost:5174', // Alternative Vite port
  process.env.CLIENT_URL,
  process.env.CLIENT_URL_PROD
].filter(Boolean); // Remove any undefined values



// Update your CORS configuration to handle preflight requests properly
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Range'],
  exposedHeaders: ['Content-Range', 'Content-Length']
}));



// Body parsing middleware - Increased limits for file uploads
app.use(express.json({ 
  limit: process.env.JSON_LIMIT || '50mb',
  verify: (req, res, buf) => {
    // Store raw body for webhook verification if needed
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ 
  extended: true, 
  limit: process.env.URLENCODED_LIMIT || '50mb' 
}));

// Static file serving with proper headers
app.use('/uploads', (req, res, next) => {
  // Set proper MIME types for videos
  if (req.url.match(/\.(mp4|webm|ogg|mov|avi|mkv)$/i)) {
    const ext = path.extname(req.url).toLowerCase();
    const mimeTypes = {
      '.mp4': 'video/mp4',
      '.webm': 'video/webm',
      '.ogg': 'video/ogg',
      '.mov': 'video/quicktime',
      '.avi': 'video/x-msvideo',
      '.mkv': 'video/x-matroska'
    };
    res.setHeader('Content-Type', mimeTypes[ext] || 'video/mp4');
  }
  
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'public, max-age=31536000');
  next();
}, express.static(path.join(__dirname, 'uploads'), {
  maxAge: '1y',
  etag: true,
  lastModified: true
}));


// Serve portfolio files
app.use('/portfolio', (req, res, next) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Disposition', 'attachment'); // Force download for portfolio files
  next();
}, express.static(path.join(__dirname, 'public', 'portfolio')));

// // Apply upload rate limiting to specific routes
// app.use('/api/about', uploadLimiter);
// app.use('/api/services', uploadLimiter);
// app.use('/api/testimonials', uploadLimiter);
// app.use('/api/hero', uploadLimiter);
// app.use('/api/machines', uploadLimiter); // Add machines to upload rate limiting

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/hero', heroRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/testimonials', testimonialsRoutes);
app.use('/api/machines', machinesRoutes); 
app.use('/api/gallery', galleryRoutes);

// Health check endpoint with more detailed information
app.get('/api/health', (req, res) => {
  const healthInfo = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV || 'development',
    mongoConnection: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  };
  
  res.status(200).json(healthInfo);
});

// API info endpoint
app.get('/api', (req, res) => {
  res.status(200).json({
    message: 'MECOSO Backend API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      about: '/api/about',
      hero: '/api/hero',
      services: '/api/services',
      testimonials: '/api/testimonials',
      machines: '/api/machines', // Add machines endpoint
      health: '/api/health'
    },
    documentation: 'Contact administrator for API documentation'
  });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use(/.*/, (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});


// Graceful shutdown handling
const gracefulShutdown = (signal) => {
  console.log(`Received ${signal}. Shutting down gracefully...`);
  
  // Close server
  if (server) {
    server.close(() => {
      console.log('HTTP server closed');
      
      // Close database connection
      mongoose.connection.close(false, () => {
        console.log('MongoDB connection closed');
        process.exit(0);
      });
    });
  }
};

// Handle various termination signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error('Unhandled Promise Rejection:', err);
  // Close server & exit process
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

// Database connection with retry logic
const connectDB = async (retries = 5) => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // Remove deprecated options
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`Connected to MongoDB Atlas: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    
    if (retries > 0) {
      console.log(`Retrying connection... ${retries} attempts left`);
      setTimeout(() => connectDB(retries - 1), 5000);
    } else {
      console.error('Failed to connect to MongoDB after all retries');
      process.exit(1);
    }
  }
};

// Start server
let server;
connectDB().then(() => {
  const PORT = process.env.PORT || 5000;
  server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
  });
});

module.exports = app;