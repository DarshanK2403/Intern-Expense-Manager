/* eslint-disable react/prop-types */
import { AiOutlineTag } from "react-icons/ai";

const SelectInput = ({ id, label, options = [], register, errors }) => {
  return (
    <div>
      {/* Label */}
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>

      <div className="relative">
        {/* Left Icon */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <AiOutlineTag className="text-gray-500" />
        </div>

        {/* Select Dropdown */}
        <select
          id={id}
          className={`w-full pl-10 pr-3 py-2 border ${
            errors?.[id] ? "border-red-300" : "border-gray-300"
          } 
                rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                appearance-none bg-white`}
          {...(register ? register(id, { required: `${label} is required` }) : {})}
        >
          <option value="">Select {label}</option>
          {options.length > 0 ? (
            options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))
          ) : (
            <option disabled>Loading...</option>
          )}
        </select>

        {/* Dropdown Arrow */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>

      {/* Error Message */}
      {errors?.[id] && (
        <span className="text-red-500 text-xs mt-1 block">
          {errors[id].message}
        </span>
      )}
    </div>
  );
};

export default SelectInput;
