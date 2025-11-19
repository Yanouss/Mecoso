const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true
  },
  role: {
    type: String,
    required: [true, 'Please add a role'],
    trim: true
  },
  company: {
    type: String,
    required: [true, 'Please add a company'],
    trim: true
  },
  content: {
    type: String,
    required: [true, 'Please add testimonial content']
  },
  rating: {
    type: Number,
    required: [true, 'Please add a rating'],
    min: 1,
    max: 5,
    default: 5
  },
  image: {
    type: String,
    required: [true, 'Please add an image']
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  translationKeys: {
    name: { type: String, default: null },
    role: { type: String, default: null },
    company: { type: String, default: null },
    content: { type: String, default: null }
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

testimonialSchema.statics.generateTranslationKey = function(testimonialId, field) {
  return `testimonial.${testimonialId}.${field}`;
};

module.exports = mongoose.model('Testimonial', testimonialSchema);