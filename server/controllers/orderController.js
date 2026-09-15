const Order = require('../models/Order');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const Discount = require('../models/Discount');
const mongoose = require('mongoose');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const { sendOrderConfirmationEmail } = require('../utils/emailService');
const { simulatePayment } = require('../services/mockPaymentService');
const { validateOrderRequest, createValidatedOrderItem } = require('../services/orderService');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = asyncHandler(async (req, res, next) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    couponCode,
    mockPaymentOutcome
  } = req.body;

  validateOrderRequest({ orderItems, shippingAddress });

  const payment = simulatePayment({ paymentMethod, outcome: mockPaymentOutcome });

  const useTransaction = mongoose.connection.supportsTransactions === true;
  const session = useTransaction ? await mongoose.startSession() : null;
  if (session) session.startTransaction();
  const inSession = (query) => session ? query.session(session) : query;
  const updatedProducts = [];
  let usedCoupon = null;

  try {
    const validatedOrderItems = [];
    let calculatedItemsPrice = 0;

    // 1. Inventory Validation, Safe Price Fetching, and Stock Reduction
    for (const item of orderItems) {
      const productId = item.product || item._id;
      const product = await inSession(Product.findById(productId));
      if (!product) {
        throw new ErrorResponse(`Product not found: ${item.name || productId}`, 404);
      }
      if (!product.isActive) {
        throw new ErrorResponse(`${product.name} is not currently available`, 400);
      }
      if (product.stock <= 0) {
        throw new ErrorResponse(`🚨 ${product.name} is currently out of stock`, 400);
      }
      if (item.quantity > product.stock) {
        throw new ErrorResponse(`⚠️ Cannot order ${item.quantity} of ${product.name}. Only ${product.stock} units remaining.`, 400);
      }

      // Fetch active discount for checkout validation
      const now = new Date();
      const activeDiscount = await Discount.findOne({
        product: product._id,
        isActive: true,
        startDate: { $lte: now },
        endDate: { $gte: now }
      });
      const discount = await inSession(activeDiscount);

      const validatedItem = createValidatedOrderItem({
        product,
        requestedQuantity: item.quantity,
        discount
      });
      product.stock -= item.quantity;
      await product.save(session ? { session } : undefined);
      updatedProducts.push({ productId: product._id, quantity: item.quantity });
      validatedOrderItems.push(validatedItem);
      calculatedItemsPrice += validatedItem.price * item.quantity;
    }

    let calculatedDiscount = 0;

    // Validate and update coupon usage if couponCode is provided
    if (couponCode) {
      const coupon = await inSession(Coupon.findOne({ code: couponCode.toUpperCase() }));
      if (!coupon) {
        throw new ErrorResponse('Invalid promo code applied', 400);
      }
      if (!coupon.isActive) {
        throw new ErrorResponse('Applied promo code is no longer active', 400);
      }
      if (new Date() > new Date(coupon.expiryDate)) {
        throw new ErrorResponse('Applied promo code has expired', 400);
      }
      if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
        throw new ErrorResponse('Applied promo code usage limit has been reached', 400);
      }
      if (calculatedItemsPrice < coupon.minOrderAmount) {
        throw new ErrorResponse(`Applied promo code requires a minimum order amount of $${coupon.minOrderAmount.toFixed(2)}`, 400);
      }

      // Calculate discount amount server-side
      if (coupon.discountType === 'percentage') {
        calculatedDiscount = (calculatedItemsPrice * coupon.discountValue) / 100;
      } else {
        calculatedDiscount = coupon.discountValue;
      }
      // Coupon discount cannot exceed the subtotal
      calculatedDiscount = Math.min(calculatedDiscount, calculatedItemsPrice);

      // Increment usage count
      coupon.usedCount += 1;
      await coupon.save(session ? { session } : undefined);
      usedCoupon = coupon;
    }

    // Flat tax rate of 5% applied on post-discount subtotal
    const discountedTotal = calculatedItemsPrice - calculatedDiscount;
    const calculatedTax = parseFloat((discountedTotal * 0.05).toFixed(2));
    
    // Free shipping standard for online grocery
    const calculatedShipping = 0;

    const calculatedTotal = parseFloat((discountedTotal + calculatedTax + calculatedShipping).toFixed(2));

    // 2. Create Order using Mongoose session transaction
    const [order] = await Order.create([{
      user: req.user.id,
      orderItems: validatedOrderItems,
      shippingAddress,
      paymentMethod,
      payment,
      itemsPrice: calculatedItemsPrice,
      taxPrice: calculatedTax,
      shippingPrice: calculatedShipping,
      discountPrice: calculatedDiscount,
      totalPrice: calculatedTotal,
      couponCode: couponCode || null,
      isPaid: true,
      paidAt: Date.now()
    }], session ? { session } : undefined);

    if (session) {
      await session.commitTransaction();
      session.endSession();
    }

    // Send email confirmation in the background (non-blocking)
    sendOrderConfirmationEmail(order, req.user.email).catch(err => {
      console.error('Failed to trigger order confirmation email:', err);
    });

    res.status(201).json({ success: true, data: order });
  } catch (err) {
    if (session) {
      await session.abortTransaction();
      session.endSession();
    } else {
      await Promise.all(updatedProducts.map(({ productId, quantity }) =>
        Product.updateOne({ _id: productId }, { $inc: { stock: quantity } })
      ));
      if (usedCoupon) {
        await Coupon.updateOne({ _id: usedCoupon._id }, { $inc: { usedCount: -1 } });
      }
    }
    next(err);
  }
});

