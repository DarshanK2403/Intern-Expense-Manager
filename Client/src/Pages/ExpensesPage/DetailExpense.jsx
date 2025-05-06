/* eslint-disable no-unused-vars */
import axios from "axios";
import { format } from "date-fns";
import {
  ArrowLeft,
  Calendar,
  Download,
  Edit,
  Eye,
  EyeOff,
  FileSpreadsheet,
  FileText,
  MoreVertical,
  Receipt,
  Share2,
  Tag,
  Trash2,
  User,
  Wallet,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import PDFExportModal from "../../Components/Export/PDFExportModal";
import { renderExpensePreview } from "../../Components/Export/renderExpensePreview";

const DetailExpense = () => {
  const token = localStorage.getItem("Token");
  const { id } = useParams();
  const [expenseData, setExpenseData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const { user } = useContext(AuthContext);
  const [sidebar, setSidebar] = useState(false);

  useEffect(() => {
    const getExpenseDetails = async () => {
      try {
        if (id) {
          setIsLoading(true);
          const res = await axios.get(`/expense-details/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setExpenseData(res.data);
          // console.log(res.data);
        }
      } catch (error) {
        toast.error("Failed to load expense details");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      getExpenseDetails();
    }
  }, [id]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleGoBack = () => {
    navigate(-1);
  };

  const deleteExpense = async () => {
    try {
      await axios.delete(`/delete-expense/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Expense deleted successfully");
      navigate(-1);
    } catch (error) {
      toast.error("Failed to delete expense");
      console.error(error);
    }
  };

  const [fields, setFields] = useState({
    userDetails: true,
    expenseDetails: true,
    expenseSummary: true,
    description: true,
    receipt: true,
    footer: true,
  });

  const handleFieldToggle = (field) => {
    setFields((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const toggleAllFields = (value) => {
    const updatedFields = {};
    Object.keys(fields).forEach((key) => {
      updatedFields[key] = value;
    });
    setFields(updatedFields);
  };

  // Show a loading state while fetching data
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 flex justify-center">
        <div className="animate-pulse text-gray-500">
          Loading expense details...
        </div>
      </div>
    );
  }

  const PDFData = {
    fields,
    userData: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
    },
    expenseData: {
      title: expenseData.title || "-",
      category: expenseData.category?.category_name || "-",
      paymentThrough: expenseData.paymentThrough?.label || "-",
      amount: expenseData.amount || "-",
      vendor: expenseData.vendor || "-",
      expenseDate: expenseData.expenseDate || "-",
      description: expenseData.description || "-",
      receipt: expenseData.receipt?.cloudinaryUrl || "-",
    },
  };

  const ExportAsPDF = async () => {
    try {
      const response = await axios.post(`/pdf/expense`, PDFData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob", // ✅ Important: tell Axios you expect PDF (binary)
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      document.body.appendChild(a);
      a.download = `expense-report.pdf`;
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const EditExpense = () => {
    navigate(`/expenses/edit-expense/${id}`);
  };

  return (
    <div className="flex h-full">
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <ToastContainer autoClose={1500} />
        <div>
          {/* Header Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              {/* Back button and Title */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleGoBack}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Go back"
                >
                  <ArrowLeft className="h-5 w-5 text-gray-600" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    {expenseData.title || "Expense Detail"}
                  </h1>
                  <p className="text-sm text-gray-500">
                    Created on{" "}
                    {format(
                      new Date(expenseData.createdAt),
                      "dd MMM yyyy, hh:mm a"
                    ) || "-"}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {/* More Options Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 rounded-md hover:bg-gray-100 transition-colors"
                    aria-label="More options"
                  >
                    <MoreVertical className="h-5 w-5 text-gray-600" />
                  </button>

                  {isOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                      <ul className="py-1">
                        <li className="px-1">
                          <button
                            className="w-full flex items-center gap-2 rounded-md text-left px-3 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => EditExpense()}
                          >
                            <Edit className="h-4 w-4 text-gray-500" />
                            <span>Edit</span>
                          </button>
                        </li>

                        <li className="px-1">
                          <button
                            className="w-full flex items-center gap-2 rounded-md text-left px-3 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => setSidebar(true)}
                          >
                            <Download className="h-4 w-4 text-gray-500" />
                            <span>Download PDF</span>
                          </button>
                        </li>
                        <li className="px-1">
                          <button
                            onClick={() => deleteExpense()}
                            className="w-full flex items-center gap-2 rounded-md text-left px-3 py-2 text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span>Delete Expense</span>
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Side - Receipt Image */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-lg shadow-md p-6 h-full">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Receipt className="h-5 w-5 text-gray-600" />
                  Receipt
                </h2>

                <div className="border border-dashed rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center h-80 lg:h-96">
                  {expenseData.receipt ? (
                    <img
                      src={expenseData.receipt?.cloudinaryUrl}
                      alt="Receipt"
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : (
                    <div className="text-gray-400 text-center p-6">
                      <Receipt className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No receipt available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Side - Expense Details */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-6">
                  Expense Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  {/* Amount - Highlight Box */}
                  <div className="md:col-span-2 bg-blue-50 rounded-lg p-4 mb-2">
                    <p className="text-sm font-medium text-blue-600 mb-1">
                      Amount
                    </p>
                    <p className="text-2xl font-bold text-blue-700">
                      {typeof expenseData.amount === "number"
                        ? new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "INR",
                          }).format(expenseData.amount)
                        : expenseData.amount || "0.00"}
                    </p>
                  </div>

                  {/* Title */}
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1 flex items-center gap-1">
                      <Tag className="h-4 w-4" />
                      Title
                    </p>
                    <p className="text-gray-900 font-medium">
                      {expenseData.title || "-"}
                    </p>
                  </div>

                  {/* Category */}
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1 flex items-center gap-1">
                      <Tag className="h-4 w-4" />
                      Category
                    </p>
                    <p className="text-gray-900">
                      {expenseData.category?.category_name || "-"}
                    </p>
                  </div>

                  {/* Expense Date */}
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1 flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Expense Date
                    </p>
                    <p className="text-gray-900">
                      {format(
                        new Date(expenseData.expenseDate),
                        "dd MMM yyyy"
                      ) || "-"}
                    </p>
                  </div>

                  {/* Vendor */}
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1 flex items-center gap-1">
                      <User className="h-4 w-4" />
                      Vendor
                    </p>
                    <p className="text-gray-900">{expenseData.vendor || "-"}</p>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1 flex items-center gap-1">
                      <Wallet className="h-4 w-4" />
                      Payment Through
                    </p>
                    <p className="text-gray-900">
                      {expenseData.paymentThrough?.label || "-"}
                    </p>
                  </div>

                  {/* Description - Full Width */}
                  <div className="md:col-span-2 mt-2">
                    <p className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-1">
                      Description
                    </p>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-800 whitespace-pre-line">
                        {expenseData.description || (
                          <span className="text-gray-600">
                            No description provided.
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PDFExportModal
        type="expense"
        visible={sidebar}
        onClose={() => setSidebar(false)}
        fields={fields}
        handleFieldToggle={handleFieldToggle}
        toggleAllFields={toggleAllFields}
        onExportPDF={ExportAsPDF}
        PDFData={PDFData}
        renderPreview={renderExpensePreview}
      />
    </div>
  );
};

export default DetailExpense;
