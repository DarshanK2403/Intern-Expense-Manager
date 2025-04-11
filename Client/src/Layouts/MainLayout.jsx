import "react";
import { matchRoutes, Outlet, useLocation } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";
import { useState } from "react";
import ExpenseNav from "../Components/navs/ExpenseNav";
import SettingNav from "../Components/navs/SettingNav";
import IncomeNav from "../Components/navs/IncomeNav";
import VendorNav from "../Components/navs/VendorNav";

const MainLayout = () => {
  const location = useLocation();
  const [searchValue, setSearchValue] = useState("");

  const routes = [
    { path: "/expenses", element: <ExpenseNav onSearchChange={setSearchValue} /> },
    { path: "/settings/*", element: <SettingNav onSearchChange={setSearchValue} /> },
    { path: "/income/", element: <IncomeNav onSearchChange={setSearchValue} /> },
    { path: "/vendor/", element: <VendorNav onSearchChange={setSearchValue} /> },
  ];

  const matchedRoute = matchRoutes(routes, location);
  const SubNav = matchedRoute ? matchedRoute[0].route.element : null;
  const isSettingsPage = location.pathname.startsWith("/settings");

  return (
    <div className="h-screen flex flex-col">
      <div className="fixed w-full top-0 z-10">
        <Navbar />
      </div>
      <div className="flex flex-1 pt-16">
        <Sidebar />
        <main
          className={`flex-1 bg-gray-50 scroll-smooth overflow-y-auto h-[calc(100vh-4rem)] ${
            isSettingsPage ? "flex" : ""
          }`}
        >
          {SubNav}
          <Outlet context={{ searchValue }} />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
