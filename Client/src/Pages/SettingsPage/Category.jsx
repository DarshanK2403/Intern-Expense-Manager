/* eslint-disable no-unused-vars */
import axios from "axios";
import { Edit, Plus, Trash2 } from "lucide-react";
import React, { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from 'react-toastify';

const Category = () => {
  const [categorys, setCategorys] = useState([]);
  const userId = localStorage.getItem("id");

  const { setValue } = useForm();

  // ✅ Memoize `getCategory` so it doesn't change on re-renders
  const getCategory = useCallback(async () => {
    try {
      const res = await axios.get(`/get-category/${userId}`);
      setCategorys(res.data.data);
      console.log(res.data.data);
    } catch (error) {
      console.log(error);
    }
  }, [userId]); // ✅ Add dependencies to `useCallback`

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
      getCategory(); // ✅ Now it won't trigger the ESLint warning
    }
  }, [userId, setValue, getCategory]); // ✅ Add `getCategory` to dependencies

  const deleteCategory = async (id) => {
    try {
      await axios.delete(`/delete-category/${id}`);
      toast.success("Deleted Successfully");
      getCategory(); // ✅ Refresh category list after deletion
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="space-y-6 m-5 w-[70%] mx-auto">
      <ToastContainer />
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">
          Category Management
        </h2>
        <button className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center">
          <Plus className="h-4 w-4 mr-1" /> Add Category
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <ul className="divide-y divide-gray-200">
            {categorys.map((category) => (
              <li key={category._id} className="flex items-center justify-between py-4">
                {category.category_name}
                <div className="flex items-center">
                  <button className="p-1 text-gray-400 hover:text-gray-600 mr-2">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    className="p-1 text-gray-400 hover:text-red-600"
                    onClick={() => deleteCategory(category._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Category;
