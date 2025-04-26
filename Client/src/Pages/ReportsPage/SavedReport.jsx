import { useState, useEffect } from "react";
import { format } from "date-fns";
import axios from "axios";
import { toast } from "react-toastify";

const SavedReport = () => {
  const token = localStorage.getItem("Token");
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSavedReports = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/saved-report", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setReports(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load saved reports");
      setLoading(false);
      console.error("Error fetching saved reports:", err);
    }
  };
  useEffect(() => {
    fetchSavedReports();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return format(new Date(dateString), "dd MMM yyyy");
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const handleViewReport = (reportId) => {
    window.location.href = `/reports/detail/${reportId}`;
  };

  const deleteReport = async (id) => {
    try {
      await axios.delete(`/delete-report-by-id/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      toast.success('Report Deleted',);
      fetchSavedReports();
    } catch {
      toast.error('Internal Server Error');
    }
  };

  if (loading)
    return <div className="text-center py-10">Loading saved reports...</div>;
  if (error)
    return <div className="text-red-500 text-center py-10">{error}</div>;
  if (reports.length === 0)
    return <div className="text-center py-10">No saved reports found.</div>;

  return (
    <div className="overflow-x-auto w-full max-w-7xl mx-auto mt-4">
      <div className="my-4 mx-2" >
        <label className="text-gray-800 text-xl">Saved Report</label>
      </div>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-3 px-4 text-left font-medium text-gray-600">
              Date Range
            </th>
            <th className="py-3 px-4 text-left font-medium text-gray-600">
              Created At
            </th>
            <th className="py-3 px-4 text-left font-medium text-gray-600">
              Type
            </th>
            <th className="py-3 px-4 text-left font-medium text-gray-600">
              Expenses
            </th>
            <th className="py-3 px-4 text-left font-medium text-gray-600">
              Income
            </th>
            <th className="py-3 px-4 text-left font-medium text-gray-600">
              Balance
            </th>
            <th className="py-3 px-4 text-left font-medium text-gray-600">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => (
            <tr
              key={report._id}
              className="border-t border-gray-200 hover:bg-gray-50"
            >
              <td className="py-3 px-4">
                {formatDate(report.startDate)} - {formatDate(report.endDate)}
              </td>
              <td className="py-3 px-4">{formatDate(report.createdAt)}</td>
              <td className="py-3 px-4 capitalize">{report.type}</td>
              <td className="py-3 px-4 text-red-600">
                {formatCurrency(report.totalExpense)}
              </td>
              <td className="py-3 px-4 text-green-600">
                {formatCurrency(report.totalIncome)}
              </td>
              <td
                className="py-3 px-4"
                style={{ color: report.balance >= 0 ? "green" : "red" }}
              >
                {formatCurrency(report.balance)}
              </td>
              <td className="py-3 px-4">
                <div className="space-x-1.5">
                  <button
                    onClick={() => handleViewReport(report._id)}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-sm"
                  >
                    View
                  </button>
                  <button
                    onClick={() => deleteReport(report._id)}
                    className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded text-sm"
                  >
                    Delete
                  </button>
                </  div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SavedReport;
