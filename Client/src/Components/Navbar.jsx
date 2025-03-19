/* eslint-disable no-unused-vars */
import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // Get username from localStorage or fetch from API
    const userId = localStorage.getItem("id");
    if (userId) {
      setUserName("User");
    }
  }, []);

  const userId = localStorage.getItem("id")
 
  useEffect(() => {
    const getUserdata = async () => {
      try {
        const res = await axios.get(`/userdata/${userId}`);
        // console.log(res.data);
        setUserName(res.data.firstName)
      } catch (error) {
        console.log(error);
      }
    };
    getUserdata();
  }, [userId]);

  const handleLogout = () => {
    // Show confirmation dialog
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("id");
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

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-blue-600 focus:outline-none"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
