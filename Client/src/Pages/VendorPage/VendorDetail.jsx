import { useCallback, useEffect, useState } from "react";
import {
  ChevronLeft,
  Edit,
  Trash2,
  Phone,
  Mail,
  Tag,
  FileText,
  Download,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const VendorDetail = () => {
  const token = localStorage.getItem("Token");
  const { id } = useParams();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState({});
  const [expenses, setExpenses] = useState([]);

  const detailVendor = useCallback(async () => {
    try {
      const res = await axios.get(`/get-vendor-by-id/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setVendor(res.data);
      console.log(res.data);
    } catch {
      toast.error("Something went wrong!");
    }
  }, [token, id]);

  useEffect(() => {
    if (token) {
      detailVendor();
    }
  }, [token, detailVendor]);

  const VendorExpense = useCallback(async () => {
    try {
      const res = await axios.get(`/vendor-expense/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res.data.expenses);
      setExpenses(res.data.expenses);
    } catch {
      toast.error("Something went wrong!");
    }
  }, [token, id]);

  useEffect(() => {
    if (token) {
      VendorExpense();
    }
  }, [token, VendorExpense]);

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <ToastContainer autoClose={1500} />
      <div className="max-w-6xl mx-auto">
        {/* Back button and Actions */}
        <div className="flex justify-between items-center mb-6">
          <button className="flex items-center text-blue-600 hover:text-blue-800">
            <ChevronLeft size={20} />
            <span className="ml-1">Back to Vendors</span>
          </button>

          <div className="space-x-2">
            <button
              className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md bg-white hover:bg-gray-50"
              onClick={() => navigate(`/vendor/edit/${id}`)}
            >
              <Edit size={16} className="mr-2" />
              Edit
            </button>
            <button className="inline-flex items-center px-3 py-2 border border-red-300 text-sm font-medium rounded-md text-red-600 bg-white hover:bg-red-50">
              <Trash2 size={16} className="mr-2" />
              Delete
            </button>
          </div>
        </div>

        {/* Vendor Details Card */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Vendor Details
            </h3>
          </div>

          <div className="px-6 py-5">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {vendor?.name}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
              <div className="flex items-start">
                <Mail className="w-5 h-5 text-gray-500 mt-1 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-gray-900">{vendor?.email}</p>
                </div>
              </div>

              <div className="flex items-start">
                <Phone className="w-5 h-5 text-gray-500 mt-1 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Phone</p>
                  <p className="text-gray-900">{vendor?.phone}</p>
                </div>
              </div>

              <div className="flex items-start">
                <Tag className="w-5 h-5 text-gray-500 mt-1 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Category</p>
                  <p className="text-gray-900">
                    {vendor.category?.category_name}
                  </p>
                </div>
              </div>

              {vendor?.notes && (
                <div className="flex items-start md:col-span-2">
                  <FileText className="w-5 h-5 text-gray-500 mt-1 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Notes</p>
                    <p className="text-gray-900">{vendor?.notes ?? "-"}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Vendor Expenses Table */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Expense History
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Description
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Amount
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {expenses.length > 0 ? (
                  expenses.map((expense) => (
                    <tr key={expense?.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(expense?.expenseDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {expense?.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Intl.NumberFormat("en-IN", {
                          style: "currency",
                          currency: "INR",
                          minimumFractionDigits: 2,
                        }).format(expense?.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3" onClick={()=>navigate(`/expenses/expense-detail/${expense._id}`)}>
                          View
                        </button>
                        <button className="text-gray-600 hover:text-gray-900" onClick={()=>navigate(`/expenses/edit-expense/${expense._id}`)}>
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <div>{expenses._id}</div>
                )}
              </tbody>
            </table>
          </div>

          {expenses.length === 0 && (
            <div className="px-6 py-4 text-center text-gray-500">
              No expense records found for this vendor.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorDetail;
