/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { ChevronLeftIcon, ChevronRightIcon, CalendarIcon } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";

const MonthlyCalendar = ({
  onMonthSelect = () => {},
  initialDate = new Date(),
  highlightCurrentMonth = true,
  primaryColor = "blue",
  monthOffset = 0,
  setMonthOffset = () => {},
}) => {
  const [currentYear, setCurrentYear] = useState(initialDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(initialDate.getMonth());
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const monthsShort = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Update internal state when monthOffset changes
  useEffect(() => {
    const newDate = new Date(initialDate);
    newDate.setMonth(initialDate.getMonth() - monthOffset); // Reverse offset direction
    setCurrentYear(newDate.getFullYear());
    setSelectedMonth(newDate.getMonth());
  }, [monthOffset, initialDate]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle month selection
  const handleMonthSelect = (monthIndex) => {
    setSelectedMonth(monthIndex);
    const newOffset = initialDate.getMonth() - monthIndex; // Reverse the offset calculation
    setMonthOffset(newOffset);
    onMonthSelect(new Date(currentYear, monthIndex, 1));
    setIsDropdownOpen(false);
  };

  // Navigate to previous month (offset +1)
  const previousMonth = () => {
    setMonthOffset((prev) => prev + 1);
  };

  // Navigate to next month (offset -1)
  const nextMonth = () => {
    setMonthOffset((prev) => prev - 1);
  };

  const getColorClasses = () => {
    switch (primaryColor) {
      case "red":
        return {
          button: "text-red-700 border-red-300 hover:bg-red-50",
          selected: "bg-red-500 text-white",
          hover: "hover:bg-red-100",
          focus: "focus:ring-red-500",
        };
      case "green":
        return {
          button: "text-green-700 border-green-300 hover:bg-green-50",
          selected: "bg-green-500 text-white",
          hover: "hover:bg-green-100",
          focus: "focus:ring-green-500",
        };
      default:
        return {
          button: "text-blue-700 border-blue-300 hover:bg-blue-50",
          selected: "bg-blue-500 text-white",
          hover: "hover:bg-blue-100",
          focus: "focus:ring-blue-500",
        };
    }
  };

  const colorClasses = getColorClasses();

  return (
    <div className="bg-white flex rounded-lg max-w-md relative">
      <button
        onClick={previousMonth}
        aria-label="Previous Month"
        className="px-2 py-2 border-r border-gray-300 text-gray-600"
      >
        <ChevronLeftIcon className="w-4 h-4" />
      </button>

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          aria-expanded={isDropdownOpen}
          aria-haspopup="true"
          className="flex items-center gap-2 px-3 py-2"
        >
          <span>
            {months[selectedMonth]} {currentYear}
          </span>
        </button>

        {isDropdownOpen && (
          <div className="absolute w-max top-full left-0 right-0 bg-white border translate-x-[-20%] border-gray-200 rounded-lg shadow-xl p-4 mt-4 z-10">
            <div className="flex justify-between items-center mb-2 px-1">
              <button
                onClick={() => setCurrentYear(currentYear - 1)}
                className="p-1 rounded-md hover:bg-gray-100"
              >
                <ChevronLeftIcon className="w-4 h-4" />
              </button>
              <span className="font-medium">{currentYear}</span>
              <button
                onClick={() => setCurrentYear(currentYear + 1)}
                className="p-1 rounded-md hover:bg-gray-100"
              >
                <ChevronRightIcon className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-1">
              {monthsShort.map((month, index) => (
                <button
                  key={index}
                  onClick={() => handleMonthSelect(index)}
                  className={`p-1 text-sm rounded-md ${
                    selectedMonth === index
                      ? colorClasses.selected
                      : "hover:bg-gray-100"
                  }`}
                >
                  {month}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <button
        onClick={nextMonth}
        aria-label="Next Month"
        className="px-2 py-2 border-l border-gray-300  text-gray-600"
      >
        <ChevronRightIcon className="w-4 h-4" />
      </button>
    </div>
  );
};

export default MonthlyCalendar;
