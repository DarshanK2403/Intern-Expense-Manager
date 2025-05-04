import { NavLink, useLocation } from 'react-router-dom';

const ReportNav = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  return (
    <div className="w-full mx-auto bg-white h-max pt-2 shadow">
      <div className="flex border-b border-gray-200">
        <NavLink
          to="/reports/generate"
          className={({ isActive }) =>
            `py-3 px-6 font-medium text-sm ${
              isActive || currentPath === '/report'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`
          }
        >
          Generate Report
        </NavLink>
        <NavLink
          to="/reports/saved"
          className={({ isActive }) =>
            `py-3 px-6 font-medium text-sm ${
              isActive
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`
          }
        >
          Saved Reports
        </NavLink>
      </div>
    </div>
  );
};

export default ReportNav;