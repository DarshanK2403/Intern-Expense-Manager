/* eslint-disable react/no-unescaped-entities */
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
  PlusCircle,
  TrendingUp,
} from "lucide-react";
import React, { useEffect, useRef, useState, PureComponent } from "react";
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
  ResponsiveContainer,
} from "recharts";
import MetricCard from "../../Components/MetricCard";

const Dashboard = () => {
  const [recentTransaction, setRecentTransaction] = useState([]);
  const userId = localStorage.getItem("id");
  const [totalExpense, setTotalExpense] = useState();
  const [totalIncome, setTotalIncome] = useState();
  const [currentBalance, setcurrentBalance] = useState();
  const [expenseData, setExpenseData] = useState([]);
  const [timeframe, setTimeframe] = useState("monthly");
  const [incomeData, setIncomeData] = useState([]);

  const COLORS = [
    "#5B9BD5", // Medium Light Blue
    "#70AD47", // Medium Light Green
    "#FFD966", // Soft Yellow (Visible)
    "#E57373", // Soft Red
    "#A085C2", // Medium Light Purple
    "#56C0E0", // Light Cyan (More Visible)
    "#F4A261", // Light Orange
  ];

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

  // Get Metric Amount
  useEffect(() => {
    const getTotalAmount = async () => {
      const res = await axios.get(`/get-total/${userId}`);
      setTotalExpense(res.data.totalExpense);
      setTotalIncome(res.data.totalIncome);
      setcurrentBalance(res.data.currentBalance);
    };
    getTotalAmount();
  }, [userId]);

  // Get Expenseby Category & Income
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

    const getIncomebyCategory = async () => {
      try {
        const res = await axios.get(`/incomebycategory/${userId}`);
        // console.log(res.data);
        setIncomeData(res.data);
      } catch (error) {
        toast.error("Interna; Server Error");
      }
    };

    if (userId) {
      getExpensebyCategory();
      getIncomebyCategory();
    }
  }, [userId]);

  return (
    <div className="p-4">
      <ToastContainer></ToastContainer>
      <div className="flex space-x-6">
        {/* Financial Metrics - Horizontal Layout */}
        <div className="flex space-x-6 flex-grow">
          <MetricCard
            icon={<TrendingUp className="h-6 w-6 text-green-600" />}
            title="Total Income"
            value={totalIncome}
            description="From all income sources"
            bgColor="bg-green-100"
            textColor="text-green-600"
          />
          <MetricCard
            icon={<CreditCard className="h-6 w-6 text-red-600" />}
            title="Total Expenses"
            value={totalExpense}
            description="All expenses this month"
            bgColor="bg-red-100"
            textColor="text-red-600"
          />
          <MetricCard
            icon={<DollarSign className="h-6 w-6 text-blue-600" />}
            title="Current Balance"
            value={currentBalance}
            description="Net income - expenses"
            bgColor="bg-blue-100"
            textColor="text-blue-600"
          />
        </div>

        {/* Quick Actions - Vertical Layout */}
        <div className="w-72 flex flex-col space-y-4">
          {/* Add Expense */}
          <Link
            to="/expenses/add"
            className="w-full flex items-center justify-between p-4 bg-white rounded-lg shadow hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center">
              <CreditCard className="h-5 w-5 mr-2 text-red-600" />
              <div>
                <p className={`font-medium text-start  text-red-600`}>
                  Add Expense
                </p>
                <p className="text-xs text-gray-500">Log a new expense</p>
              </div>
            </div>
            <ArrowUpRight className="h-5 w-5 text-gray-400" />
          </Link>

          {/* Add Income */}
          <Link
            to="/income/add"
            className="w-full flex items-center justify-between p-4 bg-white rounded-lg shadow hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center">
              <PlusCircle className="h-5 w-5 mr-2 text-green-600" />
              <div>
                <p className={`font-medium text-start  text-green-600`}>
                  Add Expense
                </p>
                <p className="text-xs text-gray-500">
                  Record a new income source
                </p>
              </div>
            </div>
            <ArrowUpRight className="h-5 w-5 text-gray-400" />
          </Link>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white p-6 border border-gray-300 shadow rounded-lg mt-6">
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
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="py-3  text-end text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction Date
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vendor/Notes
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
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
                        ? "bg-red-50 hover:bg-red-100"
                        : "bg-green-50 hover:bg-green-100"
                    }
                  `}
                  >
                    <td className="py-3 px-4 text-gray-800 font-medium">
                      <div className="flex items-center">
                        <div>
                          <div
                            className={`font-medium ${
                              isExpense ? "text-red-800" : "text-green-800"
                            }`}
                          >
                            {transaction.title}
                          </div>
                          <div className="text-xs text-gray-600">
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
                        {isExpense ? (
                          <div className="flex items-center">
                            -<IndianRupee className="h-4 w-4" />
                            <span>{transaction.amount}</span>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            +<IndianRupee className="h-4 w-4" />
                            <span>{transaction.amount}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-left text-gray-700">
                      {formatDate(date)}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {notesOrVendor ? (
                        <div className="flex items-center text-start">
                          <span className="truncate max-w-xs">
                            {notesOrVendor}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`
                    px-2 py-1 rounded-full text-xs font-medium
                    ${
                      isExpense
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }
                  `}
                      >
                        {transaction.category}
                      </span>
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
            <p className="text-gray-500 text-center max-w-md font-sans min-h-[40px]">
              You haven't recorded any transactions. Start by adding an income
              or expense.
            </p>
          </div>
        )}
      </div>

      {/* Expense by Category */}
      <div className="mt-6 p-6 bg-white shadow-md rounded-lg border border-gray-300">
        <div className="py-2">
          <h2 className="text-lg font-semibold">
            Category-wise Financial Overview
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 rounded-md">
          {/* Expenses by Category */}
          <div className="bg-white shadow-md rounded-lg p-4 border border-gray-300">
            <h3 className="text-md font-semibold mb-2">Spending by Category</h3>
            {expenseData.length > 0 ? (
              <PieChart width={700} height={350} style={{ margin: "auto" }}>
                <Pie
                  dataKey="total"
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label={({ name, percent }) =>
                    `${name} (${(percent * 100).toFixed(1)}%)`
                  }
                  nameKey="_id"
                >
                  {expenseData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            ) : (
              <div>No Expense Data</div>
            )}
          </div>

          {/* Income by Category */}
          <div className="bg-white shadow-md rounded-lg p-4 border border-gray-300">
            <h3 className="text-md font-semibold mb-2">Earnings by Category</h3>
            {incomeData.length > 0 ? (
              <PieChart width={700} height={350} style={{ margin: "auto" }}>
                <Pie
                  dataKey="total"
                  data={incomeData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#82ca9d"
                  label={({ name, percent }) =>
                    `${name} (${(percent * 100).toFixed(1)}%)`
                  }
                  nameKey="_id"
                >
                  {incomeData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            ) : (
              <div>No Income Data</div>
            )}
          </div>
        </div>
      </div>

      {/* Financial Overview */}
      <div></div>
    </div>
  );
};

export default Dashboard;
