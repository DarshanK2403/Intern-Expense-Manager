/* eslint-disable no-unused-vars */
import {
  BarChart3,
  FileText,
  Home,
  LogOut,
  Menu,
  Search,
  Settings,
  Users,
  X,
} from "lucide-react";
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const AdminSidebar = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", icon: Home, path: "/admin/dashboard" },
    { name: "Expenses", icon: FileText, path: "/admin/expenses" },
    { name: "Reports", icon: BarChart3, path: "/admin/reports" },
    { name: "Users", icon: Users, path: "/admin/users" },
    { name: "Settings", icon: Settings, path: "/admin/settings" },
  ];

  return (
    <div className="w-72 bg-gray-100 h-screen">
      <ul className="w-68">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const path = item.path;
          const isActive = location.pathname.startsWith(path)

          return (
            <Link to={item.path} key={item.path} className={`flex py-2 m-2 rounded-sm px-4 gap-2 ${isActive ? "bg-blue-200 text-blue-600" : ""}`}>
              <Icon></Icon>
              {item.name}
            </Link>
          );
        })}
      </ul>
    </div>
  );
};

export default AdminSidebar;
