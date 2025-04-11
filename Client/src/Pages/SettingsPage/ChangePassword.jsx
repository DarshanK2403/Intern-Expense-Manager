/* eslint-disable no-unused-vars */
import React from "react";
import Input from "../../Components/Input";
import { useForm } from "react-hook-form";
import { ArrowLeft, Drama } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";

const ChangePassword = () => {
  const token = localStorage.getItem("Token");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data) => {
    try {
      const res = await axios.put(
        `/change-password`,
        {
          oldPassword: data.oldPassword,
          newPassword: data.newPassword,
          confirmPassword: data.confirmPassword,
        },{
          headers:{
            Authorization: `Bearer ${token}`
          }
        }
      );
      if (res.data.success) {
        toast.success("Password changed successfully");
      } else {
        toast.error(res.data.message);
      }
      

    } catch (error) {
      toast.error("Failed to change password");
    }
  };
  return (
    <div className="mt-6 w-full">
      <ToastContainer />
      <div className="bg-white shadow-md rounded-lg p-6 max-w-6xl mx-auto">
        <div className="flex items-center mb-4">
          <ArrowLeft className="h-5 w-5 text-gray-800 mr-2" />
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Change Password
          </h2>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Old Password */}
          <div className="mb-4">
            <Input
              id={"oldPassword"}
              label={"Old Password"}
              type={"password"}
              placeholder={"Enter your old password"}
              register={register}
              error={errors.oldPassword?.message}
              validation={{ required: "Old password is required" }}
            />
          </div>

          {/* New Password */}
          <div className="mb-4">
            <Input
              id={"newPassword"}
              label={"New Password"}
              type={"password"}
              placeholder={"Enter your new password"}
              register={register}
              error={errors.newPassword?.message}
              validation={{ required: "New password is required" }}
            />
          </div>

          <div className="mb-4">
            {/* Confirm Password */}
            <Input
              id={"confirmPassword"}
              label={"Confirm Password"}
              type={"password"}
              placeholder={"Confirm your new password"}
              register={register}
              error={errors.confirmPassword?.message}
              validation={{ required: "Confirm password is required" }}
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
          >
            Change Password
          </button>

          <div className="mt-4 text-gray-500 text-sm flex items-center">
            <Drama className="h-4 w-4 mr-2" />
            <span>
              Your password should be at least 8 characters long and include at
              least
              <strong className="text-gray-500">
                1 uppercase letter, 1 lowercase letter, 1 number,
              </strong>
              and <strong className="text-gray-500">1 special character</strong>
              .
            </span>
          </div>

          <div className="flex items-center justify-between mt-4">
            <button
              type="button"
              className="text-gray-500 hover:text-blue-600 transition duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
