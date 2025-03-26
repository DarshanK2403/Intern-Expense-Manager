import { useState } from "react";
import { CalendarDays, BarChart3, FileText, Filter, TrendingUp } from "lucide-react";

const ReportPage = () => {
  const [reportType, setReportType] = useState("monthly");
  const [customRange, setCustomRange] = useState({ from: "", to: "" });
  const [data, setData] = useState([]);

  const reports = [
    { id: "weekly", label: "Weekly Report" },
    { id: "monthly", label: "Last Month Report" },
    { id: "six_month", label: "6 Month Report" },
    { id: "yearly", label: "Yearly Report" },
    { id: "custom", label: "Custom Report" },
  ];

  const fetchReport = () => {
    // Simulated API call based on reportType (In real scenario, fetch from backend)
    let filteredData = [];
    if (reportType === "weekly") {
      filteredData = [/* fetch weekly data */];
    } else if (reportType === "monthly") {
      filteredData = [/* fetch last month data */];
    } else if (reportType === "six_month") {
      filteredData = [/* fetch 6-month data */];
    } else if (reportType === "yearly") {
      filteredData = [/* fetch yearly data */];
    } else if (reportType === "custom") {
      filteredData = [/* fetch custom range data */];
    }
    setData(filteredData);
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="bg-white p-6 shadow-md rounded-lg">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" /> Reports
        </h2>

        <div className="mt-4 flex flex-wrap gap-2">
          {reports.map((report) => (
            <button
              key={report.id}
              className={`px-4 py-2 rounded-lg text-sm font-medium border ${
                reportType === report.id
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setReportType(report.id)}
            >
              {report.label}
            </button>
          ))}
        </div>

        {reportType === "custom" && (
          <div className="mt-4 flex items-center gap-4">
            <div className="flex items-center gap-2 border p-2 rounded-lg">
              <CalendarDays className="w-5 h-5 text-gray-500" />
              <input
                type="date"
                value={customRange.from}
                onChange={(e) => setCustomRange({ ...customRange, from: e.target.value })}
                className="outline-none"
              />
            </div>
            <div className="flex items-center gap-2 border p-2 rounded-lg">
              <CalendarDays className="w-5 h-5 text-gray-500" />
              <input
                type="date"
                value={customRange.to}
                onChange={(e) => setCustomRange({ ...customRange, to: e.target.value })}
                className="outline-none"
              />
            </div>
          </div>
        )}

        <button
          onClick={fetchReport}
          className="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg flex items-center gap-2"
        >
          <Filter className="w-5 h-5" /> Generate Report
        </button>
      </div>

      <div className="mt-6 bg-white p-6 shadow-md rounded-lg">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-600" /> Summary
        </h3>
        <p className="mt-2 text-gray-600">Total Expenses: $1200</p>
        <p className="text-gray-600">Top Category: Food & Beverages</p>
        <p className="text-gray-600">Highest Single Expense: $300</p>
      </div>

      <div className="mt-6 bg-white p-6 shadow-md rounded-lg">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" /> Expense Trends (Chart Placeholder)
        </h3>
        <div className="mt-4 h-40 bg-gray-100 flex items-center justify-center text-gray-500">
          Chart will be displayed here.
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
