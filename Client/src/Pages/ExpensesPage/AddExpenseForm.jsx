/* eslint-disable no-unused-vars */
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  AiOutlineUpload,
  AiOutlineDelete,
  AiOutlineCalendar,
  AiOutlineBank,
} from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import Input from "../../Components/Input";
import Subnav from "../../Components/Subnav";
import SelectInput from "../../Components/Select";
import { toast } from "react-toastify";

const AddExpenseForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm();

  const userId = localStorage.getItem("id");
  const receipt = watch("receipt");
  const [filePreview, setFilePreview] = useState(null);
  const [fileType, setFileType] = useState(null);
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expenseCategories, setexpenseCategories] = useState();

  // Handle File Change
  const handleFileChange = (event) => {
    const file = event.target.files[0] || null;
    if (!file) return;

    setIsUploading(true);

    const fileURL = URL.createObjectURL(file);
    setFilePreview(fileURL);

    if (file.type.startsWith("image/")) {
      setFileType("image");
    } else if (file.type === "application/pdf") {
      setFileType("pdf");
    } else {
      setFileType("other");
    }

    setValue("receiptFile", file); // Store file for form submission
    setIsUploading(false);
  };

  // Remove uploaded file
  const handleRemoveFile = () => {
    setFilePreview(null);
    setFileType(null);
    setValue("receiptFile", null);
  };

  // Handle Form Submit
  const onSubmit = async (data) => {
    // Ensure file is selected
    if (data.receiptFile && !(data.receiptFile instanceof File)) {
      console.error("Invalid file format");
      return;
    }

    // Create FormData
    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("title", data.title);
    formData.append("amount", data.amount);
    formData.append("description", data.description);
    formData.append("expenseDate", data.expenseDate);
    formData.append("category", data.category);
    formData.append("account", data.account);
    formData.append("paymentMethod", data.paymentMethod);
    formData.append("vendor", data.vendor);

    // ✅ Ensure file exists before appending
    if (data.receiptFile instanceof File) {
      formData.append("receipt", data.receiptFile);
      formData.append("fileOriginalName", data.receiptFile.name);
      formData.append("fileType", data.receiptFile.type);
    }

    try {
      setLoading(true);
      const res = await axios.post("/add-expense", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // ✅ Check if file upload was successful
      if (res.data.file) {
        const { cloudinaryUrl, originalName, uniqueName, fileType } =
          res.data.file;
        console.log("Uploaded file details:", {
          cloudinaryUrl,
          originalName,
          uniqueName,
          fileType,
        });
      }

      console.log("Form Data Sent:", res.data);
      navigate("/expenses");
      setLoading(false);
    } catch (error) {
      console.error(
        "Error uploading expense:",
        error.response?.data || error.message
      );
      setLoading(false);
    }
  };

  const closeForm = () => {
    navigate(-1);
  };
  const saveandclose = () => {};
  const saveandnew = () => {};

  useEffect(() => {
    const fetchExpenseCategories = async () => {
      const userId = localStorage.getItem("id");
      try {
        const res = await axios.get(`/get-expense-category/${userId}`);
        const categories = res.data.data;

        if (categories.length > 0) {
          setexpenseCategories(categories.map((cat) => cat.category_name));
        }
      } catch (error) {
        toast.error("Internal Server Error");
      }
    };

    fetchExpenseCategories();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-2 sm:py-4">
      <div className="bg-white rounded-lg shadow-md p-3 sm:p-6 border border-gray-100">
        <div className="text-lg sm:text-xl font-semibold text-gray-800 pb-2 border-b border-gray-100">
          Add Expense
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="pt-4 sm:pt-5">
          <div className="grid grid-cols-1 gap-4 sm:gap-6">
            {/* Receipt Upload - Full width on mobile, side by side on larger screens */}
            <div className="lg:grid lg:grid-cols-5 lg:gap-6">
              {/* Left Column - Receipt Upload */}
              <div className="lg:col-span-2 mb-4 lg:mb-0">
                <div
                  className={`border ${
                    errors.receipt ? "border-red-300" : "border-gray-500"
                  } 
                border-dashed rounded-lg p-3 sm:p-4 h-60 sm:h-72 md:h-[95%] flex flex-col items-center justify-center bg-gray-50 transition-all duration-200 hover:bg-gray-100 shadow-sm`}
                >
                  {isUploading ? (
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-b-2 border-blue-600"></div>
                      <p className="text-sm text-gray-500">Uploading...</p>
                    </div>
                  ) : !filePreview ? (
                    <>
                      <AiOutlineUpload className="text-3xl sm:text-4xl text-gray-400 mb-2 sm:mb-3" />
                      <input
                        type="file"
                        className="hidden"
                        id="receipt"
                        accept="image/*, application/pdf"
                        {...register("receipt")}
                        onChange={handleFileChange}
                      />
                      <label
                        htmlFor="receipt"
                        className="cursor-pointer bg-blue-50 text-blue-600 font-medium text-sm hover:bg-blue-100 px-4 py-2 rounded-md transition-colors"
                      >
                        Upload Receipt
                      </label>
                      <p className="text-xs text-gray-500 mt-3 text-center">
                        Drag & drop or click to upload
                        <br />
                        (Images or PDF only)
                      </p>
                      {errors.receipt && (
                        <span className="text-red-500 text-xs mt-2 bg-red-50 px-2 py-1 rounded">
                          Please upload a receipt
                        </span>
                      )}
                    </>
                  ) : (
                    <div className="relative w-full h-full flex items-center justify-center">
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="absolute top-2 right-2 bg-red-50 text-red-500 p-1 rounded-full hover:bg-red-100 z-10 shadow-sm transition-colors"
                      >
                        <AiOutlineDelete className="text-lg" />
                      </button>
                      {fileType === "image" ? (
                        <img
                          src={filePreview}
                          alt="Uploaded receipt"
                          className="max-w-full max-h-full object-contain rounded-md shadow-sm"
                        />
                      ) : fileType === "pdf" ? (
                        <div className="w-full h-full">
                          <iframe
                            src={filePreview}
                            className="w-full h-full rounded-md shadow-sm"
                            title="Uploaded PDF"
                          ></iframe>
                        </div>
                      ) : (
                        <p className="text-gray-600 font-medium">
                          Unsupported file type
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
              {/* Right Column - Form Fields */}
              <div className="lg:col-span-3 space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {/* Title */}
                  <div>
                    <Input
                      id="title"
                      label="Title"
                      placeholder="Lunch with Client"
                      register={register}
                      error={errors.title?.message}
                      validation={{ required: "Title is required" }}
                    />
                  </div>

                  {/* Amount */}
                  <div>
                    <Input
                      id="amount"
                      label="Amount"
                      type="number"
                      step="0.01"
                      placeholder="50.00"
                      register={register}
                      error={errors.amount?.message}
                      validation={{ required: "Amount is required" }}
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Lunch expense for business meeting"
                    rows="2"
                    {...register("description")}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {/* Expense Date */}
                  <div>
                    <Input
                      id="expenseDate"
                      label="Expense Date"
                      type="date"
                      register={register}
                      icon={AiOutlineCalendar}
                      error={errors.expenseDate?.message}
                      validation={{ required: "Expense Date is required" }}
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <SelectInput
                      id="category"
                      label="Expense Category"
                      options={expenseCategories}
                      register={register}
                      errors={errors}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {/* Account */}
                  <div>
                    <label
                      htmlFor="account"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Account
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <AiOutlineBank className="text-gray-500" />
                      </div>
                      <select
                        id="account"
                        className={`w-full pl-10 pr-3 py-2 border ${
                          errors.account ? "border-red-300" : "border-gray-300"
                        } 
                              rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
                              appearance-none bg-white transition-colors`}
                        {...register("account", {
                          required: "Account is required",
                        })}
                      >
                        <option value="">Select Account</option>
                        <option value="Cash">Cash</option>
                        <option value="Bank">Bank</option>
                        <option value="UPI">UPI</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg
                          className="h-5 w-5 text-gray-400"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                    {errors.account && (
                      <span className="text-red-500 text-xs mt-1 block bg-red-50 px-2 py-1 rounded">
                        {errors.account.message}
                      </span>
                    )}
                  </div>

                  {/* Payment Method */}
                  <div>
                    <label
                      htmlFor="paymentMethod"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Payment Method
                    </label>
                    <div className="relative">
                      <select
                        id="paymentMethod"
                        className={`w-full px-3 py-2 border ${
                          errors.paymentMethod
                            ? "border-red-300"
                            : "border-gray-300"
                        } 
                              rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
                              appearance-none bg-white transition-colors`}
                        {...register("paymentMethod", {
                          required: "Payment method is required",
                        })}
                      >
                        <option value="">Select Payment Method</option>
                        <option value="creditCard">Credit Card</option>
                        <option value="debitCard">Debit Card</option>
                        <option value="wallet">Wallet</option>
                        <option value="cash">Cash</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg
                          className="h-5 w-5 text-gray-400"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                    {errors.paymentMethod && (
                      <span className="text-red-500 text-xs mt-1 block bg-red-50 px-2 py-1 rounded">
                        {errors.paymentMethod.message}
                      </span>
                    )}
                  </div>
                </div>

                {/* Vendor */}
                <div>
                  <Input
                    id="vendor"
                    label="Vendor"
                    type="text"
                    placeholder="Vendor Name"
                    register={register}
                  />
                </div>

                {/* Buttons */}
                <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <button
                    type="submit"
                    onClick={saveandnew}
                    name="saveAndNew"
                    className="w-full sm:flex-1 bg-blue-600 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-md font-medium text-sm hover:bg-blue-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <span className="animate-spin h-4 w-4 mr-2 border-b-2 border-white rounded-full"></span>
                        Adding...
                      </span>
                    ) : (
                      "Add & New"
                    )}
                  </button>
                  <button
                    type="submit"
                    onClick={saveandclose}
                    name="saveAndClose"
                    className="w-full sm:flex-1 bg-blue-50 text-blue-600 border border-blue-200 py-2 sm:py-3 px-4 sm:px-6 rounded-md font-medium text-sm hover:bg-blue-100 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm"
                  >
                    Add & Close
                  </button>
                  <button
                    onClick={closeForm}
                    type="button"
                    className="w-full sm:flex-1 bg-white text-gray-600 border border-gray-200 py-2 sm:py-3 px-4 sm:px-6 rounded-md font-medium text-sm hover:bg-gray-50 transition-all focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 shadow-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpenseForm;
