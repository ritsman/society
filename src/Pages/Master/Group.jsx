import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const header = ["Group", "Under"];
const Group = () => {
  const options = [
    "Bank Accounts",
    "Current Assets",
    "Bank OD A/c",
    "Loans (Liability)",
    "Cash-in-hand",
    "Current Assets",
    "Deposits (Asset)",
    "Current Assets",
    "Duties & Taxes",
    "Current Liabilities",
    "Loans & Advances (Asset)",
    "Current Assets",
    "Provisions",
    "Current Liabilities",
    " Reserves & Surplus",
    "Capital Account",
    "Secured Loans",
    "Loans (Liability)",
    "Stock-in-hand",
    "Current Assets",
    "Sundry Creditors",
    "Current Liabilities",
    "Sundry Debtors",
    "Current Assets",
    "Unsecured Loans",
    "Loans (Liability)",
  ];
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/master/groups/newgroup");
  };

  const [groupData, setGroupData] = useState([]);
  useEffect(() => {
    fetch(" https://a3.arya-erp.in/api2/socapi/api/master/getgroup")
      .then((response) => response.json())
      .then((data) => setGroupData(data));
  }, []);
  console.log(groupData);
  const [chkstat2, setChkStat2] = useState({});

  useEffect(() => {
    const chkstat = {};
    groupData?.forEach((val) => {
      chkstat[val._id] = false;
    });
    setChkStat2(chkstat);
  }, [groupData]);

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
      className="md:py-10 px-24 overflow-y-auto gap-6"
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
            {options.map((row, index) => (
              <tr key={index} className="hover:bg-gray-200">
                <td className="p-4">
                  <input
                    type="checkbox"
                    checked={chkstat2[row._id]}
                    onChange={(event) => setTick(row, event)}
                    name={row._id}
                  />
                </td>
                <td className="p-4">{row}</td>
                <td className="p-4">Primary</td>
              </tr>
            ))}
            {groupData.map((row, index) => (
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
                <td className="p-4">{row.GroupName}</td>
                <td className="p-4">{row.Under}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Group;
