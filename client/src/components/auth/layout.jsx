import { motion } from "framer-motion"; // eslint-disable-line no-unused-vars
import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../language/ChangeLanguage";

const AuthLayout = () => {
  const { t } = useTranslation();

  return (
    <div className="relative flex min-h-screen w-full overflow-hidden">
      <div className="absolute top-4 left-4 z-20">
        <LanguageSwitcher />
      </div>

      {/* Left Panel */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="hidden lg:flex items-center justify-center bg-gradient-to-br from-neutral-700 via-slate-900 to-sky-900 w-1/3 px-12 relative z-10"
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="max-w-md space-y-6 text-center text-primary-foreground"
        >
          <h1 className="text-4xl font-bold tracking-tight">{t("welcome")}</h1>
        </motion.div>
      </motion.div>

      {/* Right Panel */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-1 items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8 relative z-10"
      >
        <Outlet />
      </motion.div>
    </div>
  );
};

export default AuthLayout;
