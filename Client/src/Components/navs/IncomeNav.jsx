import Subnav from "../Subnav";

const IncomeNav = () => {
  return (
    <Subnav
      id="searchIncome"
      Title="Incomes"
      tagLine="Manage and track your business incomes"
      placeholder="Search income..."
      to="add"
      ButtonText="Add Income"
    />
  );
};

export default IncomeNav;
