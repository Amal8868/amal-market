const crypto = require('crypto');
const ErrorResponse = require('../utils/errorResponse');

const simulatePayment = ({ paymentMethod, outcome = 'success' }) => {
  if (!['credit_card', 'evc_plus'].includes(paymentMethod)) {
    throw new ErrorResponse('Please select a supported demo payment method', 400);
  }

  if (!['success', 'failure'].includes(outcome)) {
    throw new ErrorResponse('Invalid demo payment outcome', 400);
  }

  if (outcome === 'failure') {
    throw new ErrorResponse('Demo payment was declined. No order was created.', 402);
  }

  return {
    provider: 'mock',
    status: 'succeeded',
    reference: `MOCK-${crypto.randomUUID()}`
  };
};

module.exports = { simulatePayment };
