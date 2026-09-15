const Category = require('../models/Category');
const Product = require('../models/Product');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
exports.getCategories = asyncHandler(async (req, res, next) => {
  const categories = await Category.find({ isActive: true }).sort('name');
  res.status(200).json({ success: true, count: categories.length, data: categories });
});

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
exports.getCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return next(new ErrorResponse('Category not found', 404));
  }
  res.status(200).json({ success: true, data: category });
});

// @desc    Create category
// @route   POST /api/categories
// @access  Private/Admin
exports.createCategory = asyncHandler(async (req, res, next) => {
  const { name, description, image, color, isActive } = req.body;

  const category = await Category.create({
    name,
    description,
    image,
    color,
    isActive
  });

  res.status(201).json({ success: true, data: category });
});

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
exports.updateCategory = asyncHandler(async (req, res, next) => {
  const allowedFields = ['name', 'description', 'image', 'color', 'isActive'];
  const updateData = {};
  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field];
    }
  });

  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new ErrorResponse('Category not found', 404));
  }
  Object.assign(category, updateData);
  await category.save();
  await Product.updateMany({ category: category._id }, { categoryName: category.name });

  res.status(200).json({ success: true, data: category });
});

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return next(new ErrorResponse('Category not found', 404));
  }
  const productCount = await Product.countDocuments({ category: category._id });
  if (productCount > 0) {
    return next(new ErrorResponse('Cannot delete a category that still has products', 409));
  }
  await category.deleteOne();
  res.status(200).json({ success: true, data: {} });
});
