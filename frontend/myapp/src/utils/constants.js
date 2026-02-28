// =================================================================
// Application Constants
// =================================================================

// API Configuration
export const API_CONFIG = {
  BASE_URL: "http://localhost:5000/api",
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3
};

// User Roles
export const USER_ROLES = {
  BUYER: "buyer",
  VENDOR: "vendor",
  ADMIN: "admin"
};

// Order Statuses
export const ORDER_STATUS = {
  PROCESSING: "processing",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled"
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: "authToken",
  USER_DATA: "userData",
  THEME: "theme"
};

// Validation Rules
export const VALIDATION_RULES = {
  EMAIL: {
    MIN_LENGTH: 5,
    MAX_LENGTH: 254
  },
  PASSWORD: {
    MIN_LENGTH: 6,
    MAX_LENGTH: 128
  },
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 100
  },
  PRODUCT_TITLE: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 200
  },
  PRODUCT_DESCRIPTION: {
    MAX_LENGTH: 1000
  },
  STORE_NAME: {
    MAX_LENGTH: 100
  },
  STORE_DESCRIPTION: {
    MAX_LENGTH: 500
  }
};

// Image Configuration
export const IMAGE_CONFIG = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ACCEPTED_TYPES: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  THUMBNAIL_SIZE: {
    WIDTH: 200,
    HEIGHT: 150
  },
  PRODUCT_IMAGE_SIZE: {
    WIDTH: 400,
    HEIGHT: 300
  }
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZES: [5, 10, 20, 50],
  MAX_PAGE_SIZE: 100
};

// Currency
export const CURRENCY = {
  DEFAULT: "USD",
  SYMBOL: "$",
  DECIMAL_PLACES: 2
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY_SHORT: "MMM d, yyyy",
  DISPLAY_LONG: "MMMM d, yyyy",
  DISPLAY_WITH_TIME: "MMM d, yyyy h:mm a",
  ISO_FORMAT: "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
};

// Routes
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  MY_ORDERS: "/my-orders",
  PROFILE: "/profile",
  PRODUCTS: "/products"
};

// Messages
export const MESSAGES = {
  // Success Messages
  LOGIN_SUCCESS: "Login successful!",
  REGISTRATION_SUCCESS: "Account created successfully!",
  PRODUCT_CREATED: "Product created successfully!",
  PRODUCT_UPDATED: "Product updated successfully!",
  PRODUCT_DELETED: "Product deleted successfully!",
  ORDER_PLACED: "Order placed successfully!",
  ORDER_STATUS_UPDATED: "Order status updated!",
  
  // Error Messages
  LOGIN_FAILED: "Invalid email or password",
  REGISTRATION_FAILED: "Registration failed",
  UNAUTHORIZED: "Please log in to continue",
  FORBIDDEN: "You don't have permission to perform this action",
  NETWORK_ERROR: "Network error. Please check your connection.",
  SERVER_ERROR: "Server error. Please try again later.",
  VALIDATION_ERROR: "Please check your input and try again.",
  
  // Warning Messages
  CONFIRM_DELETE: "Are you sure you want to delete this item?",
  UNSAVED_CHANGES: "You have unsaved changes. Are you sure you want to leave?",
  
  // Info Messages
  LOADING: "Loading...",
  PROCESSING: "Processing...",
  NO_DATA: "No data available",
  NO_RESULTS: "No results found"
};

// Colors
export const COLORS = {
  PRIMARY: "#007bff",
  SECONDARY: "#6c757d",
  SUCCESS: "#28a745",
  DANGER: "#dc3545",
  WARNING: "#ffc107",
  INFO: "#17a2b8",
  LIGHT: "#f8f9fa",
  DARK: "#343a40"
};

// Breakpoints for responsive design
export const BREAKPOINTS = {
  XS: 0,      // Extra small devices (portrait phones)
  SM: 576,    // Small devices (landscape phones)
  MD: 768,    // Medium devices (tablets)
  LG: 992,    // Large devices (desktops)
  XL: 1200,   // Extra large devices (large desktops)
  XXL: 1400   // Extra extra large devices
};

// Animation Durations
export const ANIMATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500
};

// Form Configuration
export const FORM_CONFIG = {
  DEBOUNCE_DELAY: 300, // ms
  AUTO_SAVE_DELAY: 2000 // ms
};

// Cache Configuration
export const CACHE = {
  DEFAULT_TTL: 5 * 60 * 1000, // 5 minutes
  USER_DATA_TTL: 30 * 60 * 1000, // 30 minutes
  PRODUCT_DATA_TTL: 10 * 60 * 1000 // 10 minutes
};