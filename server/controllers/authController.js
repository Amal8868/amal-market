const User = require('../models/User');
const jwt = require('jsonwebtoken');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, phone, address } = req.body;

  if (!phone || !address) {
    return next(new ErrorResponse('Please provide both phone number and shipping address', 400));
  }

  const cleanPhone = phone.replace(/[\s\-]/g, '');
  if (!/^(\+?252)?(0)?(61|62|68|77)\d{7}$/.test(cleanPhone)) {
    return next(
      new ErrorResponse('Please provide a valid Somalia mobile number (prefixes: 061, 062, 068, 077)', 400)
    );
  }

  if (address.trim().length < 8) {
    return next(
      new ErrorResponse('Delivery address is too short. Please include your neighborhood (e.g., Wadajir, Suuqa Weyn)', 400)
    );
  }

  // Create user — role is always 'user' on public registration
  const user = await User.create({
    name,
    email,
    password,
    phone,
    address,
    role: 'user'
  });

  sendTokenResponse(user, 200, res);
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Check for email and password
  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
  }

  // Check for user
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  sendTokenResponse(user, 200, res);
});

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });

  const options = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    httpOnly: true,
    sameSite: 'lax'
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
    options.sameSite = 'strict';
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role
      }
    });
};

// @desc    Log user out / clear cookie
// @route   POST /api/auth/logout
// @access  Public
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Get all users (Admin only)
// @route   GET /api/auth/users
// @access  Private/Admin
exports.getAllUsers = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const search = req.query.search || '';
  const skip = (page - 1) * limit;

  const query = {};
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } }
    ];
  }

  // Fallback to fetch all if limit is explicitly requested to be huge (e.g. for complete exports)
  const isExport = req.query.export === 'true';
  const finalLimit = isExport ? 0 : limit;

  const total = await User.countDocuments(query);
  const users = await User.find(query)
    .select('-password')
    .sort('-createdAt')
    .skip(isExport ? 0 : skip)
    .limit(finalLimit);

  res.status(200).json({ 
    success: true, 
    count: users.length, 
    total,
    totalPages: isExport ? 1 : Math.ceil(total / limit),
    currentPage: isExport ? 1 : page,
    data: users 
  });
});

// @desc    Update current logged in user details
// @route   PUT /api/auth/me
// @access  Private
exports.updateMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  // Whitelist fields
  const { name, phone, address, password, currentPassword } = req.body;

  if (name) user.name = name;
  
  if (phone) {
    const cleanPhone = phone.replace(/[\s\-]/g, '');
    if (!/^(\+?252)?(0)?(61|62|68|77)\d{7}$/.test(cleanPhone)) {
      return next(
        new ErrorResponse('Please provide a valid Somalia mobile number (prefixes: 061, 062, 068, 077)', 400)
      );
    }
    user.phone = phone;
  }
  
  if (address) {
    if (address.trim().length < 8) {
      return next(
        new ErrorResponse('Delivery address is too short. Please include your neighborhood (e.g., Wadajir, Suuqa Weyn)', 400)
      );
    }
    user.address = address;
  }
  
  if (password) {
    if (!currentPassword) {
      return next(new ErrorResponse('Please provide your current password to change it', 400));
    }
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return next(new ErrorResponse('Current password is incorrect', 401));
    }
    if (password.length < 6) {
      return next(new ErrorResponse('Password must be at least 6 characters', 400));
    }
    user.password = password;
  }

  await user.save();

  res.status(200).json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      role: user.role
    }
  });
});

