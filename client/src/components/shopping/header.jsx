import {
  LayoutDashboardIcon,
  LogOut,
  Menu,
  Search,
  ShoppingCart,
  StoreIcon,
  User2,
  UserCog,
} from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { logout } from "@/store/auth-slice";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import Cartwrapper from "./cart-wrapper";
import { fetchCartItems } from "@/store/shop/cart-slice";
import LanguageSwitcher from "../language/ChangeLanguage";
import { Label } from "../ui/label";
import { toast } from "sonner";
import { motion } from "framer-motion"; // eslint-disable-line no-unused-vars

const useShoppingMenuItems = () => {
  const { t } = useTranslation();
  return React.useMemo(
    () => [
      { id: "products", label: t("menuitems.products"), path: "/shop/listing" },
      { id: "men", label: t("menuitems.men"), path: "/shop/listing" },
      { id: "women", label: t("menuitems.women"), path: "/shop/listing" },
      { id: "kids", label: t("menuitems.kids"), path: "/shop/listing" },
      { id: "footwear", label: t("menuitems.footwear"), path: "/shop/listing" },
      {
        id: "accessories",
        label: t("menuitems.accessories"),
        path: "/shop/listing",
      },
    ],
    [t]
  );
};

const HeaderRightContent = () => {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { locale } = useParams();
  const handleLogout = useCallback(() => {
    dispatch(logout());
    toast.success("You have been logged out successfully.");
    navigate(`/${locale}/auth/login`);
  }, [dispatch, navigate, locale]);

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchCartItems(user._id));
    }
  }, [dispatch, user?._id]);

  return (
    <div className="flex lg:items-center lg:flex-row flex-col gap-4">
      <motion.div whileHover={{ rotate: -10 }} whileTap={{ scale: 0.9 }}>
        <Button
          onClick={() => navigate(`/${locale}/shop/search`)}
          variant="outline"
          size="icon"
        >
          <Search className="size-6" />
          <span className="sr-only">Search</span>
        </Button>
      </motion.div>
      <LanguageSwitcher />
      <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
        <motion.div whileHover={{ rotate: -10 }} whileTap={{ scale: 0.9 }}>
          <Button
            onClick={() => setOpenCartSheet(true)}
            variant="outline"
            size="icon"
            className="relative"
          >
            <ShoppingCart className="size-6" />
            <span className="absolute top-[-5px] right-[2px] text-sm font-extrabold text-red-500">
              {cartItems?.items?.length || 0}
            </span>
            <span className="sr-only">User cart</span>
          </Button>
        </motion.div>

        <Cartwrapper
          setOpenCartSheet={setOpenCartSheet}
          cartItems={
            cartItems && cartItems.items && cartItems.items.length > 0
              ? cartItems.items
              : []
          }
        />
      </Sheet>
      {user?._id ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="bg-black cursor-pointer">
              <AvatarFallback className="bg-black text-white font-extrabold">
                {user?.userName[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" className="w-56">
            <DropdownMenuLabel>Logged in as {user?.userName}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => navigate(`/${locale}/shop/account`)}
            >
              <UserCog className="mr-2 h-4 w-4" />
              Account
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {user?.role === "admin" && (
              <>
                <DropdownMenuItem
                  onClick={() => navigate(`/${locale}/admin/banners`)}
                >
                  <LayoutDashboardIcon className="mr-2 h-4 w-4" />
                  Admin
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}

            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="flex flex-1 justify-end">
          <Button
            onClick={() => navigate(`/${locale}/auth/login`)}
            className="inline-flex gap-2 items-center rounded-md px-4 py-2 text-sm font-medium shadow"
          >
            <User2 />
            {t("login.h1")}
          </Button>
        </div>
      )}
    </div>
  );
};

function MenuItems() {
  const navigate = useNavigate();
  const { locale } = useParams();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const menuItems = useShoppingMenuItems();

  // Thêm locale vào các path của menuItems
  const localizedMenuItems = menuItems.map((item) => ({
    ...item,
    path: `/${locale}${item.path}`,
  }));

  function handleNavigate(getCurrentMenuItem) {
    sessionStorage.removeItem("filters");
    const currentFilter =
      getCurrentMenuItem.id !== "home" &&
      getCurrentMenuItem.id !== "products" &&
      getCurrentMenuItem.id !== "search"
        ? {
            category: [getCurrentMenuItem.id],
          }
        : null;

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));

    if (location.pathname.includes("listing") && currentFilter !== null) {
      setSearchParams(
        new URLSearchParams(`?category=${getCurrentMenuItem.id}`)
      );
    } else {
      // Đảm bảo navigate đến path đã được localize
      navigate(getCurrentMenuItem.path);
    }
  }

  return (
    <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row">
      {localizedMenuItems.map((menuItem) => (
        <motion.div
          key={menuItem.id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Label
            onClick={() => handleNavigate(menuItem)}
            className="text-sm font-medium cursor-pointer"
          >
            {menuItem.label}
          </Label>
        </motion.div>
      ))}
    </nav>
  );
}

const ShoppingHeader = () => {
  const { locale } = useParams();
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <Link to={`/${locale}/shop/home`} className="flex items-center gap-2">
          <StoreIcon className="h-6 w-6" />
          <span className="font-bold">Ecommerce Shop</span>
        </Link>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle header menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full max-w-xs px-10 py-5">
            <HeaderRightContent />
            <MenuItems />
          </SheetContent>
        </Sheet>
        <div className="hidden lg:block">
          <MenuItems />
        </div>

        <div className="hidden lg:block">
          <HeaderRightContent />
        </div>
      </div>
    </header>
  );
};

export default ShoppingHeader;
