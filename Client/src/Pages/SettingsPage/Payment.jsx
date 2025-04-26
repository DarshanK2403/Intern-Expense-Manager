import axios from "axios";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import Input from "../../Components/Input";
import SelectInput from "../../Components/Select";
import SpinnerLoader from "../../Components/Loader/SpinnerLoader";

const Payment = () => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();
  const token = localStorage.getItem("Token");
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showTypeForm, setShowTypeForm] = useState(false);
  const [editingMethodId, setEditingMethodId] = useState(null);
  const [editingTypeId, setEditingTypeId] = useState(null);
  const [loading, setLoading] = useState(false);

  const getPayment = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/payment", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPaymentMethods(res.data.data);
    } catch {
      toast.error("Not Found");
    } finally {
      setLoading(false);
    }
  };

  const getPaymentType = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/payment-type", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPaymentTypes(res.data.data);
    } catch {
      toast.error("Not Found");
    }
    setLoading(false);
  };

  useEffect(() => {
    getPayment();
    getPaymentType();
  }, []);

  const resetForms = () => {
    reset();
    setEditingMethodId(null);
    setEditingTypeId(null);
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      if (editingMethodId) {
        // Update existing payment method
        await axios.put(`/payment/${editingMethodId}`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("Successfully Updated");
      } else {
        // Create new payment method
        await axios.post("/payment", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("Successfully Added");
      }
      setShowForm(false);
      resetForms();
      getPayment();
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitType = async (data) => {
    setIsLoading(true);
    try {
      if (editingTypeId) {
        // Update existing payment type
        await axios.put(`/payment-type/${editingTypeId}`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("Successfully Updated");
      } else {
        // Create new payment type
        await axios.post("/payment-type", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("Successfully Added");
      }
      setShowTypeForm(false);
      resetForms();
      getPaymentType();
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePayment = async (id) => {
    if (window.confirm("Are you sure you want to delete this payment method?")) {
      setIsLoading(true);
      try {
        const res = await axios.delete(`/payment/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success(res.data.message || "Payment method deleted successfully");
        getPayment();
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to delete payment method"
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDeletePaymentType = async (id) => {
    if (window.confirm("Are you sure you want to delete this payment type?")) {
      setIsLoading(true);
      try {
        const res = await axios.delete(`/payment-type/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success(res.data.message || "Payment type deleted successfully");
        getPaymentType();
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to delete payment type"
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleEditPaymentMethod = (method) => {
    setEditingMethodId(method._id);
    setValue("label", method.label);
    setValue("paymentTypeId", method.paymentTypeId?._id);
    setValue("detail", method.detail || "");
    setShowForm(true);
  };

  const handleEditPaymentType = (type) => {
    setEditingTypeId(type._id);
    setValue("name", type.name);
    setShowTypeForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    resetForms();
  };

  const handleCancelTypeForm = () => {
    setShowTypeForm(false);
    resetForms();
  };

  return (
    <div className="space-y-8 w-full max-w-7xl mx-auto my-6">
      <ToastContainer autoClose={1500} />
      {/* Payment Methods Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Payment Methods</h2>
          <button
            onClick={() => {
              if (showForm) {
                handleCancelForm();
              } else {
                resetForms();
                setShowForm(true);
              }
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            {showForm ? "Cancel" : "Add New Payment Method"}
          </button>
        </div>

        {showForm && (
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Input
                  id="label"
                  type="text"
                  label="Label"
                  placeholder="e.g., Personal VISA, Business PayPal"
                  register={register}
                  error={errors.label?.message}
                  validation={{ required: "Label is required" }}
                />
              </div>

              <div>
                <SelectInput
                  id="paymentTypeId"
                  label="Payment Type"
                  valueField="_id"
                  keyField="_id"
                  displayField="name"
                  options={paymentTypes}
                  register={register}
                  validation={{ required: "Payment Type is required" }}
                  error={errors.paymentTypeId?.message}
                />
              </div>

              <div>
                <Input
                  id="detail"
                  type="text"
                  label="Details"
                  placeholder="e.g., Last 4 digits, email, expiry date"
                  register={register}
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:bg-green-400"
                >
                  {isLoading
                    ? editingMethodId
                      ? "Updating..."
                      : "Adding..."
                    : editingMethodId
                    ? "Update Payment Method"
                    : "Add Payment Method"}
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <SpinnerLoader size="large" color="blue" />
          </div>
        ) : paymentMethods.length > 0 ? (
          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <div
                key={method._id}
                className="flex items-center justify-between p-4 bg-white rounded-md border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div>
                  <h3 className="font-medium">{method.label}</h3>
                  {method.detail && (
                    <p className="text-sm text-gray-600 mt-1">{method.detail}</p>
                  )}
                  {method.paymentTypeId && (
                    <p className="text-xs text-gray-500 mt-1">
                      {method.paymentTypeId.name}
                    </p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditPaymentMethod(method)}
                    className="text-blue-500 hover:text-blue-700 focus:outline-none"
                    aria-label="Edit payment method"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeletePayment(method._id)}
                    className="text-red-500 hover:text-red-700 focus:outline-none"
                    aria-label="Delete payment method"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-md border border-dashed border-gray-300">
            <p className="text-gray-500">No payment methods added yet.</p>
            <button
              onClick={() => {
                resetForms();
                setShowForm(true);
              }}
              className="mt-2 text-blue-600 hover:text-blue-800 font-medium"
            >
              Add your first payment method
            </button>
          </div>
        )}
      </div>

      {/* Payment Types Section */}
      <div className="space-y-6 border-t pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Payment Types</h2>
          <button
            onClick={() => {
              if (showTypeForm) {
                handleCancelTypeForm();
              } else {
                resetForms();
                setShowTypeForm(true);
              }
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            {showTypeForm ? "Cancel" : "Add New Payment Type"}
          </button>
        </div>

        {showTypeForm && (
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
            <form onSubmit={handleSubmit(onSubmitType)} className="space-y-4">
              <div>
                <Input
                  id="name"
                  type="text"
                  label="Type Name"
                  placeholder="e.g., Credit Card, PayPal, Bank Transfer"
                  register={register}
                  validation={{ required: "Payment Type is required" }}
                  error={errors.name?.message}
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:bg-green-400"
                >
                  {isLoading
                    ? editingTypeId
                      ? "Updating..."
                      : "Adding..."
                    : editingTypeId
                    ? "Update Payment Type"
                    : "Add Payment Type"}
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <SpinnerLoader size="large" color="blue" />
          </div>
        ) : paymentTypes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paymentTypes.map((type) => (
              <div
                key={type._id}
                className="flex items-center justify-between p-4 bg-white rounded-md border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div>
                  <h3 className="font-medium">{type.name}</h3>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditPaymentType(type)}
                    className="text-blue-500 hover:text-blue-700 focus:outline-none"
                    aria-label="Edit payment type"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeletePaymentType(type._id)}
                    className="text-red-500 hover:text-red-700 focus:outline-none"
                    aria-label="Delete payment type"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-md border border-dashed border-gray-300">
            <p className="text-gray-500">No payment types defined yet.</p>
            <button
              onClick={() => {
                resetForms();
                setShowTypeForm(true);
              }}
              className="mt-2 text-blue-600 hover:text-blue-800 font-medium"
            >
              Add your first payment type
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payment;