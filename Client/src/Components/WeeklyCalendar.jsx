/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { ChevronLeftIcon, ChevronRight } from "lucide-react";
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

  useEffect(() => {
    updateWeek(initialDate, 0);
  }, []);

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
    const newOffset = Math.round((getMonday(initialDate) - getMonday(date)) / (1000 * 60 * 60 * 24 * 7));
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
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  return (
    <div className="bg-white rounded-lg shadow-md max-w-md relative">
      <div className="flex justify-between items-center gap-2">
        <button onClick={previousWeek} className="p-3 bg-gray-100 rounded hover:bg-gray-200">
          <ChevronLeftIcon className="w-4 h-4" />
        </button>
        <div className="flex items-center">
          <h2 className="text-sm font-bold mr-2">{getWeekRange()}</h2>
          <button onClick={nextWeek} className="p-3 bg-gray-100 rounded hover:bg-gray-200">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <button onClick={() => setShowMonthCalendar(!showMonthCalendar)} className="p-2 rounded-full bg-blue-100 hover:bg-blue-200">
          📅
        </button>
      </div>
      {showMonthCalendar && (
        <div className="absolute top-full left-0 right-0 bg-white border rounded shadow p-4 mt-2">
          <div className="flex justify-between mb-2">
            <button onClick={previousMonth} className="p-2 bg-gray-200 rounded hover:bg-gray-300">Prev</button>
            <h2 className="text-lg font-bold">{currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
            <button onClick={nextMonth} className="p-2 bg-gray-200 rounded hover:bg-gray-300">Next</button>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {generateMonthDays().map((date, index) => (
              <div
                key={index}
                onClick={() => date && selectWeekFromMonth(date)}
                className={`p-2 text-center ${date && getMonday(date).getTime() === getMonday(currentWeek[0]).getTime() ? 'bg-blue-200' : 'hover:bg-gray-100'} ${!date ? 'text-gray-300' : 'cursor-pointer'}`}
              >
                {date ? date.getDate() : ""}
              </div>
            ))}
          </div>
          <button onClick={() => setShowMonthCalendar(false)} className="mt-2 bg-gray-200 p-2 rounded hover:bg-gray-300">
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default WeeklyCalendar;
