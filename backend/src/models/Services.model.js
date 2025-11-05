const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
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
  features: [{
    type: String,
    trim: true
  }],
  duration: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    trim: true
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
    title: { type: String, default: null },
    description: { type: String, default: null },
    features: [{ type: String, default: null }]
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

serviceSchema.statics.generateTranslationKey = function(serviceId, field, index = null) {
  if (field === 'features' && index !== null) {
    return `service.${serviceId}.feature_${index}`;
  }
  return `service.${serviceId}.${field}`;
};

module.exports = mongoose.model('Service', serviceSchema);