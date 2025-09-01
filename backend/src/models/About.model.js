const mongoose = require('mongoose');

const statSchema = new mongoose.Schema({
  number: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: 'Target'
  },
  backgroundImage: {
    type: String,
    default: ''
  },
  popupImage: {
    type: String,
    default: ''
  },
  popupTitle: {
    type: String,
    default: ''
  },
  popupDescription: {
    type: String,
    default: ''
  }
});

const valueSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: 'Target'
  },
  videoUrl: {
    type: String,
    default: ''
  }
});

const aboutSchema = new mongoose.Schema({
  badge: {
    type: String,
    default: 'About Our Company'
  },
  heading: {
    type: String,
    default: 'Building Tomorrow\'s Infrastructure Today'
  },
  description: {
    type: String,
    default: 'Our commitment to quality, safety, and innovation has made us a leader in the industrial metalwork sector in Morocco.'
  },
  story: {
    type: String,
    default: 'Founded in 2005 by KACEMY Abderahman, MECOSO has grown from a specialized boilermaking workshop into Morocco\'s leading provider of comprehensive industrial metalwork solutions.'
  },
  mission: {
    type: String,
    default: 'To provide comprehensive, high-quality metalwork solutions that meet the evolving needs of modern industry while maintaining the highest standards of safety, quality, and customer satisfaction'
  },
  image: {
    type: String,
    default: '/images/team.jpg'
  },
  portfolioFileName: {
    type: String,
    default: 'MECOSO-Portfolio.pptx'
  },
  stats: [statSchema],
  values: [valueSchema],
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

module.exports = mongoose.model('About', aboutSchema);