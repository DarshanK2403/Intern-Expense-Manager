/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import axios from "axios";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Briefcase,
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
import { PieChart } from "@mui/x-charts/PieChart";
import MetricCard from "../../Components/MetricCard";
import SpinnerLoader from "../../Components/Loader/SpinnerLoader";
import { Box, Paper, Typography, useTheme } from "@mui/material";

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [recentTransaction, setRecentTransaction] = useState([]);
  const [totalExpense, setTotalExpense] = useState();
  const [totalIncome, setTotalIncome] = useState();
  const [currentBalance, setcurrentBalance] = useState();
  const [expenseData, setExpenseData] = useState([]);
  const [timeframe, setTimeframe] = useState("monthly");
  const [incomeData, setIncomeData] = useState([]);
  const token = localStorage.getItem("Token");

  const COLORS = [
    "#5B9BD5",
    "#70AD47",
    "#FFD966",
    "#E57373",
    "#A085C2",
    "#56C0E0",
    "#F4A261",
  ];

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
      setTotalExpense(res.data.totalExpense);
      setTotalIncome(res.data.totalIncome);
      setcurrentBalance(res.data.currentBalance);
    };
    if (token) {
      getTotalAmount();
    }
  }, [token]);

  // Get Expenseby Category & Income
  useEffect(() => {
    const getExpensebyCategory = async () => {
      try {
        const res = await axios.get(`/expensebycategory`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setExpenseData(res.data);
        // console.log(res.data);
      } catch (error) {
        toast.error("Internal Server Error");
      }
    };

    const getIncomebyCategory = async () => {
      try {
        const res = await axios.get(`/incomebycategory`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // console.log(res.data);
        setIncomeData(res.data);
      } catch (error) {
        toast.error("Internal Server Error");
      }
    };

    if (token) {
      getExpensebyCategory();
      getIncomebyCategory();
    }
  }, [token]);

  const theme = useTheme();

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

  return (
    <div className="p-4 h-auto">
      <ToastContainer></ToastContainer>
      <div className="space-x-6 space-y-6">
        {/* Financial Metrics - Horizontal Layout */}
        <div className="flex space-x-6 flex-grow mx-auto">
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
            icon={<IndianRupee className="h-6 w-6 text-blue-600" />}
            title="Net Balance"
            value={currentBalance}
            description="Net income - expenses"
            bgColor="bg-blue-100"
            textColor="text-blue-600"
          />
        </div>

        {/* Quick Actions - Vertical Layout */}
        <div className="w-full flex flex-row space-x-4">
          {/* Add Income */}
          <Link
            to="/income/add"
            className="w-full flex items-center justify-between p-4 bg-white rounded-lg shadow hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center">
              <PlusCircle className="h-5 w-5 mr-2 text-green-600" />
              <div>
                <p className={`font-medium text-start  text-green-600`}>
                  Add Income
                </p>
                <p className="text-xs text-gray-500">Record a new income</p>
              </div>
            </div>
            <ArrowUpRight className="h-5 w-5 text-gray-400" />
          </Link>

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

          {/* Add Vendor */}
          <Link
            to="/vendor/add"
            className="w-full flex items-center justify-between p-4 bg-white rounded-lg shadow hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center">
              <Briefcase className="h-5 w-5 mr-2 text-blue-600" />
              <div>
                <p className={`font-medium text-start  text-blue-600`}>
                  Add Vendor
                </p>
                <p className="text-xs text-gray-500">Add a new vendor</p>
              </div>
            </div>
            <ArrowUpRight className="h-5 w-5 text-gray-400" />
          </Link>

          {/* Report Genarte */}
          <Link
            to="/reports/generate"
            className="w-full flex items-center justify-between p-4 bg-white rounded-lg shadow hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center">
              <FileText className="h-5 w-5 mr-2 text-purple-600" />
              <div>
                <p className={`font-medium text-start  text-purple-600`}>
                  Generate your financial report
                </p>
                <p className="text-xs text-gray-500">Generate Report</p>
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
              You haven't recorded any transactions. Start by adding an income
              or expense.
            </p>
          </div>
        )}
      </div>

      {/* Expense by Category */}
      <div className="my-6 p-6 bg-white shadow-md rounded-lg border h-[50%] border-gray-300">
        <div className="py-2">
          <h2 className="text-lg font-semibold">
            Category-wise Financial Overview
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 rounded-md">
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
