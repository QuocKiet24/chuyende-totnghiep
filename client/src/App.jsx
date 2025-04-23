// App.tsx
import { Route, Routes, Navigate } from "react-router-dom";
import AuthLayout from "./components/auth/layout";
import AuthLogin from "./pages/auth/login";
import AuthRegister from "./pages/auth/register";
import AdminLayout from "./components/admin/layout";
import BannerDashboard from "./pages/admin/banner";
import AdminFeatures from "./pages/admin/features";
import AdminOrders from "./pages/admin/orders";
import AdminProducts from "./pages/admin/products";
import LanguageLayout from "./components/language/languge";
import ShoppingLayout from "./components/shopping/layout";
import NotFound from "./pages/not-found";
import ShoppingHome from "./pages/shop/home";
import ShoppingListing from "./pages/shop/listing";
import ShoppingCheckout from "./pages/shop/checkout";
import ShoppingAccount from "./pages/shop/account";
import CheckAuth from "./components/common/check-auth";
import UnauthPage from "./pages/unAuth";
import EmailVerificationPage from "./pages/auth/verifyEmail";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getCurrentUser } from "./store/auth-slice";
import PaypalReturnPage from "./pages/shop/paypal-return";
import PaymentSuccessPage from "./pages/shop/paypal-success";
import SearchProduct from "./pages/shop/search";

const AppRoutes = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const currentLanguage = localStorage.getItem("i18nextLng") || "en-US";

  return (
    <Routes>
      {/* Redirect root to default language */}
      <Route
        path="/"
        element={<Navigate to={`/${currentLanguage}/shop/home`} replace />}
      />

      {/* Redirect bare locale to home */}
      <Route path="/:locale" element={<Navigate to="shop/home" replace />} />

      {/* Main routes with locale prefix */}
      <Route path="/:locale/*" element={<LanguageLayout />}>
        {/* Auth routes */}
        <Route
          path="auth/*"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AuthLayout />
            </CheckAuth>
          }
        >
          <Route path="login" element={<AuthLogin />} />
          <Route path="register" element={<AuthRegister />} />
          <Route path="verify-email" element={<EmailVerificationPage />} />
        </Route>

        {/* Admin routes */}
        <Route
          path="admin/*"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AdminLayout />
            </CheckAuth>
          }
        >
          <Route path="banners" element={<BannerDashboard />} />
          <Route path="features" element={<AdminFeatures />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="products" element={<AdminProducts />} />
        </Route>

        {/* Shop routes */}
        <Route path="shop" element={<ShoppingLayout />}>
          <Route index element={<ShoppingHome />} />
          <Route path="home" element={<ShoppingHome />} />
          <Route path="listing" element={<ShoppingListing />} />
          <Route path="search" element={<SearchProduct />} />
          <Route
            path="checkout"
            element={
              <CheckAuth isAuthenticated={isAuthenticated} user={user}>
                <ShoppingCheckout />
              </CheckAuth>
            }
          />
          <Route
            path="paypal-return"
            element={
              <CheckAuth isAuthenticated={isAuthenticated} user={user}>
                <PaypalReturnPage />
              </CheckAuth>
            }
          />
          <Route
            path="payment-success"
            element={
              <CheckAuth isAuthenticated={isAuthenticated} user={user}>
                <PaymentSuccessPage />
              </CheckAuth>
            }
          />
          <Route
            path="account"
            element={
              <CheckAuth isAuthenticated={isAuthenticated} user={user}>
                <ShoppingAccount />
              </CheckAuth>
            }
          />
        </Route>

        <Route path="unauth-page" element={<UnauthPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Fallback for unknown routes */}
      <Route
        path="*"
        element={<Navigate to={`/${currentLanguage}/shop/home`} replace />}
      />
    </Routes>
  );
};

function App() {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  if (isLoading) {
    return <div>Loading...</div>; // Hoặc loading spinner
  }

  return (
    <div className="flex flex-col overflow-hidden bg-white">
      <AppRoutes />
    </div>
  );
}

export default App;
