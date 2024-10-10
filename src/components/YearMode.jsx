// YearModal.js
import React from "react";

const yearRanges = [
  { label: "24-25", value: "2024-2025" },
  { label: "23-24", value: "2023-2024" },
  { label: "22-23", value: "2022-2023" },
  { label: "21-22", value: "2021-2022" },
];

const YearModal = ({ closeModal, onYearChange }) => {
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={closeModal}
          className="absolute top-2 text-2xl font-bold right-2 text-white hover:text-gray-300"
        >
          &times;
        </button>
        <h2 className="text-white text-center text-lg font-semibold mb-4">
          Change Year
        </h2>

        <ul className="list-none">
          {yearRanges.map((range) => (
            <li
              key={range.value}
              onClick={() => onYearChange(range.value)}
              className="bg-white text-black py-2 px-4 rounded-md mb-2 hover:bg-purple-100 cursor-pointer"
            >
              {range.value}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default YearModal;
