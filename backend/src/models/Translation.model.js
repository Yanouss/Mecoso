const mongoose = require('mongoose');

const translationSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  translations: {
    en: {
      type: String,
      required: true
    },
    fr: {
      type: String,
      required: true
    }
  },
  category: {
    type: String,
    enum: ['hero', 'navbar', 'footer', 'services', 'about', 'contact', 'common', 'admin', 'gallery', 'machines'],
    default: 'common',
    index: true
  },
  isEditable: {
    type: Boolean,
    default: true
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

// Index for better search performance
translationSchema.index({ key: 'text', 'translations.en': 'text', 'translations.fr': 'text' });

// Static method to get all translations by category
translationSchema.statics.getByCategory = function(category) {
  return this.find({ category }).sort({ key: 1 });
};

// Static method to get translations for frontend
translationSchema.statics.getForFrontend = function() {
  return this.find({}, { key: 1, translations: 1, _id: 0 });
};

// Instance method to update translation
translationSchema.methods.updateTranslation = function(lang, value, userId) {
  this.translations[lang] = value;
  this.lastUpdated = new Date();
  this.updatedBy = userId;
  return this.save();
};

module.exports = mongoose.model('Translation', translationSchema);