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
import { PieChart } from "@mui/x-charts/PieChart";
import MetricCard from "../../Components/MetricCard";
import SpinnerLoader from "../../Components/Loader/SpinnerLoader";
import { Box, Paper, Typography, useTheme } from "@mui/material";
import QuickLink from "../../Components/QuickLink";

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
      console.log(res.data.data);
    } catch (err) {
      console.error("Error fetching budget summary:", err);
    }
  }, [year, token]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  // Custom color palette for professional look
  const chartColors = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    "#34a853", // green
    "#ea4335", // red
    "#fbbc05", // yellow
    "#4285f4", // blue
    "#8e24aa", // purple
    "#00acc1", // cyan
  ];

  // Format data with colors assigned
  const formatPieChartData = (data) => {
    return data.map((item, index) => ({
      id: item.category_id, // still useful for keys
      value: item.total,
      label: item.category_name, // display the actual category name
      color: chartColors[index % chartColors.length],
    }));
  };

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
      <ToastContainer></ToastContainer>
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

      {/* Budget */}
      <div className="space-y-4 mt-5 bg-white p-6 border border-gray-300 shadow rounded-lg flex flex-col">
        <h2 className="text-xl font-semibold">Budget Overview - {year}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {summary.map((item) => {
            const percentSpent = (item?.totalSpent / item?.totalBudget) * 100;
            const percentRemaining = 100 - percentSpent;

            return (
              <div
                key={item.categoryId}
                className="p-4 rounded-xl shadow bg-white border border-gray-300"
                style={{ borderColor: item.color }}
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
                  ? transaction.vendor
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
                            <IndianRupee className="h-4 w-4" />
                            <span>{transaction.amount}</span>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <IndianRupee className="h-4 w-4" />
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-96 rounded-md">
          {/* Expenses by Category*/}
          {expenseData.length > 0 ? (
            <div style={{ width: "100%", height: 150 }}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  bgcolor: "background.paper",
                  overflow: "hidden",
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

                {expenseData.length > 0 ? (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                      height: 250,
                    }}
                  >
                    <PieChart
                      series={[
                        {
                          data: formatPieChartData(expenseData),
                          innerRadius: 60,
                          outerRadius: 120,
                          paddingAngle: 2,
                          cornerRadius: 4,
                          startAngle: -90,
                          endAngle: 270,
                          highlightScope: {
                            faded: "global",
                            highlighted: "item",
                          },
                          faded: {
                            innerRadius: 50,
                            additionalRadius: -20,
                            color: "gray",
                            opacity: 0.3,
                          },

                          arcLabelRadius: 0.7,
                          arcLabelsSkipAngle: 10,
                        },
                      ]}
                      slotProps={{
                        legend: {
                          direction: "column",
                          position: {
                            vertical: "middle",
                            horizontal: "right",
                          },
                          padding: 8,
                          itemMarkWidth: 12,
                          itemMarkHeight: 12,
                          markGap: 8,
                          itemGap: 12,
                          labelStyle: {
                            fontSize: 13,
                            fontWeight: 500,
                            fill: theme.palette.text.secondary,
                          },
                        },
                      }}
                      height={350}
                      margin={{ top: 10, bottom: 10, left: 10, right: 120 }}
                      sx={{
                        [".MuiChartsLegend-root"]: {
                          borderLeft: `1px solid ${theme.palette.divider}`,
                          pl: 2,
                        },
                        [".MuiChartsLegend-mark"]: {
                          borderRadius: "50%",
                          rx: 0,
                        },
                      }}
                    />
                  </Box>
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: 200,
                      color: theme.palette.text.secondary,
                      bgcolor: theme.palette.background.default,
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="body2">
                      No expense data available
                    </Typography>
                  </Box>
                )}
              </Paper>
            </div>
          ) : (
            <div className="flex justify-center items-center h-64 text-gray-500">
              No Expense Data
            </div>
          )}

          {/* Income by Category*/}
          {incomeData.length > 0 ? (
            <div style={{ width: "100%", height: 150 }}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  bgcolor: "background.paper",
                  overflow: "hidden",
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
                    height: 250,
                  }}
                >
                  <PieChart
                    series={[
                      {
                        data: formatPieChartData(incomeData),
                        innerRadius: 60,
                        outerRadius: 120,
                        paddingAngle: 2,
                        cornerRadius: 4,
                        startAngle: -90,
                        endAngle: 270,
                        highlightScope: {
                          faded: "global",
                          highlighted: "item",
                        },
                        faded: {
                          innerRadius: 50,
                          additionalRadius: -20,
                          color: "gray",
                          opacity: 0.3,
                        },
                        arcLabelRadius: 0.7,
                        arcLabelsSkipAngle: 10,
                      },
                    ]}
                    slotProps={{
                      legend: {
                        direction: "column",
                        position: {
                          vertical: "middle",
                          horizontal: "right",
                        },
                        padding: 8,
                        itemMarkWidth: 12,
                        itemMarkHeight: 12,
                        markGap: 8,
                        itemGap: 12,
                        labelStyle: {
                          fontSize: 13,
                          fontWeight: 500,
                          fill: theme.palette.text.secondary,
                        },
                      },
                    }}
                    height={350}
                    margin={{ top: 10, bottom: 10, left: 10, right: 120 }}
                    sx={{
                      [".MuiChartsLegend-root"]: {
                        borderLeft: `1px solid ${theme.palette.divider}`,
                        pl: 2,
                      },
                      [".MuiChartsLegend-mark"]: {
                        borderRadius: "50%",
                        rx: 0,
                      },
                    }}
                  />
                </Box>
              </Paper>
            </div>
          ) : (
            <div className="flex justify-center items-center h-64 text-gray-500">
              No Income Data
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
