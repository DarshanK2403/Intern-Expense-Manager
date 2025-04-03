/* eslint-disable no-unused-vars */
import axios from "axios";
import {
  ArrowLeft,
  Download,
  Edit,
  Eye,
  FileSpreadsheet,
  MoreVertical,
  Share2,
  Trash2,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const DetailExpense = () => {
  const {id} = useParams();
  const [expensedata, setExpensedata] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getExpenseDetails = async () => {
      try {
        if (id) {
          const res = await axios.get(`/expense-details/${id}`);
            console.log(res.data);
          setExpensedata(res.data);
        } else {
          console.log("error");
        }
      } catch (error) {
        toast.error("Internal Server Error");
      }
    };
    if (id) {
      getExpenseDetails();
    }
  }, [id]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleGoBack = () => {
    navigate(-1);
  };
  const deleteExpense = async() => {
    await axios.delete(`/delete-expense/${id}`)
    toast.success("Expense Deleted")
    navigate(-1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <ToastContainer></ToastContainer>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          {/* Back button and Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleGoBack}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Expense Detail</h1>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Primary Actions */}
            <button className="flex items-center gap-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors">
              <Edit className="h-4 w-4" />
              <span className="hidden sm:inline">Edit</span>
            </button>

            <button className="flex items-center gap-1 px-3 py-2 bg-purple-50 text-purple-600 rounded-md hover:bg-purple-100 transition-colors">
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline">Share</span>
            </button>

            {/* More Options Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-md hover:bg-gray-100 transition-colors"
                aria-label="More options"
              >
                <MoreVertical className="h-5 w-5 text-gray-600" />
              </button>

              {/* Enhanced Dropdown Menu */}
              {isOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <ul className="py-1">
                    <li className="px-1">
                      <button className="w-full flex items-center gap-2 rounded-md text-left px-3 py-2 text-gray-700 hover:bg-gray-50 transition-colors">
                        <Eye className="h-4 w-4 text-gray-500" />
                        <span>Preview</span>
                      </button>
                    </li>
                    <li className="px-1">
                      <button className="w-full flex items-center gap-2 rounded-md text-left px-3 py-2 text-gray-700 hover:bg-gray-50 transition-colors">
                        <Download className="h-4 w-4 text-gray-500" />
                        <span>Download PDF</span>
                      </button>
                    </li>
                    <li className="px-1">
                      <button className="w-full flex items-center gap-2 rounded-md text-left px-3 py-2 text-gray-700 hover:bg-gray-50 transition-colors">
                        <FileSpreadsheet className="h-4 w-4 text-gray-500" />
                        <span>Export to Excel</span>
                      </button>
                    </li>
                    <li className="border-t border-gray-100 my-1"></li>
                    <li className="px-1">
                      <button className="w-full flex items-center gap-2 rounded-md text-left px-3 py-2 text-red-600 hover:bg-red-50 transition-colors">
                        <Trash2 className="h-4 w-4" />
                        <button onClick={()=>deleteExpense(expensedata._id)}>
                          Delete Expense
                        </button>
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <form>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Left Column - Receipt Upload */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Receipt
              </label>
              <div
                className={`border 
                          border-dashed rounded-lg p-4 h-72 md:h-[95%] flex flex-col items-center justify-center
                          bg-gray-100 transition-all duration-200 hover:cursor-pointer hover:bg-[#2e2e2e25]`}
              >
                <img src={expensedata.receipt} alt="" className="" />
              </div>
            </div>
            {/* Right Column - Form Fields */}
            <div className="lg:col-span-3 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Title
                  </label>
                  <p className="text-gray-900">{expensedata.title}</p>
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Amount
                  </label>
                  <p className="text-gray-900">{expensedata.amount}</p>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Description
                </label>
                <p className="text-gray-900">
                  {expensedata.description || "-"}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Expense Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Expense Date
                  </label>
                  <p className="text-gray-900">{expensedata.expenseDate}</p>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Category
                  </label>
                  <p className="text-gray-900">{expensedata.category}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Account */}
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Account
                  </label>
                  <p>{expensedata.account}</p>
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Payment Method
                  </label>
                  <p>{expensedata.paymentMethod}</p>
                </div>
              </div>

              {/* Vendor */}
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Vendor
                </label>
                <p className="text-gray-900">{expensedata.vendor}</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DetailExpense;
