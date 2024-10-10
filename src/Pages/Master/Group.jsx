import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import config from "../../config";

const header = ["Code", "Group", "Under"];
const Group = () => {
  const options = [
    { _id: 1, Code: "A1000", GroupName: "Branch/Divisions", Under: "Primary" },
    { _id: 2, Code: "B1000", GroupName: "Capital Account", Under: "Primary" },
    { _id: 3, Code: "C1000", GroupName: "Current Assets", Under: "Primary" },
    {
      _id: 4,
      Code: "D1000",
      GroupName: "Current Liabilities",
      Under: "Primary",
    },
    { _id: 5, Code: "E1000", GroupName: "Direct Expenses", Under: "Primary" },
    { _id: 6, Code: "F1000", GroupName: "Direct Incomes", Under: "Primary" },
    { _id: 7, Code: "G1000", GroupName: "Fixed Assets", Under: "Primary" },
    { _id: 8, Code: "H1000", GroupName: "Indirect Expenses", Under: "Primary" },
    { _id: 9, Code: "I1000", GroupName: "Indirect Incomes", Under: "Primary" },
    { _id: 10, Code: "J1000", GroupName: "Investments", Under: "Primary" },
    {
      _id: 11,
      Code: "K1000",
      GroupName: "Loans (Liability)",
      Under: "Primary",
    },
    {
      _id: 12,
      Code: "L1000",
      GroupName: "Misc. Expenses(ASSET)",
      Under: "Primary",
    },
    {
      _id: 13,
      Code: "M1000",
      GroupName: "Purchase Accounts",
      Under: "Primary",
    },
    { _id: 14, Code: "N1000", GroupName: "Sales Accounts", Under: "Primary" },
    { _id: 15, Code: "P1000", GroupName: "Suspense A/C", Under: "Primary" },
    {
      _id: 16,
      Code: "C1001",
      GroupName: "Bank Account",
      Under: "Current Assets",
    },
    {
      _id: 17,
      Code: "K1001",
      GroupName: "Bank OD A/C ",
      Under: "Loans(Liability)",
    },
    {
      _id: 18,
      Code: "C1002",
      GroupName: "Cash-in-hand",
      Under: "Current Assets",
    },
    {
      _id: 19,
      Code: "C1003",
      GroupName: "Deposits(Asset)",
      Under: "Current Assets",
    },
    {
      _id: 20,
      Code: "D1001",
      GroupName: "Duties & Taxes",
      Under: "Current Liabilities",
    },
    {
      _id: 21,
      Code: "C1004",
      GroupName: "Loans & Advancess (Assets)",
      Under: "Current Assets",
    },
    {
      _id: 22,
      Code: "D1002",
      GroupName: "provisions",
      Under: "Current Liabilities",
    },
    {
      _id: 23,
      Code: "B1001",
      GroupName: "Reserves & Surplus",
      Under: "Capital Account",
    },
    {
      _id: 24,
      Code: "K1002",
      GroupName: "Secured Loans",
      Under: "Loans(Liability)",
    },
    {
      _id: 25,
      Code: "C0005",
      GroupName: "Stock-in-hand",
      Under: "Current Assets",
    },
    {
      _id: 26,
      Code: "D1003",
      GroupName: "Sundry Creditors",
      Under: "Current Liabilities",
    },
    {
      _id: 27,
      Code: "C1006",
      GroupName: "Sundry Debtors",
      Under: "Current Assets",
    },
    {
      _id: 28,
      Code: "K1003",
      GroupName: "Unsecured Loans",
      Under: "Loans(Liability)",
    },
  ];
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/master/groups/newgroup");
  };

  const [groupData, setGroupData] = useState([]);
  useEffect(() => {
    fetch( `${config.API_URL}/api/master/getgroup`)
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
    options?.forEach((val) => {
      chkstat[val._id] = false;
    });
    setChkStat2(chkstat);
  }, [groupData]);

  const leadSet = (event) => {
    let c = {};
    Object.keys(chkstat2).forEach((key) => {
      if (!key.match(/^(1[0-9]|2[0-8]|[1-9])$/)) {
        c[key] = event.target.checked;
      }
    });
    setChkStat2(c);
  };

  useEffect(() => {
    console.log(chkstat2);
  }, [chkstat2]);

  const setTick = (row, event) => {
    console.log(row._id);
    chkstat2[row._id] = event.target.checked;
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

  const handleDelete = async () => {
    let arr = [];
    Object.keys(chkstat2).forEach((key) => {
      arr.push(key);
    });

    try {
      let res = await axios.delete(
        "https://a3.arya-erp.in/api2/socapi/api/master/"
      );
    } catch (error) {}
  };

  return (
    <div
      className="md:py-10 px-24 overflow-y-auto gap-6"
      style={{ height: "calc(100vh - 150px)" }}
    >
      {" "}
      <div className="flex gap-5">
        <button
          onClick={handleClick}
          className=" bg-gray-800 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
        >
          Add New
        </button>
        <button
          onClick={handleDelete}
          className=" bg-gray-800 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
        >
          Delete
        </button>
      </div>
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
              <tr key={index} className="hover:bg-gray-200 ">
                <td className="p-4 text-center">
                  <input
                    type="checkbox"
                    checked={chkstat2[row._id]}
                    disabled="true"
                    onChange={(event) => setTick(row, event)}
                    name={row._id}
                  />
                </td>
                <td className="p-4 text-center">{row.Code}</td>
                <td className="p-4 text-center">{row.GroupName}</td>
                <td className="p-4 text-center">{row.Under}</td>
              </tr>
            ))}
            {groupData.map((row, index) => (
              <tr key={index} className="hover:bg-gray-200 cursor-pointer">
                <td className="p-4 text-center">
                  <input
                    type="checkbox"
                    checked={chkstat2[row._id]}
                    onChange={(event) => setTick(row, event)}
                    name={row._id}
                  />
                </td>
                <td
                  onClick={() => show_record(row)}
                  className="p-4 text-center"
                >
                  {row.Code}
                </td>
                <td
                  onClick={() => show_record(row)}
                  className="p-4 text-center"
                >
                  {row.GroupName}
                </td>
                <td
                  onClick={() => show_record(row)}
                  className="p-4 text-center"
                >
                  {row.Under}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Group;
