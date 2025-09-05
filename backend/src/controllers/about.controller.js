const About = require('../models/About.model');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const { deleteFile } = require('../utils/fileUtils');
const path = require('path');
const fs = require('fs');

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
    vision,
    portfolioFileName,
    heroImage
  } = req.body;

  // Parse JSON strings for complex objects
  let stats, values, team, partners;
  try {
    stats = req.body.stats ? JSON.parse(req.body.stats) : undefined;
    values = req.body.values ? JSON.parse(req.body.values) : undefined;
    team = req.body.team ? JSON.parse(req.body.team) : undefined;
    partners = req.body.partners ? JSON.parse(req.body.partners) : undefined;
  } catch (error) {
    return next(new ErrorResponse('Invalid JSON format in request data', 400));
  }

  let about = await About.findOne();
  
  if (!about) {
    about = new About({});
  }
  
  // Handle main image upload (for home section)
  if (req.files && req.files.image) {
    deleteFile(about.image);
    about.image = `/uploads/${req.files.image[0].filename}`;
  }

  // Handle hero image upload (for full page)
  if (req.files && req.files.heroImage) {
    deleteFile(about.heroImage);
    about.heroImage = `/uploads/${req.files.heroImage[0].filename}`;
  }

  // Handle stats with image uploads
  if (stats && Array.isArray(stats)) {
    const updatedStats = [];
    
    for (let i = 0; i < stats.length; i++) {
      const stat = { ...stats[i] };
      
      // Handle background image upload for this stat
      if (req.files && req.files[`stat_${i}_backgroundImage`]) {
        if (about.stats && about.stats[i]) {
          deleteFile(about.stats[i].backgroundImage);
        }
        stat.backgroundImage = `/uploads/${req.files[`stat_${i}_backgroundImage`][0].filename}`;
      }
      
      // Handle popup image upload for this stat
      if (req.files && req.files[`stat_${i}_popupImage`]) {
        if (about.stats && about.stats[i]) {
          deleteFile(about.stats[i].popupImage);
        }
        stat.popupImage = `/uploads/${req.files[`stat_${i}_popupImage`][0].filename}`;
      }
      
      updatedStats.push(stat);
    }
    
    about.stats = updatedStats;
  }

  // Handle values with video uploads
  if (values && Array.isArray(values)) {
    const updatedValues = [];
    
    for (let i = 0; i < values.length; i++) {
      const value = { ...values[i] };
      
      // Handle video upload for this value
      const videoFieldName = req.files && (req.files[`value_${i}_video`] || req.files[`value_${i}_videoUrl`]);
      
      if (videoFieldName) {
        console.log('Video upload detected:', {
          fieldName: Object.keys(req.files).find(key => key.includes(`value_${i}`)),
          fileName: videoFieldName[0].filename,
          originalName: videoFieldName[0].originalname,
          mimetype: videoFieldName[0].mimetype
        });
        
        if (about.values && about.values[i]) {
          deleteFile(about.values[i].videoUrl);
        }
        value.videoUrl = `/uploads/${videoFieldName[0].filename}`;
      }
      
      updatedValues.push(value);
    }
    
    about.values = updatedValues;
  }

  // Handle team members with image uploads
  if (team && Array.isArray(team)) {
    const updatedTeam = [];
    
    for (let i = 0; i < team.length; i++) {
      const member = { ...team[i] };
      
      // Handle team member image upload
      if (req.files && req.files[`team_${i}_image`]) {
        if (about.team && about.team[i]) {
          deleteFile(about.team[i].image);
        }
        member.image = `/uploads/${req.files[`team_${i}_image`][0].filename}`;
      }
      
      updatedTeam.push(member);
    }
    
    about.team = updatedTeam;
  }

  // Handle partners with logo uploads
  if (partners && Array.isArray(partners)) {
    const updatedPartners = [];
    
    for (let i = 0; i < partners.length; i++) {
      const partner = { ...partners[i] };
      
      // Handle partner logo upload
      if (req.files && req.files[`partner_${i}_src`]) {
        if (about.partners && about.partners[i]) {
          deleteFile(about.partners[i].src);
        }
        partner.src = `/uploads/${req.files[`partner_${i}_src`][0].filename}`;
      }
      
      updatedPartners.push(partner);
    }
    
    about.partners = updatedPartners;
  }
  
  // Update text fields if provided
  if (badge !== undefined) about.badge = badge;
  if (heading !== undefined) about.heading = heading;
  if (description !== undefined) about.description = description;
  if (story !== undefined) about.story = story;
  if (mission !== undefined) about.mission = mission;
  if (vision !== undefined) about.vision = vision;
  if (portfolioFileName !== undefined) about.portfolioFileName = portfolioFileName;
  if (heroImage !== undefined && !req.files?.heroImage) about.heroImage = heroImage;
  
  about.lastUpdated = Date.now();
  about.updatedBy = req.user.id;
  
  await about.save();
  
  res.status(200).json({
    success: true,
    data: about
  });
});

// @desc    Upload portfolio file
// @route   POST /api/about/portfolio
// @access  Private (Moderator/Admin)
exports.uploadPortfolio = asyncHandler(async (req, res, next) => {
  if (!req.files || !req.files.portfolio) {
    return next(new ErrorResponse('Please upload a portfolio file', 400));
  }

  const file = req.files.portfolio[0];
  
  // Validate file type (presentations only)
  const allowedTypes = ['.pptx', '.ppt', '.pdf'];
  const fileExt = path.extname(file.originalname).toLowerCase();
  
  if (!allowedTypes.includes(fileExt)) {
    return next(new ErrorResponse('Please upload a valid portfolio file (PPTX, PPT, or PDF)', 400));
  }

  let about = await About.findOne();
  
  if (!about) {
    about = new About({});
  }

  // Delete old portfolio file if it exists
  if (about.portfolioFileName) {
    const oldPortfolioPath = path.join(__dirname, '..', 'public', 'portfolio', about.portfolioFileName);
    if (fs.existsSync(oldPortfolioPath)) {
      fs.unlinkSync(oldPortfolioPath);
    }
  }

  // Move file to portfolio directory
  const portfolioDir = path.join(__dirname, '..', 'public', 'portfolio');
  if (!fs.existsSync(portfolioDir)) {
    fs.mkdirSync(portfolioDir, { recursive: true });
  }

  const fileName = `MECOSO-Portfolio-${Date.now()}${fileExt}`;
  const filePath = path.join(portfolioDir, fileName);
  
  fs.copyFileSync(file.path, filePath);
  fs.unlinkSync(file.path); // Remove from uploads temp location

  about.portfolioFileName = fileName;
  about.lastUpdated = Date.now();
  about.updatedBy = req.user.id;
  
  await about.save();
  
  res.status(200).json({
    success: true,
    data: {
      portfolioFileName: fileName,
      message: 'Portfolio file uploaded successfully'
    }
  });
});