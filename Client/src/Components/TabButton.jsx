import PropTypes from "prop-types";

const TabButton = ({ type, activeTab, setActiveTab, fetchCategories, children }) => {
  const isActive = activeTab === type;

  return (
    <button
      onClick={() => {
        setActiveTab(type);
        fetchCategories(type);
      }}
      className={`
        flex items-center justify-center px-4 py-2 rounded-t-lg transition-all
        ${isActive 
          ? 'bg-white text-blue-600 border-b-2 border-blue-600 font-semibold' 
          : 'text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200'}
      `}
    >
      {children}
    </button>
  );
};

TabButton.propTypes = {
  type: PropTypes.string.isRequired,
  activeTab: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
  fetchCategories: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired
};

export default TabButton;
