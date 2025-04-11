/* eslint-disable react/prop-types */
import Subnav from "../Subnav";

const ExpenseNav = ({onSearchChange}) => {

  return (
    <Subnav
      id="searchExpense"
      Title="Expenses"
      tagLine="Manage and track your business expenses"
      placeholder="Search expenses..."
      to="add"
      ButtonText="Add Expense"
      onSearchChange={onSearchChange} 
    />
  );
};

export default ExpenseNav;
