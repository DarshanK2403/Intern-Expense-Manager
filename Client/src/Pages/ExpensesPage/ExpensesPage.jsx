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
  Image,
  ImagePlus,
  ImageDown,
  IndianRupee,
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
    <div className="bg-gray-50 max-w-7xl mx-auto px-4 md:px-6">
      {/* Expenses List */}
      {expenses.length > 0 ? (
        <div className="max-w-6xl mx-auto bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full bg-white border rounded-lg shadow-sm overflow-hidden">
            <thead>
              <tr className="border-b bg-blue-600 text-white">
                <th className="p-4 text-left font-medium">Receipt</th>
                <th className="p-4 text-left font-medium">Details</th>
                <th className="p-4 text-left font-medium">Amount</th>
                <th className="p-4 text-left font-medium">Category</th>
                <th className="p-4 text-left font-medium">Date</th>
                <th className="p-4 text-left font-medium">Payment</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr
                  key={expense._id}
                  className="hover:bg-gray-50 border-b border-gray-300  "
                >
                  <td className="p-4">
                    {expense.receipt ? (
                      <a
                        href={expense.receipt}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-start"
                      >
                        {isImage(expense.receipt) ? (
                          <Image />
                        ) : isPDF(expense.receipt) ? (
                          <img
                            src="./pdf.png"
                            alt="PDF Receipt"
                            className="w-8 h-8"
                          />
                        ) : (
                          <FileText className="w-8 h-8 text-gray-400" />
                        )}
                      </a>
                    ) : (
                      <span className="text-sm text-gray-500">No Receipt</span>
                    )}
                  </td>
                  <td className="p-4">
                    <Link to={`expense-detail/${expense._id}`}>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {expense.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {expense.vendor}
                        </p>
                        {expense.description && (
                          <p className="text-xs text-gray-600 italic mt-1 line-clamp-1">
                            {expense.description}
                          </p>
                        )}
                      </div>
                    </Link>
                  </td>
                  <td className="p-4 font-semibold text-gray-900">
                    <div className="flex items-center">
                      <IndianRupee className="w-4 h-4" />
                      {expense.amount.toFixed(2)}
                    </div>
                  </td>
                  <td className="p-4 text-gray-600">
                    <div className="flex items-center gap-2">
                      <Tag size={16} className="text-gray-400 flex-shrink-0" />
                      <span className="truncate">{expense.category}</span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar
                        size={16}
                        className="text-gray-400 flex-shrink-0"
                      />
                      <span>
                        {new Date(expense.expenseDate).toLocaleDateString()}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-600">
                    <div className="flex items-center gap-2">
                      <CreditCard
                        size={16}
                        className="text-gray-400 flex-shrink-0"
                      />
                      <span className="truncate">{expense.paymentMethod}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-lg shadow-sm">
          <FileText className="h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            No Expense Yet
          </h3>
          <p className="text-gray-500 text-center max-w-md font-sans min-h-[40px]">
            You haven&#39;t recorded any expense transactions. Start by adding
            an expense.
          </p>
        </div>
      )}
    </div>
  );
};

export default ExpensesPage;
