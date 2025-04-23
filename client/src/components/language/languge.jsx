import { useEffect } from "react";
import { useParams, useNavigate, useLocation, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";

const SUPPORTED_LANGS = ["en-US", "vi-VN"];

const LanguageLayout = () => {
  const { locale } = useParams(); // Đổi từ 'lang' thành 'locale' để nhất quán
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!SUPPORTED_LANGS.includes(locale)) {
      const fallbackLang = localStorage.getItem("i18nextLng") || "en-US";
      const newPath = location.pathname.replace(
        `/${locale}`,
        `/${fallbackLang}`
      );
      navigate(newPath, { replace: true });
    } else {
      i18n.changeLanguage(locale);
      localStorage.setItem("i18nextLng", locale);
    }
  }, [locale, navigate, location.pathname, i18n]);

  return <Outlet />;
};

export default LanguageLayout;
