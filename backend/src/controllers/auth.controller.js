const User = require('../models/User.model');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  
  // Validate email & password
  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
  }
  
  // Check for user
  const user = await User.findOne({ email }).select('+password');
  
  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }
  
  // Check if user has moderator or admin role
  if (user.role !== 'moderator' && user.role !== 'admin') {
    return next(new ErrorResponse('Access denied. Insufficient permissions.', 403));
  }
  
  // Check if user is active
  if (!user.isActive) {
    return next(new ErrorResponse('Account is deactivated. Please contact administrator.', 403));
  }
  
  // Check if password matches
  const isMatch = await user.comparePassword(password);
  
  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }
  
  sendTokenResponse(user, 200, res);
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  
  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Update user details
// @route   PUT /api/auth/updatedetails
// @access  Private
exports.updateDetails = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email
  };
  
  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true
  });
  
  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');
  
  // Check current password
  if (!(await user.comparePassword(req.body.currentPassword))) {
    return next(new ErrorResponse('Password is incorrect', 401));
  }
  
  user.password = req.body.newPassword;
  await user.save();
  
  sendTokenResponse(user, 200, res);
});

// @desc    Forgot password
// @route   POST /api/auth/forgotpassword
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  
  if (!user) {
    return next(new ErrorResponse('There is no user with that email', 404));
  }
  
  // Check if user has moderator or admin role
  if (user.role !== 'moderator' && user.role !== 'admin') {
    return next(new ErrorResponse('Password reset not available for this account type', 403));
  }
  
  // Get reset token
  const resetToken = user.getResetPasswordToken();
  
  await user.save({ validateBeforeSave: false });
  
  // Create reset url
  const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/resetpassword/${resetToken}`;
  
  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;
  
  try {
    await sendEmail({
      email: user.email,
      subject: 'Password reset token',
      message
    });
    
    res.status(200).json({ success: true, data: 'Email sent' });
  } catch (err) {
    console.log(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    
    await user.save({ validateBeforeSave: false });
    
    return next(new ErrorResponse('Email could not be sent', 500));
  }
});

// @desc    Reset password
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');
  
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });
  
  if (!user) {
    return next(new ErrorResponse('Invalid token', 400));
  }
  
  // Check if user has moderator or admin role
  if (user.role !== 'moderator' && user.role !== 'admin') {
    return next(new ErrorResponse('Password reset not available for this account type', 403));
  }
  
  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  
  sendTokenResponse(user, 200, res);
});

// @desc    Create admin/moderator user (Protected route - Admin only)
// @route   POST /api/auth/create-user
// @access  Private/Admin
exports.createUser = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;
  
  // Only admins can create new users
  if (req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to create users', 403));
  }
  
  // Only allow creation of moderator and admin roles
  if (role !== 'moderator' && role !== 'admin') {
    return next(new ErrorResponse('Invalid role. Only moderator and admin roles are allowed.', 400));
  }
  
  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role
  });
  
  res.status(201).json({
    success: true,
    data: user
  });
});

// @desc    Get all admin/moderator users (Protected route - Admin only)
// @route   GET /api/auth/users
// @access  Private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
  // Only admins can view users
  if (req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to view users', 403));
  }
  
  const users = await User.find({ 
    role: { $in: ['moderator', 'admin'] } 
  }).select('-password');
  
  res.status(200).json({
    success: true,
    count: users.length,
    data: users
  });
});

// @desc    Update user status (Protected route - Admin only)
// @route   PUT /api/auth/users/:id/status
// @access  Private/Admin
exports.updateUserStatus = asyncHandler(async (req, res, next) => {
  // Only admins can update user status
  if (req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to update user status', 403));
  }
  
  const { isActive } = req.body;
  
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isActive },
    { new: true, runValidators: true }
  );
  
  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }
  
  res.status(200).json({
    success: true,
    data: user
  });
});

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();
  
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax'
  };
  
  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      data: user
    });
};


// Add this to your existing auth.controller.js

// @desc    Forgot password
// @route   POST /api/auth/forgotpassword
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  
  if (!user) {
    return next(new ErrorResponse('There is no user with that email', 404));
  }
  
  // Check if user has moderator or admin role
  if (user.role !== 'moderator' && user.role !== 'admin') {
    return next(new ErrorResponse('Password reset not available for this account type', 403));
  }
  
  // Get reset token
  const resetToken = user.getResetPasswordToken();
  
  await user.save({ validateBeforeSave: false });
  
  // Create reset url - This should point to your frontend
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
  
  const message = `
    You are receiving this email because you (or someone else) has requested to reset your password.
    
    Please click the link below or copy and paste it into your browser to complete the process:
    
    ${resetUrl}
    
    This link will expire in 10 minutes.
    
    If you did not request this, please ignore this email and your password will remain unchanged.
  `;

  const htmlMessage = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0;">Password Reset Request</h1>
      </div>
      <div style="padding: 30px; background-color: #f7fafc;">
        <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <p style="color: #4a5568; line-height: 1.6; margin-bottom: 20px;">
            Hello <strong>${user.name}</strong>,
          </p>
          <p style="color: #4a5568; line-height: 1.6; margin-bottom: 20px;">
            You are receiving this email because you (or someone else) has requested to reset your password.
          </p>
          <p style="color: #4a5568; line-height: 1.6; margin-bottom: 30px;">
            Please click the button below to reset your password:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: white; 
                      padding: 15px 40px; 
                      text-decoration: none; 
                      border-radius: 8px; 
                      display: inline-block;
                      font-weight: bold;">
              Reset Password
            </a>
          </div>
          <p style="color: #718096; font-size: 14px; margin-top: 30px;">
            Or copy and paste this link into your browser:
          </p>
          <p style="color: #4299e1; font-size: 14px; word-break: break-all;">
            ${resetUrl}
          </p>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
            <p style="color: #e53e3e; font-size: 14px; margin: 0;">
              ⚠️ This link will expire in 10 minutes.
            </p>
          </div>
          <p style="color: #718096; font-size: 14px; margin-top: 20px;">
            If you did not request this password reset, please ignore this email and your password will remain unchanged.
          </p>
        </div>
      </div>
      <div style="padding: 20px; text-align: center; color: #718096; font-size: 12px;">
        <p>© ${new Date().getFullYear()} MECOSO. All rights reserved.</p>
      </div>
    </div>
  `;
  
  try {
    await sendEmail({
      email: user.email,
      subject: 'Password Reset Request - MECOSO',
      message: message,
      html: htmlMessage
    });
    
    res.status(200).json({ 
      success: true, 
      data: 'Password reset email sent successfully' 
    });
  } catch (err) {
    console.error('Email error:', err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    
    await user.save({ validateBeforeSave: false });
    
    return next(new ErrorResponse('Email could not be sent. Please check email configuration.', 500));
  }
});