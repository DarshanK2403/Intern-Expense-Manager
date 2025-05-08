import { format } from "date-fns";
import { AlertTriangle } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
  ResponsiveContainer,
} from "recharts";

export const renderReportPreview = (PDFData, fields) => {
  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#a4de6c"];
  const { reportData, userData } = PDFData;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(value);
  };

  const BudgetTotal = Object.values(reportData.budgetData || {}).reduce(
    (acc, amount) => acc + amount,
    0
  );

  const processedData = PDFData.reportData.processedData;
  const allValues = processedData.flatMap((item) => [
    item.income,
    item.expense,
  ]);
  const minValue = Math.min(...allValues);
  const maxValue = Math.max(...allValues);
  const padding = (maxValue - minValue) * 0.1;
  const yAxisDomain = [Math.max(0, minValue - padding), maxValue + padding];
  const remainingBudget = BudgetTotal - reportData?.totalExpense;

  const getRowClass = (index) => {
    return index % 2 === 0 ? "" : "bg-gray-50";
  };
  const getAmountDisplay = (txn) => {
    if (txn.incomeDate) {
      return <span className="text-gray-800">+₹{txn.amount}</span>;
    } else {
      return <span className="text-gray-800">-₹{txn.amount}</span>;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = new Intl.DateTimeFormat("en", { month: "short" }).format(
      date
    );
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const getEstimatedXAxisHeight = (data = []) => {
    if (!data.length) return 60; // default height

    const maxLabelLength = Math.max(
      ...data.map((item) => item.category_name?.length || 0)
    );

    // Estimate: 6px per character, with a cap
    return Math.min(150, Math.max(60, maxLabelLength * 6));
  };
  const estimatedHeight = getEstimatedXAxisHeight(
    reportData?.budgetVsActualData
  );

  return (
    <div className="p-4 space-y-6 text-gray-800 text-sm">
      <div className="mb-8 pb-4 border-b border-gray-300">
        {/* Main title */}
        <h1 className="text-2xl font-bold text-center mb-4">Report</h1>

        {/* Report metadata in a clean layout */}
        <div className="flex justify-between text-sm px-4">
          <div>
            <div className="mb-2">
              <span className="font-medium">Date: </span>
              <span>
                {formatDate(reportData.startDate)} to{" "}
                {formatDate(reportData.endDate)}
              </span>
            </div>
          </div>

          <div>
            <div>
              <span className="font-medium">Report Type: </span>
              <span className="capitalize">{reportData?.type}</span>
            </div>
          </div>
        </div>
      </div>
      {fields.overview && (
        <div className="w-full mx-auto p-4 bg-white">
          <table className="w-full border-collapse border border-gray-300 text-sm">
            <tbody>
              <tr>
                <td className="p-2 border border-gray-300 bg-gray-100 font-medium w-1/3">
                  Name
                </td>
                <td className="p-2 border border-gray-300">
                  {userData.firstName} {userData.lastName}
                </td>
              </tr>
              <tr>
                <td className="p-2 border border-gray-300 bg-gray-100 font-medium">
                  Email
                </td>
                <td className="p-2 border border-gray-300">{userData.email}</td>
              </tr>
              <tr>
                <td className="p-2 border border-gray-300 bg-gray-100 font-medium">
                  Phone
                </td>
                <td className="p-2 border border-gray-300">{userData.phone}</td>
              </tr>
            </tbody>
          </table>

          {/* Additional metrics in simple table */}
          <table className="w-full border-collapse">
            <tbody>
              <tr>
                <td className="py-2 font-medium text-gray-700">
                  Top Spending Category:
                </td>
                <td className="py-2 text-right">
                  {reportData.topSpendingCategory?.name
                    ? `${reportData.topSpendingCategory.name} (${formatCurrency(
                        reportData.topSpendingCategory.amount
                      )})`
                    : "N/A"}
                </td>
              </tr>
              <tr>
                <td className="py-2 font-medium text-gray-700">
                  Highest Income:
                </td>
                <td className="py-2 text-right">
                  {reportData.highestIncome
                    ? `${reportData.highestIncome.title} (${formatCurrency(
                        reportData.highestIncome.amount
                      )})`
                    : "N/A"}
                </td>
              </tr>
              <tr>
                <td className="py-2 font-medium text-gray-700">
                  Highest Expense:
                </td>
                <td className="py-2 text-right">
                  {reportData.highestExpense
                    ? `${reportData.highestExpense.title} (${formatCurrency(
                        reportData.highestExpense.amount
                      )})`
                    : "N/A"}
                </td>
              </tr>
              <tr className="bg-gray-50">
                <td className="py-2 font-medium text-gray-700">
                  Total Transactions:
                </td>
                <td className="py-2 text-right">
                  {reportData.transaction?.length || 0}
                </td>
              </tr>
              <tr>
                <td className="py-2 font-medium text-gray-700">Saving Rate:</td>
                <td className="py-2 text-right">
                  {reportData.savingRate || 0}%
                </td>
              </tr>
            </tbody>
          </table>
          {/* Budget status */}
          <div className="mb-6 p-4 bg-gray-50 border border-gray-200">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-base font-medium text-gray-800">
                Budget Status
                {reportData.isOverBudget && (
                  <AlertTriangle
                    className="inline ml-2 text-gray-700"
                    size={16}
                  />
                )}
              </h3>
            </div>

            <div className="flex justify-between text-sm mb-2">
              <span>Budget: {formatCurrency(BudgetTotal)}</span>
              <span>Remaining: {formatCurrency(remainingBudget)}</span>
            </div>

            <div className="w-full bg-gray-200 h-4 rounded">
              <div
                className="bg-gray-500 h-4 rounded"
                style={{
                  width: `${Math.min(
                    100,
                    (reportData.totalExpense / BudgetTotal) * 100
                  )}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      )}
      {fields.charts && reportData.formatted?.length > 0 && (
        <section>
          <h2 className="font-semibold mb-2">Income vs Expense</h2>
          <div id="income-expense-chart" style={{ background: "white" }}>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart
                data={reportData.formatted}
                margin={{
                  top: 10,
                  right: 30,
                  left: 20,
                  bottom: 10,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#c8c8c8" />
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
                              {entry.name}: {formatCurrency(entry.value)}
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
        </section>
      )}

      {/* 🟠 Pie Chart - Expense by Category */}
      {fields.charts && reportData.expenseByCategory?.length > 0 && (
        <section>
          <h2 className="font-semibold mb-2 mt-6">Expense by Category</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={reportData.expenseByCategory}
                dataKey="value"
                nameKey="_id"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {reportData.expenseByCategory.map((_, idx) => (
                  <Cell
                    key={`cell-${idx}`}
                    fill={COLORS[idx % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${value}`} />
              <Legend
                layout="vertical"
                verticalAlign="center"
                align="right"
                wrapperStyle={{ fontSize: "12px" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </section>
      )}

      {/* 🟢 Bar Chart - Income Sources */}
      {fields.charts && reportData.incomeSources?.length > 0 && (
        <section>
          <h2 className="font-semibold mb-2 mt-6">Income Sources</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={reportData.incomeSources.map((src) => ({
                name: src._id,
                value: src.value,
              }))}
            >
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" name="Income Source" />
            </BarChart>
          </ResponsiveContainer>
        </section>
      )}

      {/* Transactions */}
      {fields.transaction && reportData.transaction?.length > 0 && (
        <section className="mt-6 mb-6">
          <h2 className="text-lg font-bold mb-3 pb-2 border-b border-gray-300">
            Transactions
          </h2>

          <table className="w-full border-collapse border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border border-gray-300 text-left font-medium">
                  Title
                </th>
                <th className="p-2 border border-gray-300 text-left font-medium">
                  Amount
                </th>
                <th className="p-2 border border-gray-300 text-left font-medium">
                  Date
                </th>
                <th className="p-2 border border-gray-300 text-left font-medium">
                  Category
                </th>
                <th className="p-2 border border-gray-300 text-left font-medium">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody>
              {reportData.transaction.map((txn, idx) => (
                <tr key={idx} className={getRowClass(idx)}>
                  <td className="p-2 border border-gray-300">{txn.title}</td>
                  <td className="p-2 border border-gray-300">
                    {getAmountDisplay(txn)}
                  </td>
                  <td className="p-2 border border-gray-300">
                    {format(
                      new Date(txn?.incomeDate || txn?.expenseDate),
                      "dd MMM yyyy"
                    )}
                  </td>
                  <td className="p-2 border border-gray-300">
                    {txn.category?.category_name}
                  </td>
                  <td className="p-2 border border-gray-300">{txn.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination or summary if needed */}
          <div className="text-xs text-right text-gray-500 mt-2">
            Showing {reportData.transaction.length} transactions
          </div>
        </section>
      )}

      {/* Budget vs Actual */}
      {fields.budget && reportData.budgetVsActual?.length > 0 && (
        <section>
          <h2 className="font-semibold mt-4">Budget vs Actual</h2>
          <table className="w-full text-left border border-gray-300 text-xs">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-1 border">Category</th>
                <th className="p-1 border">Budgeted</th>
                <th className="p-1 border">Spent</th>
                <th className="p-1 border">Remaining</th>
              </tr>
            </thead>
            <tbody>
              {reportData.budgetVsActual.map((b, idx) => (
                <tr key={idx}>
                  <td className="p-1 border">{b.category_name}</td>
                  <td className="p-1 border">₹{b.budgeted}</td>
                  <td className="p-1 border">₹{b.spent}</td>
                  <td className="p-1 border">₹{b.remaining}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {/* Monthly Budget Data */}
      {fields.budget && reportData.budgetData && (
        <ResponsiveContainer width="100%" height={450}>
          <BarChart data={reportData?.budgetVsActualData}>
            <XAxis
              dataKey="category_name"
              angle={-90}
              textAnchor="end"
              interval={0}
              height={estimatedHeight}
            />
            <YAxis />
            <Tooltip />
            <Legend align="end" verticalAlign="top" />
            <Bar dataKey="budgeted" fill="#8884d8" name="Budgeted" />
            <Bar dataKey="spent" fill="#82ca9d" name="Spent" />
          </BarChart>
        </ResponsiveContainer>
      )}

      {/* Footer */}
      {fields.footer && (
        <div className="absolute bottom-4 left-0 right-0 px-8 text-xs text-gray-500 italic flex justify-between">
          <span>Generated on: {new Date().toLocaleDateString()}</span>
          <span>Page 1 of 1</span>
        </div>
      )}
    </div>
  );
};
