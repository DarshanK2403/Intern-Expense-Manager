/* eslint-disable no-unused-vars */
import { useForm } from "react-hook-form";
import Subnav from "../../Components/Subnav";
import Input from "../../Components/Input";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import SelectInput from "../../Components/Select";
import { useNavigate } from "react-router-dom";

const AddIncome = () => {
  const token = localStorage.getItem("Token");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [incomeCategories, setincomeCategories] = useState();
  const navigate = useNavigate();

  // On Submit
  const submitHandler = async (data) => {
    // console.log(data);
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("amount", data.amount);
    formData.append("incomeDate", data.incomeDate);
    formData.append("category", data.category);
    formData.append("notes", data.notes);
    if (data.receipt) {
      formData.append("receipt", data.receipt);
    }

    try {
      const res = await axios.post(`/add-income`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      // console.log(res);
      navigate(-1);
    } catch (error) {
      console.log(error);
    }
  };

  // Get Income category
  useEffect(() => {
    const fetchIncomeCategories = async () => {
      try {
        const res = await axios.get(`/category?type=income`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const resData = res.data.data;
        if (resData.length > 0) {
          const names = resData.map((cat) => cat.category_name);
          setincomeCategories(names);
        }
      } catch (error) {
        toast.error("Internal Server Error");
      }
    };
    if (token) {
      fetchIncomeCategories();
    }
  }, [token]);

  return (
    <div className="max-w-7xl mx-auto py-6 bg-gray-50">
      <ToastContainer></ToastContainer>
      <div className="bg-white shadow p-6">
        <div className="text-xl font-semibold text-gray-800">Add Income</div>
        <form onSubmit={handleSubmit(submitHandler)} className="mt-2">
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
            <div>
              <SelectInput
                id="category"
                label="Expense Category"
                options={incomeCategories}
                register={register}
                errors={errors}
              />
            </div>
          </div>
          <div className="flex flex-col mt-2">
            <Input
              id={"notes"}
              type="text"
              label="Notes"
              register={register}
              placeholder="Add notes here"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="title" className="pb-1">
              Receipt
            </label>
            <input
              type="file"
              name="receipt"
              id="receipt"
              className="bg-white rounded-sm w-96 p-1 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              {...register("receipt")}
            />
          </div>
          <input
            type="submit"
            className="bg-blue-600 py-2 px-4 rounded-lg my-2 text-white"
            value="Add Income"
          />
        </form>
      </div>
    </div>
  );
};

export default AddIncome;
