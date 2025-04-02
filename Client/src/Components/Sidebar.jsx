/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  BarChart,
  DollarSign,
  Settings,
  Menu,
  ChevronLeft,
  ChevronRight,
  Banknote,
  Store,
} from "lucide-react";
import axios from "axios";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  const [user, setUser] = useState([]);
  const userId = localStorage.getItem("id");
  const [isAdmin, setAdmin] = useState(false);

  // Function to check if a route is active
  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };

  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: DollarSign, label: "Expenses", path: "/expenses" },
    { icon: Banknote, label: "Income", path: "/income" },
    { icon: Store, label: "Vendor", path: "/vendor" },
    { icon: BarChart, label: "Reports", path: "/reports" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  useEffect(() => {
    const getUser = async () => {
      try {
        if (userId) {
          const res = await axios.get(`/userdata/${userId}`);
          // console.log(res);
          setUser(res.data);
          if (res.data.role.name === "admin") {
            setAdmin(true);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [userId]);

  return (
    <aside
    className={`bg-white text-gray-800 border-r border-gray-300 shadow-md transition-all duration-300 sticky top-0 left-0 ${
      isOpen ? "w-64" : "w-20"
    }`}
  >
    {/* Logo and company name */}
    <div className="p-4 border-b border-gray-300 flex items-center justify-between bg-gray-100">
      <div className="flex items-center">
        <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
          <span className="text-white font-bold">F</span>
        </div>
        {isOpen && (
          <span className="ml-3 font-semibold text-blue-700">FinanceTrack</span>
        )}
      </div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 rounded-md hover:bg-gray-200 transition-colors"
        aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
      >
        {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
      </button>
    </div>
  
    {/* Navigation Menu */}
    <nav className="mt-4 px-2">
      <ul className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
  
          return (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center rounded-md px-4 py-3 transition-colors ${
                  active
                    ? "bg-blue-200 text-blue-700 font-semibold border-l-4 border-[#007bff]"
                    : "hover:bg-gray-200 text-gray-900"
                }`}
              >
                <Icon className={`${isOpen ? "w-5 h-5" : "w-6 h-6"} text-gray-700`} />
                {isOpen && <span className="ml-3">{item.label}</span>}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  
    {/* User Profile Section */}
    <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-300 bg-gray-100">
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-800">
          {isOpen ? "JS" : "J"}
        </div>
        {isOpen && (
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">
              {user.firstName} {user.lastName}
            </p>
            {isAdmin ? <p className="text-xs text-gray-500">Administrator</p> : ""}
          </div>
        )}
      </div>
    </div>
  </aside>
  
  
  );
};

export default Sidebar;
