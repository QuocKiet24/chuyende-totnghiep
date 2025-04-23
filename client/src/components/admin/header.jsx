import React from "react";
import { Button } from "../ui/button";
import { AlignJustify, LogOut } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { logout } from "@/store/auth-slice";
import { useNavigate } from "react-router-dom";
import LanguageSwitcher from "../language/ChangeLanguage";

const AdminHeader = ({ setOpen }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/auth/login");
  };
  return (
    <header className="flex items-center justify-between px-4 py-3 bg-background border-b">
      <Button onClick={() => setOpen(true)} className="lg:hidden sm:block">
        <AlignJustify />
        <span className="sr-only">Menu</span>
      </Button>
      <div className="flex flex-1 justify-end gap-4">
        <LanguageSwitcher />
        <Button
          onClick={handleLogout}
          className="inline-flex gap-2 items-center rounded-md px-4 py-2 text-sm font-medium shadow"
        >
          <LogOut />
          {t("logout")}
        </Button>
      </div>
    </header>
  );
};

export default AdminHeader;
