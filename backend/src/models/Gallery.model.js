const mongoose = require('mongoose');

const galleryItemSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  size: {
    type: String,
    required: true,
    enum: ['small', 'medium', 'large'],
    default: 'medium'
  }
}, {
  timestamps: true
});

const galleryPageSchema = new mongoose.Schema({
  badge: {
    type: String,
    required: true,
    default: "Our Portfolio"
  },
  heading: {
    type: String,
    required: true,
    default: "Project Gallery"
  },
  description: {
    type: String,
    required: true,
    default: "Explore our completed projects and industrial solutions..."
  }
}, {
  timestamps: true
});

module.exports = {
  GalleryItem: mongoose.model('GalleryItem', galleryItemSchema),
  GalleryPage: mongoose.model('GalleryPage', galleryPageSchema)
};