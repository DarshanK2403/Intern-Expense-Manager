/* eslint-disable no-unused-vars */
import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [isAdmin, setAdmin] = useState(false);

  const token = localStorage.getItem("Token");
  useEffect(() => {
    const getUserdata = async () => {
      try {
        const res = await axios.get(`/userdata`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // console.log(res.data.role.name);
        if (res.data.role.name === "admin") {
          setAdmin(true);
        }
        setUserName(res.data.firstName);
      } catch (error) {
        console.log(error);
      }
    };
    getUserdata();
  }, [token]);

  const handleLogout = () => {
    // Show confirmation dialog
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("Token");
      navigate("/signin");
    }
  };

  return (
    <nav className="bg-white shadow text-gray-700 fixed top-0 left-0 right-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <h1
              className="text-xl font-bold text-blue-600 hover:cursor-pointer"
              onClick={() => navigate("/dashboard")}
            >
              FinanceTrack
            </h1>
          </div>

          {/* User Menu and Logout */}
          <div className="flex items-center space-x-4">
            {isAdmin ? <Link to="/admin/dashboard">Admin Dashboard</Link> : " "}
            {userName && (
              <span className="hidden md:inline text-sm">
                Welcome, {userName}
              </span>
            )}
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
