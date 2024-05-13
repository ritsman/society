import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Ledger = ({ activeItem, setVisible, visible, handleItemClick }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/master/ledger/newledger");
  };

  return (
    <>
      <div className="pl-5 md:flex md:justify-end pt-24 md:pr-20">
        <span>
          <a href="/">Home</a> &gt; <a href="/master">Master</a> &gt;
          <span className="font-semibold"> Ledger</span>
        </span>
      </div>
      <div className="pt-10 ml-36 h-screen overflow-y-auto  gap-6">
        <button
          onClick={handleClick}
          className=" bg-gray-800 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
        >
          Add New
        </button>
      </div>
    </>
  );
};

export default Ledger;
