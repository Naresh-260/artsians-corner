# Artisan's Corner - E-Commerce Marketplace

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18%2B-blue)](https://reactjs.org/)

A modern, full-stack e-commerce marketplace platform built with the MERN stack (MongoDB, Express.js, React, Node.js) that connects artisans (vendors) with customers (buyers).

## 🎯 Project Overview

Artisan's Corner is a dual-role marketplace platform where:
- **Vendors** can showcase and sell their handmade products
- **Buyers** can browse, purchase, and track their orders
- **Admin** features for managing the platform (future enhancement)

## 🏗️ Architecture

```
artsians-corner/
├── backend/                 # Node.js + Express API Server
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Request handlers
│   │   ├── middlewares/    # Custom middleware
│   │   ├── models/         # MongoDB schemas
│   │   ├── routes/         # API routes
│   │   ├── utils/          # Helper functions
│   │   └── app.js         # Express app configuration
│   ├── server.js           # Server entry point
│   └── .env               # Environment variables
└── frontend/
    └── myapp/              # React + Vite frontend
        ├── src/
        │   ├── components/ # Reusable UI components
        │   ├── context/    # React context providers
        │   ├── pages/      # Page components
        │   ├── routes/     # React Router configuration
        │   ├── services/   # API service functions
        │   └── utils/      # Frontend utilities
        └── public/         # Static assets
```

## 🚀 Key Features

### For Buyers:
- 🔍 Browse products with images
- 🛒 Add products to cart and place orders
- 💳 Secure payment processing via Razorpay
- 📦 Track order status
- 👤 User authentication and profile management

### For Vendors:
- 📤 Create and manage product listings
- 🖼️ Upload product images via Cloudinary
- 💰 Receive payments securely
- 📊 View incoming orders
- 🔄 Update order status (processing → shipped → delivered)
- 📈 Manage inventory and stock levels
- 📊 Analytics dashboard with sales metrics

### Technical Features:
- 🔐 JWT-based authentication
- 🖼️ Cloudinary image hosting
- 💳 Razorpay payment integration
- ⭐ Product reviews and ratings system
- 🛡️ Role-based access control
- 📱 Responsive design
- ⚡ Real-time updates

## 🛠️ Tech Stack

### Backend:
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Cloudinary** - Image hosting
- **Razorpay** - Payment processing
- **Bcrypt.js** - Password hashing
- **Dotenv** - Environment management

### Frontend:
- **React 18** - UI library
- **Vite** - Build tool
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Bootstrap 5** - CSS framework
- **Context API** - State management
- **Chart.js** - Data visualization

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account
- Razorpay account (for payment processing)

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone <repository-url>
cd artsians-corner
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `.env` file in the backend directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

Start the backend server:
```bash
npm run dev
# or
node server.js
```

### 3. Frontend Setup
```bash
cd frontend/myapp
npm install
```

Create `.env` file in the frontend directory:
```env
REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key_id
```

Start the development server:
```bash
npm run dev
```

### 4. Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 📁 Project Structure Explained

### Backend Structure:
```
src/
├── config/                 # Configuration files
│   ├── cloudinary.js      # Cloudinary setup
│   └── env.js            # Environment configuration
├── controllers/           # Business logic handlers
│   ├── auth.controller.js # User authentication
│   ├── product.controller.js # Product management
│   ├── order.controller.js  # Order processing
│   ├── payment.controller.js # Payment processing
│   └── analytics.controller.js # Analytics
├── middlewares/           # Custom middleware
│   ├── auth.middleware.js # JWT authentication
│   ├── role.middleware.js # Role-based access
│   └── upload.middleware.js # File upload handling
├── models/               # Database models
│   ├── user.js          # User schema
│   ├── product.js       # Product schema
│   ├── order.js         # Order schema
│   ├── cart.js          # Shopping cart
│   ├── review.js        # Product reviews
│   └── payment.js       # Payment records
├── routes/              # API route definitions
│   ├── auth.routes.js   # Authentication routes
│   ├── product.routes.js # Product routes
│   ├── order.routes.js  # Order routes
│   ├── payment.routes.js # Payment routes
│   └── analytics.routes.js # Analytics routes
├── utils/              # Helper functions
│   ├── cloudinaryUpload.js # Image upload utility
│   └── generateToken.js   # JWT token generation
└── app.js             # Express application setup
```

### Frontend Structure:
```
src/
├── components/           # Reusable UI components
│   ├── Navigation.jsx   # Navigation bar
│   ├── CartIcon.jsx     # Shopping cart icon
│   ├── StarRating.jsx   # Star rating component
│   ├── ReviewList.jsx   # Review list component
│   ├── ReviewForm.jsx   # Review form component
│   ├── ChartComponent.jsx # Chart component
│   └── ProductCard.jsx  # Product card component
├── context/             # React context providers
│   ├── AuthContext.jsx # Authentication state
│   └── CartContext.jsx # Shopping cart state
├── pages/              # Page components
│   ├── HomePage.jsx    # Main product listing
│   ├── LoginPage.jsx   # User login
│   ├── RegisterPage.jsx # User registration
│   ├── MyOrdersPage.jsx # Buyer orders
│   ├── SellerDashboardPage.jsx # Vendor dashboard
│   ├── VendorAnalyticsPage.jsx # Vendor analytics
│   ├── ProductDetailsPage.jsx # Product details
│   ├── CartPage.jsx    # Shopping cart
│   ├── CheckoutPage.jsx # Payment checkout
│   └── TestPage.jsx    # Connection testing
├── routes/             # Routing configuration
│   └── AppRoutes.jsx  # Route definitions
├── services/           # API service functions
│   ├── authService.js # Authentication API
│   ├── productService.js # Product API
│   ├── orderService.js  # Order API
│   ├── paymentService.js # Payment API
│   ├── cartService.js   # Cart API
│   ├── reviewService.js # Review API
│   ├── analyticsService.js # Analytics API
│   └── axiosInstance.js # HTTP client configuration
├── App.jsx            # Main App component
├── main.jsx          # React entry point
└── index.css         # Global styles
```

## 🔧 Development Workflow

1. **Branch Strategy**: Use feature branches for new functionality
2. **Code Reviews**: All changes require review before merging
3. **Testing**: Test all features thoroughly before deployment
4. **Documentation**: Keep README and code comments up to date

## 🎨 UI/UX Design Principles

- **Clean & Modern**: Minimalist design with clear typography
- **Responsive**: Works on all device sizes
- **Intuitive**: Easy navigation and clear user flows
- **Accessible**: Follows WCAG accessibility guidelines
- **Consistent**: Unified design language throughout

## 🚨 Error Handling

The application implements comprehensive error handling:
- **Frontend**: User-friendly error messages and validation
- **Backend**: Proper HTTP status codes and error responses
- **Logging**: Console logging for debugging (development)
- **Validation**: Input validation at both frontend and backend

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt encryption for user passwords
- **Role-based Access**: Different permissions for buyers vs vendors
- **CORS Protection**: Controlled cross-origin resource sharing
- **Input Sanitization**: Protection against injection attacks
- **Payment Security**: Secure payment processing with Razorpay

## 📈 Future Enhancements

- [ ] Admin dashboard for platform management
- [ ] Advanced product search and filtering
- [ ] Real-time notifications
- [ ] Wishlist functionality
- [ ] Mobile app development
- [ ] Email notifications for order updates
- [ ] Vendor commission management

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## 👨‍💻 Author

**Naresh** - Full Stack Developer

## 🙏 Acknowledgments

- Cloudinary for image hosting services
- MongoDB Atlas for database hosting
- Razorpay for payment processing
- Bootstrap for CSS framework
- Chart.js for data visualization
- All open-source libraries and tools used in this project

---
*This project was developed as part of an internship program to demonstrate full-stack web development skills using modern technologies.*