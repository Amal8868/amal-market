const express = require('express');
const { createCoupon, getAllCoupons, getCoupon, updateCoupon, deleteCoupon, validateCoupon } = require('../controllers/couponController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Validate route must come before /:id to avoid route conflicts
router.get('/validate/:code', protect, validateCoupon);

router.route('/')
  .get(protect, authorize('admin'), getAllCoupons)
  .post(protect, authorize('admin'), createCoupon);

router.route('/:id')
  .get(protect, authorize('admin'), getCoupon)
  .put(protect, authorize('admin'), updateCoupon)
  .delete(protect, authorize('admin'), deleteCoupon);

module.exports = router;

