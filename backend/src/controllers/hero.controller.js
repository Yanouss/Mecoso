const Hero = require('../models/Hero.model');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get hero content
// @route   GET /api/hero
// @access  Public
exports.getHero = asyncHandler(async (req, res, next) => {
  let hero = await Hero.findOne({ isActive: true });
  
  // If no hero content exists, create default
  if (!hero) {
    hero = await Hero.create({});
  }
  
  res.status(200).json({
    success: true,
    data: hero
  });
});

// @desc    Update hero content
// @route   PUT /api/hero
// @access  Private (Moderator/Admin)
exports.updateHero = asyncHandler(async (req, res, next) => {
  const {
    badge,
    heading,
    description,
    image,
    buttons
  } = req.body;

  let hero = await Hero.findOne();
  
  if (!hero) {
    hero = new Hero({});
  }
  
  // Update fields if provided
  if (badge !== undefined) hero.badge = badge;
  if (heading !== undefined) hero.heading = heading;
  if (description !== undefined) hero.description = description;
  if (image !== undefined) hero.image = image;
  if (buttons !== undefined) hero.buttons = buttons;
  
  hero.lastUpdated = Date.now();
  hero.updatedBy = req.user.id;
  
  await hero.save();
  
  res.status(200).json({
    success: true,
    data: hero
  });
});