import axios from "axios";
import {
  Briefcase,
  ChevronRight,
  CreditCard,
  FileText,
  IndianRupee,
  PiggyBank,
  PlusCircle,
  TrendingUp,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { format } from "date-fns";
import { toast, ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";
import MetricCard from "../../Components/MetricCard";
import SpinnerLoader from "../../Components/Loader/SpinnerLoader";
import { Box, Paper, Typography, useTheme } from "@mui/material";
import QuickLink from "../../Components/QuickLink";
import FormattedAmount from "../../Components/FormattedAmount";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const Dashboard = () => {
  const token = localStorage.getItem("Token");
  const [carddata, setCardata] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recentTransaction, setRecentTransaction] = useState([]);
  const [expenseData, setExpenseData] = useState([]);
  const [incomeData, setIncomeData] = useState([]);
  const [summary, setSummary] = useState([]);
  const currentYear = new Date().getFullYear();
  const [year] = useState(currentYear);
  const [showAll, setShowAll] = useState(false);

  const filteredSummary = summary.filter(
    (item) =>
      item.totalBudget !== 0 || item.totalSpent !== 0 || item.remaining !== 0
  );

  const visibleSummary = showAll
    ? filteredSummary
    : filteredSummary.slice(0, 4);

  useEffect(() => {
    const getRecentTransactions = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/recent-transactions`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // console.log("res", res.data);
        setRecentTransaction(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      getRecentTransactions();
    }
  }, [token]);

  const TransactionType = (transaction) => {
    return transaction.expenseDate ? "Expense" : "Income";
  };

  const formatDate = (date) => {
    return format(new Date(date), "MMM dd, yyyy");
  };

  // Get Metric Amount
  useEffect(() => {
    const getTotalAmount = async () => {
      const res = await axios.get(`/get-total`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCardata(res.data);
    };
    if (token) {
      getTotalAmount();
    }
  }, [token]);

  // Get Expenseby Category & Income
  const getExpensebyCategory = useCallback(async () => {
    try {
      const res = await axios.get(`/expensebycategory`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setExpenseData(res.data);
      console.log(res.data);
    } catch {
      toast.error("Internal Server Error");
    }
  }, [token]);

  const getIncomebyCategory = useCallback(async () => {
    try {
      const res = await axios.get(`/incomebycategory`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setIncomeData(res.data);
    } catch {
      toast.error("Internal Server Error");
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      getExpensebyCategory();
      getIncomebyCategory();
    }
  }, [token, getExpensebyCategory, getIncomebyCategory]);

  const theme = useTheme();

  const fetchSummary = useCallback(async () => {
    try {
      const res = await axios.get(`/budget/${year}/dashboard-summary`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSummary(res.data.data.categories);
    } catch (err) {
      console.error("Error fetching budget summary:", err);
    }
  }, [year, token]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  // Custom color palette for professional look
  const generateColors = (count) =>
    Array.from(
      { length: count },
      (_, i) => `hsl(${(i * 360) / count}, 70%, 60%)`
    );

  const COLORS = generateColors(expenseData.length);

  // Format data with colors assigned
  const formatPieChartData = (data) => {
    return data.map((item) => ({
      id: item.category_id, // still useful for keys
      value: item.total,
      label: item.category_name, // display the actual category name
    }));
  };

  const IncomePieData = formatPieChartData(incomeData);
  const ExpensePieData = formatPieChartData(expenseData);

  // Quick Link
  const quickLinks = [
    {
      to: "/income/add",
      icon: PlusCircle,
      title: "Add Income",
      description: "Record a new income",
      color: "text-green-600",
    },
    {
      to: "/expenses/add",
      icon: CreditCard,
      title: "Add Expense",
      description: "Log a new expense",
      color: "text-red-600",
    },
    {
      to: "/vendor/add",
      icon: Briefcase,
      title: "Add Vendor",
      description: "Add a new vendor",
      color: "text-blue-600",
    },
    {
      to: "/reports/generate",
      icon: FileText,
      title: "Generate Report",
      description: "Financial summary report",
      color: "text-purple-600",
    },
    {
      to: "/budget",
      icon: FileText,
      title: "Manage Budget",
      description: "Control your finances",
      color: "text-amber-600",
    },
  ];

  return (
    <div className="p-4">
      <ToastContainer autoClose={1500}></ToastContainer>
      <div className="space-x-6 space-y-6">
        {/* Financial Metrics - Horizontal Layout */}
        <div className="flex space-x-6 flex-grow mx-auto">
          <MetricCard
            icon={<TrendingUp className="h-6 w-6 text-green-600" />}
            title="Total Income"
            value={carddata.totalIncome}
            description="All income this month"
            bgColor="bg-green-100"
            textColor="text-green-600"
          />
          <MetricCard
            icon={<CreditCard className="h-6 w-6 text-red-600" />}
            title="Total Expenses"
            value={carddata.totalExpense}
            description="All expenses this month"
            bgColor="bg-red-100"
            textColor="text-red-600"
          />
          <MetricCard
            icon={<IndianRupee className="h-6 w-6 text-blue-600" />}
            title="Net Balance"
            value={carddata.currentBalance}
            description="Income - Expense"
            bgColor="bg-blue-100"
            textColor="text-blue-600"
          />
          <MetricCard
            icon={<PiggyBank className="h-6 w-6 text-amber-600" />}
            title="Remaining Budget"
            value={carddata.remainingBudget}
            description="Total Budget - Total Spent"
            bgColor="bg-amber-100"
            textColor="text-amber-600"
          />
        </div>

        {/* Quick Actions - Vertical Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {quickLinks.map((link, index) => (
            <QuickLink key={index} {...link} />
          ))}
        </div>
      </div>

      <div className="space-y-4 mt-5 flex flex-col">
        {/* Title & Toggle */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl text-gray-700 font-semibold">
            Budget Overview - {year}
          </h2>
          {filteredSummary.length > 5 && (
            <button
              onClick={() => setShowAll((prev) => !prev)}
              className="text-sm text-blue-600 hover:underline"
            >
              {showAll ? "Show Less" : "Show All"}
            </button>
          )}
        </div>

        {/* Data Display */}
        {filteredSummary.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {visibleSummary
              .filter(
                (item) =>
                  item.totalSpent !== 0 ||
                  item.totalBudget !== 0 ||
                  item.remaining !== 0
              )
              .map((item) => {
                const percentSpent =
                  (item.totalSpent / item.totalBudget) * 100 || 0;
                const percentRemaining = 100 - percentSpent;

                return (
                  <div
                    key={item.categoryId}
                    className="p-4 bg-white border border-gray-200"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold">{item.categoryName}</h3>
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          item.status === "Over Budget"
                            ? "bg-red-100 text-red-600"
                            : item.status === "Near Limit"
                            ? "bg-yellow-100 text-yellow-600"
                            : "bg-green-100 text-green-600"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="absolute left-0 top-0 h-full bg-green-500"
                        style={{ width: `${percentSpent}%` }}
                      ></div>
                      <div
                        className="absolute right-0 top-0 h-full bg-blue-500"
                        style={{ width: `${percentRemaining}%` }}
                      ></div>
                    </div>

                    <div className="flex justify-between text-sm mt-1 text-gray-700">
                      <span>Spent: ₹{item.totalSpent.toFixed(2)}</span>
                      <span>Remaining: ₹{item.remaining.toFixed(2)}</span>
                    </div>

                    <p className="text-xs text-gray-500 mt-1">
                      Total Budget: ₹{item.totalBudget.toFixed(2)}
                    </p>
                  </div>
                );
              })}
          </div>
        ) : (
          // Centered No Data Message
          <div className="flex items-center justify-center h-40 w-full">
            <p className="text-gray-500 text-xl">No budget data to display.</p>
          </div>
        )}
      </div>

      {/* Recent Transactions */}
      <div className="mt-6">
        <div className="flex justify-between">
          <h3 className="text-gray-700 mb-4 text-xl font-semibold">
            Recent Transactions
          </h3>
          <Link
            to="recent-transactions"
            className="flex text-sm text-blue-600 hover:underline"
          >
            View All <ChevronRight />
          </Link>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <SpinnerLoader size="large" color="blue" />
          </div>
        ) : recentTransaction.length > 0 ? (
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
              {recentTransaction.slice(0, 5).map((transaction) => {
                const isExpense = TransactionType(transaction) === "Expense";
                const date = isExpense
                  ? transaction.expenseDate
                  : transaction.incomeDate;
                const notesOrVendor = isExpense
                  ? transaction?.vendor?.name
                  : transaction.notes;

                return (
                  <tr
                    key={transaction._id}
                    className={`
                   transition-colors duration-150 hover:cursor-pointer
                    ${
                      isExpense
                        ? "bg-white hover:bg-red-50"
                        : "bg-white hover:bg-green-50"
                    }
                  `}
                  >
                    <td className="py-3 px-4 text-gray-800 font-medium">
                      <div className="flex items-center">
                        <div>
                          <div className={`font-medium `}>
                            {transaction.title}
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
                            <FormattedAmount amount={transaction.amount} />
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <FormattedAmount amount={transaction.amount} />
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
                        {transaction.category?.category_name}
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
              You haven&#39;t recorded any transactions. Start by adding an
              income or expense.
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Expenses by Category */}
          {expenseData.length > 0 ? (
            <Box sx={{ width: "100%", height: "100%" }}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  bgcolor: "background.paper",
                  overflow: "hidden",
                  height: { xs: 400, md: 450 },
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography
                  variant="h6"
                  component="h2"
                  gutterBottom
                  sx={{
                    fontWeight: 600,
                    mb: 2,
                    color: theme.palette.text.primary,
                  }}
                >
                  Expense Distribution
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    flex: 1,
                    minHeight: 0,
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={ExpensePieData}
                        dataKey="value"
                        nameKey="label"
                        cx="50%"
                        cy="50%"
                        outerRadius="70%"
                        innerRadius="30%"
                        paddingAngle={2}
                      >
                        {expenseData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend
                        wrapperStyle={{
                          fontSize: "12px",
                          paddingTop: "10px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: { xs: 200, md: 250 },
                color: "text.secondary",
                bgcolor: "background.paper",
                borderRadius: 2,
                border: 1,
                borderColor: "divider",
              }}
            >
              <Typography variant="body1" color="text.secondary">
                No Expense Data
              </Typography>
            </Box>
          )}

          {/* Income by Category */}
          {incomeData.length > 0 ? (
            <Box sx={{ width: "100%" }}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  bgcolor: "background.paper",
                  overflow: "hidden",
                  height: { xs: 400, md: 450 },
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography
                  variant="h6"
                  component="h2"
                  gutterBottom
                  sx={{
                    fontWeight: 600,
                    mb: 2,
                    color: theme.palette.text.primary,
                  }}
                >
                  Income Distribution
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    flex: 1,
                    minHeight: 0,
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={IncomePieData}
                        dataKey="value"
                        nameKey="label"
                        cx="50%"
                        cy="50%"
                        outerRadius="70%"
                        innerRadius="30%"
                        paddingAngle={2}
                      >
                        {incomeData.map((entry, index) => (
                          <Cell
                            key={`income-cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend
                        wrapperStyle={{
                          fontSize: "12px",
                          paddingTop: "10px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: { xs: 200, md: 250 },
                color: "text.secondary",
                bgcolor: "background.paper",
                borderRadius: 2,
                border: 1,
                borderColor: "divider",
              }}
            >
              <Typography variant="body1" color="text.secondary">
                No Income Data
              </Typography>
            </Box>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
