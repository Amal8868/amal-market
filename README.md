# Amal Market (SuperMarket)

A full-stack e-commerce application tailored for premium grocery delivery. Built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

- **User Authentication:** Secure JWT-based authentication using HTTP-Only cookies.
- **Product Management:** Browse, search, filter, and sort products.
- **Admin Dashboard:** Comprehensive dashboard to manage products, categories, orders, and users.
- **Shopping Cart & Wishlist:** Fully featured cart and wishlist with local state management.
- **Modern UI:** Premium design system featuring glassmorphism, fluid animations, and a seamless light/dark mode.
- **Responsive Design:** Mobile-first approach using responsive CSS Grid and Flexbox.

## Technologies Used

### Frontend
- React 19 + Vite
- React Router DOM
- Framer Motion (Animations)
- Recharts (Admin Analytics)
- Vanilla CSS + Flex/Grid Utilities
- Context API (State Management)

### Backend
- Node.js & Express.js
- MongoDB & Mongoose
- JSON Web Tokens (JWT) & HTTP-Only Cookies
- Express Rate Limit, Helmet, & HPP (Security)
- Multer (File uploads)

## Installation

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/supermarket.git
cd supermarket
```

### 2. Backend Setup
```bash
cd server
npm install
cp .env.example .env
```
Ensure you update the `.env` file with your actual `MONGODB_URI` and `JWT_SECRET`.

### 3. Frontend Setup
```bash
cd ../client
npm install
cp .env.example .env
```

## Running the Application

### Start Backend Server
```bash
cd server
npm run dev
```
Runs on `http://localhost:5000`

### Start Frontend Client
```bash
cd client
npm run dev
```
Runs on `http://localhost:5173`

## API Overview

- `POST /api/auth/register`: Register a new user
- `POST /api/auth/login`: Login user (sets HTTP-Only cookie)
- `POST /api/auth/logout`: Logout user (clears cookie)
- `GET /api/auth/me`: Get current logged-in user
- `GET /api/products`: Fetch all products (supports pagination, filtering, search)
- `POST /api/products`: Create a new product (Admin only)

## Discount System

The application features a professional, time-bound, admin-controlled discount system. 

### Database Schema
Discounts are stored in their own database collection and linked to products:
- `product`: Reference to Product.
- `type`: Either `'percentage'` or `'fixed'`.
- `value`: Percentage rate (e.g. 20 for 20% OFF) or fixed dollar amount.
- `startDate` & `endDate`: Time constraints during which the discount is active.
- `isActive`: Boolean flag for admin control.

### Discount Calculations & Validation
- **Percentage Discounts:** `discountedPrice = price * (1 - value / 100)`
- **Fixed Discounts:** `discountedPrice = Math.max(0, price - value)`
- **Expiration Check:** A discount is active only if `isActive = true` and `now >= startDate` and `now <= endDate`.
- **Checkout Validation:** The backend transactionally re-calculates all product prices during checkout using database queries, completely preventing users from spoofing or injecting fraudulent prices from the frontend client.

### API Endpoints
- `POST /api/discounts`: Create a new discount (Admin only)
- `GET /api/discounts`: Get all discounts (Admin only)
- `GET /api/discounts/:id`: Get a single discount details (Admin only)
- `PUT /api/discounts/:id`: Update an existing discount (Admin only)
- `DELETE /api/discounts/:id`: Remove a discount (Admin only)
- `GET /api/products/deals`: Fetch only products with currently active discounts (Public)
