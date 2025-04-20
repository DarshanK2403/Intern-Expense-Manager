/* eslint-disable no-unused-vars */
import { useEffect, useMemo, useRef, useState } from "react";
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
  Save,
  Trash2,
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
  ReferenceLine,
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
import WeeklyCalendar from "../../Components/Calendar/WeeklyCalendar";
import MonthlyCalendar from "../../Components/Calendar/MonthlyCalendar";
import YearlyCalendar from "../../Components/Calendar/YearlyCalendar";
import DateCalender from "../../Components/Calendar/DateCalender";
import SpinnerLoader from "../../Components/Loader/SpinnerLoader";
import { Link, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const ReportDetail = () => {
  const { id } = useParams();
  console.log(id);
  const [loading, setLoading] = useState(false);
  const [customRange, setCustomRange] = useState({ from: "", to: "" });
  const [data, setData] = useState([]);
  const [Offset, setOffset] = useState(0);
  const [formatedData, setFormatedData] = useState([]);
  const [incomeSourceData, setincomeSourceData] = useState([]);
  const [categoryExpenseData, setcategoryExpenseData] = useState([]);
  const [allTransactions, setAllTransactions] = useState([]);
  const incomeSum = formatedData?.reduce(
    (sum, item) => sum + (item.income || 0),
    0
  );

  const expenseSum = formatedData?.reduce(
    (sum, item) => sum + (item.expense || 0),
    0
  );
  const [activeFilters, setActiveFilters] = useState(false);
  const [period, setPeriod] = useState("");
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [ExpenseCategory, setExpenseCategory] = useState([]);
  const [IncomeCategory, setIncomeCategory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [visibleTransactions, setVisibleTransactions] =
    useState(allTransactions);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [filters, setFilters] = useState({
    type: "all",
    expenseCategory: "all",
    incomeCategory: "all",
    minAmount: "",
    maxAmount: "",
  });
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [ReportType, setReportType] = useState("Week")
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884d8",
    "#82ca9d",
  ];

  const toggleFilterPanel = () => {
    setActiveFilters(!activeFilters);
  };

  const token = localStorage.getItem("Token");
  const generateReport = async () => {
    try {
      setLoading(true);

      let requestData = {};

      if (period === "custom") {
        requestData = {
          start: startDate.toISOString().split("T")[0],
          end: endDate.toISOString().split("T")[0],
        };
      }

      const res = await axios.get(`/report-by-id/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: requestData,
      });
      console.log("Res", res.data);
      setReportType(res.data.type)
      setData(res.data);
      setFormatedData(res.data.formatted);
      setincomeSourceData(res.data.incomeSources);
      setcategoryExpenseData(res.data.expenseByCategory);
      setAllTransactions(res.data.transaction);
      setExpenseCategory(res.data.expenseByCategory.map((cat) => cat._id));
      setIncomeCategory(res.data.incomeSources.map((cat) => cat._id));
    } catch (error) {
      toast.error("Error fetching report data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (period !== "custom") {
      generateReport();
    }
  }, [Offset, period]);


  const handlePeriodSelect = (selected) => {
    setPeriod(selected);
    setIsDropdownOpen(false);
  };

  const [tempFilters, setTempFilters] = useState(filters);

  const applyFilters = (updatedFilters) => {
    setFilters(updatedFilters);

    setActiveFilters(
      updatedFilters.type !== "all" ||
        updatedFilters.expenseCategory !== "all" ||
        updatedFilters.incomeCategory !== "all" ||
        updatedFilters.minAmount ||
        updatedFilters.maxAmount ||
        searchTerm !== ""
    );

    const filtered = allTransactions.filter((item) => {
      const type = item.expenseDate
        ? "expense"
        : item.incomeDate
        ? "income"
        : "";

      // Ensure only the selected type is shown
      if (updatedFilters.type !== "all" && type !== updatedFilters.type) {
        return false;
      }

      const isExpenseCategoryMatch =
        updatedFilters.type !== "expense" ||
        updatedFilters.expenseCategory === "all" ||
        item.category === updatedFilters.expenseCategory;

      const isIncomeCategoryMatch =
        updatedFilters.type !== "income" ||
        updatedFilters.incomeCategory === "all" ||
        item.category === updatedFilters.incomeCategory;

      const isMinMatch =
        !updatedFilters.minAmount ||
        Math.abs(item.amount) >= Number(updatedFilters.minAmount);

      const isMaxMatch =
        !updatedFilters.maxAmount ||
        Math.abs(item.amount) <= Number(updatedFilters.maxAmount);

      const isSearchMatch =
        searchTerm === "" ||
        item.title.toLowerCase().includes(searchTerm.toLowerCase());

      return (
        isExpenseCategoryMatch &&
        isIncomeCategoryMatch &&
        isMinMatch &&
        isMaxMatch &&
        isSearchMatch
      );
    });

    setVisibleTransactions(filtered);
    setFilteredTransactions(filtered); // Optional if used elsewhere
    // console.log(filtered);

    // ⬇️ Update category chart data
    const filteredIncome = filtered.filter((item) => item.incomeDate);
    const filteredExpense = filtered.filter((item) => item.expenseDate);

    const incomeSources = filteredIncome.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {});
    setincomeSourceData(
      Object.entries(incomeSources).map(([cat, value]) => ({
        _id: cat,
        value,
      }))
    );

    const expenseByCategory = filteredExpense.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {});
    setcategoryExpenseData(
      Object.entries(expenseByCategory).map(([cat, value]) => ({
        _id: cat,
        value,
      }))
    );

    // ⬇️ Update totals
    const totalIncome = filteredIncome
      .reduce((sum, i) => sum + i.amount, 0)
      .toFixed(2);
    const totalExpense = filteredExpense
      .reduce((sum, e) => sum + e.amount, 0)
      .toFixed(2);
    const balance = totalIncome - totalExpense;
    const savingRate = totalIncome
      ? ((balance / totalIncome) * 100).toFixed(2)
      : 0;

    setData((prev) => ({
      ...prev,
      totalIncome,
      totalExpense,
      balance,
      savingRate,
    }));
  };

  const filteredChartData = useMemo(() => {
    return formatedData.map((entry) => ({
      ...entry,
      income: filters.type === "expense" ? 0 : entry.income,
      expense: filters.type === "income" ? 0 : entry.expense,
    }));
  }, [formatedData, filters.type]);

  const saveReport = async () => {
    try {
      const res = await axios.post("/save-report", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Report Saved");
    } catch (error) {
      toast("Report Save Failed");
    }
  };
  return (
    <div className="w-full p-2 md:p-4 xl:p-6 min-h-screen bg-gray-50">
      <ToastContainer></ToastContainer>

      {/* UI */}
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="w-full max-w-7xl mx-auto bg-white shadow-sm p-4">
          <div className="flex flex-nowrap items-center justify-between">
            <div className="font-bold text-xl text-gray-800 whitespace-nowrap mr-4">
              Report Detail
            </div>

            {/* Period */}
            <div className="flex flex-col sm:flex-row md:items-center items-start gap-3 w-full md:w-auto">
              <span className="capitalize font-bold">{ReportType}</span>

              {/* Calaender */}
              <div className="flex items-center border border-gray-400 rounded-md bg-white whitespace-nowrap ">
                
              </div>

              {/* Filter Button */}
              <button
                onClick={toggleFilterPanel}
                className={`flex items-center gap-2 px-3 py-2 border rounded-md hover:bg-blue-100 whitespace-nowrap ${
                  activeFilters
                    ? "bg-blue-100 text-blue-600"
                    : "bg-white text-gray-800"
                }`}
              >
                <Filter size={16} />
                <span>Filter</span>
              </button>

              {/* Export Button */}
              <button className="flex items-center justify-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium px-4 py-2 rounded-md w-full sm:w-auto shadow-sm">
                <Download size={16} />
                <span>Export</span>
              </button>

              <button
                className="flex items-center justify-center gap-2 bg-red-100 hover:bg-red-200 text-red-700 font-medium px-4 py-2 rounded-md w-full sm:w-auto shadow-sm"
                onClick={saveReport}
              >
                <Trash2 size={16} />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>

        <main className="mx-auto max-w-7xl px-3 md:px-4 py-4 md:py-6 sm:px-6 lg:px-8">
          {/* Tabs - Scrollable on small screens */}
          {activeFilters && (
            <div className="bg-white border shadow-md border-gray-300 mb-5 p-3 rounded-lg mt-2 flex flex-wrap gap-4 transition-all duration-300 ease-in-out">
              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  value={tempFilters.type}
                  onChange={(e) =>
                    setTempFilters((prev) => ({
                      ...prev,
                      type: e.target.value,
                    }))
                  }
                  className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                >
                  <option value="all">All</option>
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>

              {/* Expense Category */}
              {tempFilters.type === "expense" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expense Category
                  </label>
                  <select
                    value={tempFilters.expenseCategory}
                    onChange={(e) =>
                      setTempFilters((prev) => ({
                        ...prev,
                        expenseCategory: e.target.value,
                      }))
                    }
                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                  >
                    <option value="all">All</option>
                    {ExpenseCategory.map((cat) => (
                      <option value={cat} key={`expense-${cat}`}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Income Category */}
              {tempFilters.type === "income" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Income Category
                  </label>
                  <select
                    value={tempFilters.incomeCategory}
                    onChange={(e) =>
                      setTempFilters((prev) => ({
                        ...prev,
                        incomeCategory: e.target.value,
                      }))
                    }
                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                  >
                    <option value="all">All</option>
                    {IncomeCategory.map((cat) => (
                      <option value={cat} key={`income-${cat}`}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Min Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Min Amount
                </label>
                <input
                  type="number"
                  value={tempFilters.minAmount || ""}
                  onChange={(e) =>
                    setTempFilters((prev) => ({
                      ...prev,
                      minAmount: e.target.value,
                    }))
                  }
                  placeholder="0"
                  className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                />
              </div>

              {/* Max Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Amount
                </label>
                <input
                  type="number"
                  value={tempFilters.maxAmount || ""}
                  onChange={(e) =>
                    setTempFilters((prev) => ({
                      ...prev,
                      maxAmount: e.target.value,
                    }))
                  }
                  placeholder="10000"
                  className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                />
              </div>

              {/* Apply Button */}
              <div className="flex items-end">
                <button
                  onClick={() => applyFilters(tempFilters)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg mt-6"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}

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
                {/* <span className="text-green-500 font-medium">+12.5%</span> */}
                <span className="text-green-500 ml-1">
                  {data?.comparisons?.income ?? 0}
                </span>
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
                <span className="text-red-500 ml-1">
                  {data?.comparisons?.expense ?? 0}
                </span>
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
                <span className="text-blue-500 ml-1">
                  {data?.comparisons?.income ?? 0}
                </span>
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
                <span className="text-purple-500 ml-1">
                  {data?.comparisons?.savingRate ?? 0}
                </span>
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
                {loading ? (
                  <div className="flex justify-center items-center h-40">
                    <SpinnerLoader size="large" color="blue" />
                  </div>
                ) : (
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={filteredChartData}
                        margin={{ top: 10, right: 20, bottom: 10, left: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey={
                            period === "week"
                              ? "day"
                              : period === "month"
                              ? "date"
                              : period === "year"
                              ? "month"
                              : "week"
                          }
                          tickFormatter={(value) =>
                            period === "month"
                              ? value.toString().padStart(2, "0")
                              : value
                          }
                          tick={{ fontSize: 12 }}
                        />
                        <YAxis
                          tick={{ fontSize: 12 }}
                          domain={["auto", "auto"]} // Dynamically adjusts min/max
                          allowDataOverflow={false} // Prevents drawing outside area
                        />
                        <Tooltip />
                        <Legend wrapperStyle={{ fontSize: "12px" }} />
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
                )}
              </div>
            </div>

            {/* Expense by Category Pie Chart */}
            {filters.type !== "income" && (
              <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm">
                <div className="flex justify-between items-center mb-3 md:mb-4">
                  <h2 className="text-base md:text-lg font-medium text-gray-900">
                    Expense by Category
                  </h2>
                  <div className="flex items-center gap-2">
                    <PieChartIcon size={14} className="text-gray-500" />
                    <span className="text-xs md:text-sm text-gray-500">
                      Distribution
                    </span>
                  </div>
                </div>

                <div className="h-64 md:h-72 lg:h-80">
                  {loading ? (
                    <div className="flex justify-center items-center h-40">
                      <SpinnerLoader size="large" color="blue" />
                    </div>
                  ) : categoryExpenseData.length > 0 ? (
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
                          wrapperStyle={{ fontSize: "12px" }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-64 md:h-72 lg:h-80 flex justify-center items-center">
                      <div className="text-lg md:text-2xl text-gray-600">
                        No Data Found
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Income Sources Bar Chart */}
            {filters.type !== "expense" && (
              <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm">
                <div className="flex justify-between items-center mb-3 md:mb-4">
                  <h2 className="text-base md:text-lg font-medium text-gray-900">
                    Income Sources
                  </h2>
                  <div className="flex items-center gap-2">
                    <BarChartIcon size={14} className="text-gray-500" />
                    <span className="text-xs md:text-sm text-gray-500">
                      Distribution
                    </span>
                  </div>
                </div>

                {/* Income Source Chart */}
                {loading ? (
                  <div className="flex justify-center items-center h-40">
                    <SpinnerLoader size="large" color="blue" />
                  </div>
                ) : incomeSourceData.length > 0 ? (
                  <div className="h-64 md:h-72 lg:h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={incomeSourceData}
                        margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                        barCategoryGap={
                          incomeSourceData.length === 1 ? "70%" : "10%"
                        }
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="_id"
                          tick={{ fontSize: 14 }}
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
                      No Data Found
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Transaction History */}
            <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm">
              <div className="flex justify-between items-center mb-3 md:mb-4">
                <h2 className="text-base md:text-lg font-medium text-gray-900">
                  Transactions
                </h2>
              </div>

              <div className="overflow-x-auto">
                <div className="h-full max-h-72 overflow-y-auto rounded-md">
                  {loading ? (
                    <div className="flex justify-center items-center h-40">
                      <SpinnerLoader size="large" color="blue" />
                    </div>
                  ) : allTransactions.length > 0 ? (
                    <table className="min-w-full divide-y divide-gray-200">
                      {/* Sticky Header */}
                      <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
                        <tr>
                          <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Title
                          </th>
                          <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-3 md:px-6 py-2 md:py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                        </tr>
                      </thead>

                      {/* Rows */}
                      <tbody className="bg-white divide-y divide-gray-200">
                        {allTransactions
                          .filter((transaction) => {
                            if (filters.type === "income")
                              return !!transaction.incomeDate;
                            if (filters.type === "expense")
                              return !!transaction.expenseDate;
                            return true; // show all for "all"
                          })
                          .map((transaction) => (
                            <tr
                              key={
                                transaction.title +
                                transaction.amount +
                                (transaction.expenseDate ||
                                  transaction.incomeDate)
                              }
                              className="hover:bg-gray-50"
                            >
                              <td className="px-3 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs md:text-sm font-medium text-gray-900">
                                {transaction.title}
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
                  ) : (
                    <div className="h-64 md:h-72 lg:h-[72] flex justify-center items-center">
                      <div className="text-lg md:text-2xl text-gray-600">
                        No Data Found
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ReportDetail;
