import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import MyOrdersPage from "../pages/MyOrdersPage";
import SellerDashboardPage from "../pages/SellerDashboardPage";
import TestPage from "../pages/TestPage";
import CartPage from "../pages/CartPage";
import CheckoutPage from "../pages/CheckoutPage";
import ProductDetailsPage from "../pages/ProductDetailsPage";
import VendorAnalyticsPage from "../pages/VendorAnalyticsPage";
import ReviewsPage from "../pages/ReviewsPage";
import AllReviewsPage from "../pages/AllReviewsPage";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/my-orders" element={<MyOrdersPage />} />
      <Route path="/dashboard" element={<SellerDashboardPage />} />
      <Route path="/test" element={<TestPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/product/:productId" element={<ProductDetailsPage />} />
      <Route path="/product/:productId/reviews" element={<AllReviewsPage />} />
      <Route path="/vendor-analytics" element={<VendorAnalyticsPage />} />
      <Route path="/reviews" element={<ReviewsPage />} />
    </Routes>
  );
}

export default AppRoutes;