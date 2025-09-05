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

const teamMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    default: ''
  },
  expertise: [{
    type: String
  }]
});

const partnerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  src: {
    type: String,
    required: true
  }
});

const aboutSchema = new mongoose.Schema({
  // Common fields for both home section and full page
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
  stats: [statSchema],
  values: [valueSchema],
  
  // Fields primarily for home section
  image: {
    type: String,
    default: '/images/team.jpg'
  },
  portfolioFileName: {
    type: String,
    default: 'MECOSO-Portfolio.pptx'
  },
  
  // Fields primarily for full about page
  vision: {
    type: String,
    default: 'To be the leading construction company that shapes the future of our cities through sustainable, innovative, and transformative building solutions.'
  },
  heroImage: {
    type: String,
    default: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1200&h=800&fit=crop'
  },
  team: [teamMemberSchema],
  partners: [partnerSchema],
  
  // Metadata
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