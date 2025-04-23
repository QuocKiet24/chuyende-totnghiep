import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import { Globe, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const SUPPORTED_LANGS = [
  { code: "en-US", name: "English" },
  { code: "vi-VN", name: "Tiếng Việt" },
];

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  // Get current language from URL or i18n
  const pathParts = location.pathname.split("/");
  const currentPathLang = pathParts[1];
  const currentLang =
    SUPPORTED_LANGS.find((lang) => lang.code === currentPathLang) ||
    SUPPORTED_LANGS[0];

  const changeLanguage = (newLang) => {
    if (currentLang.code === newLang) return;

    // Update i18n and localStorage
    i18n.changeLanguage(newLang);
    localStorage.setItem("i18nextLng", newLang);

    // Build new path with the new language
    let newPath = location.pathname;
    if (SUPPORTED_LANGS.some((lang) => lang.code === pathParts[1])) {
      // Replace existing language in path
      newPath = `/${newLang}${newPath.substring(`/${pathParts[1]}`.length)}`;
    } else {
      // Insert new language at beginning
      newPath = `/${newLang}${newPath}`;
    }

    navigate(newPath, { replace: true });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{currentLang.name}</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {SUPPORTED_LANGS.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={currentLang.code === lang.code ? "bg-accent" : ""}
          >
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