// @desc    Get logged in user's orders
// @route   GET /api/orders/myorders
// @access  Private
exports.getMyOrders = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const skip = (page - 1) * limit;
  const total = await Order.countDocuments({ user: req.user.id });
  const orders = await Order.find({ user: req.user.id })
    .sort('-createdAt')
    .skip(skip)
    .limit(limit);
  res.status(200).json({ 
    success: true, 
    count: orders.length,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    data: orders 
  });
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) {
    return next(new ErrorResponse('Order not found', 404));
  }
  // Only allow the order owner or admin to view
  if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized', 403));
  }
  res.status(200).json({ success: true, data: order });
});

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
exports.getAllOrders = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const search = req.query.search || '';
  const skip = (page - 1) * limit;

  // Build query object for search
  const query = {};
  if (search) {
    query.$or = [
      { status: { $regex: search, $options: 'i' } },
      { 'shippingAddress.fullName': { $regex: search, $options: 'i' } },
      { 'shippingAddress.city': { $regex: search, $options: 'i' } }
    ];
  }

  const isExport = req.query.export === 'true';
  const finalLimit = isExport ? 0 : limit;

  const total = await Order.countDocuments(query);
  const orders = await Order.find(query)
    .populate('user', 'name email')
    .sort('-createdAt')
    .skip(isExport ? 0 : skip)
    .limit(finalLimit);

  // Compute totalRevenue across ALL matching orders (not just current page)
  const revenueAgg = await Order.aggregate([
    { $match: { ...query, status: { $ne: 'cancelled' } } },
    { $group: { _id: null, total: { $sum: '$totalPrice' } } }
  ]);
  const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].total : 0;
  
  res.status(200).json({ 
    success: true, 
    count: orders.length, 
    total,
    totalPages: isExport ? 1 : Math.ceil(total / limit),
    currentPage: isExport ? 1 : page,
    totalRevenue, 
    data: orders 
  });
});

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { status, isPaid } = req.body;

  // Local MongoDB installations commonly run without replica sets, where
  // transactions are unavailable. Use one when supported, otherwise perform
  // the same guarded update without a session.
  const useTransaction = mongoose.connection.supportsTransactions === true;
  const session = useTransaction ? await mongoose.startSession() : null;
  if (session) session.startTransaction();
  const inSession = (query) => session ? query.session(session) : query;

  try {
    const order = await inSession(Order.findById(req.params.id));
    if (!order) {
      throw new ErrorResponse('Order not found', 404);
    }

    const oldStatus = order.status;
    const newStatus = status;

    if (newStatus !== undefined && oldStatus !== newStatus) {
      if (oldStatus === 'delivered') {
        throw new ErrorResponse('Cannot change status of a delivered order', 400);
      }
      if (oldStatus === 'cancelled') {
        throw new ErrorResponse('Cannot change status of a cancelled order', 400);
      }
      if (oldStatus === 'shipped' && newStatus !== 'delivered') {
        throw new ErrorResponse('Shipped orders can only be updated to delivered', 400);
      }
      if (oldStatus === 'processing' && !['shipped', 'cancelled'].includes(newStatus)) {
        throw new ErrorResponse('Processing orders can only be updated to shipped or cancelled', 400);
      }
      if (oldStatus === 'pending' && !['processing', 'cancelled'].includes(newStatus)) {
        throw new ErrorResponse('New orders can only be updated to processing or cancelled', 400);
      }
    }

    // Handle order cancellation (restore stock and coupon counts)
    if (newStatus === 'cancelled' && oldStatus !== 'cancelled') {
      for (const item of order.orderItems) {
        const productId = item.product || item._id;
        const product = await inSession(Product.findById(productId));
        if (product) {
          product.stock += item.quantity;
          await product.save(session ? { session } : undefined);
        }
      }

      // Restore coupon usage count
      if (order.couponCode) {
        const coupon = await inSession(Coupon.findOne({ code: order.couponCode.toUpperCase() }));
        if (coupon && coupon.usedCount > 0) {
          coupon.usedCount -= 1;
          await coupon.save(session ? { session } : undefined);
        }
      }
    }

    if (newStatus !== undefined) {
      order.status = newStatus;
      if (newStatus === 'delivered') {
        order.deliveredAt = Date.now();
      }
    }

    if (isPaid !== undefined) {
      order.isPaid = isPaid;
      if (isPaid) {
        order.paidAt = Date.now();
      }
    }

    const updated = await order.save(session ? { session } : undefined);

    if (session) {
      await session.commitTransaction();
      session.endSession();
    }

    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    if (session) {
      await session.abortTransaction();
      session.endSession();
    }
    next(err);
  }
});
