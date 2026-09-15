const Product = require('../models/Product');
const Category = require('../models/Category');
const Review = require('../models/Review');
const Discount = require('../models/Discount');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// Helper to apply active discounts to products
const getDiscountedProducts = async (products) => {
  const isArray = Array.isArray(products);
  const prodArray = isArray ? products : [products];
  const prodIds = prodArray.map(p => p._id);

  const now = new Date();
  const activeDiscounts = await Discount.find({
    product: { $in: prodIds },
    isActive: true,
    startDate: { $lte: now },
    endDate: { $gte: now }
  });

  const discountMap = {};
  activeDiscounts.forEach(d => {
    discountMap[d.product.toString()] = d;
  });

  const results = prodArray.map(p => {
    const pObj = p.toObject ? p.toObject() : p;
    const discount = discountMap[pObj._id.toString()];

    if (discount) {
      let discountedPrice = pObj.price;
      let discountPercentage = 0;

      if (discount.type === 'percentage') {
        discountPercentage = discount.value;
        discountedPrice = pObj.price * (1 - discount.value / 100);
      } else if (discount.type === 'fixed') {
        discountedPrice = Math.max(0, pObj.price - discount.value);
        discountPercentage = Math.round(((pObj.price - discountedPrice) / pObj.price) * 100);
      }

      discountedPrice = Math.round(discountedPrice * 100) / 100;

      return {
        ...pObj,
        originalPrice: pObj.price,
        discountedPrice,
        discountPercentage,
        hasDiscount: true
      };
    } else {
      return {
        ...pObj,
        originalPrice: pObj.price,
        discountedPrice: pObj.price,
        discountPercentage: 0,
        hasDiscount: false
      };
    }
  });

  return isArray ? results : results[0];
};

// @desc    Get all products (with search, filter, pagination)
// @route   GET /api/products
// @access  Public
exports.getProducts = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 12;
  if (limit > 100) limit = 100;
  const skip = (page - 1) * limit;

  // Build filter object
  const filter = { isActive: true };

  // Category filter
  if (req.query.category && req.query.category !== 'All') {
    filter.categoryName = req.query.category;
  }

  // Price range filter
  if (req.query.minPrice || req.query.maxPrice) {
    filter.price = {};
    if (req.query.minPrice) filter.price.$gte = parseFloat(req.query.minPrice);
    if (req.query.maxPrice) filter.price.$lte = parseFloat(req.query.maxPrice);
  }

  // Search
  if (req.query.search) {
    filter.name = { $regex: req.query.search, $options: 'i' };
  }

  // Badge filter (e.g., organic, sale)
  if (req.query.badge) {
    filter.badge = { $regex: req.query.badge, $options: 'i' };
  }

  // In stock filter
  if (req.query.inStock === 'true') {
    filter.stock = { $gt: 0 };
  }

  // Sort
  let sort = {};
  switch (req.query.sort) {
    case 'price_asc': sort = { price: 1 }; break;
    case 'price_desc': sort = { price: -1 }; break;
    case 'rating': sort = { rating: -1 }; break;
    case 'name': sort = { name: 1 }; break;
    default: sort = { createdAt: -1 }; // Newest
  }

  const total = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .populate('category', 'name slug');

  const mappedProducts = await getDiscountedProducts(products);

  res.status(200).json({
    success: true,
    count: products.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: mappedProducts
  });
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate('category', 'name slug');
  if (!product) {
    return next(new ErrorResponse('Product not found', 404));
  }
  const mappedProduct = await getDiscountedProducts(product);
  res.status(200).json({ success: true, data: mappedProduct });
});

// @desc    Get only products with active discounts
// @route   GET /api/products/deals
// @access  Public
exports.getDeals = asyncHandler(async (req, res, next) => {
  const now = new Date();
  
  const activeDiscounts = await Discount.find({
    isActive: true,
    startDate: { $lte: now },
    endDate: { $gte: now }
  });

  const productIds = activeDiscounts.map(d => d.product);

  const products = await Product.find({
    _id: { $in: productIds },
    isActive: true
  }).populate('category', 'name slug');

  const mappedProducts = await getDiscountedProducts(products);
  const deals = mappedProducts.filter(p => p.hasDiscount);

  res.status(200).json({
    success: true,
    count: deals.length,
    data: deals
  });
});

// @desc    Create product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = asyncHandler(async (req, res, next) => {
  const {
    name,
    description,
    price,
    categoryId,
    images,
    image,
    stock,
    rating,
    numReviews,
    badge,
    isOrganic,
    isActive
  } = req.body;

  const selectedCategory = await Category.findById(categoryId);
  if (!selectedCategory) {
    return next(new ErrorResponse('Category not found', 404));
  }

  const product = await Product.create({
    name,
    description,
    price,
    category: selectedCategory._id,
    categoryName: selectedCategory.name,
    images,
    image,
    stock,
    rating,
    numReviews,
    badge,
    isOrganic,
    isActive
  });

  res.status(201).json({ success: true, data: product });
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = asyncHandler(async (req, res, next) => {
  const allowedFields = [
    'name',
    'description',
    'price',
    'images',
    'image',
    'stock',
    'rating',
    'numReviews',
    'badge',
    'isOrganic',
    'isActive'
  ];

  const updateData = {};
  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field];
    }
  });

  if (req.body.categoryId !== undefined) {
    const category = await Category.findById(req.body.categoryId);
    if (!category) {
      return next(new ErrorResponse('Category not found', 404));
    }
    updateData.category = category._id;
    updateData.categoryName = category.name;
  }

  const product = await Product.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true
  });

  if (!product) {
    return next(new ErrorResponse('Product not found', 404));
  }
  res.status(200).json({ success: true, data: product });
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    return next(new ErrorResponse('Product not found', 404));
  }
  res.status(200).json({ success: true, data: {} });
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
exports.createProductReview = asyncHandler(async (req, res, next) => {
  const { rating, comment } = req.body;

  if (rating === undefined || !comment) {
    return next(new ErrorResponse('Please add a rating and comment', 400));
  }

  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorResponse('Product not found', 404));
  }

  // Check if already reviewed
  const alreadyReviewed = await Review.findOne({
    product: req.params.id,
    user: req.user.id
  });

  if (alreadyReviewed) {
    return next(new ErrorResponse('You have already reviewed this product', 400));
  }

  // Create review
  const review = await Review.create({
    product: req.params.id,
    user: req.user.id,
    userName: req.user.name,
    rating: Number(rating),
    comment
  });

  // Calculate new average rating and review counts
  const reviews = await Review.find({ product: req.params.id });
  product.numReviews = reviews.length;
  product.rating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

  await product.save();

  res.status(201).json({ success: true, message: 'Review added successfully', data: review });
});

// @desc    Get product reviews
// @route   GET /api/products/:id/reviews
// @access  Public
exports.getProductReviews = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorResponse('Product not found', 404));
  }

  const reviews = await Review.find({ product: req.params.id })
    .populate('user', 'name email avatar')
    .sort('-createdAt');

  res.status(200).json({ success: true, count: reviews.length, data: reviews });
});
