const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get revenue analytics (daily/weekly/monthly)
// @route   GET /api/analytics/revenue
// @access  Private/Admin
exports.getRevenueAnalytics = asyncHandler(async (req, res, next) => {
  // Daily (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const daily = await Order.aggregate([
    { 
      $match: { 
        status: { $ne: 'cancelled' }, 
        createdAt: { $gte: thirtyDaysAgo } 
      } 
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        revenue: { $sum: "$totalPrice" },
        ordersCount: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  // Weekly (last 12 weeks)
  const twelveWeeksAgo = new Date();
  twelveWeeksAgo.setDate(twelveWeeksAgo.getDate() - 84);
  const weekly = await Order.aggregate([
    { 
      $match: { 
        status: { $ne: 'cancelled' }, 
        createdAt: { $gte: twelveWeeksAgo } 
      } 
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          week: { $week: "$createdAt" }
        },
        revenue: { $sum: "$totalPrice" },
        ordersCount: { $sum: 1 }
      }
    },
    { $sort: { "_id.year": 1, "_id.week": 1 } }
  ]);

  // Monthly (last 12 months)
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
  const monthly = await Order.aggregate([
    { 
      $match: { 
        status: { $ne: 'cancelled' }, 
        createdAt: { $gte: twelveMonthsAgo } 
      } 
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
        revenue: { $sum: "$totalPrice" },
        ordersCount: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  res.status(200).json({
    success: true,
    data: {
      daily,
      weekly: weekly.map(w => ({
        _id: `${w._id.year}-W${String(w._id.week).padStart(2, '0')}`,
        revenue: w.revenue,
        ordersCount: w.ordersCount
      })),
      monthly
    }
  });
});

// @desc    Get top 10 best-selling products
// @route   GET /api/analytics/top-products
// @access  Private/Admin
exports.getTopProducts = asyncHandler(async (req, res, next) => {
  const topProducts = await Order.aggregate([
    { $match: { status: { $ne: 'cancelled' } } },
    { $unwind: "$orderItems" },
    {
      $group: {
        _id: "$orderItems.product",
        name: { $first: "$orderItems.name" },
        quantitySold: { $sum: "$orderItems.quantity" },
        revenueGenerated: { $sum: { $multiply: ["$orderItems.price", "$orderItems.quantity"] } }
      }
    },
    { $sort: { quantitySold: -1 } },
    { $limit: 10 }
  ]);

  res.status(200).json({
    success: true,
    data: topProducts
  });
});

// @desc    Get order status breakdown and key performance stats
// @route   GET /api/analytics/orders-summary
// @access  Private/Admin
exports.getOrdersSummary = asyncHandler(async (req, res, next) => {
  const statusSummary = await Order.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
        revenue: { $sum: "$totalPrice" }
      }
    }
  ]);

  const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  const breakdown = {};
  statuses.forEach(s => {
    breakdown[s] = { count: 0, revenue: 0 };
  });

  let totalOrders = 0;
  let totalRevenue = 0;
  let nonCancelledCount = 0;
  let fulfilledCount = 0; // shipped + delivered

  statusSummary.forEach(item => {
    if (breakdown[item._id] !== undefined) {
      breakdown[item._id] = { count: item.count, revenue: item.revenue };
    }
    totalOrders += item.count;
    if (item._id !== 'cancelled') {
      totalRevenue += item.revenue;
      nonCancelledCount += item.count;
    }
    if (item._id === 'shipped' || item._id === 'delivered') {
      fulfilledCount += item.count;
    }
  });

  const aov = nonCancelledCount > 0 ? parseFloat((totalRevenue / nonCancelledCount).toFixed(2)) : 0;
  const fulfillmentRate = nonCancelledCount > 0 ? parseFloat(((fulfilledCount / nonCancelledCount) * 100).toFixed(1)) : 0;

  // Let's get total user count
  const totalCustomers = await User.countDocuments({ role: 'user' });

  // Let's get total items/products count
  const totalProducts = await Product.countDocuments();

  res.status(200).json({
    success: true,
    data: {
      breakdown: Object.keys(breakdown).map(key => ({
        status: key,
        count: breakdown[key].count,
        revenue: breakdown[key].revenue
      })),
      stats: {
        totalOrders,
        totalRevenue,
        totalCustomers,
        totalProducts,
        averageOrderValue: aov,
        fulfillmentRate
      }
    }
  });
});

// @desc    Get recent orders and new user registrations
// @route   GET /api/analytics/recent-activity
// @access  Private/Admin
exports.getRecentActivity = asyncHandler(async (req, res, next) => {
  const recentOrders = await Order.find()
    .populate('user', 'name email')
    .sort('-createdAt')
    .limit(8);

  const recentUsers = await User.find({ role: 'user' })
    .select('name email createdAt')
    .sort('-createdAt')
    .limit(8);

  res.status(200).json({
    success: true,
    data: {
      recentOrders,
      recentUsers
    }
  });
});
