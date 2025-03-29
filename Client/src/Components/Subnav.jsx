import { ChevronDown, Filter, Plus, Search } from "lucide-react";
import { Link } from "react-router-dom";

/* eslint-disable react/prop-types */
const Subnav = ({
  Title,
  tagLine,
  id,
  placeholder,
  to,
  ButtonText,
}) => {
  return (
    <div className="bg-gray-50 p-4 md:p-6 ">
      <div className="max-w-6xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            {Title}
          </h1>
          <p className="text-gray-500">
            {tagLine}
          </p>
        </header>

        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              id={id}
              type="text"
              placeholder={placeholder}
              className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex gap-2">
            <button className="px-4 py-2 flex items-center gap-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter size={18} />
              <span>Filter</span>
              <ChevronDown size={16} />
            </button>

            <Link
              to={to}
              className="px-4 py-2 flex items-center gap-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus size={18} />
              <span>{ButtonText}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subnav;
