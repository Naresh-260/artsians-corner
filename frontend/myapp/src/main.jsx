// =================================================================
// Application Entry Point
// =================================================================

import React from "react";
import ReactDOM from "react-dom/client";

// Main application component
import App from "./App";

// Authentication context provider
import { AuthProvider } from "./context/AuthContext";

// Cart context provider
import { CartProvider } from "./context/CartContext";

// Bootstrap CSS for styling
import "bootstrap/dist/css/bootstrap.min.css";

/**
 * Application Bootstrap
 * 
 * This is the entry point of the React application.
 * It sets up the React DOM root and renders the main App component
 * wrapped with necessary providers.
 * 
 * Component Hierarchy:
 * - React.StrictMode (development mode checks)
 *   - AuthProvider (authentication state management)
 *     - CartProvider (shopping cart state management)
 *       - App (main application component)
 * 
 * Bootstrap is loaded globally for consistent styling
 * across all components.
 */

ReactDOM.createRoot(document.getElementById("root")).render(
  // React.StrictMode helps detect potential problems in development
  <React.StrictMode>
    {/* AuthProvider manages global authentication state */}
    <AuthProvider>
      {/* CartProvider manages shopping cart state */}
      <CartProvider>
        {/* Main application component */}
        <App />
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);