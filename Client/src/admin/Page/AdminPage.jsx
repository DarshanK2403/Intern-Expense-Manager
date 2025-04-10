/* eslint-disable no-unused-vars */
import MetricCard from "../../Components/MetricCard";
import React, { useState } from "react";
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
} from "lucide-react";

const AdminPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [TotalUser, setTotaluser] = useState(0);
  const [TotalExpense, setTotalExpense] = useState(0);
  const [AvgExpense, setAvgExpense] = useState(0);

  // Sample data for charts and metrics
  const userData = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      totalExpenses: 2450,
      lastActive: "2 hours ago",
    },
    {
      id: 2,
      name: "Sarah Smith",
      email: "sarah@example.com",
      totalExpenses: 1890,
      lastActive: "1 day ago",
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike@example.com",
      totalExpenses: 3200,
      lastActive: "5 hours ago",
    },
    {
      id: 4,
      name: "Emily Davis",
      email: "emily@example.com",
      totalExpenses: 1540,
      lastActive: "Just now",
    },
    {
      id: 5,
      name: "Robert Wilson",
      email: "robert@example.com",
      totalExpenses: 2780,
      lastActive: "3 days ago",
    },
  ];

  const monthlyExpenseData = [
    { name: "Jan", value: 4000 },
    { name: "Feb", value: 3000 },
    { name: "Mar", value: 2000 },
    { name: "Apr", value: 2780 },
    { name: "May", value: 1890 },
    { name: "Jun", value: 2390 },
    { name: "Jul", value: 3490 },
    { name: "Aug", value: 4000 },
    { name: "Sep", value: 3200 },
    { name: "Oct", value: 2500 },
    { name: "Nov", value: 3700 },
    { name: "Dec", value: 4500 },
  ];

  const categoryData = [
    { name: "Food", value: 400 },
    { name: "Transport", value: 300 },
    { name: "Entertainment", value: 300 },
    { name: "Shopping", value: 200 },
    { name: "Utilities", value: 150 },
  ];

  const userGrowthData = [
    { name: "Jan", activeUsers: 40, newUsers: 24 },
    { name: "Feb", activeUsers: 45, newUsers: 13 },
    { name: "Mar", activeUsers: 58, newUsers: 22 },
    { name: "Apr", activeUsers: 75, newUsers: 28 },
    { name: "May", activeUsers: 90, newUsers: 15 },
    { name: "Jun", activeUsers: 102, newUsers: 17 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
            <div className="bg-white rounded-xl shadow-sm p-6 flex items-center border border-gray-100">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                <Users size={24} />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Total Users
                </h3>
                <p className="text-2xl font-bold text-gray-800">143</p>
                <p className="text-xs text-green-600 mt-1">
                  ↑ 12% from last month
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 flex items-center border border-gray-100">
              <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                <DollarSign size={24} />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Total Expenses
                </h3>
                <p className="text-2xl font-bold text-gray-800">$48,759</p>
                <p className="text-xs text-green-600 mt-1">
                  ↑ 8% from last month
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 flex items-center border border-gray-100">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                <User size={24} />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Active Users
                </h3>
                <p className="text-2xl font-bold text-gray-800">102</p>
                <p className="text-xs text-green-600 mt-1">
                  ↑ 5% from last month
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 flex items-center border border-gray-100">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
                <TrendingUp size={24} />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Avg. Expense
                </h3>
                <p className="text-2xl font-bold text-gray-800">$341</p>
                <p className="text-xs text-red-600 mt-1">
                  ↓ 3% from last month
                </p>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Monthly Expenses
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyExpenseData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#4F46E5" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                User Growth
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={userGrowthData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="activeUsers"
                      stroke="#4F46E5"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="newUsers"
                      stroke="#10B981"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Top Users
                </h3>
                <button className="text-sm text-blue-600 hover:text-blue-800">
                  View All
                </button>
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
                        Last Active
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {userData.map((user) => (
                      <tr key={user.id}>
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
                          <div className="text-sm text-gray-900">
                            ${user.totalExpenses}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-500">
                            {user.lastActive}
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
