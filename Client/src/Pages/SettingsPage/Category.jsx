/* eslint-disable no-unused-vars */
import axios from "axios";
import { Edit, Plus, Trash2 } from "lucide-react";
import React, { useEffect, useState, useCallback } from "react";
import { get, useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Subnav from "../../Components/Subnav";
import Input from "../../Components/Input";

const Category = () => {
  const [categorys, setCategorys] = useState([]);
  const userId = localStorage.getItem("id");
  const [loading, setLoading] = useState(false)
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const getCategory = useCallback(async () => {
    try {
      const res = await axios.get(`/get-category/${userId}`);
      setCategorys(res.data.data);
    } catch (error) {
      console.log(error);
    }
  }, [userId]);

  useEffect(() => {
    const getUserdata = async () => {
      try {
        const res = await axios.get(`/userdata/${userId}`);
        for (const key in res.data) {
          setValue(key, res.data[key] || "");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (userId) {
      getUserdata();
      getCategory();
    }
  }, [userId, setValue, getCategory]);

  const deleteCategory = async (id) => {
    try {
      await axios.delete(`/delete-category/${id}`);
      toast.success("💣 Deleted Successfully");
      getCategory();
    } catch (error) {
      console.log(error);
    }
  };

  const submitHandler = async (data) => {
    const categoryData = {
      ...data,
      userId: userId,
    };
    try {
      const res = await axios.post(`/create-category/${userId}`, categoryData);
      // console.log(res.data.message);
      if (res.data.message == "Created") {
        toast.success("Category Added");
        getCategory();
      } else {
        toast.error("Something gose wrong");
      }
    } catch (error) {
      toast.error("Server Error");
      console.error(
        "Error uploading expense:",
        error.response?.data || error.message
      );
    }
  };
  return (
    <div className="m-5 w-[70%] mx-auto">
      <ToastContainer />
      <Subnav>Category Management</Subnav>

      <div className="mt-4">
        <form onSubmit={handleSubmit(submitHandler)}>
          <div className="grid lg:grid-cols-2 grid-cols-1 col-span-2 gap-x-4 items-center">
            {/* Category Name */}
            <Input
              id="category_name"
              label="Category Name"
              type="text"
              placeholder="Category Name"
              register={register}
              error={errors.category_name?.message}
              validation={{ required: "Category Name is required" }}
            />

            {/* Category Description */}
            <Input
              id="category_description"
              label="Description"
              type="text"
              placeholder="Category Description"
              register={register}
            />

            {/* Submit Button */}
            <div className="items-center gap-2 mb-2">
              <input
                type="submit"
                value="Add Category"
                className="flex  bg-blue-600 text-white py-2 px-4 rounded-md mt-2 hover:bg-blue-700 hover:cursor-pointer transition-colors"
              />
            </div>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow">
        <table className="w-full">
          <tbody className="divide-y divide-gray-200">
            {categorys.map((category) => (
              <tr key={category._id} className="py-4 mx-4 items-center">
                <td className="items-start py-4 px-4">
                  {category.category_name}
                </td>
                <td className="text-gray-400 py-4 px-4">
                  {category.category_description}
                </td>
                <td className="py-4 px-4 text-end">
                  <button className="p-1 text-gray-400 hover:text-gray-600 mr-2">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    className="p-1 text-gray-400 hover:text-red-600"
                    onClick={() => deleteCategory(category._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Category;
