import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const header = ["Maintenance Heads", "Under"];
const MaintenanceHead = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/master/maintenance-head/new-maintenanceHead");
  };

  const [mmData, setMMData] = useState([]);
  useEffect(() => {
    fetch("http://localhost:3001/api/master/getHead")
      .then((response) => response.json())
      .then((data) => setMMData(data));
  }, []);
  console.log(mmData);
  const [chkstat2, setChkStat2] = useState({});

  useEffect(() => {
    const chkstat = {};
    mmData?.forEach((val) => {
      chkstat[val._id] = false;
    });
    setChkStat2(chkstat);
  }, [mmData]);

  const leadSet = (event) => {
    let c = {};
    Object.keys(chkstat2).forEach((key) => {
      c[key] = event.target.checked;
    });
    setChkStat2(c);
  };

  const setTick = (contact, event) => {
    chkstat2[contact._id] = event.target.checked;
    const c = {
      ...chkstat2,
    };
    setChkStat2(c);
  };

  const show_record = (row) => {
    const { _id } = row;
    console.log(`id:${_id}`);

    navigate(`${_id}`, { state: { row } });
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
        Add New
      </button>
      <div className="max-w-max overflow-x-auto shadow-lg  mt-6 rounded-lg ">
        <table className="rounded-md">
          <thead className="bg-gray-700 text-slate-200">
            <tr>
              <th className="p-4 ">
                <input type="checkbox" onChange={(event) => leadSet(event)} />
              </th>
              {header.map((head, index) => (
                <th className="p-4" key={index}>
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-300">
            {mmData.map((row, index) => (
              <tr
                key={index}
                onClick={() => show_record(row)}
                className="hover:bg-gray-200 cursor-pointer"
              >
                <td className="p-4">
                  <input
                    type="checkbox"
                    checked={chkstat2[row._id]}
                    onChange={(event) => setTick(row, event)}
                    name={row._id}
                  />
                </td>
                <td className="p-4">{row.Header}</td>
                <td className="p-4">{row.Under}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MaintenanceHead;
