# Backend API - Artisan's Corner

This is the backend REST API for the Artisan's Corner e-commerce platform, built with Node.js and Express.js.

## 🏗️ Architecture Overview

The backend follows a modular, well-organized structure that separates concerns and promotes maintainability:

```
src/
├── config/          # Configuration files
├── controllers/     # Business logic handlers
├── middlewares/     # Custom middleware functions
├── models/          # Database schemas and models
├── routes/          # API route definitions
├── utils/           # Helper functions and utilities
└── app.js          # Express application setup
```

## 📡 API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - User login

### Product Routes (`/api/products`)
- `GET /` - Get all products (public)
- `POST /` - Create new product (vendor only)
- `GET /my-products` - Get vendor's products (vendor only)
- `PUT /:id` - Update product (vendor only)
- `DELETE /:id` - Delete product (vendor only)

### Order Routes (`/api/orders`)
- `GET /my-orders` - Get buyer's orders (buyer only)
- `GET /vendor-orders` - Get vendor's orders (vendor only)
- `POST /` - Create new order (buyer only)
- `PUT /:id/status` - Update order status (vendor only)

## 🔐 Authentication & Authorization

### JWT Implementation
- Uses JSON Web Tokens for stateless authentication
- Tokens expire after 7 days
- Protected routes require valid JWT in Authorization header

### Role-based Access Control
- **Buyer**: Can browse products, place orders, view order history
- **Vendor**: Can create products, manage inventory, process orders
- **Admin**: (Future implementation) Platform management

## 🛠️ Key Components

### Controllers
Handle the business logic for each resource:
- `auth.controller.js` - User registration and authentication
- `product.controller.js` - Product CRUD operations
- `order.controller.js` - Order processing and management

### Middlewares
Custom middleware functions for common tasks:
- `auth.middleware.js` - JWT token verification
- `role.middleware.js` - Role-based access control
- `upload.middleware.js` - File upload handling with Multer

### Models
Mongoose schemas defining data structure:
- `user.js` - User accounts with roles and authentication
- `product.js` - Product listings with images and inventory
- `order.js` - Order records with status tracking

### Utilities
Helper functions for common operations:
- `cloudinaryUpload.js` - Image upload to Cloudinary
- `generateToken.js` - JWT token generation

## 📊 Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (buyer/vendor),
  storeProfile: {
    storeName: String,
    logo: String,
    description: String
  }
}
```

### Product Model
```javascript
{
  title: String,
  description: String,
  price: Number,
  stock: Number,
  image: String (Cloudinary URL),
  imagePublicId: String (Cloudinary ID),
  vendor: ObjectId (references User)
}
```

### Order Model
```javascript
{
  product: ObjectId (references Product),
  buyer: ObjectId (references User),
  vendor: ObjectId (references User),
  quantity: Number,
  totalPrice: Number,
  status: String (processing/shipped/delivered)
}
```

## 🚀 Development Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

3. Start development server:
```bash
npm run dev
# or
node server.js
```

## 🧪 Testing

The backend includes comprehensive testing for all endpoints. Test users are automatically created for development purposes.

## 📈 Performance & Security

### Performance Optimizations
- Database indexing for faster queries
- Efficient image handling with Cloudinary
- Proper error handling and logging

### Security Measures
- Password hashing with bcrypt
- JWT token authentication
- CORS configuration
- Input validation and sanitization
- Role-based access control

## 📚 Code Standards

- **ES6+ syntax** with modern JavaScript features
- **Consistent naming conventions** (camelCase for variables/functions, PascalCase for classes)
- **Modular structure** with clear separation of concerns
- **Comprehensive error handling** with meaningful error messages
- **Detailed code comments** explaining complex logic
- **Environment-based configuration** for different deployment stages

## 🔄 Error Handling

All API responses follow a consistent format:
```javascript
// Success response
{
  "data": {...},
  "message": "Operation successful"
}

// Error response
{
  "error": "Error message",
  "message": "Human-readable description"
}
```

## 📊 Monitoring & Logging

- Console logging for development debugging
- Structured error responses
- Request/response logging (can be enhanced with Winston/Bunyan)

## 🚀 Deployment Considerations

- Environment-specific configuration
- Database connection pooling
- Proper error logging for production
- Security headers implementation
- Rate limiting for API protection
- Health check endpoints

## 🤝 Best Practices Implemented

1. **Separation of Concerns**: Each module has a single responsibility
2. **DRY Principle**: Reusable utility functions and middleware
3. **Error First**: Proper error handling throughout the application
4. **Security First**: Authentication, authorization, and data validation
5. **Scalability**: Modular design allows easy feature additions
6. **Maintainability**: Clear code structure and comprehensive documentation

## 📞 Support

For issues or questions about the backend API, please contact the development team or check the main project documentation.