/* eslint-disable no-unused-vars */
import axios from "axios";
import {
  ArrowDownLeft,
  ArrowUpRight,
  ChevronRight,
  CreditCard,
  DollarSign,
  Eye,
  FileText,
  IndianRupee,
  MoreHorizontal,
  MoreVertical,
  MoreVerticalIcon,
  TrendingUp,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { toast, ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const Dashboard = () => {
  const [recentTransaction, setRecentTransaction] = useState([]);
  const userId = localStorage.getItem("id");
  const [totalExpense, setTotalExpense] = useState();
  const [totalIncome, setTotalIncome] = useState();
  const [currentBalance, setcurrentBalance] = useState();
  const [expenseData, setExpenseData] = useState([]);
  const [timeframe, setTimeframe] = useState("monthly");

  const getRecentTransactions = async (userId, limit = 5) => {
    try {
      const res = await axios.get(
        `/recent-transactions/${userId}/?limit=${limit}`
      );
      // console.log(res.data);
      setRecentTransaction(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (userId) {
      getRecentTransactions(userId);
    }
  }, [userId]);

  const TransactionType = (transaction) => {
    return transaction.expenseDate ? "Expense" : "Income";
  };

  const formatDate = (date) => {
    return format(new Date(date), "MMM dd, yyyy");
  };

  useEffect(() => {
    const getTotalAmount = async () => {
      const res = await axios.get(`/get-total/${userId}`);
      setTotalExpense(res.data.totalExpense);
      setTotalIncome(res.data.totalIncome);
      setcurrentBalance(res.data.currentBalance);
    };
    getTotalAmount();
  }, [userId]);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  useEffect(() => {
    const getExpensebyCategory = async () => {
      try {
        const res = await axios.get(`/expensebycategory/${userId}`);
        // console.log(res.data);
        setExpenseData(res.data);
      } catch (error) {
        toast.error("Interna; Server Error");
      }
    };

    if (userId) {
      getExpensebyCategory();
    }
  }, [userId]);

  return (
    <div className="p-4">
      <ToastContainer></ToastContainer>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Income */}
        <div>
          <div className="bg-white rounded-lg shadow p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="bg-green-100 p-2 rounded-full mr-3">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-700">
                  Total Income
                </h3>
              </div>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-green-600">
              {totalIncome}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              From all income sources
            </p>
          </div>
        </div>

        {/* Total Expenses */}
        <div>
          <div className="bg-white rounded-lg shadow p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="bg-red-100 p-2 rounded-full mr-3">
                  <CreditCard className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-700">
                  Total Expenses
                </h3>
              </div>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-red-600">
              {totalExpense}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              All expenses this month
            </p>
          </div>
        </div>

        {/* Current Balacnce */}
        <div>
          <div className="bg-white rounded-lg shadow p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-700">
                  Current Balance
                </h3>
              </div>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-blue-600">
              {currentBalance}
            </p>
            <p className="text-sm text-gray-500 mt-2">Net income - expenses</p>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white p-6 shadow rounded-lg mt-6">
        <div className="flex justify-between">
          <h3 className="text-gray-700 mb-4 text-xl font-semibold">
            Recent Transactions
          </h3>
          <Link
            to="recent-transactions"
            className="flex text-blue-600 font-bold"
          >
            View All <ChevronRight />
          </Link>
        </div>
        {recentTransaction.length > 0 ? (
          <table className="w-full rounded-sm overflow-hidden">
            <thead>
              <tr className="bg-blue-700 text-white">
                <th className="p-2 text-start">Title</th>
                <th className="p-2 text-end">Amount</th>
                <th className="p-2 text-end">Transaction Date</th>
                <th className="p-2 text-end">Vendor/Notes</th>
              </tr>
            </thead>
            <tbody>
              {recentTransaction.map((transaction) => {
                const isExpense = TransactionType(transaction) === "Expense";
                const date = isExpense
                  ? transaction.expenseDate
                  : transaction.incomeDate;
                const notesOrVendor = isExpense
                  ? transaction.vendor
                  : transaction.notes;

                return (
                  <tr
                    key={transaction._id}
                    className={`
                   transition-colors duration-150 hover:cursor-pointer
                    ${
                      isExpense
                        ? "bg-red-100 hover:bg-red-200"
                        : "bg-green-100 hover:bg-green-200"
                    }
                  `}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div>
                          <div
                            className={`font-medium ${
                              isExpense ? "text-red-800" : "text-green-800"
                            }`}
                          >
                            {transaction.title}
                          </div>
                          <div className="text-xs text-gray-500">
                            {/* {getRelativeTime(date)} */}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td
                      className={`pe-2 py-3 text-right font-semibold ${
                        isExpense ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      <div className="flex items-center justify-end">
                        <IndianRupee className="h-4 w-4" />
                        {transaction.amount}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-700">
                      {formatDate(date)}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-700">
                      {notesOrVendor ? (
                        <div className="flex items-center justify-end">
                          <span className="truncate max-w-xs">
                            {notesOrVendor}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-lg shadow-sm">
            <FileText className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              No Transactions Yet
            </h3>
            <p className="text-gray-500 text-center max-w-md">
              You haven&#39;t recorded any transactions. Start by adding an
              income or expense.
            </p>
          </div>
        )}
      </div>

      {/* Expense by Category */}
      <div className="mt-6 p-6 bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Expenses by Category</h2>
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <span className="font-semibold">
              Total Expenses: ${totalExpense}
            </span>
          </div>
          <BarChart width={500} height={300} data={expenseData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="_id" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="total" fill="#8884d8">
              {expenseData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
