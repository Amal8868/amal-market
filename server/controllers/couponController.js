const Coupon = require('../models/Coupon');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Create a new coupon
// @route   POST /api/coupons
// @access  Private/Admin
exports.createCoupon = asyncHandler(async (req, res, next) => {
  const { code, discountType, discountValue, minOrderAmount, expiryDate, usageLimit, isActive } = req.body;

  if (!code || !discountType || !discountValue || !expiryDate) {
    return next(new ErrorResponse('Please provide code, discountType, discountValue, and expiryDate', 400));
  }

  const alreadyExists = await Coupon.findOne({ code: code.toUpperCase() });
  if (alreadyExists) {
    return next(new ErrorResponse('Coupon code already exists', 400));
  }

  const coupon = await Coupon.create({
    code: code.toUpperCase(),
    discountType,
    discountValue,
    minOrderAmount,
    expiryDate,
    usageLimit,
    isActive
  });

  res.status(201).json({ success: true, data: coupon });
});

// @desc    Get all coupons
// @route   GET /api/coupons
// @access  Private/Admin
exports.getAllCoupons = asyncHandler(async (req, res, next) => {
  const coupons = await Coupon.find().sort('-createdAt');
  res.status(200).json({ success: true, count: coupons.length, data: coupons });
});

// @desc    Get a single coupon
// @route   GET /api/coupons/:id
// @access  Private/Admin
exports.getCoupon = asyncHandler(async (req, res, next) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) {
    return next(new ErrorResponse('Coupon not found', 404));
  }
  res.status(200).json({ success: true, data: coupon });
});

// @desc    Update a coupon
// @route   PUT /api/coupons/:id
// @access  Private/Admin
exports.updateCoupon = asyncHandler(async (req, res, next) => {
  const allowedFields = ['discountType', 'discountValue', 'minOrderAmount', 'expiryDate', 'usageLimit', 'isActive'];
  const updateData = {};
  allowedFields.forEach(f => { if (req.body[f] !== undefined) updateData[f] = req.body[f]; });

  const coupon = await Coupon.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
  if (!coupon) {
    return next(new ErrorResponse('Coupon not found', 404));
  }
  res.status(200).json({ success: true, data: coupon });
});

// @desc    Delete a coupon
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
exports.deleteCoupon = asyncHandler(async (req, res, next) => {
  const coupon = await Coupon.findByIdAndDelete(req.params.id);
  if (!coupon) {
    return next(new ErrorResponse('Coupon not found', 404));
  }
  res.status(200).json({ success: true, data: {} });
});

// @desc    Validate a coupon code
// @route   GET /api/coupons/validate/:code
// @access  Private
exports.validateCoupon = asyncHandler(async (req, res, next) => {
  const code = req.params.code.toUpperCase();
  const total = parseFloat(req.query.total) || 0;

  const coupon = await Coupon.findOne({ code });

  if (!coupon) {
    return next(new ErrorResponse('Invalid promo code', 404));
  }

  if (!coupon.isActive) {
    return next(new ErrorResponse('This promo code has been deactivated', 400));
  }

  if (new Date() > new Date(coupon.expiryDate)) {
    return next(new ErrorResponse('This promo code has expired', 400));
  }

  if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
    return next(new ErrorResponse('This promo code usage limit has been reached', 400));
  }

  if (total < coupon.minOrderAmount) {
    return next(
      new ErrorResponse(`This promo code requires a minimum order amount of $${coupon.minOrderAmount.toFixed(2)}`, 400)
    );
  }

  res.status(200).json({
    success: true,
    message: 'Promo code applied successfully!',
    data: {
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minOrderAmount: coupon.minOrderAmount
    }
  });
});

