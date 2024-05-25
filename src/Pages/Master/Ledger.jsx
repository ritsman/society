import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Ledger = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/master/ledger/newledger");
  };
  return (
    <div className="md:py-10 ml-36  overflow-y-auto  gap-6">
      <button
        onClick={handleClick}
        className=" bg-gray-800 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
      >
        Add New
      </button>
    </div>
  );
};

export default Ledger;
