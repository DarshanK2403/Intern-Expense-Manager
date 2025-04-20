/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
// src/components/DateRangePicker.jsx
import React, { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { endOfMonth, format, startOfMonth } from "date-fns";

const formatDisplayDate = (date) => format(date, "dd-MM-yyyy");

const DateRangePicker = ({
  startDate,
  endDate,
  onStartDateChange = () => {},
  onEndDateChange = () => {},
  primaryColor = "blue",
}) => {
  const inputClass = `rounded-md px-3 py-2 w-full outline-none focus:ring-2 focus:ring-${primaryColor}-500`;
  const [internalStart, setInternalStart] = useState(startOfMonth(new Date()));
  const [internalEnd, setInternalEnd] = useState(endOfMonth(new Date()));

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 rounded-xl shadow-sm w-fit">
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <input
          type="date"
          className={inputClass}
          value={format(startDate, "yyyy-MM-dd")}
          onChange={(e) => onStartDateChange(new Date(e.target.value))}
        />
      </div>

      <span className="text-gray-500 text-sm">to</span>

      <div className="flex items-center gap-2 w-full sm:w-auto">
        <input
          type="date"
          className={inputClass}
          value={format(endDate, "yyyy-MM-dd")}
          onChange={(e) => onEndDateChange(new Date(e.target.value))}
        />
      </div>
    </div>
  );
};

export default DateRangePicker;
