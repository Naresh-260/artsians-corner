// =================================================================
// Main Application Component
// =================================================================

import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import Navigation from "./components/Navigation";

/**
 * Main App Component
 * 
 * This is the root component of the Artisan's Corner application.
 * It sets up the routing system and provides the main application layout.
 * 
 * Features:
 * - React Router for client-side navigation
 * - Global navigation bar
 * - Protected routes based on authentication state
 * - Responsive design
 * 
 * @returns {JSX.Element} The main application wrapper
 */
function App() {
  return (
    // BrowserRouter provides routing context to all child components
    <BrowserRouter>
      {/* Navigation bar that persists across all pages */}
      <Navigation />
      
      {/* Main content area with route-based page rendering */}
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;