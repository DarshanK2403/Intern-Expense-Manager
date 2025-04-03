import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  AiOutlineBank,
  AiOutlineCalendar,
  AiOutlineDelete,
  AiOutlineUpload,
} from "react-icons/ai";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Input from "../../Components/Input";
import SelectInput from "../../Components/Select";
import axios from "axios";

const EditExpense = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expenseCategories, setexpenseCategories] = useState();

  useEffect(() => {
    const getExpenseDetailbyId = async () => {
      try {
        const res = await axios.get(`/expense-details/${id}`);
        console.log(res.data);
        setValue("title", res.data.title);
        setValue("amount", res.data.amount);
        setValue("description", res.data.description);
        setValue("expenseDate", res.data.expenseDate.split("T")[0]);
        setValue("category", res.data.category);
        setValue("account", res.data.account);
        setValue("paymentMethod", res.data.paymentMethod);
        setValue("vendor", res.data.vendor);
        setValue("receipt", res.data.receipt);
        // setValue("receiptFile", res.data.data.receipt); // Set the receipt file for preview
        // setFilePreview(res.data.data.receipt); // Set the file preview URL
      } catch (error) {
        toast.error("Error fetching expense details:", error.message);
      }
    };

    getExpenseDetailbyId();
  }, []);

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

  const onSubmit = async (data) => {
    if (!id) {
      console.error("Error: Expense ID is missing");
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

    // Ensure file is valid before appending
    if (data.receiptFile && data.receiptFile instanceof File) {
      formData.append("receipt", data.receiptFile);
    }

    try {
      setLoading(true);
      const response = await axios.put(`/edit-expense/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log(response.data);
      navigate("/expenses");
    } catch (error) {
      console.error(
        "Error uploading expense:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false); // Ensure loading is turned off in all cases
    }
  };

  useEffect(() => {
    const fetchExpenseCategories = async () => {
      const userId = localStorage.getItem("id");
      try {
        const res = await axios.get(`/get-expense-category/${userId}`);
        const categories = res.data.data;
  
        if (categories.length > 0) {
          setexpenseCategories(categories.map((cat) => cat.category_name)); // ✅ Set both states at once
        }
      } catch (error) {
        toast.error("Internal Server Error");
      }
    };
  
    fetchExpenseCategories();
  }, []);
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <ToastContainer />
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-xl font-semibold text-gray-800">Add Expense</div>
        <form onSubmit={handleSubmit(onSubmit)} className="pt-4">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Left Column - Receipt Upload */}
            <div className="lg:col-span-2">
              <div
                className={`border ${
                  errors.receipt ? "border-red-300" : "border-gray-300"
                } 
                border-dashed rounded-lg p-4 h-72 md:h-[95%] flex flex-col items-center justify-center bg-gray-50 transition-all duration-200 hover:bg-gray-100`}
              >
                {isUploading ? (
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                    <p className="text-sm text-gray-500">Uploading...</p>
                  </div>
                ) : !filePreview ? (
                  <>
                    <AiOutlineUpload className="text-4xl text-gray-400 mb-3" />
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
                      className="cursor-pointer text-blue-600 font-medium text-sm hover:text-blue-700"
                    >
                      Upload Receipt
                    </label>
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      Drag & drop or click to upload
                      <br />
                      (Images or PDF only)
                    </p>
                    {errors.receipt && (
                      <span className="text-red-500 text-xs mt-2">
                        Please upload a receipt
                      </span>
                    )}
                  </>
                ) : (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="absolute top-2 right-2 bg-red-50 text-red-500 p-1 rounded-full hover:bg-red-100 z-10"
                    >
                      <AiOutlineDelete className="text-lg" />
                    </button>
                    {fileType === "image" ? (
                      <img
                        src={filePreview}
                        alt="Uploaded receipt"
                        className="max-w-full max-h-full object-contain rounded-md"
                      />
                    ) : fileType === "pdf" ? (
                      <div className="w-full h-full">
                        <iframe
                          src={filePreview}
                          className="w-full h-full rounded-md"
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
            <div className="lg:col-span-3 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div>
                  <Input
                    id="title"
                    label="Title"
                    placeholder="Expense Title"
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
                    placeholder="0.00"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add details about this expense"
                  rows="2"
                  {...register("description")}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                              rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                              appearance-none bg-white`}
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
                    <span className="text-red-500 text-xs mt-1 block">
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
                              rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                              appearance-none bg-white`}
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
                    <span className="text-red-500 text-xs mt-1 block">
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
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  name="saveAndNew"
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-md font-medium text-sm hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {loading ? "Updating..." : "Save"}
                </button>
                <button
                  //   onClick={closeForm}
                  name="saveAndClose"
                  className="flex-1 bg-white text-blue-600 border border-blue-600 py-3 px-6 rounded-md font-medium text-sm hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditExpense;
