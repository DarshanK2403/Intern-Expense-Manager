import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import {
  TrendingUp,
  IndianRupee,
  TrendingDown,
  Wallet,
  AlertTriangle,
  Calendar,
  Tag,
  Landmark,
  Download,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  LineChart as LineChartIcon,
  Trash2,
  ArrowLeft,
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
import Select from "react-select";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import SpinnerLoader from "../../Components/Loader/SpinnerLoader";
import { useNavigate, useParams } from "react-router-dom";

const ReportPage = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [formatedData, setFormatedData] = useState([]);
  const [incomeSourceData, setincomeSourceData] = useState([]);
  const [categoryExpenseData, setcategoryExpenseData] = useState([]);
  const [allTransactions, setAllTransactions] = useState([]);
  const [activeFilters, setActiveFilters] = useState(false);
  const [period, setPeriod] = useState("week");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [visibleTransactions, setVisibleTransactions] =
    useState(allTransactions);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    type: "all",
    expenseCategory: "all",
    incomeCategory: "all",
    minAmount: "",
    maxAmount: "",
  });
  const [activeTab, setActiveTab] = useState("overview");
  const [budgetVsActualData, setBudgetVsActualData] = useState([]);
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884d8",
    "#82ca9d",
  ];

  const token = localStorage.getItem("Token");

  const BudgetTotal = Object.values(data.budgetData || {}).reduce(
    (acc, amount) => acc + amount,
    0
  );

  const getReportData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`report-by-id/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res);
      setData(res.data);
      setFormatedData(res.data.formatted);
      setincomeSourceData(res.data.incomeSources);
      setcategoryExpenseData(res.data.expenseByCategory);
      setAllTransactions(res.data.transaction);
      setBudgetVsActualData(res.data.budgetVsActual);
    } catch {
      toast("Failed to getch report data");
    } finally {
      setLoading(false);
    }
  }, [token, id]);

  useEffect(() => {
    getReportData();
  }, [token, id, getReportData]);

  const remainingBudget = BudgetTotal - data.totalExpense;
  useEffect(() => {
    setData((prev) => ({
      ...prev,
      remainingBudget,
      isOverBudget: remainingBudget < 0,
    }));
  }, [BudgetTotal, data.totalExpense]);

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    setFilteredTransactions(filtered);

    const filteredIncome = filtered.filter((item) => item.incomeDate);
    const filteredExpense = filtered.filter((item) => item.expenseDate);

    // Income Source
    const incomeSources = filteredIncome.reduce((acc, curr) => {
      const categoryName = curr.title;
      acc[categoryName] = (acc[categoryName] || 0) + curr.amount;
      return acc;
    }, {});
    setincomeSourceData(
      Object.entries(incomeSources).map(([categoryName, value]) => ({
        _id: categoryName,
        name: categoryName,
        value,
      }))
    );

    // Expense by Category
    const expenseByCategory = filteredExpense.reduce((acc, curr) => {
      const categoryName = curr.title;
      acc[categoryName] = (acc[categoryName] || 0) + curr.amount;
      return acc;
    }, {});
    setcategoryExpenseData(
      Object.entries(expenseByCategory).map(([categoryName, value]) => ({
        _id: categoryName,
        name: categoryName,
        value,
      }))
    );

    // Update totals
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

  // Line Charts
  const processedData = useMemo(() => {
    return formatedData.map((item) => {
      let label;
      if (period === "week") {
        label = item.day || item.month;
      } else if (period === "month") {
        label = item.date || item.month;
      } else {
        label = item.month;
      }
      return {
        label,
        income: parseFloat(item.income || 0),
        expense: parseFloat(item.expense || 0),
      };
    });
  }, [formatedData, period]);

  const allValues = processedData.flatMap((item) => [
    item.income,
    item.expense,
  ]);
  const minValue = Math.min(...allValues);
  const maxValue = Math.max(...allValues);

  const padding = (maxValue - minValue) * 0.1;
  const yAxisDomain = [Math.max(0, minValue - padding), maxValue + padding];

  // Format currency values
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(value);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-40">
        <SpinnerLoader size="large" color="blue" />
      </div>
    );

  return (
    <div className="w-full bg-gray-50">
      <ToastContainer></ToastContainer>

      <div className="bg-gray-50">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* Report ID and Created At */}
              <div
                className="text-gray-800 hover:cursor-pointer"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft />
              </div>
              <div className="flex-1">
                <div className="mt-1 flex flex-col text-sm text-gray-500">
                  <div>
                    <h2 className="text-2xl text-black font-bold">Report</h2>
                  </div>
                  {data.createdAt ? (
                    <div className="flex text-center">
                      <Calendar size={16} className="mr-1" />
                      <span>
                        Created at:{" "}
                        {format(new Date(data?.createdAt), "dd MMM yyyy")}
                      </span>
                    </div>
                  ) : (
                    " "
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center">
                  <Tag size={16} className="mr-1 text-gray-500" />
                  <span className="text-sm font-bold">
                    Type:{" "}
                    <span className="text-blue-600 capitalize">
                      {data.type || "N/A"}
                    </span>
                  </span>
                </div>
                {data.startDate ? (
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-1 text-gray-500" />
                    <span className="text-sm font-bold">
                      Date :{" "}
                      <span className="font-medium text-blue-600">
                        {format(new Date(data?.startDate), "dd MMM yyyy")}-{" "}
                        {format(new Date(data?.endDate), "dd MMM yyyy")}
                      </span>
                    </span>
                  </div>
                ) : (
                  " "
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3">
                <button
                  // onClick={handleExport}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Download size={16} className="mr-2" />
                  Export
                </button>
                <button
                  // onClick={handleDelete}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-red-600 bg-white hover:bg-gray-50"
                >
                  <Trash2 size={16} className="mr-2" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Tab Buttons */}
        <div className="mx-auto bg-white mt-2 border-y border-gray-300 mb-6">
          <nav className="flex max-w-6xl mx-auto flex-wrap -mb-px">
            <button
              onClick={() => setActiveTab("overview")}
              className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "overview"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("ChartsSection")}
              className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "ChartsSection"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Charts
            </button>
            <button
              onClick={() => setActiveTab("transactions")}
              className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "transactions"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Transactions
            </button>
            <button
              onClick={() => setActiveTab("budget")}
              className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "budget"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Budget Overview
            </button>
          </nav>
        </div>

        {/* Main */}
        <main className="mx-auto max-w-7xl px-3 md:px-4 pb-2 md:pb-5 sm:px-6 lg:px-8">
          {/* Overview */}
          {activeTab === "overview" && (
            <>
              <div className="bg-gray-50">
                <div className="max-w-7xl mx-auto">
                  {/* Main Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-medium text-gray-700">
                          Total Income
                        </h2>
                        <TrendingUp className="text-blue-500" size={24} />
                      </div>
                      <p className="text-3xl font-bold text-blue-600">
                        {formatCurrency(data.totalIncome)}
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        {data.comparisons?.income}
                      </p>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-medium text-gray-700">
                          Total Expenses
                        </h2>
                        <TrendingDown className="text-red-500" size={24} />
                      </div>
                      <p className="text-3xl font-bold text-red-600">
                        {formatCurrency(data.totalExpense)}
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        {data.comparisons?.expense}
                      </p>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-medium text-gray-700">
                          Net Balance
                        </h2>
                        <Wallet className="text-green-500" size={24} />
                      </div>
                      <p className="text-3xl font-bold text-green-600">
                        {formatCurrency(data.balance)}
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        {data.comparisons?.balance}
                      </p>
                    </div>
                  </div>

                  {/* Secondary Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-md p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-medium text-gray-700">
                          Budget Status
                        </h2>
                        {data.isOverBudget ? (
                          <AlertTriangle
                            className="text-yellow-500"
                            size={24}
                          />
                        ) : (
                          <Calendar className="text-purple-500" size={24} />
                        )}
                      </div>
                      <div className="mb-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Budget: {formatCurrency(BudgetTotal)}</span>

                          <span>
                            Remaining: {formatCurrency(remainingBudget)}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className={`h-2.5 rounded-full ${
                              data.isOverBudget ? "bg-red-500" : "bg-green-500"
                            }`}
                            style={{
                              width: `${Math.min(
                                (1 - remainingBudget / BudgetTotal) * 100,
                                100
                              )}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                      {data.isOverBudget && (
                        <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                          <div className="flex">
                            <AlertTriangle
                              className="text-yellow-500 mr-2"
                              size={20}
                            />
                            <p className="text-sm text-yellow-700">
                              You&#39;ve exceeded your monthly budget by{" "}
                              {formatCurrency(Math.abs(remainingBudget))}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-medium text-gray-700">
                          Top Spending
                        </h2>
                        <PieChart className="text-indigo-500" size={24} />
                      </div>
                      <div className="mb-4">
                        <p className="text-sm text-gray-500">Top Category</p>
                        <div className="flex items-center">
                          <div className="bg-indigo-100 rounded-full p-2 mr-3">
                            <Tag className="text-indigo-500" size={16} />
                          </div>
                          <div>
                            <p className="font-medium">
                              {data.topSpendingCategory?.name || "N/A"}
                            </p>
                            <p className="text-sm text-gray-500">
                              {formatCurrency(
                                data.topSpendingCategory?.amount || 0
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Highest Expense</p>
                        <div className="flex items-center">
                          <div className="bg-red-100 rounded-full p-2 mr-3">
                            <TrendingDown className="text-red-500" size={16} />
                          </div>
                          <div>
                            <p className="font-medium">
                              {data.highestExpense?.title}
                            </p>
                            <p className="text-sm text-gray-500">
                              {formatCurrency(data.highestExpense?.amount)}
                            </p>
                            {data?.highestExpense?.date &&
                              !isNaN(new Date(data?.highestExpense?.date)) && (
                                <p className="text-xs text-gray-500">
                                  Spent on{" "}
                                  {format(
                                    new Date(data?.highestExpense?.date),
                                    "dd MMM yyyy"
                                  )}
                                </p>
                              )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tertiary Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-xl shadow-md p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-medium text-gray-700">
                          Total Transactions
                        </h2>
                        <div className="bg-blue-100 rounded-full p-2">
                          <Calendar className="text-blue-500" size={16} />
                        </div>
                      </div>
                      <p className="text-3xl font-bold text-gray-800">
                        {data.transaction?.length}
                      </p>
                      <p className="text-sm text-gray-500 mt-2 capitalize">
                        This {data.type}
                      </p>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-medium text-gray-700">
                          Highest Income
                        </h2>
                        <div className="bg-green-100 rounded-full p-2">
                          <Landmark className="text-green-500" size={16} />
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-gray-800">
                        {formatCurrency(data?.highestIncome?.amount)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {data?.highestIncome?.title}
                      </p>
                      {data?.highestIncome?.date &&
                        !isNaN(new Date(data?.highestIncome?.date)) && (
                          <p className="text-xs text-gray-500 mt-1">
                            Received on{" "}
                            {format(
                              new Date(data?.highestIncome?.date),
                              "dd MMM yyyy"
                            )}
                          </p>
                        )}
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-medium text-gray-700">
                          Saving Rate
                        </h2>
                        <div className="bg-purple-100 rounded-full p-2">
                          <TrendingUp className="text-purple-500" size={16} />
                        </div>
                      </div>
                      <p className="text-3xl font-bold text-gray-800">
                        {data.savingRate}%
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3">
                        <div
                          className="h-2.5 rounded-full bg-purple-500"
                          style={{
                            width: `${Math.max(
                              0,
                              Math.min(data.savingRate, 100)
                            )}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
          {/* End Overview */}

          {/* Chart Tab */}
          {activeTab === "ChartsSection" && (
            <>
              {/* Income vs Expenses Line Chart */}
              <div className="bg-white p-4 mb-5 rounded-xl shadow border border-gray-300">
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
                    <div className="w-full h-64 md:h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={processedData}
                          margin={{
                            top: 10,
                            right: 30,
                            left: 20,
                            bottom: 10,
                          }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#c8c8c8"
                          />
                          <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                          <YAxis
                            domain={yAxisDomain}
                            tick={{ fontSize: 12 }}
                            tickFormatter={(value) =>
                              formatCurrency(value).replace(".00", "")
                            }
                            width={80}
                          />
                          <Tooltip
                            content={({ active, payload, label }) => {
                              if (active && payload && payload.length) {
                                return (
                                  <div className="bg-white p-3 border border-gray-200 rounded shadow-md">
                                    <p className="text-gray-600 font-medium mb-1">
                                      {label}
                                    </p>
                                    {payload.map((entry, index) => (
                                      <p
                                        key={`item-${index}`}
                                        style={{
                                          color:
                                            entry.name === "Income"
                                              ? "#4ade80"
                                              : "#f87171",
                                        }}
                                        className="text-sm font-medium"
                                      >
                                        {entry.name}:{" "}
                                        {formatCurrency(entry.value)}
                                      </p>
                                    ))}
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />

                          <Legend wrapperStyle={{ paddingTop: 10 }} />
                          <Line
                            type="monotone"
                            dataKey="income"
                            stroke="#4ade80"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                            name="Income"
                          />
                          <Line
                            type="monotone"
                            dataKey="expense"
                            stroke="#f87171"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                            name="Expense"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 h-max">
                {/* Expense by Category Pie Chart */}
                {filters.type !== "income" && (
                  <div className="bg-white p-4 md:p-6 mb-5 rounded-xl shadow border h-full border-gray-300">
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
                  <div className="bg-white p-4 md:p-6 rounded-xl shadow border border-gray-300">
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
              </div>
            </>
          )}
          {/* End Chart */}

          {/* Transaction Tab */}
          {activeTab === "transactions" && (
            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100">
                <h2 className="text-lg md:text-xl font-semibold text-gray-800">
                  Transaction History
                </h2>
              </div>

              {loading ? (
                <div className="flex justify-center items-center h-40">
                  <SpinnerLoader size="large" color="blue" />
                </div>
              ) : allTransactions?.length > 0 ? (
                <div className="max-h-full">
                  <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                          Title
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                          Category
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                          Date
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">
                          Amount
                        </th>
                      </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-gray-100">
                      {allTransactions
                        .filter((transaction) => {
                          if (filters.type === "income")
                            return !!transaction.incomeDate;
                          if (filters.type === "expense")
                            return !!transaction.expenseDate;
                          return true;
                        })
                        .map((transaction) => (
                          <tr
                            key={`${transaction.title}-${transaction.amount}-${
                              transaction.expenseDate || transaction.incomeDate
                            }`}
                            className="hover:bg-gray-50"
                          >
                            <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900">
                              {transaction.title}
                            </td>
                            <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                              {transaction?.category?.category_name}
                            </td>

                            <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
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
                              className={`px-4 py-3 text-right whitespace-nowrap font-semibold ${
                                transaction.incomeDate
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              <div className="flex items-center justify-end gap-1">
                                <IndianRupee className="w-4 h-4" />
                                {Math.abs(transaction.amount).toFixed(2)}
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="h-64 flex justify-center items-center">
                  <div className="text-lg md:text-2xl text-gray-500">
                    No Transactions Found
                  </div>
                </div>
              )}
            </div>
          )}
          {/* End Transaction tab */}

          {/* Budget Overview */}
          {activeTab === "budget" && (
            <>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={budgetVsActualData}>
                  <XAxis dataKey="category_name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="budgeted" fill="#8884d8" name="Budgeted" />
                  <Bar dataKey="spent" fill="#82ca9d" name="Spent" />
                </BarChart>
              </ResponsiveContainer>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default ReportPage;
