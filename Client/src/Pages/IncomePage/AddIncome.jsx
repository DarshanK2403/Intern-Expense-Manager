import { useForm } from "react-hook-form";
import Subnav from "../../Components/Subnav";
import Input from "../../Components/Input";
import axios from "axios";

const AddIncome = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const userId = localStorage.getItem("id");
  const submitHandler = async (data) => {
    console.log(data);
    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("title", data.title);
    formData.append("amount", data.amount);
    formData.append("incomeDate", data.incomeDate);
    formData.append("category", data.category);
    formData.append("notes", data.notes);
    if (data.receipt) {
      formData.append("receipt", data.receipt);
    }

    try {
      const res = await axios.post(`/add-income/${userId}`, formData, {
        headers: { "Content-Type": "application/json" },
      });
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="max-w-7xl mx-auto py-6 bg-gray-50">
      <div className="bg-white shadow p-6">
        <Subnav>Add Income</Subnav>
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
            <label htmlFor="amount" className="pb-1">
              Category
            </label>
            <select
              className="bg-white rounded-sm p-1 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              {...register("category")}
            >
              <option value="1">1</option>
              <option value="2">2</option>
            </select>
          </div>
          <div className="flex flex-col mt-2">
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
            value="Add Category"
          />
        </form>
      </div>
    </div>
  );
};

export default AddIncome;
