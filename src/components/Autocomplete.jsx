import React, { useState, useRef } from "react";

const AutoComplete = ({ options, onSelect }) => {
  const [inputValue, setInputValue] = useState("");
  const [selectedValues, setSelectedValues] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    filterOptions(value);
  };

  const filterOptions = (value) => {
    setFilteredOptions(
      options.filter(
        (option) =>
          option?.toLowerCase().includes(value.toLowerCase()) &&
          !selectedValues.includes(option)
      )
    );
    setSelectedIndex(-1);
  };

  const handleSelectOption = (option) => {
    setSelectedValues([...selectedValues, option]);
    setInputValue(option);
    inputRef.current.focus();
    setFilteredOptions([]);
    onSelect(option);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prevIndex) =>
        prevIndex < filteredOptions.length - 1 ? prevIndex + 1 : prevIndex
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : -1));
    } else if (e.key === "Enter" && selectedIndex !== -1) {
      e.preventDefault();
      handleSelectOption(filteredOptions[selectedIndex]);
    }
  };

  return (
    <div className="relative">
      <input
        required
        className="w-full px-3 py-2 border focus:outline-none border-gray-300 rounded"
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        ref={inputRef}
        onKeyDown={handleKeyDown}
      />
      <ul className="absolute left-0 right-0 mt-1 bg-white border border-gray-300 rounded shadow-lg z-10 max-h-60 overflow-y-auto">
        {filteredOptions.map((option, i) => (
          <li
            key={i}
            onClick={() => handleSelectOption(option)}
            className={`cursor-pointer hover:bg-gray-100 py-1 px-2 ${
              selectedIndex === i ? "bg-gray-800 text-white" : ""
            }`}
          >
            {option}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AutoComplete;
