/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

const QuickLink = ({ to, icon: Icon, title, description, color }) => {
  return (
    <Link
      to={to}
      className="w-full flex items-center justify-between p-4 bg-white rounded-lg shadow hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-center">
        <Icon className={`h-5 w-5 mr-2 ${color}`} />
        <div>
          <p className={`font-medium text-start ${color}`}>{title}</p>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
      </div>
      <ArrowUpRight className="h-5 w-5 text-gray-400" />
    </Link>
  );
};

export default QuickLink;
