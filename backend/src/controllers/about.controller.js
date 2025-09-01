const About = require('../models/About.model');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get about content
// @route   GET /api/about
// @access  Public
exports.getAbout = asyncHandler(async (req, res, next) => {
  let about = await About.findOne();
  
  // If no about content exists, create default
  if (!about) {
    about = await About.create({});
  }
  
  res.status(200).json({
    success: true,
    data: about
  });
});

// @desc    Update about content
// @route   PUT /api/about
// @access  Private (Moderator/Admin)
exports.updateAbout = asyncHandler(async (req, res, next) => {
  const {
    badge,
    heading,
    description,
    story,
    mission,
    image,
    portfolioFileName,
    stats,
    values
  } = req.body;

  let about = await About.findOne();
  
  if (!about) {
    about = new About({});
  }
  
  // Update fields if provided
  if (badge !== undefined) about.badge = badge;
  if (heading !== undefined) about.heading = heading;
  if (description !== undefined) about.description = description;
  if (story !== undefined) about.story = story;
  if (mission !== undefined) about.mission = mission;
  if (image !== undefined) about.image = image;
  if (portfolioFileName !== undefined) about.portfolioFileName = portfolioFileName;
  if (stats !== undefined) about.stats = stats;
  if (values !== undefined) about.values = values;
  
  about.lastUpdated = Date.now();
  about.updatedBy = req.user.id;
  
  await about.save();
  
  res.status(200).json({
    success: true,
    data: about
  });
});