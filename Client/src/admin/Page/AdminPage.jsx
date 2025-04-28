/* eslint-disable no-unused-vars */
import MetricCard from "../../Components/MetricCard";
import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import {
  Users,
  CreditCard,
  DollarSign,
  TrendingUp,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  BarChart2,
  User,
  IndianRupee,
  TrendingDown,
} from "lucide-react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const AdminPage = () => {
  const token = localStorage.getItem("Token");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [TotalUser, setTotaluser] = useState(0);
  const [stats, setStats] = useState([]);
  const [monthlyData, setmonthlyData] = useState([]);
  const [topUser, setTopUser] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const getUserData = async () => {
    try {
      if (token) {
        const res = await axios.get("admin/user-details", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTotaluser(res.data.length);
      } else {
        toast.error("Not found User");
      }
    } catch (error) {
      toast.error("Somthing goes wrong");
    }
  };

  const getTotalExpenseorIncome = async () => {
    try {
      const res = await axios.get("/admin/get-total-expense-or-income", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setmonthlyData(res.data.monthlyData);
      setStats(res.data.stats);
    } catch {
      toast.error("Internal Server Error");
    }
  };

  const TopUser = async () => {
    try {
      const res = await axios.get("/admin/top-user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTopUser(res.data);
    } catch (error) {
      toast.error("Somthing went wrong");
    }
  };

  const ExpenseByCategory = async () => {
    try {
      const res = await axios("/admin/expense-by-category", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = res.data;

      const transformedData = data.map(item => ({
        name: item.categoryName,   // PieChart expects 'name'
        value: item.totalAmount    // PieChart expects 'value'
      }));

      setCategoryData(transformedData);
    } catch (error) {
      console.log(error);
      toast.error("Not Found");
    }
  };

  useEffect(() => {
    getUserData();
    getTotalExpenseorIncome();
    TopUser();
    ExpenseByCategory();
  }, []);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer></ToastContainer>
      <div className="flex">
        {/* Main Content */}
        <main
          className={`flex-1 p-6 ${
            isSidebarOpen ? "" : "ml-0"
          } transition-all duration-300`}
        >
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              User Analysis Dashboard
            </h2>
            <p className="text-gray-600">
              Overview of user activity and expense patterns
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {/* Total User */}
            <div className="bg-white rounded-xl shadow-sm p-6 flex items-center border border-gray-100">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                <Users size={24} />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Total Users
                </h3>
                <p className="text-2xl font-bold text-gray-800">{TotalUser}</p>
                <p className="text-xs text-green-600 mt-1">
                  ↑ 12% from last month
                </p>
              </div>
            </div>

            {/* Total Expense */}
            <div className="bg-white rounded-xl shadow-sm p-6 flex items-center border border-gray-100">
              <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
                <TrendingUp size={24} />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Total Expenses
                </h3>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.currentExpense}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  {stats.expenseTrend} from last month
                </p>
              </div>
            </div>

            {/* Total Income */}
            <div className="bg-white rounded-xl shadow-sm p-6 flex items-center border border-gray-100">
              <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                <TrendingDown size={24} />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Total Income
                </h3>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.currentIncome}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  {stats.incomeTrend} from last month
                </p>
              </div>
            </div>

            {/* Avg Expense */}
            <div className="bg-white rounded-xl shadow-sm p-6 flex items-center border border-gray-100">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
                <DollarSign size={24} />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Avg. Expense
                </h3>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.averageExpense}
                </p>
                <p className="text-xs text-red-600 mt-1">
                  {stats.avgExpenseTrend} from last month
                </p>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Monthly Expense */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Monthly Expenses
              </h3>
              <div className="w-full h-96">
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="totalExpense"
                      fill="#f87171"
                      name="Total Expense"
                    />
                    {/* Use "totalIncome" with another bar if you want both */}
                    <Bar
                      dataKey="totalIncome"
                      fill="#60a5fa"
                      name="Total Income"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Expense Category */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Expense Categories
              </h3>
              <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {categoryData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Top User */}
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Top Users
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        User
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Total Expenses
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Toal Income
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {topUser.map((user) => (
                      <tr key={user.userId}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-medium">
                              {user.name.charAt(0)}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600 flex items-center">
                            <IndianRupee size={16} />
                            {user.totalExpense}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-600 flex items-center">
                            <IndianRupee size={16} />

                            {user.totalIncome}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminPage;
