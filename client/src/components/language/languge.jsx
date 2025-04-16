import { useEffect } from "react";
import { useParams, useNavigate, useLocation, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";

const SUPPORTED_LANGS = ["en", "vi"];

const LanguageLayout = () => {
  const { lang } = useParams();
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!SUPPORTED_LANGS.includes(lang)) {
      const fallbackLang = localStorage.getItem("i18nextLng") || "en";
      navigate(`/${fallbackLang}${location.pathname}`, { replace: true });
    } else {
      i18n.changeLanguage(lang);
      localStorage.setItem("i18nextLng", lang);
    }
  }, [lang]);

  return <Outlet />;
};

export default LanguageLayout;
