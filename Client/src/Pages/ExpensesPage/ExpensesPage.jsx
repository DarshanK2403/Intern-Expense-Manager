/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Store,
  Calendar,
  DollarSign,
  FileText,
  CreditCard,
  Tag,
  Wallet,
  File,
  Search,
  Filter,
  ChevronDown,
  Plus,
  Receipt,
  ImageIcon,
} from "lucide-react";
import { Link } from "react-router-dom";

const ExpensesPage = () => {
  const userId = localStorage.getItem("id");
  const [expenses, setExpenses] = useState([]);
  const isImage = (fileName) => {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName);
  };

  const isPDF = (fileName) => {
    return /\.pdf$/i.test(fileName);
  };
  // ✅ Fetch Expenses
  const getExpense = async () => {
    try {
      const res = await axios(`/get-expense/${userId}`);
      // console.log("API Response:", res.data.data); // ✅ Always correct
      setExpenses(res.data.data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  // ✅ Logs only after `expenses` updates
  useEffect(() => {
    // console.log("Updated Expenses (After State Change):", expenses);
  }, [expenses]);

  // ✅ Calls API only when `userId` is available
  useEffect(() => {
    if (userId) {
      getExpense();
    }
  }, [userId]);

  return (
    <div className="bg-gray-50 max-w-6xl mx-auto p-2">
      {/* Mobile View */}
      <div className="space-y-4">
        {expenses.length > 0 ? (
          expenses.map((expense) => (
            <Link
              key={expense._id}
              className="flex space-y-4"
              to={`expense-detail/${expense._id}`}
            >
              <div className="flex bg-white rounded-lg shadow p-4 w-full hover:cursor-pointer">
                <div className=" border-gray-100 flex ">
                  {expense.receipt ? (
                    isImage(expense.receipt) ? (
                      <img
                        src={expense.receipt}
                        alt="Receipt"
                        className="max-w-48 max-h-48 box-border object-cover rounded-md"
                      />
                    ) : isPDF(expense.receipt) ? (
                      <img
                        src="./pdf.png"
                        alt="Receipt"
                        className="max-w-48 max-h-48 p-5 box-border object-cover rounded-md"
                      />
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                        Unsupported File Type
                      </span>
                    )
                  ) : (
                    <img
                      src="./no-receipt.png"
                      alt="Receipt"
                      className="max-w-48 max-h-48 box-border object-cover rounded-md"
                    />
                  )}
                </div>
                <div className="p-4 w-full">
                  <div className="flex justify-between text-xl items-start mb-2">
                    <div>
                      <p className="font-medium text-gray-900">
                        {expense.title}
                      </p>
                      <p className="text-sm text-gray-500">{expense.vendor}</p>
                    </div>
                    <div className="font-semibold text-gray-900">
                      ${expense.amount.toFixed(2)}
                    </div>
                  </div>

                  <p className="text-sm text-gray-500 mb-3 italic">
                    {expense.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-gray-400" />
                      <span>
                        {new Date(expense.expenseDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Tag size={16} className="text-gray-400" />
                      <span>{expense.category}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wallet size={16} className="text-gray-400" />
                      <span>{expense.account}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CreditCard size={16} className="text-gray-400" />
                      <span>{expense.paymentMethod}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center p-6 bg-gray-100 rounded-md shadow">
            <p className="text-lg font-semibold text-gray-700">
              No expenses recorded yet
            </p>
            <p className="text-gray-500 text-sm text-center max-w-md mt-1">
              Start tracking your expenses to better manage your finances. Click
              below to add your first expense.
            </p>
            <Link
              to="add"
              className="px-4 py-2 mt-4 flex items-center gap-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={18} />
              <span>Add Expense</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpensesPage;
