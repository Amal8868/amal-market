const Discount = require('../models/Discount');
const Product = require('../models/Product');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Create a new discount
// @route   POST /api/discounts
// @access  Private/Admin
exports.createDiscount = asyncHandler(async (req, res, next) => {
  const { product, type, value, startDate, endDate, isActive } = req.body;

  if (!product || !type || value === undefined || !startDate || !endDate) {
    return next(new ErrorResponse('Please provide product, type, value, startDate, and endDate', 400));
  }

  const dbProduct = await Product.findById(product);
  if (!dbProduct) {
    return next(new ErrorResponse('Product not found', 404));
  }

  // Validate discount value
  if (type === 'percentage' && value > 100) {
    return next(new ErrorResponse('Percentage discount cannot exceed 100%', 400));
  }
  if (type === 'fixed' && value > dbProduct.price) {
    return next(new ErrorResponse(`Fixed discount cannot be higher than product price ($${dbProduct.price})`, 400));
  }

  // Check if there is already an overlapping active discount for this product
  const overlapping = await Discount.findOne({
    product,
    isActive: true,
    $or: [
      { startDate: { $lte: new Date(endDate) }, endDate: { $gte: new Date(startDate) } }
    ]
  });

  if (overlapping && isActive !== false) {
    return next(new ErrorResponse('An active discount already exists for this product during the specified dates', 400));
  }

  const discount = await Discount.create({
    product,
    type,
    value: Number(value),
    startDate: new Date(startDate),
    endDate: new Date(endDate),
    isActive: isActive !== undefined ? isActive : true
  });

  res.status(201).json({ success: true, data: discount });
});

// @desc    Get all discounts
// @route   GET /api/discounts
// @access  Private/Admin
exports.getDiscounts = asyncHandler(async (req, res, next) => {
  const discounts = await Discount.find()
    .populate('product', 'name price image categoryName')
    .sort('-createdAt');

  res.status(200).json({ success: true, count: discounts.length, data: discounts });
});

// @desc    Get a single discount
// @route   GET /api/discounts/:id
// @access  Private/Admin
exports.getDiscount = asyncHandler(async (req, res, next) => {
  const discount = await Discount.findById(req.params.id).populate('product', 'name price image');

  if (!discount) {
    return next(new ErrorResponse('Discount not found', 404));
  }

  res.status(200).json({ success: true, data: discount });
});

// @desc    Update a discount
// @route   PUT /api/discounts/:id
// @access  Private/Admin
exports.updateDiscount = asyncHandler(async (req, res, next) => {
  const { type, value, startDate, endDate, isActive } = req.body;

  let discount = await Discount.findById(req.params.id);
  if (!discount) {
    return next(new ErrorResponse('Discount not found', 404));
  }

  const dbProduct = await Product.findById(discount.product);
  if (!dbProduct) {
    return next(new ErrorResponse('Associated product not found', 404));
  }

  const proposedType = type || discount.type;
  const proposedValue = value !== undefined ? Number(value) : discount.value;
  const proposedStartDate = startDate ? new Date(startDate) : discount.startDate;
  const proposedEndDate = endDate ? new Date(endDate) : discount.endDate;
  const proposedIsActive = isActive !== undefined ? isActive : discount.isActive;

  // Validate discount value
  if (proposedType === 'percentage' && proposedValue > 100) {
    return next(new ErrorResponse('Percentage discount cannot exceed 100%', 400));
  }
  if (proposedType === 'fixed' && proposedValue > dbProduct.price) {
    return next(new ErrorResponse(`Fixed discount cannot be higher than product price ($${dbProduct.price})`, 400));
  }

  if (proposedEndDate < proposedStartDate) {
    return next(new ErrorResponse('End date must be after start date', 400));
  }

  // Check overlap for other discounts if active
  if (proposedIsActive) {
    const overlapping = await Discount.findOne({
      _id: { $ne: req.params.id },
      product: discount.product,
      isActive: true,
      $or: [
        { startDate: { $lte: proposedEndDate }, endDate: { $gte: proposedStartDate } }
      ]
    });

    if (overlapping) {
      return next(new ErrorResponse('An overlapping active discount already exists for this product', 400));
    }
  }

  discount.type = proposedType;
  discount.value = proposedValue;
  discount.startDate = proposedStartDate;
  discount.endDate = proposedEndDate;
  discount.isActive = proposedIsActive;

  await discount.save();

  res.status(200).json({ success: true, data: discount });
});

// @desc    Delete a discount
// @route   DELETE /api/discounts/:id
// @access  Private/Admin
exports.deleteDiscount = asyncHandler(async (req, res, next) => {
  const discount = await Discount.findByIdAndDelete(req.params.id);

  if (!discount) {
    return next(new ErrorResponse('Discount not found', 404));
  }

  res.status(200).json({ success: true, data: {} });
});
