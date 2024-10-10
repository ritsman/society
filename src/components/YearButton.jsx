// YearButton.js
import React, { useState } from "react";
import YearModal from "./YearMode";
import { BsCalendar2Date } from "react-icons/bs";

const YearButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState("2024-2025");

  const handleClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleYearChange = (newYear) => {
    setSelectedYear(newYear);
    closeModal();
  };

  return (
    <div>
      <button
        onClick={handleClick}
        className="bg-gray-700 flex gap-2 items-center text-white px-4 py-2 rounded-lg"
      >
        <p>
          <BsCalendar2Date />
        </p>

        <p>{selectedYear}</p>
      </button>
      {isModalOpen && (
        <YearModal closeModal={closeModal} onYearChange={handleYearChange} />
      )}
    </div>
  );
};

export default YearButton;
