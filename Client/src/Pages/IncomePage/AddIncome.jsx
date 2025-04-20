/* eslint-disable no-unused-vars */
import { useForm } from "react-hook-form";
import Subnav from "../../Components/Subnav";
import Input from "../../Components/Input";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import SelectInput from "../../Components/Select";
import { useNavigate } from "react-router-dom";
import { AiOutlineDelete, AiOutlineUpload } from "react-icons/ai";

const AddIncome = () => {
  const token = localStorage.getItem("Token");
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const [incomeCategories, setincomeCategories] = useState();
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const [filePreview, setFilePreview] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [PaymentType, setPaymentType] = useState([]);

  // On Submit
  const submitHandler = async (data) => {
    console.log(data);

    if (data.receiptFile && !(data.receiptFile instanceof File)) {
      console.error("Invalid file format");
      return;
    }

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("amount", data.amount);
    formData.append("incomeDate", data.incomeDate);
    formData.append("category", data.category);
    formData.append("notes", data.notes);
    if (data.receiptFile instanceof File) {
      formData.append("receipt", data.receiptFile);
      formData.append("fileOriginalName", data.receiptFile.name);
      formData.append("fileType", data.receiptFile.type);
    }

    try {
      setLoading(true);

      const res = await axios.post(`/add-income`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
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
      console.log("Form Data Sent:", res.data);
      navigate("/income");
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  // Handle File Change
  const handleFileChange = (event) => {
    const file = event.target.files[0] || null;
    if (!file) return;

    setIsUploading(true);

    const fileURL = URL.createObjectURL(file);
    setFilePreview(fileURL);

    if (file.type.startsWith("image/")) {
      setFileType("image");
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

  const getPaymentType = useCallback(
    async (callback) => {
      try {
        const res = await axios.get("/payment", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPaymentType(res.data.data);
        if (callback) callback(res.data.data);
      } catch (error) {
        toast.error("Something went wrong");
      }
    },
    [token]
  );

  // ✅ Fetch Income Categories (with optional callback)
  const fetchIncomeCategories = useCallback(
    async (callback) => {
      try {
        const res = await axios.get("/category?type=income", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setincomeCategories(res.data.data);
        if (callback) callback(res.data.data);
      } catch (error) {
        toast.error("Internal Server Error");
      }
    },
    [token]
  );

  // ✅ useEffect to call both safely
  useEffect(() => {
    if (token) {
      fetchIncomeCategories();
      getPaymentType();
    }
  }, [token, fetchIncomeCategories, getPaymentType]);
  return (
    <div className="max-w-7xl mx-auto py-6 bg-gray-50">
      <ToastContainer></ToastContainer>
      <div className="bg-white shadow p-6">
        <div className="text-xl font-semibold text-gray-800">Add Income</div>
        <form onSubmit={handleSubmit(submitHandler)} className="mt-2">
          <div className="lg:grid lg:grid-cols-5 lg:gap-6">
            {/* Left */}
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
                      accept="image/*"
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
                      (Images only)
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
                    <img
                      src={filePreview}
                      alt="Uploaded receipt"
                      className="max-w-full max-h-full object-contain rounded-md shadow-sm"
                    />
                  </div>
                )}
              </div>
            </div>

            {/*Right Sec  */}
            <div className="lg:col-span-3 space-y-4 sm:space-y-6">
              <div className="grid lg:grid-cols-2 space-y-2 grid-cols-1 space-x-4">
                <Input
                  id="title"
                  type="text"
                  label="Title"
                  register={register}
                  error={errors.title?.message}
                  validation={{ required: "Title is required" }}
                />

                <Input
                  id="amount"
                  type="number"
                  label="Amount"
                  placeholder="0.00"
                  step={0.01}
                  register={register}
                  error={errors.amount?.message}
                  validation={{ required: "Amount is required" }}
                />
              </div>

              <div className="flex flex-col mt-2">
                <Input
                  id="incomeDate"
                  type="date"
                  label="Income Date"
                  name="incomeDate"
                  register={register}
                  error={errors.incomeDate?.message}
                  validation={{ required: "Income Date is Required" }}
                />
              </div>
              <div className="flex flex-col mt-2">
                <div className="mt-2">
                  <SelectInput
                    id="category"
                    label="Expense Category"
                    options={incomeCategories}
                    register={register}
                    valueField="_id"
                    keyField="_id"
                    displayField="category_name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                    errors={errors}
                  />
                </div>
              </div>
              <div className="flex flex-col">
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

                <Input
                  id={"notes"}
                  type="text"
                  label="Notes"
                  register={register}
                  placeholder="Add notes here"
                />
              </div>
              <button
                type="submit"
                name="save"
                className="w-full sm:flex-1 bg-blue-600 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-md font-medium text-sm hover:bg-blue-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <span className="animate-spin h-4 w-4 mr-2 border-b-2 border-white rounded-full"></span>
                    Adding...
                  </span>
                ) : (
                  "Add Income"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddIncome;
