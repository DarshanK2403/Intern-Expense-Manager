/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import Input from "../../Components/Input";
import SelectInput from "../../Components/Select";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const UpdateVendor = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const token = localStorage.getItem("Token");
  const [vendorCategories, setvendorCategories] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  const getVendorById = async () => {
    try {
      const res = await axios.get(`/get-vendor-by-id/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setValue("name", res.data.name);
      setValue("email", res.data.email);
      setValue("phone", res.data.phone);
      setValue("category", res.data.category);
      setValue("notes", res.data.notes);
      console.log(res.data);
    } catch (error) {
      toast.error("Internal Server Error");
    }
  };

  const getVendorCategory = async () => {
    try {
      const res = await axios.get(`/category?type=vendor`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log(res.data.data);
      setvendorCategories(res.data.data);
      // console.log(id);
    } catch (error) {
      toast.error("Internal Server Error");
    }
  };

  useEffect(() => {
    if (token) {
      getVendorById();
      getVendorCategory();
    }
  }, [token, id, setValue]);

  // Update Vendor
  const onSubmit = async (data) => {
    try {
      const res = await axios.put(`/update-vendor/${id}`, data,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status === 200) {
        toast.success("Vendor Updated Successfully");
        navigate(-1);
      } else {
        toast.error("Something went wrong");
      }
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
      <div className="text-xl font-semibold text-gray-800">
        Edit Vendor Detail
      </div>
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
              valueField="_id"
              keyField="_id"
              displayField="category_name"
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
              value="Update Vendor"
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

export default UpdateVendor;
