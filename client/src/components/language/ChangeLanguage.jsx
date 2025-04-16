import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";

const SUPPORTED_LANGS = ["en", "vi"];

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  // Lấy lang hiện tại từ URL
  const currentLang = location.pathname.split("/")[1]; // ví dụ: /vi/admin => vi

  const changeLanguage = (newLang) => {
    if (currentLang === newLang) return;

    const newPath = location.pathname.replace(`/${currentLang}`, `/${newLang}`);
    const newUrl = `${newPath}${location.search}`;

    i18n.changeLanguage(newLang);
    localStorage.setItem("i18nextLng", newLang);

    navigate(newUrl, { replace: true });
  };

  return (
    <div className="flex gap-2">
      {SUPPORTED_LANGS.map((lng) => (
        <button
          key={lng}
          onClick={() => changeLanguage(lng)}
          className={`px-4 py-1 rounded transition ${
            currentLang === lng
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          {lng === "en" ? "English" : "Tiếng Việt"}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
