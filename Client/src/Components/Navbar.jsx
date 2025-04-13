import { ChevronDown, LogOut, Menu, User, X } from "lucide-react";
import { useState, useEffect, useContext, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { user, loading } = useContext(AuthContext);

  const menuRef = useRef(null);
  const profileMenuRef = useRef(null);

  
  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setIsProfileMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close mobile menu when navigation occurs
  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    // Show confirmation dialog
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("Token");
      navigate("/signin");
    }
  };

  if (loading) {
    return (
      <nav className="bg-white shadow fixed top-0 left-0 right-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="skeleton-loading h-8 w-40 rounded"></div>
            <div className="skeleton-loading h-10 w-24 rounded"></div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow fixed top-0 left-0 right-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => navigate("/dashboard")}
            >
              <div className="bg-blue-600 text-white p-2 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm3 1h6v4H7V5zm8 8v2h1v1H4v-1h1v-2H4v-1h12v1h-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-blue-600 hidden sm:block">
                FinanceTrack
              </h1>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Desktop Navigation and User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {/* User Profile Menu */}
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 focus:outline-none"
              >
                <div className="bg-blue-100 text-blue-600 p-1 rounded-full">
                  <User className="h-5 w-5" />
                </div>
                {user && (
                  <span className="text-sm font-medium">{user.firstName}</span>
                )}
                <ChevronDown className="h-4 w-4" />
              </button>

              {/* Profile Dropdown */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Settings
                  </Link>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    <div className="flex items-center">
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-md" ref={menuRef}>
          <div className="pt-2 pb-3 space-y-1 px-4">
            <div className="border-t border-gray-200 my-2"></div>

            {user && (
              <div className="flex items-center py-3">
                <div className="bg-blue-100 text-blue-600 p-2 rounded-full mr-3">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
            )}

            <Link
              to="/profile"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50"
            >
              My Profile
            </Link>

            <Link
              to="/settings"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50"
            >
              Settings
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
