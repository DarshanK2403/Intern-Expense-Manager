/* eslint-disable no-unused-vars */
import { Search } from "lucide-react";
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
      <nav className="w-7xl flex flex-row justify-between px-12 py-4 ">
        <span className="text-2xl font-bold text-blue-600">
          <h1>FinanceTrack</h1>
        </span>
        <div className="flex items-center space-x-4">
          <p className="text-blue-600">Welcome, Admin!</p>
          <button
          onClick={logout}
           className="bg-red-100 text-red-600 rounded-lg py-2 font-semibold border border-red-300 hover:bg-red-200 transition-colors px-4">
            Logout
          </button>
        </div>
      </nav>
    </div>
  );
};

export default AdminNav;
