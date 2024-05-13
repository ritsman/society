import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Ledger = ({ activeItem, setVisible, visible, handleItemClick }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/master/ledger/newledger");
  };
  const navItems = [{ name: "Add New", path: "/master/newledger" }];
  return (
    <div className="md:py-24 ml-36  overflow-y-auto  gap-6">
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
