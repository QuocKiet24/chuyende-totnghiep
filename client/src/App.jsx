import { useTranslation } from "react-i18next";
import { Button } from "./components/ui/button";

function App() {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{t("welcome")}</h1>
      <button
        onClick={() => changeLanguage("en")}
        className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
      >
        English
      </button>
      <Button
        onClick={() => changeLanguage("vi")}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Tiếng Việt
      </Button>
    </div>
  );
}
export default App;
