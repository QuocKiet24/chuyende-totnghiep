import {
  BadgeCheck,
  ChartNoAxesCombined,
  Image,
  LayoutDashboard,
  ShoppingBasket,
  StoreIcon,
} from "lucide-react";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";

const AdminSidebarMenuItems = ({ locale }) => [
  {
    id: "shop",
    label: "shop",
    path: `/${locale}/shop/home`, // Thêm locale vào path
    icon: <StoreIcon />,
  },
  {
    id: "banner",
    label: "managebanner",
    path: `/${locale}/admin/banners`, // Thêm locale vào path
    icon: <Image />,
  },
  {
    id: "products",
    label: "products",
    path: `/${locale}/admin/products`, // Thêm locale vào path
    icon: <ShoppingBasket />,
  },
  {
    id: "orders",
    label: "orders",
    path: `/${locale}/admin/orders`, // Thêm locale vào path
    icon: <BadgeCheck />,
  },
];

function MenuItems({ setOpen }) {
  const navigate = useNavigate();
  const { locale } = useParams();
  const { t } = useTranslation();

  // Truyền locale vào để tạo menu items
  const menuItems = AdminSidebarMenuItems({ locale });

  return (
    <nav className="mt-8 flex-col flex gap-2">
      {menuItems.map((menuItem) => (
        <div
          key={menuItem.id}
          onClick={() => {
            navigate(menuItem.path);
            setOpen ? setOpen(false) : null;
          }}
          className="flex cursor-pointer text-xl items-center gap-2 rounded-md px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          {menuItem.icon}
          <span>{t(`admin.${menuItem.label}`)}</span>
        </div>
      ))}
    </nav>
  );
}

const AdminSidebar = ({ open, setOpen }) => {
  const navigate = useNavigate();
  const { locale } = useParams(); // Lấy locale từ URL

  return (
    <Fragment>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-64">
          <div className="flex flex-col h-full">
            <SheetHeader className="border-b">
              <SheetTitle className="flex gap-2 mt-5 mb-5">
                <ChartNoAxesCombined size={30} />
                <span className="text-xl font-extrabold">Admin Panel</span>
              </SheetTitle>
            </SheetHeader>
            <MenuItems setOpen={setOpen} />
          </div>
        </SheetContent>
      </Sheet>
      <aside className="hidden w-64 flex-col border-r bg-background p-6 lg:flex">
        <div
          onClick={() => navigate(`/${locale}/admin/banners`)} // Thêm locale vào path
          className="flex items-center gap-2 cursor-pointer"
        >
          <ChartNoAxesCombined size={30} />
          <h1 className="text-xl font-extrabold">Admin Panel</h1>
        </div>
        <MenuItems />
      </aside>
    </Fragment>
  );
};

export default AdminSidebar;
