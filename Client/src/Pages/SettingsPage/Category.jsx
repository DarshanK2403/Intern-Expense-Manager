import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { ChevronDown, ChevronUp, Edit, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import TabButton from "../../Components/TabButton";
import SpinnerLoader from "../../Components/Loader/SpinnerLoader";

const Category = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("expense");
  const [categories, setCategories] = useState([]);
  const token = localStorage.getItem("Token");
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm();
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  const fetchCategories = useCallback(
    async (type) => {
      setLoading(true);
      try {
        const res = await axios.get(`/category?type=${type}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCategories(res.data.data);
      } catch (error) {
        toast.error(`Failed to fetch ${type} categories`);
        console.error(error);
      } finally {
        setLoading(false);
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
        categoryData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
      await axios.delete(`/category/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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

  const toggleForm = () => {
    setOpen((prev) => !prev);
  };

  const updateCategories = async (id) => {
    try {
      setEdit(true);
      setOpen(false);
      const getData = await axios.get(`/category-by-id/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = getData.data.data;
      setValue("category_name", data.category_name);
      setValue("category_description", data.category_description);
      setEditId(id); // Save the ID in state
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async (data) => {
    console.log(data);
    try {
      const id = editId; // Get the ID from state
      const res = await axios.put(`/update-category/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res.data.message);
      if (res.data.message === "Updated") {
        toast.success("Catgey Updated");
        fetchCategories(activeTab);
        setEdit(false);
        setEditId(null);
        reset({
          category_name: "",
          category_description: "",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const cancelEdit = () => {
    reset({
      category_name: "",
      category_description: "",
    });
    setEdit(false);
    setEditId(null); // optional if you track editId
    setOpen(false); // optional if you want to close the form
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <ToastContainer />

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Tab Navigation */}
        <div className="flex justify-between">
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
          <button
            onClick={() => toggleForm()}
            className="bg-blue-600 py-2 px-4 rounded-md text-white mx-2 flex items-center"
          >
            {open ? (
              <div className="flex items-center gap-2">
                Close <ChevronUp size={18} />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                Add Category <ChevronDown size={18} />
              </div>
            )}
          </button>
        </div>

        {/* Category Creation Form */}
        <div
          className={`transition-all ease-in-out duration-300 overflow-hidden ${
            open
              ? "opacity-100 max-h-[1000px]"
              : "opacity-0 max-h-0 pointer-events-none"
          }`}
        >
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
                        message:
                          "Category name must be less than 50 characters",
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
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>

        <div
          className={`transition-all ease-in-out duration-300 overflow-hidden ${
            edit
              ? "opacity-100 max-h-[1000px]"
              : "opacity-0 max-h-0 pointer-events-none"
          }`}
        >
          <div className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                        message:
                          "Category name must be less than 50 characters",
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

              <div className="flex justify-end space-x-2">
                <button
                  className="
                  flex items-center px-4 py-2 
                  bg-white border border-gray-400 rounded-md 
                  hover:bg-gray-200 transition-colors
                "
                  onClick={cancelEdit}
                >
                  Cancle
                </button>
                <button
                  type="submit"
                  className="
                  flex items-center px-4 py-2 
                  bg-blue-600 text-white rounded-md 
                  hover:bg-blue-700 transition-colors
                "
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
        {/* Categories List */}
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <SpinnerLoader size="large" color="blue" />
          </div>
        ) : (
          <div className="bg-gray-50 border-t border-gray-300">
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}{" "}
                Categories
              </h3>
            </div>

            {categories.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {categories?.map((category) => (
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
                        onClick={() => updateCategories(category._id)}
                        aria-label="Edit Category"
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
            ) : (
              <div className="text-center py-6 text-gray-500">
                No {activeTab} categories found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Category;
