import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const header = [
  "Name",
  "Comapany Name",
  "Email",
  "Mobile Number",
  "Address",
  "City",
  "Account Number",
  "Bank",
];
const Ledger = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/master/ledger/partyLedger/newledger");
  };

  const [ledgerData, setLedgerData] = useState([]);
  useEffect(() => {
    fetch("https://a3.arya-erp.in/api2/socapi/api/master/getLedger")
      .then((response) => response.json())
      .then((data) => setLedgerData(data));
  }, []);
  console.log(ledgerData);
  const [chkstat2, setChkStat2] = useState({});

  useEffect(() => {
    const chkstat = {};
    ledgerData?.forEach((val) => {
      chkstat[val._id] = false;
    });
    setChkStat2(chkstat);
  }, [ledgerData]);

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
      className="md:py-10 px-10 overflow-y-auto gap-6"
      style={{ height: "calc(100vh - 150px)" }}
    >
      <button
        onClick={handleClick}
        className=" bg-gray-800 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
      >
        Add New
      </button>
      <div className="w-screen overflow-x-auto shadow-lg  mt-6 rounded-lg  ">
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
            {ledgerData.map((row, index) => (
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
                <td className="p-4">{row.data.name}</td>
                <td className="p-4">{row.data.companyName}</td>
                <td className="p-4">{row.data.email}</td>
                <td className="p-4">{row.data.mobile}</td>
                <td className="p-4">{row.data.address}</td>
                <td className="p-4">{row.data.city}</td>
                <td className="p-4">{row.data.acc_no}</td>
                <td className="p-4">{row.data.bank}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Ledger;
