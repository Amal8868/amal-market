const test = require('node:test');
const assert = require('node:assert/strict');
const mongoose = require('mongoose');
const Product = require('../models/Product');
const { simulatePayment } = require('../services/mockPaymentService');
const { validateOrderRequest, createValidatedOrderItem } = require('../services/orderService');

const categoryId = new mongoose.Types.ObjectId();
const productId = new mongoose.Types.ObjectId();

test('product model requires a category relationship', () => {
  const product = new Product({ name: 'Demo Apples', price: 3.5, categoryName: 'Fruit', stock: 10 });
  assert.equal(product.validateSync().errors.category.kind, 'required');
});

test('product model accepts a valid category relationship', () => {
  const product = new Product({ name: 'Demo Apples', price: 3.5, category: categoryId, categoryName: 'Fruit', stock: 10 });
  assert.equal(product.validateSync(), undefined);
  assert.equal(product.category.toString(), categoryId.toString());
});

test('order request requires complete address data and whole-number quantities', () => {
  assert.throws(() => validateOrderRequest({ orderItems: [{ quantity: 1.5 }], shippingAddress: {} }), { statusCode: 400 });
});

test('order item uses the database price instead of a client price', () => {
  const item = createValidatedOrderItem({
    product: { _id: productId, name: 'Demo Apples', price: 5, stock: 4, isActive: true },
    requestedQuantity: 2,
    discount: { type: 'percentage', value: 20 }
  });
  assert.equal(item.price, 4);
  assert.equal(item.quantity, 2);
});

test('order item rejects quantities above available stock', () => {
  assert.throws(() => createValidatedOrderItem({
    product: { _id: productId, name: 'Demo Apples', price: 5, stock: 1, isActive: true },
    requestedQuantity: 2
  }), { statusCode: 400 });
});

test('mock payment succeeds without sensitive payment data', () => {
  const payment = simulatePayment({ paymentMethod: 'credit_card', outcome: 'success' });
  assert.deepEqual(Object.keys(payment).sort(), ['provider', 'reference', 'status']);
  assert.equal(payment.provider, 'mock');
  assert.equal(payment.status, 'succeeded');
});

test('mock payment failure prevents order creation', () => {
  assert.throws(() => simulatePayment({ paymentMethod: 'evc_plus', outcome: 'failure' }), { statusCode: 402 });
});
