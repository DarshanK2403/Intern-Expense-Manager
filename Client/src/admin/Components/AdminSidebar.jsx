/* eslint-disable no-unused-vars */
import {
  BarChart2,
  BarChart3,
  CreditCard,
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
import { Link, useLocation, useNavigate } from "react-router-dom";
const AdminSidebar = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  

  const menuItems = [
    { name: "Dashboard", icon: Home, path: "/admin/dashboard" },
    { name: "Users", icon: FileText, path: "/admin/users" },
    { name: "Expenses", icon: BarChart3, path: "/admin/expenses" },
    { name: "Reports", icon: Users, path: "/admin/reports" },
    { name: "Settings", icon: Settings, path: "/admin/settings" },
  ];

  const logout = () => {
    localStorage.removeItem("id");
    navigate("/signin", { replace: true });
  }
  return (
    <aside
      className={`${
        isSidebarOpen ? "w-64" : "w-0 -ml-64"
      } transition-all duration-300 bg-white border-r border-gray-200 h-screen sticky top-0 z-10`}
    >
      <div className="h-full py-6 px-3 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`flex items-center p-2 rounded-lg font-medium ${
                    isActive
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <item.icon size={20} className="mr-3" />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        
        </ul>
        <div className="mt-10 pt-6 border-t border-gray-200">
          <button
            className="flex items-center p-2 rounded-lg text-red-600 hover:bg-red-50 font-medium"
            onClick={logout}
          >
            <LogOut size={20} className="mr-3" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
