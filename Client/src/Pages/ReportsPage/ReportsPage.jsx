/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import {
  CalendarDays,
  BarChart3,
  FileText,
  Filter,
  TrendingUp,
  Calendar,
  Tag,
  CreditCard,
  IndianRupee,
} from "lucide-react";

import {
  PieChart,
  Pie,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

import {
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Download,
  ChevronDown,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  LineChart as LineChartIcon,
} from "lucide-react";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getISOWeek, startOfWeek, endOfWeek, format } from "date-fns";
import WeeklyCalendar from "../../Components/WeeklyCalendar";
import MonthlyCalendar from "../../Components/MonthlyCalendar";

const ReportPage = () => {
  const [reportType, setReportType] = useState("monthly");
  const [customRange, setCustomRange] = useState({ from: "", to: "" });
  const [data, setData] = useState([]);
  const [type, setType] = useState("weekly");
  const [Offset, setOffset] = useState(0); // Move weekOffset state here
  const [weeklyData, setweeklyData] = useState([]);
  const [incomeSourceData, setincomeSourceData] = useState([]);
  const [categoryExpenseData, setcategoryExpenseData] = useState([]);
  const [selectedTab, setSelectedTab] = useState("overview");
  const [transactions, setTransactions] = useState([]);
  const totalIncome = weeklyData?.reduce((sum, item) => sum + item.income, 0);
  const totalExpense = weeklyData?.reduce((sum, item) => sum + item.expense, 0);
  const netBalance = totalIncome - totalExpense;
  const savingsRate = (
    ((totalIncome - totalExpense) / totalIncome) *
    100
  ).toFixed(1);

  useEffect(() => {
    const userId = localStorage.getItem("id");
    const getSevenDayReport = async () => {
      try {
        const res = await axios.get(
          `/get-report/${type}/${userId}?offset=${Offset}`
        );
        console.log(res.data);
        setData(res.data);
        if (type === "weekly") {
          setweeklyData(res.data.weekly);
        } else if (type === "monthly") {
          setweeklyData(res.data.monthly);
        } else if (type === "yearly") {
          setweeklyData(res.data.yearly);
        } else if (type === "custom") {
          setweeklyData(res.data.custom);
        } else {
          setweeklyData(res.data.weekly);
        }

        setincomeSourceData(res.data.incomeSources);
        setcategoryExpenseData(res.data.expenseByCategory);
        setTransactions(res.data.transaction);
      } catch (error) {
        toast.error("Error fetching report data");
      }
    };
    getSevenDayReport();
  }, [Offset, type]);

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884d8",
    "#82ca9d",
  ];

  // Optional: Handle the weekOffset state change or log it
  const handleWeekOffsetChange = (newOffset) => {
    setOffset(newOffset);
  };

  const handleMonthOffsetChange = (newOffset) => {
    setOffset(newOffset);
  };

  return (
    <div className="w-full p-2 md:p-4 xl:p-6 min-h-screen bg-gray-50">
      <ToastContainer></ToastContainer>

      {/* UI */}
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white w-full xl:max-w-7xl shadow mx-auto rounded-md">
          <div className="w-full xl:mx-auto xl:max-w-6xl px-3 md:px-4 py-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-4 md:gap-0 justify-between items-start md:items-center">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-900 text-left">
              Financial Report
            </h1>

            {/* Select Type */}
            <div className="w-full md:w-auto">
              <select
                className="w-full md:w-auto border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                {/* <option value="six_month">Last 6 Months</option> */}
                <option value="yearly">Yearly</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>

            <div className="flex flex-col sm:flex-row md:items-center items-start gap-3 w-full md:w-auto">
              <div className="flex items-center rounded-lg w-full sm:w-auto">
                {/* Week Calendar Import */}
                {type === "weekly" ? (
                  <WeeklyCalendar
                    weekOffset={Offset}
                    setWeekOffset={handleWeekOffsetChange}
                  />
                ) : type === "monthly" ? (
                  <MonthlyCalendar
                    monthOffset={Offset}
                    setMonthOffset={handleMonthOffsetChange}
                  />
                ) : (
                  ""
                )}
              </div>
              <button className="flex items-center justify-center gap-2 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg w-full sm:w-auto">
                <Download size={16} />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>

        <main className="mx-auto max-w-7xl px-3 md:px-4 py-4 md:py-6 sm:px-6 lg:px-8">
          {/* Tabs - Scrollable on small screens */}
          <div className="border-b border-gray-200 mb-4 md:mb-6 overflow-x-auto">
            <nav className="flex space-x-6 md:space-x-8 min-w-max" aria-label="Tabs">
              <button
                onClick={() => setSelectedTab("overview")}
                className={`py-3 md:py-4 px-1 border-b-2 font-medium text-xs md:text-sm whitespace-nowrap ${
                  selectedTab === "overview"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setSelectedTab("expenses")}
                className={`py-3 md:py-4 px-1 border-b-2 font-medium text-xs md:text-sm whitespace-nowrap ${
                  selectedTab === "expenses"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Expenses
              </button>
              <button
                onClick={() => setSelectedTab("income")}
                className={`py-3 md:py-4 px-1 border-b-2 font-medium text-xs md:text-sm whitespace-nowrap ${
                  selectedTab === "income"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Income
              </button>
              <button
                onClick={() => setSelectedTab("transactions")}
                className={`py-3 md:py-4 px-1 border-b-2 font-medium text-xs md:text-sm whitespace-nowrap ${
                  selectedTab === "transactions"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Transactions
              </button>
            </nav>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
            <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs md:text-sm font-medium text-gray-500">
                    Total Income
                  </p>
                  <p className="text-xl md:text-2xl font-bold text-gray-900">
                    ${data.totalIncome}
                  </p>
                </div>
                <div className="p-2 bg-green-50 rounded-full">
                  <ArrowUpRight className="text-green-600" size={18} />
                </div>
              </div>
              <div className="mt-2 flex items-center text-xs md:text-sm">
                <TrendingUp className="text-green-500 mr-1" size={14} />
                <span className="text-green-500 font-medium">+12.5%</span>
                <span className="text-gray-500 ml-1">vs last week</span>
              </div>
            </div>

            <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs md:text-sm font-medium text-gray-500">
                    Total Expenses
                  </p>
                  <p className="text-xl md:text-2xl font-bold text-gray-900">
                    ${data.totalExpense}
                  </p>
                </div>
                <div className="p-2 bg-red-50 rounded-full">
                  <ArrowDownRight className="text-red-600" size={18} />
                </div>
              </div>
              <div className="mt-2 flex items-center text-xs md:text-sm">
                <TrendingUp className="text-red-500 mr-1" size={14} />
                <span className="text-red-500 font-medium">+8.2%</span>
                <span className="text-gray-500 ml-1">vs last week</span>
              </div>
            </div>

            <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs md:text-sm font-medium text-gray-500">
                    Net Balance
                  </p>
                  <p className="text-xl md:text-2xl font-bold text-gray-900">
                    ${data.balance}
                  </p>
                </div>
                <div className="p-2 bg-blue-50 rounded-full">
                  <DollarSign className="text-blue-600" size={18} />
                </div>
              </div>
              <div className="mt-2 flex items-center text-xs md:text-sm">
                <TrendingUp className="text-blue-500 mr-1" size={14} />
                <span className="text-blue-500 font-medium">+18.3%</span>
                <span className="text-gray-500 ml-1">vs last week</span>
              </div>
            </div>

            <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs md:text-sm font-medium text-gray-500">
                    Savings Rate
                  </p>
                  <p className="text-xl md:text-2xl font-bold text-gray-900">
                    {data.savingRate === "NaN" ? "0" : data.savingRate}%
                  </p>
                </div>
                <div className="p-2 bg-purple-50 rounded-full">
                  <TrendingUp className="text-purple-600" size={18} />
                </div>
              </div>
              <div className="mt-2 flex items-center text-xs md:text-sm">
                <TrendingUp className="text-purple-500 mr-1" size={14} />
                <span className="text-purple-500 font-medium">+5.7%</span>
                <span className="text-gray-500 ml-1">vs last week</span>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
            {/* Income vs Expenses Line Chart */}
            <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm">
              <div className="flex justify-between items-center mb-3 md:mb-4">
                <h2 className="text-base md:text-lg font-medium text-gray-900">
                  Income vs Expenses
                </h2>
                <div className="flex items-center gap-2">
                  <LineChartIcon size={14} className="text-gray-500" />
                  <span className="text-xs md:text-sm text-gray-500">
                    Daily Comparison
                  </span>
                </div>
              </div>
              <div className="h-64 md:h-72 lg:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={weeklyData}
                    margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey={
                        type === "weekly"
                          ? "day"
                          : type === "monthly"
                          ? "date"
                          : type === "yearly"
                          ? "month"
                          : "weekly"
                      }
                      tickFormatter={(value) =>
                        type === "monthly"
                          ? value.toString().padStart(2, "0")
                          : value
                      }
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Line
                      type="monotone"
                      dataKey="income"
                      stroke="#3b82f6"
                      activeDot={{ r: 8 }}
                      strokeWidth={2}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="expense" 
                      stroke="#ef4444" 
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Expense by Category Pie Chart */}
            <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm">
              <div className="flex justify-between items-center mb-3 md:mb-4">
                <h2 className="text-base md:text-lg font-medium text-gray-900">
                  Expense by Category
                </h2>
                <div className="flex items-center gap-2">
                  <PieChartIcon size={14} className="text-gray-500" />
                  <span className="text-xs md:text-sm text-gray-500">Distribution</span>
                </div>
              </div>
              <div className="h-64 md:h-72 lg:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryExpenseData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      innerRadius={30}
                      outerRadius="70%"
                      fill="#8884d8"
                      dataKey="value"
                      label={({ _id, percent }) =>
                        `${_id} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {categoryExpenseData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          name={entry._id}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `$${value}`} />
                    <Legend 
                      layout="horizontal" 
                      verticalAlign="bottom" 
                      align="center"
                      wrapperStyle={{ fontSize: '12px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Income Sources Bar Chart */}
            <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm">
              <div className="flex justify-between items-center mb-3 md:mb-4">
                <h2 className="text-base md:text-lg font-medium text-gray-900">
                  Income Sources
                </h2>
                <div className="flex items-center gap-2">
                  <BarChartIcon size={14} className="text-gray-500" />
                  <span className="text-xs md:text-sm text-gray-500">Distribution</span>
                </div>
              </div>
              {incomeSourceData.length > 0 ? (
                <div className="h-64 md:h-72 lg:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={incomeSourceData}
                      margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="_id" 
                        tick={{ fontSize: 12 }}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip formatter={(value) => `$${value}`} />
                      <Bar dataKey="value" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-64 md:h-72 lg:h-80 flex justify-center items-center">
                  <div className="text-lg md:text-2xl text-gray-600">
                    No Income Source
                  </div>
                </div>
              )}
            </div>

            {/* Transaction History */}
            <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm">
              <div className="flex justify-between items-center mb-3 md:mb-4">
                <h2 className="text-base md:text-lg font-medium text-gray-900">
                  Transactions
                </h2>
                <button className="text-xs md:text-sm text-blue-600 hover:text-blue-800">
                  View All
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Title
                      </th>
                      <th
                        scope="col"
                        className="hidden md:table-cell px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Category
                      </th>
                      <th
                        scope="col"
                        className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Date
                      </th>
                      <th
                        scope="col"
                        className="px-3 md:px-6 py-2 md:py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {transactions.slice(0, 5).map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50">
                        <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs md:text-sm font-medium text-gray-900">
                          {transaction.title}
                        </td>
                        <td className="hidden md:table-cell px-3 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500">
                          {transaction.category}
                        </td>
                        <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500">
                          {transaction.expenseDate
                            ? format(
                                new Date(transaction.expenseDate),
                                "MMM dd"
                              )
                            : format(
                                new Date(transaction.incomeDate),
                                "MMM dd"
                              )}
                        </td>
                        <td
                          className={`px-3 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs md:text-sm text-right font-medium ${
                            transaction.incomeDate
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          <div className="flex items-center justify-end">
                            <IndianRupee className="w-3 h-3 md:w-4 md:h-4" />
                            {Math.abs(transaction.amount).toFixed(2)}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Insights & Recommendations */}
          <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm mb-4 md:mb-6">
            <h2 className="text-base md:text-lg font-medium text-gray-900 mb-3 md:mb-4">
              Insights & Recommendations
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              <div className="p-3 md:p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-700 mb-1 md:mb-2 text-sm md:text-base">
                  Spending Insight
                </h3>
                <p className="text-xs md:text-sm text-blue-600">
                  Your food expenses increased by 15% compared to last week.
                  Consider meal planning to reduce costs.
                </p>
              </div>
              <div className="p-3 md:p-4 bg-green-50 rounded-lg">
                <h3 className="font-medium text-green-700 mb-1 md:mb-2 text-sm md:text-base">
                  Savings Opportunity
                </h3>
                <p className="text-xs md:text-sm text-green-600">
                  You&apos;re on track to reach your monthly savings goal. Keep
                  up the good work!
                </p>
              </div>
              <div className="p-3 md:p-4 bg-purple-50 rounded-lg">
                <h3 className="font-medium text-purple-700 mb-1 md:mb-2 text-sm md:text-base">
                  Budget Alert
                </h3>
                <p className="text-xs md:text-sm text-purple-600">
                  Entertainment spending is nearing your monthly budget limit.
                  Consider adjusting your plans.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ReportPage;