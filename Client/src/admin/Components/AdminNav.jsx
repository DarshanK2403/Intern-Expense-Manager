/* eslint-disable no-unused-vars */
import { Search, Settings } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';

const AdminNav = () => {
  const id = localStorage.getItem("id");
  const navigate = useNavigate();
  const logout = (id) => {
    try {
      if(id){
        localStorage.removeItem("id")
        navigate('/signinP')
      
      }else{
        toast.error("Failed to Logout");
      }
    } catch (error) {
      toast.error("Server not response")
    }
  }
  return (
    <div className="w-full bg-white justify-center items-center flex border-b border-gray-300 shadow">
      <ToastContainer></ToastContainer>
      <header className="w-full max-w-7xl bg-white border-b border-gray-200">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          {/* <button onClick={toggleSidebar} className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none">
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button> */}
          <h1 className="ml-3 text-xl font-bold text-blue-600">FinanceTrack</h1>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full bg-gray-100 text-gray-400 hover:text-gray-500">
            <Settings size={18} />
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold">
              D
            </div>
            <span className="hidden md:inline-block text-sm font-medium text-gray-700">Admin</span>
          </div>
        </div>
      </div>
    </header>
    </div>
  );
};

export default AdminNav;
