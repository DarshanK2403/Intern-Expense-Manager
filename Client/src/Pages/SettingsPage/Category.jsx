import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  Edit,
  Plus,
  Trash2,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import TabButton from "../../Components/TabButton";

const Category = () => {
  const [activeTab, setActiveTab] = useState("expense");
  const [categories, setCategories] = useState([]);
  const token = localStorage.getItem("Token");
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const fetchCategories = useCallback(
    async (type) => {
      try {
        const res = await axios.get(`/category?type=${type}`,{
          headers:{
            Authorization: `Bearer ${token}`
          }
        });
        setCategories(res.data.data);
      } catch (error) {
        toast.error(`Failed to fetch ${type} categories`);
        console.error(error);
      }
    },
    [token]
  );

  useEffect(() => {
    if (token) {
      fetchCategories(activeTab);
    }
  }, [token, activeTab, fetchCategories]);

  const submitHandler = async (data) => {
    const categoryData = {
      ...data,
      category_type: activeTab,
    };

    // console.log(categoryData);
    try {
      const res = await axios.post(
        `/category?type=${activeTab}`,
        categoryData,{
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log("API RES", res);
      if (res.data.message === "Created") {
        toast.success(
          `${
            activeTab.charAt(0).toUpperCase() + activeTab.slice(1)
          } Category Added`
        );
        fetchCategories(activeTab);
        reset();
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error("Server Error");
      console.error(`Error creating ${activeTab} category:`, error);
    }
  };

  const deleteCategory = async (id) => {
    try {
      await axios.delete(`/category/${id}`,{
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      toast.success(
        `${
          activeTab.charAt(0).toUpperCase() + activeTab.slice(1)
        } Category Deleted`
      );
      fetchCategories(activeTab);
    } catch (error) {
      toast.error(`Failed to delete ${activeTab} category`);
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <ToastContainer />

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 bg-gray-50">
          <TabButton
            type="expense"
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            fetchCategories={fetchCategories}
          >
            Expense Categories
          </TabButton>
          <TabButton
            type="income"
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            fetchCategories={fetchCategories}
          >
            Income Categories
          </TabButton>
          <TabButton
            type="vendor"
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            fetchCategories={fetchCategories}
          >
            Vendor Categories
          </TabButton>
        </div>

        {/* Category Creation Form */}
        <div className="p-6">
          <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}{" "}
                  Category Name
                </label>
                <input
                  type="text"
                  placeholder={`Enter ${activeTab} Category`}
                  {...register("category_name", {
                    required: "Category name is required",
                    maxLength: {
                      value: 50,
                      message: "Category name must be less than 50 characters",
                    },
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.category_name && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.category_name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Category Description"
                  {...register("category_description")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="
                  flex items-center px-4 py-2 
                  bg-blue-600 text-white rounded-md 
                  hover:bg-blue-700 transition-colors
                "
              >
                <Plus className="mr-2 h-5 w-5" />
                Add {activeTab.charAt(0).toUpperCase() +
                  activeTab.slice(1)}{" "}
                Category
              </button>
            </div>
          </form>
        </div>

        {/* Categories List */}
        <div className="bg-gray-50 border-t">
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-800">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}{" "}
              Categories
            </h3>
          </div>

          {categories.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              No {activeTab} categories found
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {categories.map((category) => (
                <div
                  key={category._id}
                  className="grid md:grid-cols-3 grid-cols-1 gap-4 p-4 hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <span className="font-medium text-gray-800">
                      {category.category_name}
                    </span>
                  </div>
                  <div className="text-gray-600 md:block hidden">
                    {category.category_description || "No description"}
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      className="text-gray-500 hover:text-blue-600 p-2 rounded-full"
                      title="Edit"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      className="text-gray-500 hover:text-red-600 p-2 rounded-full"
                      onClick={() => deleteCategory(category._id)}
                      title="Delete"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Category;
