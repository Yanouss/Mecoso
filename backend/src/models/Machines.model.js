const mongoose = require('mongoose');

const machineSchema = new mongoose.Schema({
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
    default: ''
  },
  image: {
    type: String,
    default: ''
  },
  specifications: [{
    type: String,
    required: true
  }],
  capacity: {
    type: String,
    default: ''
  },
  powerRequirement: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    required: true,
    enum: ['Cutting', 'Forming', 'Handling', 'Welding', 'Assembly', 'Testing', 'Other']
  },
  model: {
    type: String,
    default: ''
  },
  yearManufactured: {
    type: String,
    default: '',
    validate: {
      validator: function(v) {
        if (!v || v === '') return true; // Allow empty values
        return /^\d{4}$/.test(v) && parseInt(v) >= 1900 && parseInt(v) <= new Date().getFullYear() + 1;
      },
      message: 'Year must be a valid 4-digit year or empty'
    }
  },
  status: {
    type: String,
    enum: ['Available', 'In Use', 'Maintenance'],
    default: 'Available'
  }
}, {
  timestamps: true
});

// Indexes for better query performance
machineSchema.index({ category: 1 });
machineSchema.index({ status: 1 });
machineSchema.index({ title: 1 });

module.exports = mongoose.model('Machine', machineSchema);