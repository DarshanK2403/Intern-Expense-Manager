/* eslint-disable react/prop-types */

const Input = ({ id, label, type = "text", placeholder, step, icon: Icon, className = "", register, validation, error, ...props }) => {
  return (
    <div>
      {/* Label */}
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      {/* Input Container */}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="text-gray-500" />
          </div>
        )}

        <input
          id={id}
          type={type}
          step={step}
          className={`w-full ${Icon ? "pl-10" : "pl-3"} pr-3 py-2 border ${error ? "border-red-500" : "border-gray-300"} 
                      rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                      ${className}`}
          placeholder={placeholder}
          {...register(id, validation)} // Registering input with validation
          {...props}
        />
      </div>

      {/* Error Message */}
      {error && (
        <span className="text-red-500 text-xs mt-1 block">{error}</span>
      )}
    </div>
  );
};

export default Input;
