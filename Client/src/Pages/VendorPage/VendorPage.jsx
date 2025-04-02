/* eslint-disable no-unused-vars */
import axios from "axios";
import { Edit, FileText, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const VendorPage = () => {
  const [vendorData, setVendorData] = useState([]);
  const userId = localStorage.getItem("id");
  const navigate = useNavigate();

  // Fetch Vendor Data
  const getVendor = useCallback(async () => {
    if (!userId) return;

    try {
      const res = await axios.get(`/get-vendor/${userId}`);
      setVendorData(res.data);
    } catch (error) {
      toast.error("Failed to fetch vendor data");
    }
  }, [userId]);

  useEffect(() => {
    getVendor();
  }, [getVendor]);

  // Delete Vendor
  const deleteVendor = async (id) => {
    try {
      await axios.delete(`/delete-vendor/${id}`);
      toast.success("Vendor Deleted");

      // Update state after deletion
      getVendor();
    } catch (error) {
      toast.error("Failed to delete vendor");
    }
  };

  return (
    <div>
      <ToastContainer></ToastContainer>
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow overflow-hidden">
        {vendorData.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-blue-600 text-white">
              <tr>
                  <th className="p-4 text-left font-medium">
                  Name
                </th>
                  <th className="p-4 text-left font-medium">
                  Email
                </th>
                  <th className="p-4 text-left font-medium">
                  Phone
                </th>
                  <th className="p-4 text-left font-medium">
                  Category
                </th>
                  <th className="p-4 text-left font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {vendorData.map((entry, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">
                      {entry.name}
                    </div>
                    {entry.notes && (
                      <div className="text-sm text-gray-500">
                        {entry.notes.length > 40
                          ? `${entry.notes.substring(0, 40)}...`
                          : entry.notes}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{entry.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{entry.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {entry.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                      <button className="text-gray-600 hover:text-indigo-600" onClick={() => navigate(`/vendor/edit/${entry._id}`)}>
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        className="text-gray-600 hover:text-red-600"
                        onClick={() => deleteVendor(entry._id)}
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-lg shadow-sm">
            <FileText className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              No Income Yet
            </h3>
            <p className="text-gray-500 text-center max-w-md">
              You haven&#39;t recorded any income transactions. Start by adding
              an income.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorPage;
