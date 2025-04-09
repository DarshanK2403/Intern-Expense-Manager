import React from "react";

const SpinnerLoader = ({ size = "medium", color = "blue" }) => {
  const sizeClasses = {
    small: "h-4 w-4 border-2",
    medium: "h-6 w-6 border-4",
    large: "h-10 w-10 border-4",
  };

  const colorClasses = {
    blue: "border-blue-500 border-t-transparent",
    red: "border-red-500 border-t-transparent",
    green: "border-green-500 border-t-transparent",
    gray: "border-gray-500 border-t-transparent",
  };

  return (
    <div
      className={`animate-spin rounded-full ${sizeClasses[size]} ${colorClasses[color]}`}
    />
  );
};

export default SpinnerLoader;
