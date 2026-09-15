const express = require('express');
const rateLimit = require('express-rate-limit');
const { register, login, logout, getMe, getAllUsers, updateMe } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/auth');
const { validateRegister, validateLogin } = require('../middleware/validator');

const router = express.Router();

// Rate limiting for authentication attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many login attempts from this IP, please try again after 15 minutes' }
});

router.post('/register', loginLimiter, validateRegister, register);
router.post('/login', loginLimiter, validateLogin, login);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.put('/me', protect, updateMe);
router.get('/users', protect, authorize('admin'), getAllUsers);

module.exports = router;
