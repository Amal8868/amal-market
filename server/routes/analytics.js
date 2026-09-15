const express = require('express');
const { 
  getRevenueAnalytics, 
  getTopProducts, 
  getOrdersSummary, 
  getRecentActivity 
} = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Apply global protect & admin authorize middleware to all analytics endpoints
router.use(protect);
router.use(authorize('admin'));

router.get('/revenue', getRevenueAnalytics);
router.get('/top-products', getTopProducts);
router.get('/orders-summary', getOrdersSummary);
router.get('/recent-activity', getRecentActivity);

module.exports = router;
