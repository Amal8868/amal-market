const ErrorResponse = require('../utils/errorResponse');

const validateOrderRequest = ({ orderItems, shippingAddress }) => {
  if (!Array.isArray(orderItems) || orderItems.length === 0) {
    throw new ErrorResponse('No order items', 400);
  }

  const requiredAddressFields = ['fullName', 'address', 'city', 'postalCode', 'country'];
  const hasCompleteAddress = shippingAddress && requiredAddressFields.every((field) =>
    typeof shippingAddress[field] === 'string' && shippingAddress[field].trim()
  );

  if (!hasCompleteAddress) {
    throw new ErrorResponse('Please provide a complete shipping address', 400);
  }

  orderItems.forEach((item) => {
    if (!item || !Number.isInteger(item.quantity) || item.quantity < 1) {
      throw new ErrorResponse('Each order item must have a whole-number quantity of at least 1', 400);
    }
  });
};

const createValidatedOrderItem = ({ product, requestedQuantity, discount }) => {
  if (!product) throw new ErrorResponse('Product not found', 404);
  if (!product.isActive) throw new ErrorResponse(`${product.name} is not currently available`, 400);
  if (product.stock <= 0) throw new ErrorResponse(`${product.name} is currently out of stock`, 400);
  if (requestedQuantity > product.stock) {
    throw new ErrorResponse(`Cannot order ${requestedQuantity} of ${product.name}. Only ${product.stock} units remaining.`, 400);
  }

  let price = product.price;
  if (discount?.type === 'percentage') price = product.price * (1 - discount.value / 100);
  if (discount?.type === 'fixed') price = Math.max(0, product.price - discount.value);

  return {
    product: product._id,
    name: product.name,
    image: product.image || product.images?.[0],
    price: Math.round(price * 100) / 100,
    quantity: requestedQuantity
  };
};

module.exports = { validateOrderRequest, createValidatedOrderItem };
