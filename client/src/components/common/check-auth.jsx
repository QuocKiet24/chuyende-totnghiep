import { Navigate, useLocation, useParams } from "react-router-dom";

function CheckAuth({ isAuthenticated, user, children }) {
  const location = useLocation();
  const { locale = "en-US" } = useParams(); // 👈 đổi từ lang -> locale
  const path = location.pathname;

  const role = user?.role;
  const isVerified = user?.isVerified;

  const isAuthPage = ["/login", "/register", "/verify-email"].some((p) =>
    path.endsWith(p)
  );
  const isShopProtectedPage = ["/checkout", "/account"].some((p) =>
    path.includes(p)
  );

  if (isAuthenticated && !user) {
    return <div>Đang tải thông tin người dùng...</div>;
  }

  if (
    isAuthenticated &&
    user &&
    isVerified === false &&
    !path.includes("/verify-email")
  ) {
    return <Navigate to={`/${locale}/auth/verify-email`} replace />;
  }

  if (!isAuthenticated && path.includes("/verify-email")) {
    return <Navigate to={`/${locale}/auth/login`} replace />;
  }

  if (path === `/${locale}` || path === `/${locale}/`) {
    if (!isAuthenticated) {
      return <Navigate to={`/${locale}/shop/home`} replace />;
    }
    return (
      <Navigate
        to={`/${locale}/${role === "admin" ? "admin/banners" : "shop/home"}`}
        replace
      />
    );
  }

  if (!isAuthenticated && path.includes("shop") && isShopProtectedPage) {
    return <Navigate to={`/${locale}/auth/login`} replace />;
  }

  if (!isAuthenticated && path.includes("admin")) {
    return <Navigate to={`/${locale}/auth/login`} replace />;
  }

  if (isAuthenticated && isAuthPage && isVerified !== false) {
    return (
      <Navigate
        to={`/${locale}/${role === "admin" ? "admin/banners" : "shop/home"}`}
        replace
      />
    );
  }

  if (isAuthenticated && role !== "admin" && path.includes("admin")) {
    return <Navigate to={`/${locale}/unauth-page`} replace />;
  }

  return <>{children}</>;
}

export default CheckAuth;
