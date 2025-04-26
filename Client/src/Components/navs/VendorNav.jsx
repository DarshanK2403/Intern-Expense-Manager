/* eslint-disable react/prop-types */
import Subnav from "../Subnav";

const VendorNav = ({ onSearchChange }) => {
  return (
    // .
    <Subnav
      id="searchVendor"
      Title="Vendors"
      tagLine="Easily manage and track your vendors with categorized expenses"
      placeholder="Search vendor..."
      to="add"
      ButtonText="Add Vendor"
      onSearchChange={onSearchChange}
    />
  );
};

export default VendorNav;
