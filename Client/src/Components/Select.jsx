/* eslint-disable react/prop-types */
import { AiOutlineTag } from "react-icons/ai";

const SelectInput = ({
  id,
  label,
  options = [],
  register,
  errors,
  keyField = "",
  valueField = "",
  displayField = "",
  icon: Icon = AiOutlineTag,
  required = true, // Default to true if not passed
}) => {
  return (
    <div className="mb-4">
      {/* Label */}
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>

      <div className="relative">
        {/* Left Icon */}
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>

        {/* Select Dropdown */}
        <select
          id={id}
          className="block w-full pl-10 pr-10 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 appearance-none"
          {...register(id, { required })}
        >
          {/* Empty selectable option if not required */}
          {!required && (
            <option value="null">-- Select {label} --</option>
          )}

          {options.length > 0 ? (
            options.map((option) => (
              <option key={option[keyField]} value={option[valueField]}>
                {option[displayField]}
              </option>
            ))
          ) : (
            <option disabled>No data available</option> // Custom message for no options
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
        <p className="mt-1 text-sm text-red-600">{errors[id].message}</p>
      )}
    </div>
  );
};

export default SelectInput;
