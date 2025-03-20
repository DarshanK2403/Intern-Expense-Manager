import { useForm } from "react-hook-form";

const AddIncome = () => {
  const { register, handleSubmit } = useForm();
  const submitHandler = (data) => {
    console.log(data);
  };
  return (
    <div>
      <form onSubmit={handleSubmit(submitHandler)}>
        <div className="flex flex-col">
          <label htmlFor="title" className="pb-1">
            Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            className="bg-white rounded-sm w-96 p-1 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            {...register("title")}
          />
        </div>
        <div className="flex flex-col mt-2">
          <label htmlFor="amount" className="pb-1">
            Amount
          </label>
          <input
            type="number"
            name="amount"
            id="amount"
            className="bg-white rounded-sm p-1 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            {...register("amount")}
          />
        </div>
        <div className="flex flex-col mt-2">
          <label htmlFor="amount" className="pb-1">
            Income Date
          </label>
          <input
            type="date"
            name="incomeDate"
            id="incomeDate"
            className="bg-white rounded-sm p-1 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            {...register("incomeDate")}
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
  );
};

export default AddIncome;
