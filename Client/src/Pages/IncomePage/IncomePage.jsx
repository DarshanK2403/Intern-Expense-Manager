/* eslint-disable no-unused-vars */
import React, { useCallback, useEffect, useState } from "react";
import {
  Calendar,
  DollarSign,
  Edit,
  FileText,
  IndianRupee,
  Tag,
  Trash2,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

const IncomePage = () => {
  const token = localStorage.getItem("Token");
  const [incomeData, setIncomeData] = useState([]);
  const navigate = useNavigate();
  // Ge Income
  const getIncome = useCallback(async () => {
    try {
      const res = await axios.get(`/get-income`,{
        headers:{
          Authorization: `Bearer ${token}`
        }
      });
      setIncomeData(res.data);
    } catch (error) {
      toast.error("Failed to fetch income data");
    }
  }, [token]);

  useEffect(() => {
    getIncome();
  }, [getIncome]);

  // Delete Income
  const deleteIncome = async (id) => {
    try {
      await axios.delete(`/delete-income/${id}`,{
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      toast.success("Income Deleted");

      // Update state after deletion
      setIncomeData((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      toast.error("Failed to delete income");
    }
  };

  const EditIncome = async(id)=>{
    navigate(`/income/edit-income/${id}`);
  }

  return (
    <div>
      <ToastContainer autoClose={1500}></ToastContainer>
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow overflow-hidden">
        {incomeData.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-blue-600 text-white">
              <tr>
                 <th className="p-4 text-left font-medium">
                  Title
                </th>
                 <th className="p-4 text-left font-medium">
                  Amount
                </th>
                 <th className="p-4 text-left font-medium">
                  Date
                </th>
                 <th className="p-4 text-left font-medium">
                  Category
                </th>
                 <th className="p-4 text-left font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {incomeData.map((entry, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">
                      {entry.title}
                    </div>
                    {entry.notes && (
                      <div className="text-sm text-gray-500">
                        {entry.notes.length > 40
                          ? `${entry.notes.substring(0, 40)}...`
                          : entry.notes}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-lg font-semibold text-gray-900 flex items-center text-end">
                      <IndianRupee className="h-4 w-4" />
                      {entry.amount}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-800">
                        {format(new Date(entry.incomeDate), "MMM dd, yyyy")}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {entry.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                      <button className="text-gray-600 hover:text-indigo-600"
                      onClick={()=>EditIncome(entry._id)}
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        className="text-gray-600 hover:text-red-600"
                        onClick={() => deleteIncome(entry._id)}
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-lg shadow-sm">
            <FileText className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              No Income Yet
            </h3>
            <p className="text-gray-500 text-center max-w-md">
              You haven&#39;t recorded any income transactions. Start by adding
              an income.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default IncomePage;
