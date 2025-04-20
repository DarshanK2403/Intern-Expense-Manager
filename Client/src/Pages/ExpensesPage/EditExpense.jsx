import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  AiOutlineCalendar,
  AiOutlineDelete,
  AiOutlineUpload,
} from "react-icons/ai";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Input from "../../Components/Input";
import SelectInput from "../../Components/Select";
import axios from "axios";
import AutocompleteInput from "../../Components/AutocompleteInput";

const EditExpense = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const token = localStorage.getItem("Token");
  // const receipt = watch("receipt");
  const [filePreview, setFilePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expenseCategories, setexpenseCategories] = useState();
  const [vendorSuggestions, setvendorSuggestions] = useState([]);
  const [PaymentType, setPaymentType] = useState([]);

  useEffect(() => {
    const getExpenseDetailbyId = async () => {
      try {
        const res = await axios.get(`/expense-details/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(res.data.receipt?.cloudinaryUrl);
        setValue("title", res.data.title);
        setValue("amount", res.data.amount);
        setValue("description", res.data.description);
        setValue("expenseDate", res.data.expenseDate.split("T")[0]);
        setValue("category", res.data.category);
        setValue("paymentThrough", res.data.paymentThrough);
        setValue("vendor", res.data.vendor);
        setValue("receipt", res.data.receipt);
        // setValue("receiptFile", res.data.data.receipt); // Set the receipt file for preview
        setFilePreview(res.data.receipt?.cloudinaryUrl); // Set the file preview URL
      } catch (error) {
        toast.error("Error fetching expense details:", error.message);
      }
    };
    if (id) {
      getExpenseDetailbyId();
    }
  }, [token, id, setValue]);

  const getPaymentType = async () => {
    try {
      const res = await axios.get("/payment", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res.data.data);
      setPaymentType(res.data.data);
    } catch {
      toast.error("Somthing went wrong");
    }
  };

  useEffect(() => {
    getPaymentType();
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0] || null;
    if (!file) return;

    setIsUploading(true);

    const fileURL = URL.createObjectURL(file);
    setFilePreview(fileURL);

    setValue("receiptFile", file); // Store file for form submission
    setIsUploading(false);
  };

  // Remove uploaded file
  const handleRemoveFile = () => {
    setFilePreview(null);
    setValue("receiptFile", null);
  };

  const onSubmit = async (data) => {
    if (!id) {
      console.error("Error: Expense ID is missing");
      return;
    }

    // Create FormData
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("amount", data.amount);
    formData.append("description", data.description);
    formData.append("expenseDate", data.expenseDate);
    formData.append("category", data.category);
    formData.append("paymentThrough", data.paymentThrough);
    formData.append("vendor", data.vendor);

    // Ensure file is valid before appending
    if (data.receiptFile instanceof File) {
      formData.append("receipt", data.receiptFile);
      formData.append("fileOriginalName", data.receiptFile.name);
      formData.append("fileType", data.receiptFile.type);
    }

    try {
      setLoading(true);
      const res = await axios.put(`/edit-expense/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

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

      console.log(res.data);
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

  const VendorSuggest = async () => {
    const res = await axios.get(`/get-vendor`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const vendor = res.data.map((data) => data.name);
    setvendorSuggestions(vendor);
  };

  useEffect(() => {
    const fetchExpenseCategories = async () => {
      try {
        const res = await axios.get(`/category?type=expense`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setexpenseCategories(res.data.data);
      } catch {
        toast.error("Internal Server Error");
      }
    };

    fetchExpenseCategories();
    VendorSuggest();
  }, [token]);

  const closeForm = () => {
    navigate("/expenses");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <ToastContainer autoClose={1500} />
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
                      accept="image/*"
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
                      (Images only)
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
                    <img
                      src={filePreview}
                      alt="Uploaded receipt"
                      className="max-w-full max-h-full object-contain rounded-md"
                    />
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
                    valueField="_id"
                    keyField="_id"
                    displayField="category_name"
                    options={expenseCategories}
                    register={register}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {/* Payment Through */}
                <SelectInput
                  id="paymentThrough"
                  label="Payment Through"
                  options={PaymentType}
                  valueField="_id"
                  keyField="_id"
                  displayField="label"
                  register={register}
                  error={errors.paymentThrough?.message}
                  validation={{ required: "Select one" }}
                />

                <AutocompleteInput
                  name="vendor"
                  label="Vendor"
                  placeholder="Search or select vendor (optional)"
                  suggestions={vendorSuggestions}
                  required={false}
                  {...register("vendor")}
                  onSelect={(value) => setValue("vendor", value)}
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
                  onClick={closeForm}
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
