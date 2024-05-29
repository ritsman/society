import axios from "axios";
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Popup from "reactjs-popup";

const GroupView = () => {
  const navigate = useNavigate();

  const location = useLocation();
  const { row } = location.state || {};

  const handleClick = (row) => {
    navigate("/master/groups/updateGroup", { state: { row } });
  };

  const handleDelete = async (id, close) => {
    console.log("id", id);
    try {
      const res = await axios.delete(
        `https://a3.arya-erp.in/api2/socapi/api/master/deleteGroup/${id}`
      );
      console.log(res);
      navigate("/master/groups");
    } catch (error) {
      console.log(error);
    }
    close();
  };

  return (
    <div
      className="md:py-10 ml-36 overflow-y-auto gap-6"
      style={{ height: "calc(100vh - 150px)" }}
    >
      <div className="flex gap-5">
        <button
          onClick={() => handleClick(row)}
          className=" bg-gray-800 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
        >
          Edit
        </button>
        <Popup
          trigger={
            <button className=" bg-gray-800 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">
              delete
            </button>
          }
          position="center"
          contentStyle={{
            width: "400px",
            background: "white",
            borderRadius: "0.5rem",
            padding: "1rem",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
          }}
          overlayStyle={{
            background: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          modal
        >
          {(close) => (
            <div className="text-center ">
              <div className="text-xl text-black font-bold mb-4">
                Are you Sure, You want to Delete ?
              </div>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => handleDelete(row._id, close)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                >
                  Delete
                </button>
                <button
                  className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400"
                  onClick={close}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </Popup>
      </div>
      <div className="w-1/2 mt-10 border border-4 border-gray-600 shadow-xl rounded-md">
        <div className="bg-gray-600 shadow-xl p-4 text-gray-200">
          <h2 className="font-semibold text-2xl">{row.GroupName}</h2>
        </div>
        <div className="p-4 shadow-lg grid grid-cols-2">
          <h5 className="font-semibold">Under : {row.Under}</h5>
        </div>
      </div>
    </div>
  );
};

export default GroupView;
