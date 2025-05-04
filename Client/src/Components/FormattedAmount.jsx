import PropTypes from "prop-types";

const FormattedAmount = ({ amount }) => {
  const formatted = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);

  return <>{formatted}</>;
};

FormattedAmount.propTypes = {
  amount: PropTypes.number.isRequired,
};

export default FormattedAmount;
