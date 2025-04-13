/* eslint-disable react/prop-types */
import Subnav from "../Subnav";

const IncomeNav = ({onSearchChange}) => {
  return (
    <Subnav
      id="searchIncome"
      Title="Incomes"
      tagLine="Manage and track your business incomes"
      placeholder="Search income..."
      to="add"
      ButtonText="Add Income"
      onSearchChange={onSearchChange} 
    />
  );
};

export default IncomeNav;
