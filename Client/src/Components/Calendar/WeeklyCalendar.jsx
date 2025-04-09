/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import {
  Calendar,
  ChevronLeft,
  ChevronLeftIcon,
  ChevronRight,
} from "lucide-react";
import React, { useState, useEffect } from "react";

const WeeklyCalendar = ({
  onDateSelect = () => {},
  initialDate = new Date(),
  highlightToday = true,
  primaryColor = "blue",
  weekOffset,
  setWeekOffset,
}) => {
  const [currentWeek, setCurrentWeek] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showMonthCalendar, setShowMonthCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getMonday = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  };

  const formatDate = (date) => {
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  const updateWeek = (baseDate, newOffset) => {
    const monday = getMonday(baseDate);
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      weekDates.push(day);
    }
    setCurrentWeek(weekDates);
    setWeekOffset(newOffset);
  };

  useEffect(() => {
    updateWeek(initialDate, 0);
  }, []);


  const handleDateSelect = (date) => {
    setSelectedDate(date);
    onDateSelect(date);
  };

  const previousWeek = () => {
    const prevWeekDate = new Date(currentWeek[0]);
    prevWeekDate.setDate(prevWeekDate.getDate() - 7);
    updateWeek(prevWeekDate, weekOffset + 1);
  };

  const nextWeek = () => {
    const nextWeekDate = new Date(currentWeek[0]);
    nextWeekDate.setDate(nextWeekDate.getDate() + 7);
    updateWeek(nextWeekDate, weekOffset - 1);
  };

  const getWeekRange = () => {
    if (currentWeek.length < 7) return "";
    return `${formatDate(currentWeek[0])} - ${formatDate(currentWeek[6])}`;
  };

  const selectWeekFromMonth = (date) => {
    const newOffset = Math.round(
      (getMonday(initialDate) - getMonday(date)) / (1000 * 60 * 60 * 24 * 7)
    );
    updateWeek(date, newOffset);
    setShowMonthCalendar(false);
  };

  const generateMonthDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    let firstDayOfWeek = firstDay.getDay();
    firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
    const daysArray = [];
    for (let i = 0; i < firstDayOfWeek; i++) {
      daysArray.push(null);
    }
    for (let i = 1; i <= lastDay.getDate(); i++) {
      daysArray.push(new Date(year, month, i));
    }
    return daysArray;
  };

  const previousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  return (
    <div className="bg-white rounded-lg max-w-md relative">
      <div className="flex items-center border border-gray-200 rounded-md bg-white whitespace-nowrap">
        <button
          onClick={previousWeek}
          className="px-2 py-2 border-r border-gray-300 text-gray-600"
        >
          <ChevronLeft size={16} />
        </button>

        {/* Modified to make the date range clickable to show calendar */}
        <button
          onClick={() => setShowMonthCalendar(!showMonthCalendar)}
          // className="px-4 py-3 rounded-md hover:bg-blue-50 transition-colors duration-200 text-gray-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-300 flex items-center"
          className="flex items-center gap-2 px-3 py-2"
        >
          {/* <Calendar size={16} className="text-gray-500" /> */}
          <span>{getWeekRange()}</span>
        </button>

        <button
          onClick={nextWeek}
          className="px-2 py-2 border-l border-gray-300  text-gray-600"
        >
          <ChevronRight size={16} />
        </button>
      </div>
      {showMonthCalendar && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-xl p-4 mt-2 z-10">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={previousMonth}
              className="p-2 text-sm rounded-md bg-gray-50 hover:bg-gray-100 transition-colors duration-200 text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </button>
            <h2 className="text-md font-bold text-gray-800">
              {currentMonth.toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </h2>
            <button
              onClick={nextMonth}
              className="p-2 text-sm rounded-md bg-gray-50 hover:bg-gray-100 transition-colors duration-200 text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {["M", "T", "W", "T", "F", "S", "S"].map((day, idx) => (
              <div
                key={idx}
                className="p-2 text-center text-xs font-medium text-gray-500"
              >
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {generateMonthDays().map((date, index) => (
              <div
                key={index}
                onClick={() => date && selectWeekFromMonth(date)}
                className={`p-2 text-center rounded-md transition-colors duration-200
                  ${
                    !date
                      ? "text-gray-300"
                      : "cursor-pointer text-gray-700 hover:bg-blue-50"
                  } 
                  ${
                    date &&
                    getMonday(date).getTime() ===
                      getMonday(currentWeek[0]).getTime()
                      ? "bg-blue-100 text-blue-700 font-medium"
                      : ""
                  }
                  ${
                    date && date.toDateString() === new Date().toDateString()
                      ? "ring-1 ring-blue-400"
                      : ""
                  }
                `}
              >
                {date ? date.getDate() : ""}
              </div>
            ))}
          </div>
          <div className="flex justify-end mt-4">
            <button
              onClick={() => setShowMonthCalendar(false)}
              className="px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-600 transition-colors duration-200 text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklyCalendar;
