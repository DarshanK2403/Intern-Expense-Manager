/* eslint-disable no-unused-vars */
import React from "react";
import { Outlet } from "react-router-dom";
import AdminNav from "../Components/adminNav";
import AdminSidebar from "../Components/adminSidebar";

const AdminLayout = () => {
  return (
    <div>
      <AdminNav />
      <div className="flex">
        <AdminSidebar />
        <main className="w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
