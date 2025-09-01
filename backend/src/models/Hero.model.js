const mongoose = require('mongoose');

const heroSchema = new mongoose.Schema({
  badge: {
    type: String,
    default: 'Industrial Excellence'
  },
  heading: {
    type: String,
    required: true,
    default: 'Blocks Built With Shadcn & Tailwind'
  },
  description: {
    type: String,
    required: true,
    default: 'Finely crafted components built with React, Tailwind and Shadcn UI. Developers can copy and paste these blocks directly into their project.'
  },
  image: {
    src: {
      type: String,
      required: true,
      default: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2574&q=80'
    },
    alt: {
      type: String,
      default: 'Hero section demo image showing interface components'
    }
  },
  buttons: {
    primary: {
      text: {
        type: String,
        default: 'Start Your Project'
      },
      url: {
        type: String,
        default: '/contact'
      }
    },
    secondary: {
      text: {
        type: String,
        default: 'View Portfolio'
      },
      url: {
        type: String,
        default: '/portfolio'
      }
    }
  },
  isActive: {
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

module.exports = mongoose.model('Hero', heroSchema);