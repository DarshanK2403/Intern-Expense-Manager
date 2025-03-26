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
    <div className="bg-gray-50 max-w-6xl mx-auto p-4 md:p-6">
      {/* Expenses List */}
      <div className="space-y-4">
        {expenses.length > 0 ? (
          expenses.map((expense) => (
            <Link
              key={expense._id}
              className="block transition-transform hover:translate-y-[-2px]"
              to={`expense-detail/${expense._id}`}
            >
              <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-sm hover:shadow transition-shadow duration-200 overflow-hidden">
                {/* Receipt Image */}
                <div className="w-full md:w-48 h-48 bg-gray-100 flex items-center justify-center border-b md:border-b-0 md:border-r border-gray-100">
                  {expense.receipt ? (
                    isImage(expense.receipt) ? (
                      <img
                        src={expense.receipt}
                        alt="Receipt"
                        className="w-full h-full object-cover"
                      />
                    ) : isPDF(expense.receipt) ? (
                      <div className="flex flex-col items-center justify-center p-2">
                        <img
                          src="./pdf.png"
                          alt="PDF Receipt"
                          className="w-20 h-20 object-contain"
                        />
                        <span className="text-xs text-gray-500 mt-1">
                          PDF Document
                        </span>
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                        Unsupported File Type
                      </span>
                    )
                  ) : (
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-sm text-gray-600 mt-1">
                        No Receipt
                      </span>
                    </div>
                  )}
                </div>

                {/* Content Area */}
                <div className="p-4 flex-1">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-medium text-lg text-gray-900">
                        {expense.title}
                      </h3>
                      <p className="text-sm text-gray-500">{expense.vendor}</p>
                    </div>
                    <div className="font-semibold text-lg text-gray-900">
                      ${expense.amount.toFixed(2)}
                    </div>
                  </div>

                  {expense.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {expense.description}
                    </p>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm mt-auto">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar
                        size={16}
                        className="text-gray-400 flex-shrink-0"
                      />
                      <span>
                        {new Date(expense.expenseDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Tag size={16} className="text-gray-400 flex-shrink-0" />
                      <span className="truncate">{expense.category}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Wallet
                        size={16}
                        className="text-gray-400 flex-shrink-0"
                      />
                      <span className="truncate">{expense.account}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <CreditCard
                        size={16}
                        className="text-gray-400 flex-shrink-0"
                      />
                      <span className="truncate">{expense.paymentMethod}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-lg shadow-sm">
            <FileText className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              No Expense Yet
            </h3>
            <p className="text-gray-500 text-center max-w-md">
              You haven&#39;t recorded any expense transactions. Start by adding
              an expense.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpensesPage;
