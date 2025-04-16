// App.tsx
import { Route, Routes, Navigate } from "react-router-dom";
import AuthLayout from "./components/auth/layout";
import AuthLogin from "./pages/auth/login";
import AuthRegister from "./pages/auth/register";
import AdminLayout from "./components/admin/layout";
import AdminDashboard from "./pages/admin/dashboard";
import AdminFeatures from "./pages/admin/features";
import AdminOrders from "./pages/admin/orders";
import AdminProducts from "./pages/admin/products";
import LanguageLayout from "./components/language/languge";
import LanguageSwitcher from "./components/language/ChangeLanguage";
import ShoppingLayout from "./components/shopping/layout";
import NotFound from "./pages/not-found";
import ShoppingHome from "./pages/shop/home";
import ShoppingListing from "./pages/shop/listing";
import ShoppingCheckout from "./pages/shop/checkout";
import ShoppingAccount from "./pages/shop/account";
import CheckAuth from "./components/common/check-auth";
import UnauthPage from "./pages/unAuth";

const AppRoutes = () => {
  const isAuthenticated = false;
  const user = null;
  return (
    <Routes>
      {/* Wrapper lang route */}
      <Route path="/:lang" element={<LanguageLayout />}>
        <Route
          path="auth"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AuthLayout />
            </CheckAuth>
          }
        >
          <Route path="login" element={<AuthLogin />} />
          <Route path="register" element={<AuthRegister />} />
        </Route>

        <Route
          path="admin"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AdminLayout />
            </CheckAuth>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="features" element={<AdminFeatures />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="products" element={<AdminProducts />} />
        </Route>

        <Route
          path="shop"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <ShoppingLayout />
            </CheckAuth>
          }
        >
          <Route path="home" element={<ShoppingHome />} />
          <Route path="listing" element={<ShoppingListing />} />
          <Route path="checkout" element={<ShoppingCheckout />} />
          <Route path="acccount" element={<ShoppingAccount />} />
        </Route>
        <Route path="unauth-page" element={<UnauthPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Redirect fallback */}
      <Route
        path="*"
        element={
          <Navigate
            to={`/${localStorage.getItem("i18nextLng") || "en"}/shop/home`}
            replace
          />
        }
      />
    </Routes>
  );
};

function App() {
  return (
    <div className="flex flex-col overflow-hidden bg-white">
      <LanguageSwitcher />
      <AppRoutes />
    </div>
  );
}

export default App;
