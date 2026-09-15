const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');
const mongoSanitize = require('./middleware/mongoSanitize');
const hpp = require('hpp');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const validateEnvironment = require('./config/env');

// Load environment variables
dotenv.config();
validateEnvironment();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false, limit: '10kb' }));
app.use(compression());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.CLIENT_URL 
    : 'http://localhost:5173',
  credentials: true
}));

// Security Middlewares
app.use(helmet());
app.use(mongoSanitize());
app.use(hpp());

// Cookie parser
app.use(cookieParser());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100,
  message: 'Too many requests from this IP, please try again later'
});
app.use('/api', limiter);

// Static folder for file uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Route files
const auth = require('./routes/auth');
const products = require('./routes/products');
const categories = require('./routes/categories');
const orders = require('./routes/orders');
const coupons = require('./routes/coupons');
const analytics = require('./routes/analytics');
const discounts = require('./routes/discounts');

// Mount routers
app.use('/api/auth', auth);
app.use('/api/products', products);
app.use('/api/categories', categories);
app.use('/api/orders', orders);
app.use('/api/coupons', coupons);
app.use('/api/analytics', analytics);
app.use('/api/discounts', discounts);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Amal Market API is running...', version: '1.0.0' });
});

// Centralized error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

const shutdown = (signal) => {
  console.log(`${signal} received. Closing server gracefully.`);
  server.close(() => process.exit(0));
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
