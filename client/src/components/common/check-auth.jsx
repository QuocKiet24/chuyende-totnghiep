import { Navigate, useLocation, useParams } from "react-router-dom";

function CheckAuth({ isAuthenticated, user, children }) {
  const location = useLocation();
  const { lang = "en" } = useParams(); // Nếu không có thì fallback về "en"
  const role = user?.role;
  const path = location.pathname;

  const isAuthPage = ["/login", "/register"].some((p) => path.includes(p));

  if (path === `/${lang}` || path === `/${lang}/`) {
    if (!isAuthenticated) {
      return <Navigate to={`/${lang}/auth/login`} replace />;
    }
    return (
      <Navigate
        to={`/${lang}/${role === "admin" ? "admin/dashboard" : "shop/home"}`}
        replace
      />
    );
  }

  if (!isAuthenticated && !isAuthPage) {
    return <Navigate to={`/${lang}/auth/login`} replace />;
  }

  if (isAuthenticated && isAuthPage) {
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

  if (isAuthenticated && role === "admin" && path.includes("shop")) {
    return <Navigate to={`/${lang}/admin/dashboard`} replace />;
  }

  return <>{children}</>;
}

export default CheckAuth;
