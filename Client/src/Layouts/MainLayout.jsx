/* eslint-disable no-unused-vars */
import "react";
import { matchRoutes, Outlet, useLocation } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";
import { useState } from "react";
import ExpenseNav from "../Components/navs/ExpenseNav";
import SettingNav from "../Components/navs/SettingNav";

const routes = [
  { path: "/expenses", element: <ExpenseNav /> },
  { path: "/settings/*", element: <SettingNav /> },
];

const MainLayout = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true); // Track sidebar state

  const matchedRoute = matchRoutes(routes, location);

  // Determine if SubNav exists
  const SubNav = matchedRoute ? matchedRoute[0].route.element : null;

  // Check if the current route is under `/settings/*`
  const isSettingsPage = location.pathname.startsWith("/settings");

  return (
    <div className="h-screen flex flex-col">
      {/* Fixed Navbar */}
      <div className="fixed w-full top-0 z-10">
        <Navbar />
      </div>

      <div className="flex flex-1 pt-16">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content - Only this section scrolls */}
        <main
          className={`flex-1 bg-gray-50 scroll-smooth overflow-y-auto h-[calc(100vh-4rem)] p-4 ${
            isSettingsPage ? "flex" : ""
          }`}
        >
          {SubNav}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
