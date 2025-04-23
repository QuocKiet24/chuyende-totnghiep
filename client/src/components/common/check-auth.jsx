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

  // ⏳ Chờ user nếu đang xác thực nhưng chưa có user object
  if (isAuthenticated && !user) {
    return <div>Đang tải thông tin người dùng...</div>;
  }

  // ✅ Redirect bắt buộc đến trang verify email nếu chưa xác minh
  if (
    isAuthenticated &&
    user &&
    isVerified === false &&
    !path.includes("/verify-email")
  ) {
    return <Navigate to={`/${lang}/auth/verify-email`} replace />;
  }

  // ❌ Chưa login mà vào /verify-email
  if (!isAuthenticated && path.includes("/verify-email")) {
    return <Navigate to={`/${lang}/auth/login`} replace />;
  }

  // ✅ Redirect root
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

  if (!isAuthenticated && path.includes("shop") && isShopProtectedPage) {
    return <Navigate to={`/${lang}/auth/login`} replace />;
  }

  if (!isAuthenticated && path.includes("admin")) {
    return <Navigate to={`/${lang}/auth/login`} replace />;
  }

  if (isAuthenticated && isAuthPage && isVerified !== false) {
    return (
      <Navigate
        to={`/${lang}/${role === "admin" ? "admin/dashboard" : "shop/home"}`}
        replace
      />
    );
  }

  if (isAuthenticated && role !== "admin" && path.includes("admin")) {
    return <Navigate to={`/${lang}/unauth-page`} replace />;
  }

  return <>{children}</>;
}

export default CheckAuth;
