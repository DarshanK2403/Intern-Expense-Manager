import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import PDFExportModal from "../../Components/Export/PDFExportModal";
import { renderIncomePreview } from "../../Components/Export/renderIncomePreview";
import {
  ArrowLeft,
  Calendar,
  Download,
  Edit,
  FileText,
  MoreVertical,
  Receipt,
  Tag,
  Trash2,
  Wallet,
} from "lucide-react";
import { format } from "date-fns";
import { AuthContext } from "../../context/AuthContext";
const DetailIncome = () => {
  const { id } = useParams();
  const token = localStorage.getItem("Token");
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [incomeData, setIncomeData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [sidebar, setSidebar] = useState(false);
  const { user } = useContext(AuthContext);

  const [fields, setFields] = useState({
    userDetails: true,
    incomeDetails: true,
    incomeSummary: true,
    receipt: true,
    footer: true,
  });
  useEffect(() => {
    const getIncomeeDetails = async () => {
      try {
        if (id) {
          setIsLoading(true);
          const res = await axios.get(`/income-details/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setIncomeData(res.data);
          console.log(res.data);
        }
      } catch (error) {
        toast.error("Failed to load expense details");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      getIncomeeDetails();
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

  const deleteIncome = async () => {
    try {
      await axios.delete(`/delete-income/${id}`);
      toast.success("Income deleted successfully");
      navigate(-1);
    } catch (error) {
      toast.error("Failed to delete expense");
      console.error(error);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

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

  const PDFData = {
    fields,
    userData: {
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.email,
      phone: user?.phone,
    },
    incomeData: {
      title: incomeData?.title || "-",
      category: incomeData?.category?.category_name || "-",
      paymentThrough: incomeData?.paymentThrough?.label || "-",
      amount: incomeData?.amount || "-",
      incomeDate: incomeData?.incomeDate || "-",
      receipt: incomeData?.receipt?.cloudinaryUrl || "-",
      notes: incomeData?.notes,
    },
  };

  const ExportAsPDF = async () => {
    try {
      const response = await axios.post(`/pdf/income`, PDFData, {
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

  const EditIncome = () => {
    navigate(`/income/edit-income/${id}`);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 flex justify-center">
        <div className="animate-pulse text-gray-500">
          Loading income details...
        </div>
      </div>
    );
  }
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
                    {incomeData?.title || "Income Detail"}
                  </h1>
                  <p className="text-sm text-gray-500">
                    Created on{" "}
                    {/* {format(
                      new Date(incomeData?.createdAt),
                      "dd MMM yyyy, hh:mm a"
                    ) || "-"} */}
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
                            onClick={() => EditIncome()}
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
                            onClick={() => deleteIncome()}
                            className="w-full flex items-center gap-2 rounded-md text-left px-3 py-2 text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span>Delete Income</span>
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
                  {incomeData?.receipt ? (
                    <img
                      src={incomeData?.receipt?.cloudinaryUrl}
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

            {/* Right Side - Income Details */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-6">
                  Income Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  {/* Amount - Highlight Box */}
                  <div className="md:col-span-2 bg-blue-50 rounded-lg p-4 mb-2">
                    <p className="text-sm font-medium text-blue-600 mb-1">
                      Amount
                    </p>
                    <p className="text-2xl font-bold text-blue-700">
                      {typeof incomeData?.amount === "number"
                        ? new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "INR",
                          }).format(incomeData?.amount)
                        : incomeData?.amount || "0.00"}
                    </p>
                  </div>

                  {/* Title */}
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1 flex items-center gap-1">
                      <Tag className="h-4 w-4" />
                      Title
                    </p>
                    <p className="text-gray-900 font-medium">
                      {incomeData?.title || "-"}
                    </p>
                  </div>

                  {/* Category */}
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1 flex items-center gap-1">
                      <Tag className="h-4 w-4" />
                      Category
                    </p>
                    <p className="text-gray-900">
                      {incomeData?.category?.category_name || "-"}
                    </p>
                  </div>

                  {/* Income Date */}
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1 flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Income Date
                    </p>
                    <p className="text-gray-900">
                      {format(
                        new Date(incomeData?.incomeDate),
                        "dd MMM yyyy"
                      ) || "-"}
                    </p>
                  </div>

                  {/* Vendor */}
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1 flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      Note
                    </p>
                    <p className="text-gray-900">{incomeData?.notes || "-"}</p>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1 flex items-center gap-1">
                      <Wallet className="h-4 w-4" />
                      Payment Through
                    </p>
                    <p className="text-gray-900">
                      {incomeData?.paymentThrough?.label || "-"}
                    </p>
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
        renderPreview={renderIncomePreview}
      />
    </div>
  );
};

export default DetailIncome;
