import axios from "axios";
import { format } from "date-fns";
import { ArrowLeft, FileText, IndianRupee } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SpinnerLoader from "../../Components/Loader/SpinnerLoader";

const RecentTransactios = () => {
  const [loading, setLoading] = useState(false);
  const [recentTransaction, setRecentTransaction] = useState([]);
  const token = localStorage.getItem("Token");
  const navigate = useNavigate();

  const formatDate = (date) => {
    return format(new Date(date), "MMM dd, yyyy");
  };

  const getRecentTransactions = async (token) => {
    setLoading(true);
    try {
      const res = await axios.get(`/recent-transactions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRecentTransaction(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const TransactionType = (transaction) => {
    return transaction.expenseDate ? "Expense" : "Income";
  };

  useEffect(() => {
    if (token) {
      getRecentTransactions(token);
    }
  }, [token]);

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="bg-white p-6 shadow rounded-lg m-5">
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={handleGoBack}
          className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5 text-blue-600" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Recent Transaction</h1>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <SpinnerLoader size="large" color="blue" />
        </div>
      ) : recentTransaction.length > 0 ? (
        <table className="w-full rounded-sm overflow-hidden">
          <thead className="border border-blue-400">
            <tr className="bg-blue-700 text-white">
              <th className="px-2 py-3 text-start">Transaction Date</th>
              <th className="px-2 py-3 text-start">Title</th>
              <th className="px-2 py-3 text-end">Amount</th>
              <th className="px-2 py-3 text-end">Category</th>
              <th className="px-2 py-3 text-end">Vendor/Notes</th>
            </tr>
          </thead>
          <tbody>
            {recentTransaction.map((transaction) => {
              const isExpense = TransactionType(transaction) === "Expense";
              const date = isExpense
                ? transaction.expenseDate
                : transaction.incomeDate;

              return (
                <tr
                  key={transaction._id}
                  className={`transition-colors duration-150 hover:cursor-pointer bg-gray-50 border border-gray-300`}
                >
                  <td className="px-4 py-3 text-left text-gray-700">
                    {formatDate(date)}
                  </td>
                  <td className="px-4 py-3">
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
                      <IndianRupee className="h-4 w-4" />
                      {transaction?.amount ?? 0}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right text-gray-700">
                    {transaction?.category?.category_name}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-700">
                    {transaction?.vendor ? (
                      <div className="flex items-center justify-end">
                        <span className="truncate max-w-xs">
                          {transaction?.vendor?.name}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end">
                        <span className="truncate max-w-xs">
                          {transaction?.notes}
                        </span>
                      </div>
                    )}
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
            You haven&#39;t recorded any transactions. Start by adding an income
            or expense.
          </p>
        </div>
      )}
    </div>
  );
};

export default RecentTransactios;
