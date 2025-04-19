import { Navigate, useLocation, useParams } from "react-router-dom";

function CheckAuth({ isAuthenticated, user, children }) {
  const location = useLocation();
  const { lang = "en" } = useParams();
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
    return <div>Loading...</div>;
  }

  // ❌ Nếu chưa đăng nhập nhưng lại vào /verify-email
  if (!isAuthenticated && path.includes("/verify-email")) {
    return <Navigate to={`/${lang}/auth/login`} replace />;
  }

  // ✅ Nếu người dùng đã login nhưng chưa xác minh email
  if (
    isAuthenticated &&
    isVerified === false &&
    !path.includes("/verify-email")
  ) {
    return <Navigate to={`/${lang}/auth/verify-email`} replace />;
  }

  // ✅ Nếu path là gốc /vi hoặc /en
  if (path === `/${lang}` || path === `/${lang}/`) {
    if (!isAuthenticated) {
      return <Navigate to={`/${lang}/shop/home`} replace />;
    }
    return (
      <Navigate
        to={`/${lang}/${role === "admin" ? "admin/dashboard" : "shop/home"}`}
        replace
      />
    );
  }

  // ✅ Nếu chưa login và truy cập trang checkout hoặc account của shop
  if (!isAuthenticated && path.includes("shop") && isShopProtectedPage) {
    return <Navigate to={`/${lang}/auth/login`} replace />;
  }

  // ✅ Nếu chưa login và truy cập trang admin
  if (!isAuthenticated && path.includes("admin")) {
    return <Navigate to={`/${lang}/auth/login`} replace />;
  }

  // ✅ Nếu đã login nhưng đang ở trang auth
  if (isAuthenticated && isAuthPage && isVerified !== false) {
    return (
      <Navigate
        to={`/${lang}/${role === "admin" ? "admin/dashboard" : "shop/home"}`}
        replace
      />
    );
  }

  // ✅ Nếu user không phải admin mà vào trang admin
  if (isAuthenticated && role !== "admin" && path.includes("admin")) {
    return <Navigate to={`/${lang}/unauth-page`} replace />;
  }

  return <>{children}</>;
}

export default CheckAuth;
