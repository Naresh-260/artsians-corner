// =================================================================
// Validation Utilities
// =================================================================

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if email is valid
 */
export const validateEmail = (email) => {
  const emailRegex = /^\S+@\S+\.\S+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} - Validation result with isValid and message
 */
export const validatePassword = (password) => {
  const minLength = 6;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  
  if (password.length < minLength) {
    return {
      isValid: false,
      message: `Password must be at least ${minLength} characters long`
    };
  }
  
  // You can add more complex validation rules here
  return {
    isValid: true,
    message: "Password is valid"
  };
};

/**
 * Validate required field
 * @param {string} value - Field value to validate
 * @param {string} fieldName - Name of the field for error message
 * @returns {Object} - Validation result
 */
export const validateRequired = (value, fieldName) => {
  if (!value || value.trim() === "") {
    return {
      isValid: false,
      message: `${fieldName} is required`
    };
  }
  return {
    isValid: true,
    message: ""
  };
};

/**
 * Validate number field
 * @param {number} value - Number to validate
 * @param {string} fieldName - Name of the field
 * @param {Object} options - Validation options (min, max, integer)
 * @returns {Object} - Validation result
 */
export const validateNumber = (value, fieldName, options = {}) => {
  const { min, max, integer = false } = options;
  
  if (isNaN(value) || value === "") {
    return {
      isValid: false,
      message: `${fieldName} must be a valid number`
    };
  }
  
  const numValue = Number(value);
  
  if (min !== undefined && numValue < min) {
    return {
      isValid: false,
      message: `${fieldName} must be at least ${min}`
    };
  }
  
  if (max !== undefined && numValue > max) {
    return {
      isValid: false,
      message: `${fieldName} must be no more than ${max}`
    };
  }
  
  if (integer && !Number.isInteger(numValue)) {
    return {
      isValid: false,
      message: `${fieldName} must be a whole number`
    };
  }
  
  return {
    isValid: true,
    message: ""
  };
};

// =================================================================
// Formatting Utilities
// =================================================================

/**
 * Format currency value
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: USD)
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (amount, currency = "USD") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2
  }).format(amount);
};

/**
 * Format date for display
 * @param {string|Date} date - Date to format
 * @param {string} format - Format type (short, long, time)
 * @returns {string} - Formatted date string
 */
export const formatDate = (date, format = "short") => {
  const dateObj = new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    return "Invalid Date";
  }
  
  const options = {
    short: { year: "numeric", month: "short", day: "numeric" },
    long: { year: "numeric", month: "long", day: "numeric" },
    time: { 
      year: "numeric", 
      month: "short", 
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }
  };
  
  return new Intl.DateTimeFormat("en-US", options[format]).format(dateObj);
};

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} - Truncated text
 */
export const truncateText = (text, maxLength) => {
  if (!text || text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + "...";
};

// =================================================================
// Array Utilities
// =================================================================

/**
 * Group array items by a property
 * @param {Array} array - Array to group
 * @param {string} key - Property to group by
 * @returns {Object} - Grouped object
 */
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const group = item[key];
    if (!result[group]) {
      result[group] = [];
    }
    result[group].push(item);
    return result;
  }, {});
};

/**
 * Remove duplicates from array
 * @param {Array} array - Array to deduplicate
 * @param {string} key - Property to check for duplicates (optional)
 * @returns {Array} - Array with duplicates removed
 */
export const removeDuplicates = (array, key = null) => {
  if (key) {
    const seen = new Set();
    return array.filter(item => {
      const value = item[key];
      if (seen.has(value)) {
        return false;
      }
      seen.add(value);
      return true;
    });
  }
  return [...new Set(array)];
};

// =================================================================
// Storage Utilities
// =================================================================

/**
 * Store data in localStorage
 * @param {string} key - Storage key
 * @param {any} value - Value to store
 */
export const setLocalStorage = (key, value) => {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error("Error storing data in localStorage:", error);
  }
};

/**
 * Get data from localStorage
 * @param {string} key - Storage key
 * @param {any} defaultValue - Default value if key doesn't exist
 * @returns {any} - Stored value or default
 */
export const getLocalStorage = (key, defaultValue = null) => {
  try {
    const serializedValue = localStorage.getItem(key);
    if (serializedValue === null) {
      return defaultValue;
    }
    return JSON.parse(serializedValue);
  } catch (error) {
    console.error("Error retrieving data from localStorage:", error);
    return defaultValue;
  }
};

/**
 * Remove data from localStorage
 * @param {string} key - Storage key
 */
export const removeLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error("Error removing data from localStorage:", error);
  }
};

// =================================================================
// Error Handling Utilities
// =================================================================

/**
 * Get user-friendly error message from error object
 * @param {Error|Object} error - Error object
 * @returns {string} - User-friendly error message
 */
export const getErrorMessage = (error) => {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error?.message) {
    return error.message;
  }
  
  if (typeof error === "string") {
    return error;
  }
  
  return "An unexpected error occurred";
};

/**
 * Handle API error with proper logging
 * @param {Error} error - Error object
 * @param {string} context - Context where error occurred
 * @returns {string} - User-friendly error message
 */
export const handleApiError = (error, context = "") => {
  console.error(`API Error${context ? ` in ${context}` : ""}:`, error);
  
  // Log additional error details in development
  if (process.env.NODE_ENV === "development") {
    console.error("Error details:", {
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      data: error?.response?.data,
      url: error?.config?.url
    });
  }
  
  return getErrorMessage(error);
};

// =================================================================
// Async Utilities
// =================================================================

/**
 * Sleep function for delays
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise} - Promise that resolves after delay
 */
export const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Retry async function with exponential backoff
 * @param {Function} fn - Async function to retry
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} delay - Initial delay in ms
 * @returns {Promise} - Result of the function
 */
export const retryAsync = async (fn, maxRetries = 3, delay = 1000) => {
  let lastError;
  
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (i === maxRetries) {
        throw lastError;
      }
      
      // Exponential backoff
      const waitTime = delay * Math.pow(2, i);
      console.warn(`Attempt ${i + 1} failed, retrying in ${waitTime}ms...`);
      await sleep(waitTime);
    }
  }
};