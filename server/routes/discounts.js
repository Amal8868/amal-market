const express = require('express');
const {
  createDiscount,
  getDiscounts,
  getDiscount,
  updateDiscount,
  deleteDiscount
} = require('../controllers/discountController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes are protected and admin-only
router.use(protect);
router.use(authorize('admin'));

router.route('/')
  .post(createDiscount)
  .get(getDiscounts);

router.route('/:id')
  .get(getDiscount)
  .put(updateDiscount)
  .delete(deleteDiscount);

module.exports = router;
