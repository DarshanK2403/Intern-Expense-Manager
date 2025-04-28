import { Clock, CreditCard, TagIcon, User } from "lucide-react";
import "react";
import { Link, useLocation } from "react-router-dom";

const SettingNav = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };

  const menuSetting = [
    { icon: User, label: "Profile Settings", path: "/settings/profile" },
    { icon: TagIcon, label: "Category Management", path: "/settings/category" },
    { icon: CreditCard, label: "Payment Through", path: "/settings/payment" },
    { icon: Clock, label: "History", path: "/settings/history" },
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
              className={`flex items-center rounded-md hover:cursor-pointer px-4 m-2 py-3 transition-colors ${active ? "bg-blue-100 text-blue-600" : ""}`}
            >
              <Icon className="h-5 w-5 mr-3"/>
              <label className="hover:cursor-pointer">{menu.label}</label>
            </Link>
          </li>
        );
      })}
    </div>
  );
};

export default SettingNav;
