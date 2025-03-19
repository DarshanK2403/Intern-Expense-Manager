import { CreditCard, Globe, TagIcon, User } from "lucide-react";
import "react";
import { Link, useLocation } from "react-router-dom";

const SettingNav = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const menuSetting = [
    { icon: User, label: "Profile Settings", path: "/settings" },
    { icon: TagIcon, label: "Category Management", path: "/settings/category" },
    { icon: User, label: "Account Management", path: "/settings/account" },
    { icon: CreditCard, label: "Payment Methods", path: "/settings/payment" },
    { icon: Globe, label: "Currency Settings", path: "/settings/currency" },
  ];
  return (
    <div className="w-64 border-r bg-white border-gray-200 max-h-screen md:sticky md:top-0">
      <div className="p-4 border-b border-gray-200 hidden md:block">
        <h1 className="text-xl font-bold">Settings</h1>
      </div>
      {menuSetting.map((menu) => {
        const Icon = menu.icon;
        const active = isActive(menu.path);

        return (
          <li className="list-none" key={menu.path}>
            <Link
              to={menu.path}
              className="flex items-center rounded-md px-4 py-3 transition-colors"
            >
              <Icon className="h-5 w-5 mr-3" />
              <label htmlFor="">{menu.label}</label>
            </Link>
          </li>
        );
      })}
    </div>
  );
};

export default SettingNav;
