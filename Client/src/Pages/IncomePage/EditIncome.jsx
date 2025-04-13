import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import SelectInput from "../../Components/Select";
import Input from "../../Components/Input";
import { toast, ToastContainer } from "react-toastify";

const EditIncome = () => {
  const token = localStorage.getItem("Token");
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const { id } = useParams();
  const [incomeCategories, setincomeCategories] = useState();
  const navigate = useNavigate  ();
  useEffect(() => {
    const getIncome = async () => {
      const res = await axios.get(`/get-income-by-id/${id}`,{
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setValue("title", res.data.title);
      setValue("amount", res.data.amount);
      setValue("incomeDate", res.data.incomeDate.split("T")[0]);
      setValue("category", res.data.category);
      setValue("notes", res.data.notes);
    };
    if (id) {
      getIncome();
    }
  }, [id, setValue]);

  useEffect(() => {
    const fetchIncomeCategories = async () => {
      try {
        const res = await axios.get(`/category?type=income`,{
          headers:{
            Authorization: `Bearer ${token}`
          }
        });
        const resData = res.data.data;
        if (resData.length > 0) {
          const names = resData.map((cat) => cat.category_name);
          setincomeCategories(names);
        }
      } catch {
        toast.error("Internal Server Error");
      }
    };
    if (token) {
      fetchIncomeCategories();
    }
  }, [token]);

  const onSubmit = async (data) => {
    try {
      const res = await axios.put(`/edit-income/${id}`, {
        ...data,
      },{
        headers:{
          Authorization: `Bearer ${token}`
        }
      });
      if (res.status === 200) {
        toast.success("Income Updated Successfully");
        navigate("/income");
      } else {
        toast.error("Failed to update income");
      }
    } catch {
      toast.error("Internal Server Error");
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 bg-gray-50">
      <ToastContainer></ToastContainer>
      <div className="bg-white shadow p-6">
        <div className="text-xl font-semibold text-gray-800">Add Income</div>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-2">
          <div className="grid lg:grid-cols-2 space-y-2 grid-cols-1 space-x-4">
            {/* Title */}
            <Input
              id="title"
              type="text"
              label="Title"
              register={register}
              error={errors.title?.message}
              validation={{ required: "Title is required" }}
            />

            {/* Amount */}
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

          {/* IncomeDate */}
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
            {/* Category */}
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
            {/* Notes */}
            <label htmlFor="title" className="pb-1">
              Notes
            </label>
            <input
              type="text"
              name="notes"
              id="notes"
              className="bg-white rounded-sm w-96 p-1 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              {...register("notes")}
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
            value="Update Income"
          />
        </form>
      </div>
    </div>
  );
};

export default EditIncome;
