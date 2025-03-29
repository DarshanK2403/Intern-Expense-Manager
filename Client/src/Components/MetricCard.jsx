/* eslint-disable react/prop-types */
const MetricCard = ({
  icon,
  title,
  value,
  description,
  bgColor,
  textColor,
}) => (
  <div className="bg-white rounded-lg shadow p-4 flex-1">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center">
        <div className={`${bgColor} p-2 rounded-full mr-3`}>{icon}</div>
        <h3 className="text-lg font-medium text-gray-700">{title}</h3>
      </div>
    </div>
    <p className={`text-2xl font-bold ${textColor}`}>{value}</p>
    <p className="text-sm text-gray-500 mt-2">{description}</p>
  </div>
);

export default MetricCard;
