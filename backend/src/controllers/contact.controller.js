const Contact = require('../models/Contact.model');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get contact information
// @route   GET /api/contact
// @access  Public
exports.getContact = asyncHandler(async (req, res, next) => {
  // Get the latest contact info or create default if none exists
  let contact = await Contact.findOne().sort({ createdAt: -1 });
  
  if (!contact) {
    // Create default contact information
    contact = await Contact.create({
      badge: "Get In Touch",
      heading: "Let's Build Something Amazing Together",
      description: "Ready to start your next construction project? Our expert team is here to turn your vision into reality with professional consultation and tailored solutions.",
      contactInfo: [
        {
          iconType: "MapPin",
          title: "Visit Our Atelier",
          details: [
            "Zone industrielle siege aprt 2 imm H 465 op raja",
            "Massira II, Marrakech 40000",
            "Morocco"
          ],
          accent: true
        },
        {
          iconType: "Phone",
          title: "Call Us",
          details: ["+212 603301313", "+212 808612536"]
        },
        {
          iconType: "Mail",
          title: "Email Us",
          details: ["entreprisemecoso@gmail.com"]
        },
        {
          iconType: "Clock",
          title: "Business Hours",
          details: ["Mon - Sat: 9:00 AM - 6:00 PM", "Sunday: Closed"]
        }
      ]
    });
  }
  
  res.status(200).json({
    success: true,
    data: contact
  });
});

// @desc    Update contact information
// @route   PUT /api/contact
// @access  Private (Moderator/Admin)
exports.updateContact = asyncHandler(async (req, res, next) => {
  let contact = await Contact.findOne().sort({ createdAt: -1 });
  
  if (!contact) {
    return next(new ErrorResponse('Contact information not found', 404));
  }
  
  const updateData = {
    ...req.body,
    lastUpdated: Date.now(),
    updatedBy: req.user.id
  };
  
  contact = await Contact.findByIdAndUpdate(
    contact._id,
    updateData,
    {
      new: true,
      runValidators: true
    }
  );
  
  res.status(200).json({
    success: true,
    data: contact
  });
});