const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  badge: {
    type: String,
    required: true,
    trim: true
  },
  heading: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  contactInfo: [{
    iconType: {
      type: String,
      enum: ['MapPin', 'Phone', 'Mail', 'Clock'],
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    details: [{
      type: String,
      trim: true
    }],
    accent: {
      type: Boolean,
      default: false
    }
  }],
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

module.exports = mongoose.model('Contact', contactSchema);