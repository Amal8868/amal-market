const mongoose = require('mongoose');

const discountSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Please associate this discount with a product']
  },
  type: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: [true, 'Please specify discount type (percentage or fixed)']
  },
  value: {
    type: Number,
    required: [true, 'Please specify discount value'],
    min: [0, 'Discount value cannot be negative']
  },
  startDate: {
    type: Date,
    required: [true, 'Please specify the start date']
  },
  endDate: {
    type: Date,
    required: [true, 'Please specify the end date']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Validation to ensure end date is after start date
discountSchema.pre('validate', function() {
  if (this.endDate < this.startDate) {
    this.invalidate('endDate', 'End date must be after start date');
  }
});

module.exports = mongoose.model('Discount', discountSchema);
