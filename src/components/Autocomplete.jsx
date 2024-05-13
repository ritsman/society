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
          option.toLowerCase().includes(value.toLowerCase()) &&
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
    <div>
      <>
        <input
          required
          className="w-full px-3 py-2 border focus:outline-none border-gray-300 rounded"
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          ref={inputRef}
          onKeyDown={handleKeyDown}
        />
        <ul className="mt-5">
          {filteredOptions.map((option, i) => (
            <li
              key={i}
              onClick={() => handleSelectOption(option)}
              className={
                selectedIndex === i
                  ? "selected bg-gray-800 text-white py-1 rounded pl-2"
                  : ""
              }
            >
              {option}
            </li>
          ))}
        </ul>
      </>
    </div>
  );
};

export default AutoComplete;
