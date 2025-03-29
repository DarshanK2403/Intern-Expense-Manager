import { ChevronDown, Filter, Plus, Search } from "lucide-react";
import { Link } from "react-router-dom";
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
