/* eslint-disable no-unused-vars */
import axios from "axios";
import { MoreVertical, MoreVerticalIcon } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { ToastContainer } from "react-toastify";

const Dashboard = () => {
  const [latestExpense, setLatestexpense] = useState([]);
  const userId = localStorage.getItem("id");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [showDates, setShowDates] = useState(false);

  const getLastExpense = async (userId) => {
    const limit = 5;
    try {
      const res = await axios.get(
        `/get-latest-expense/${userId}?limit=${limit}`
      );
      setLatestexpense(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (userId) {
      getLastExpense(userId);
    }
  }, [userId]);

  return (
    <div className="p-4">
      <ToastContainer></ToastContainer>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 shadow rounded-lg">
          <h3 className="text-gray-600 text-lg">Total Income</h3>
          <p className="text-2xl font-bold text-green-600">$5,000</p>
        </div>
        <div className="bg-white p-6 shadow rounded-lg">
          <h3 className="text-gray-600 text-lg">Total Expenses</h3>
          <p className="text-2xl font-bold text-red-600">$2,000</p>
        </div>
        <div className="bg-white p-6 shadow rounded-lg">
          <h3 className="text-gray-600 text-lg">Balance</h3>
          <p className="text-2xl font-bold text-blue-600">$3,000</p>
        </div>
      </div>
      <div className="bg-white p-6 shadow rounded-lg mt-6">
        <div className="flex justify-between">
          <h3 className="text-gray-600 text-lg mb-4">Recent Transactions</h3>
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
                    <input
                      type="checkbox"
                      checked={showDates}
                      onChange={() => setShowDates(!showDates)}
                      name="date"
                      id="date"
                    />
                    <span>Expense Date</span>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
        <table className="w-full">
          <thead className="w-full">
            <tr className="w-full grid grid-cols-3 gap-x-4">
              <th className="text-start">Title</th>
              <th className="text-end">Amount</th>
              <th className="text-end">Expense Date</th>
            </tr>
          </thead>
          <tbody className="w-full">
            {latestExpense.length > 0 ? (
              latestExpense.map((expense) => (
                <tr key={expense._id} className="border-b border-gray-400 w-full grid grid-cols-3 gap-x-4">
                  <td className="py-2">{expense.title}</td>
                  <td className="py-2 text-end ">{expense.amount}</td>
                  <td className="py-2 text-end">
                    {format(new Date(expense.expenseDate), "dd/MM/yyyy")}
                  </td>
                </tr>
              ))
            ) : (
              <div>Data not found</div>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
