const mongoose = require('mongoose');

const heroSchema = new mongoose.Schema({
  badge: {
    type: String,
    default: 'Industrial Excellence',
    maxlength: [100, 'Badge text cannot exceed 100 characters']
  },
  heading: {
    type: String,
    required: [true, 'Heading is required'],
    default: 'Blocks Built With Shadcn & Tailwind',
    minlength: [5, 'Heading must be at least 5 characters long'],
    maxlength: [200, 'Heading cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    default: 'Finely crafted components built with React, Tailwind and Shadcn UI. Developers can copy and paste these blocks directly into their project.',
    minlength: [20, 'Description must be at least 20 characters long'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  image: {
    src: {
      type: String,
      required: [true, 'Image source is required'],
      default: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2574&q=80'
    },
    alt: {
      type: String,
      default: 'Hero section demo image showing interface components',
      maxlength: [200, 'Alt text cannot exceed 200 characters']
    }
  },
  buttons: {
    primary: {
      text: {
        type: String,
        default: 'Start Your Project',
        maxlength: [50, 'Primary button text cannot exceed 50 characters']
      },
      url: {
        type: String,
        default: '/contact',
        maxlength: [500, 'Primary button URL cannot exceed 500 characters'],
        validate: {
          validator: function(v) {
            // Allow relative paths or valid URLs
            return v.startsWith('/') || /^https?:\/\//.test(v);
          },
          message: 'Primary button URL must be a valid URL or relative path'
        }
      }
    },
    secondary: {
      text: {
        type: String,
        default: 'View Portfolio',
        maxlength: [50, 'Secondary button text cannot exceed 50 characters']
      },
      url: {
        type: String,
        default: '/portfolio',
        maxlength: [500, 'Secondary button URL cannot exceed 500 characters'],
        validate: {
          validator: function(v) {
            // Allow relative paths or valid URLs
            return v.startsWith('/') || /^https?:\/\//.test(v);
          },
          message: 'Secondary button URL must be a valid URL or relative path'
        }
      }
    }
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  version: {
    type: Number,
    default: 1
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  metadata: {
    totalViews: {
      type: Number,
      default: 0
    },
    lastViewed: {
      type: Date
    },
    deviceStats: {
      desktop: { type: Number, default: 0 },
      mobile: { type: Number, default: 0 },
      tablet: { type: Number, default: 0 }
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
heroSchema.index({ isActive: 1, lastUpdated: -1 });
heroSchema.index({ updatedBy: 1, lastUpdated: -1 });

// Virtual for checking if image is external
heroSchema.virtual('isExternalImage').get(function() {
  return this.image.src.startsWith('http');
});

// Virtual for getting relative image path
heroSchema.virtual('relativeImagePath').get(function() {
  if (this.image.src.includes('/uploads/')) {
    return this.image.src.substring(this.image.src.indexOf('/uploads/'));
  }
  return null;
});

// Pre-save middleware to handle versioning
heroSchema.pre('save', async function(next) {
  if (this.isNew) {
    // If this is a new hero and should be active, deactivate others
    if (this.isActive) {
      await this.constructor.updateMany(
        { _id: { $ne: this._id } },
        { isActive: false }
      );
    }
    
    // Set version number
    const lastVersion = await this.constructor.findOne().sort({ version: -1 });
    this.version = lastVersion ? lastVersion.version + 1 : 1;
  }
  
  next();
});

// Pre-save middleware to update lastUpdated when modified
heroSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.lastUpdated = Date.now();
  }
  next();
});

// Static method to get active hero
heroSchema.statics.getActive = function() {
  return this.findOne({ isActive: true });
};

// Static method to create backup
heroSchema.statics.createBackup = function() {
  return this.find().sort({ lastUpdated: -1 });
};

// Instance method to activate this hero
heroSchema.methods.activate = async function() {
  // Deactivate all others
  await this.constructor.updateMany(
    { _id: { $ne: this._id } },
    { isActive: false }
  );
  
  // Activate this one
  this.isActive = true;
  return await this.save();
};

// Instance method to increment view count
heroSchema.methods.incrementViews = function(deviceType = 'desktop') {
  this.metadata.totalViews += 1;
  this.metadata.lastViewed = new Date();
  
  if (deviceType && this.metadata.deviceStats[deviceType] !== undefined) {
    this.metadata.deviceStats[deviceType] += 1;
  }
  
  return this.save();
};

// Instance method to get analytics data
heroSchema.methods.getAnalytics = function() {
  return {
    totalViews: this.metadata.totalViews,
    lastViewed: this.metadata.lastViewed,
    deviceBreakdown: this.metadata.deviceStats,
    version: this.version,
    lastUpdated: this.lastUpdated,
    isActive: this.isActive
  };
};

// Pre-remove middleware to clean up image files
heroSchema.pre('remove', function(next) {
  const fs = require('fs');
  const path = require('path');
  
  // Only delete if it's a local upload
  if (this.image && this.image.src && this.image.src.includes('/uploads/')) {
    const filename = this.image.src.split('/').pop();
    const imagePath = path.join(__dirname, '..', 'uploads', filename);
    
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }
  
  next();
});

// Add text search index for better searchability
heroSchema.index({
  heading: 'text',
  description: 'text',
  badge: 'text',
  'buttons.primary.text': 'text',
  'buttons.secondary.text': 'text'
});

module.exports = mongoose.model('Hero', heroSchema);