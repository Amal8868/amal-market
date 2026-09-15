const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Please add a coupon code'],
    unique: true,
    uppercase: true,
    trim: true
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: [true, 'Please add a discount type']
  },
  discountValue: {
    type: Number,
    required: [true, 'Please add a discount value']
  },
  minOrderAmount: {
    type: Number,
    default: 0
  },
  expiryDate: {
    type: Date,
    required: [true, 'Please add an expiry date']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  usageLimit: {
    type: Number,
    default: null // Null means no limit
  },
  usedCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Coupon', couponSchema);
