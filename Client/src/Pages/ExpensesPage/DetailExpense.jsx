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

const DetailExpense = () => {
  const token = localStorage.getItem("Token");
  const { id } = useParams();
  const [expenseData, setExpenseData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null); // Added the missing dropdownRef
  const { user } = useContext(AuthContext);
  const [sidebar, setSidebar] = useState(false);

  useEffect(() => {
    const getExpenseDetails = async () => {
      try {
        if (id) {
          setIsLoading(true);
          const res = await axios.get(`/expense-details/${id}`);
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
      await axios.delete(`/delete-expense/${id}`);
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

  console.log(PDFData)

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
        <ToastContainer position="top-right" autoClose={3000} />
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
                <button
                  className="flex items-center gap-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
                  onClick={() => EditExpense()}
                >
                  <Edit className="h-4 w-4" />
                  <span className="hidden sm:inline">Edit</span>
                </button>

                <button className="flex items-center gap-1 px-3 py-2 bg-purple-50 text-purple-600 rounded-md hover:bg-purple-100 transition-colors">
                  <Share2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Share</span>
                </button>

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
                          <button className="w-full flex items-center gap-2 rounded-md text-left px-3 py-2 text-gray-700 hover:bg-gray-50 transition-colors">
                            <Eye className="h-4 w-4 text-gray-500" />
                            <span>Preview</span>
                          </button>
                        </li>
                        <li className="px-1">
                          <button
                            className="w-full flex items-center gap-2 rounded-md text-left px-3 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                            // onClick={() => ExportAsPDF()}
                            onClick={() => setSidebar(true)}
                          >
                            <Download className="h-4 w-4 text-gray-500" />
                            <span>Download PDF</span>
                          </button>
                        </li>
                        <li className="px-1">
                          <button className="w-full flex items-center gap-2 rounded-md text-left px-3 py-2 text-gray-700 hover:bg-gray-50 transition-colors">
                            <FileSpreadsheet className="h-4 w-4 text-gray-500" />
                            <span>Export to Excel</span>
                          </button>
                        </li>
                        <li className="border-t border-gray-100 my-1"></li>
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
                            currency: "USD",
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

      <div
        className={`w-full transition-all duration-500 ease-in-out
            fixed inset-0 z-50 flex items-center justify-center
            bg-black bg-opacity-10
            ${sidebar ? "opacity-100 visible" : "opacity-0 invisible"}`}
      >
        <div
          className={`w-full bg-white rounded-md shadow-lg border border-gray-200
              p-6 w-full max-w-5xl h-[90vh] 
              transform transition-transform duration-500 flex
              ${sidebar ? "scale-100" : "scale-95"}`}
        >
          {/* Left Side - Options */}
          <div className="w-96 pr-6 border-r border-gray-200 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Export PDF</h2>
              <button
                onClick={() => setSidebar(false)}
                className="text-gray-500 hover:text-gray-800"
              >
                ✕
              </button>
            </div>

            {/* Field Selection */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-md font-medium">Fields to Include</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => toggleAllFields(true)}
                    className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    <Eye size={14} className="mr-1" /> Select All
                  </button>
                  <button
                    onClick={() => toggleAllFields(false)}
                    className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    <EyeOff size={14} className="mr-1" /> Deselect All
                  </button>
                </div>
              </div>

              <div className="space-y-2 mt-3">
                {Object.entries(fields).map(([key, value]) => (
                  <div key={key} className="flex items-center">
                    <input
                      type="checkbox"
                      id={key}
                      checked={value}
                      onChange={() => handleFieldToggle(key)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label
                      htmlFor={key}
                      className="ml-2 block text-sm text-gray-700"
                    >
                      {key
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase())}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Export Options */}
          

            {/* Action Buttons */}
            <div className="flex space-x-4 mt-8">
              <button
                onClick={() => setSidebar(false)}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center justify-center" onClick={()=>ExportAsPDF()}>
                <Download size={16} className="mr-2" /> Export PDF
              </button>
            </div>
          </div>

          {/* Right Side - PDF Preview */}
          <div className="w-3/4 pl-6 overflow-y-auto">
            <h3 className="text-md font-medium mb-4">Preview</h3>
            <div className="relative bg-white border border-gray-300 rounded-lg shadow-lg pt-4 pb-12 px-8 min-h-[75vh]">
              {/* PDF Header */}
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-blue-800 underline">
                  Expense Receipt
                </h1>
              </div>

              {/* User Details Section */}
              {fields.userDetails && (
                <div className="mb-8">
                  <table className="w-full mb-6">
                    <tbody>
                      <tr className="bg-gray-100">
                        <td className="py-2 px-3 w-1/4 text-sm font-semibold text-gray-600">
                          Name
                        </td>
                        <td className="py-2 px-3 text-sm">{`${PDFData.userData.firstName} ${PDFData.userData.lastName}`}</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 w-1/4 text-sm font-semibold text-gray-600">
                          Email
                        </td>
                        <td className="py-2 px-3 text-sm">
                          {PDFData.userData.email}
                        </td>
                      </tr>
                      <tr className="bg-gray-100">
                        <td className="py-2 px-3 w-1/4 text-sm font-semibold text-gray-600">
                          Phone
                        </td>
                        <td className="py-2 px-3 text-sm">
                          {PDFData.userData.phone}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {/* Expense Details Section */}
              {fields.expenseDetails && (
                <div className="mb-6">
                  <table className="w-full mb-4">
                    <tbody>
                      <tr className="bg-gray-100">
                        <td className="py-2 px-3 w-1/2 text-sm font-semibold text-gray-600">
                          Title
                        </td>
                        <td className="py-2 px-3 text-sm">
                          {PDFData.expenseData.title}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 w-1/2 text-sm font-semibold text-gray-600">
                          Date
                        </td>
                        <td className="py-2 px-3 text-sm">
                          {new Date(
                            PDFData.expenseData.expenseDate
                          ).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {/* Expense Summary Section */}
              {fields.expenseSummary && (
                <div className="mb-6">
                  <table className="w-full border-collapse border border-gray-300 mb-6">
                    <tbody>
                      <tr>
                        <td className="py-2 px-3 border border-gray-300 bg-blue-50 w-1/2 text-sm font-semibold text-blue-800">
                          Amount
                        </td>
                        <td className="py-2 px-3 border border-gray-300 text-lg font-bold text-green-600">
                          ${PDFData.expenseData.amount.toFixed(2)}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 border border-gray-300 bg-blue-50 text-sm font-semibold text-blue-800">
                          Category
                        </td>
                        <td className="py-2 px-3 border border-gray-300 text-sm">
                          {PDFData.expenseData.category}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 border border-gray-300 bg-blue-50 text-sm font-semibold text-blue-800">
                          Payment Method
                        </td>
                        <td className="py-2 px-3 border border-gray-300 text-sm">
                          {PDFData.expenseData.paymentThrough}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 border border-gray-300 bg-blue-50 text-sm font-semibold text-blue-800">
                          Vendor
                        </td>
                        <td className="py-2 px-3 border border-gray-300 text-sm">
                          {PDFData.expenseData.vendor}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {/* Description Section */}
              {fields.description && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">
                    Description
                  </h3>
                  <p className="text-sm text-gray-600">
                    {PDFData.expenseData.description}
                  </p>
                </div>
              )}

              {/* Receipt Image */}
              {fields.receipt && (
                <div className="mb-6 flex justify-center">
                  <img
                    src={PDFData.expenseData.receipt}
                    alt="Receipt"
                    className="border border-gray-300 p-1"
                  />
                </div>
              )}

              {/* Footer */}
              {fields.footer && (
                <div className="absolute bottom-4 left-0 right-0 px-8 text-xs text-gray-500 italic flex justify-between">
                  <span>Generated on: {new Date().toLocaleDateString()}</span>
                  <span>Page 1 of 1</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailExpense;
