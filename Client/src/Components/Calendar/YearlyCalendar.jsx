/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

const YearlyCalendar = ({
  onYearSelect = () => {},
  initialYear = new Date().getFullYear(),
  yearOffset = 0,
  setYearOffset = () => {},
  highlightCurrentYear = true,
  primaryColor = "blue",
}) => {
  const [selectedYear, setSelectedYear] = useState(initialYear);
  const [startYear, setStartYear] = useState(initialYear - 6);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Sync with yearOffset
  useEffect(() => {
    const newYear = initialYear - yearOffset;
    setSelectedYear(newYear);
    setStartYear(newYear - 6);
  }, [yearOffset, initialYear]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getColorClasses = () => {
    switch (primaryColor) {
      case "red":
        return {
          selected: "bg-red-500 text-white",
          hover: "hover:bg-red-100",
        };
      case "green":
        return {
          selected: "bg-green-500 text-white",
          hover: "hover:bg-green-100",
        };
      default:
        return {
          selected: "bg-blue-500 text-white",
          hover: "hover:bg-blue-100",
        };
    }
  };

  const colorClasses = getColorClasses();

  const handleYearClick = (year) => {
    setSelectedYear(year);
    const offset = initialYear - year; // reverse offset
    setYearOffset(offset);
    onYearSelect(year);
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative bg-white flex rounded-lg shadow max-w-xs">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-2 px-4 py-2"
      >
        {selectedYear}
      </button>

      {isDropdownOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 mt-2 z-10 bg-white border border-gray-200 shadow-lg rounded-md p-4 w-64"
        >
          <div className="flex justify-between items-center mb-2">
            <button
              onClick={() => setStartYear((prev) => prev - 12)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </button>
            <span className="font-semibold">
              {startYear} - {startYear + 11}
            </span>
            <button
              onClick={() => setStartYear((prev) => prev + 12)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 12 }, (_, i) => {
              const year = startYear + i;
              const isSelected = year === selectedYear;
              const isCurrent = year === new Date().getFullYear();

              return (
                <button
                  key={year}
                  onClick={() => handleYearClick(year)}
                  className={`p-2 rounded-md text-sm font-medium transition ${
                    isSelected
                      ? colorClasses.selected
                      : isCurrent && highlightCurrentYear
                      ? "border border-blue-500 text-blue-500"
                      : "text-gray-700 " + colorClasses.hover
                  }`}
                >
                  {year}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default YearlyCalendar;
