import React from "react";
import { useNavigate } from "react-router-dom";

const GroupView = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/master/groups/newgroup");
  };

  return (
    <div
      className="md:py-10 ml-36 overflow-y-auto gap-6"
      style={{ height: "calc(100vh - 150px)" }}
    >
      <button
        onClick={handleClick}
        className=" bg-gray-800 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
      >
        Edit
      </button>
      <div className="w-1/2 mt-10 border border-4 border-gray-600 shadow-xl rounded-md">
        <div className="bg-gray-600 shadow-xl p-4 text-gray-200">
          <h2 className="font-semibold text-2xl">Group Name</h2>
        </div>
        <div className="p-4 shadow-lg grid grid-cols-2">
          <h5 className="font-semibold">Under</h5>
        </div>
      </div>
    </div>
  );
};

export default GroupView;
