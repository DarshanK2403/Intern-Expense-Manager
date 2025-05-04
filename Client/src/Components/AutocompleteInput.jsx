/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useForm } from 'react-hook-form';

/**
 * Reusable Autocomplete Input Component
 * 
 * @param {Object} props
 * @param {string} props.name - Field name for React Hook Form
 * @param {string} props.label - Label text for the input
 * @param {string} props.placeholder - Placeholder text for the input
 * @param {Array<Object>} props.suggestions - Array of suggestion objects to display
 * @param {Function} props.onSelect - Optional callback when an item is selected
 * @param {boolean} props.required - Whether the field is required
 * @param {string} props.className - Additional class name for the container
 * @param {string} props.valueField - The key for the value to store (e.g., '_id')
 * @param {string} props.displayField - The key for the value to display (e.g., 'label')
 */
const AutocompleteInput = ({
  name,
  label,
  placeholder = "Search or select...",
  suggestions = [],
  onSelect,
  required = false,
  className = "",
  valueField = "_id",
  displayField = "label",
}) => {
  const { register, setValue, watch } = useForm();
  const inputValue = watch(name, "");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Memoize filtered suggestions to prevent unnecessary recalculations
  const filteredSuggestions = useMemo(() => {
    if (!inputValue) return suggestions;
    return suggestions.filter((s) =>
      s[displayField]?.toLowerCase().includes(inputValue.toLowerCase())
    );
  }, [inputValue, suggestions, displayField]);

  // Reset active index when filtered suggestions change
  useEffect(() => {
    setActiveIndex(-1);
  }, [filteredSuggestions]);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!showSuggestions || filteredSuggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex(prev =>
          prev < filteredSuggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex(prev =>
          prev > 0 ? prev - 1 : filteredSuggestions.length - 1
        );
        break;
      case "Enter":
        if (activeIndex >= 0) {
          e.preventDefault();
          handleSelectSuggestion(filteredSuggestions[activeIndex]);
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        break;
      default:
        break;
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target) &&
        !inputRef.current?.contains(e.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get the register function with specific options
  const { ref, ...rest } = register(name, { required });

  // Handle selecting a suggestion
  const handleSelectSuggestion = (suggestion) => {
    const value = suggestion[valueField];  // This is the ObjectId or value to store
    const display = suggestion[displayField]; // This is the label to display

    setValue(name, value); // Store the ObjectId or full object
    setShowSuggestions(false);
    if (onSelect) onSelect(suggestion); // Pass the full object to the callback
    inputRef.current?.blur();
  };

  // Handle clearing the input
  const handleClearInput = () => {
    setValue(name, "");
    inputRef.current?.focus();
    if (onSelect) onSelect("");
  };

  // Display value (for showing label in the input)
  const displayValue = useMemo(() => {
    const matched = suggestions.find((s) => s[valueField] === inputValue);
    return matched ? matched[displayField] : inputValue;
  }, [inputValue, suggestions, valueField, displayField]);

  return (
    <div className={`relative w-full ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          id={name}
          type="text"
          placeholder={placeholder}
          autoComplete="off"
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          {...rest}
          value={displayValue} // Use display value here
          ref={(e) => {
            ref(e);
            inputRef.current = e;
          }}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
        />
        {inputValue && (
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            onClick={handleClearInput}
            aria-label={`Clear ${label || name}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {showSuggestions && filteredSuggestions.length > 0 && (
        <ul
          ref={suggestionsRef}
          className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto"
        >
          {filteredSuggestions.map((suggestion, index) => (
            <li
              key={suggestion[valueField]}
              onClick={() => handleSelectSuggestion(suggestion)}
              className={`px-4 py-2 text-sm cursor-pointer ${
                index === activeIndex
                  ? "bg-blue-100 text-blue-800"
                  : "hover:bg-gray-50"
              }`}
            >
              {suggestion[displayField]}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutocompleteInput;
