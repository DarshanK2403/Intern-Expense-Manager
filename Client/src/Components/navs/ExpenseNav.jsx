// eslint-disable-next-line no-unused-vars
import React from "react";
import Subnav from "../Subnav";

const ExpenseNav = () => {
  return (
    <Subnav
      id="searchExpense"
      Title="Expenses"
      tagLine="Manage and track your business expenses"
      placeholder="Search expenses..."
      to="add"
      ButtonText="Add Expense"
    />
  );
};

export default ExpenseNav;
