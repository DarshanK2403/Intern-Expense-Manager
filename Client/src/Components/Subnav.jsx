/* eslint-disable react/prop-types */
const Subnav = ({ children, className = "", ...props }) => {
  return (
    <div
      className={`text-xl font-semibold text-gray-800 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Subnav;
