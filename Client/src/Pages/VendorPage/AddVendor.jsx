import { useForm } from "react-hook-form";
import Input from "../../Components/Input";
import { useNavigate } from "react-router-dom";
import SelectInput from "../../Components/Select";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";

const AddVendor = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const userId = localStorage.getItem("id");
  const [vendorCategories, setvendorCategories] = useState([]);

  useEffect(() => {
    const getVendorCategory = async () => {
      try {
        const res = await axios.get(`/get-vendor-category/${userId}`);
        // console.log(res.data.data);
        const data = res.data.data;
        const categoryName = data?.map((cat) => cat.category_name);
        setvendorCategories(categoryName);
      } catch (error) {
        toast.error("Internal Server Error");
      }
    };
    if (userId) {
      getVendorCategory();
    }
  }, [userId]);

  const onSubmit = async (data) => {
    try {
      const formData = {
        ...data,
        userId
      }
      const res = await axios.post(`/add-vendor/${userId}`, formData);
      toast.success("Venodr Added");
      // console.log(res.data);
      navigate('/vendor');
    } catch (error) {
      toast.error("Internal Server Error");
    }
  };

  const cancle = () => {
    navigate(-1);
  };
  return (
    <div className="max-w-7xl mx-auto mt-5 p-6 bg-white">
      <ToastContainer></ToastContainer>
      {/* Form Title */}
      <div className="text-xl font-semibold text-gray-800">Add Vendor</div>
      <div className="mt-2">
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Vendor Name */}
          <div>
            <Input
              id="name"
              type="text"
              label="Name"
              register={register}
              placeholder="Fresh Mart"
              error={errors.name?.message}
              validation={{ required: "Name is Required" }}
            />
          </div>

          {/* Venodr Email */}
          <div className="mt-2">
            <Input
              id="email"
              type="email"
              label="Email"
              register={register}
              placeholder="vendor@example.com"
              error={errors.email?.message}
              validation={{ required: "Email is Required" }}
            />
          </div>

          {/* Phone */}
          <div className="mt-2">
            <Input
              id="phone"
              type="number"
              label="Phone"
              register={register}
              placeholder="+91 98765 98765"
              error={errors.phone?.message}
              validation={{ required: "Phone Number is Required" }}
            />
          </div>

          {/* Category */}
          <div className="mt-2">
            <SelectInput
              id="category"
              label="Category"
              options={vendorCategories}
              register={register}
              errors={errors}
            />
          </div>

          {/* Notes */}
          <div className="mt-2">
            <Input
              id="notes"
              type="text"
              label="Note"
              register={register}
              placeholder="Add any additional details about the vendor..."
            />
          </div>

          {/* Submit & Cancle Button */}
          <div className="mt-2 space-x-2">
            <input
              type="submit"
              value="Add Vendor"
              className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 hover:cursor-pointer focus:"
            />
            <button
              onClick={() => cancle()}
              className="py-2 px-4 text-blue-600 bg-white border border-blue-600 rounded-md"
            >
              Cancle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVendor;
