import axios from "axios";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const OpeningBalance = () => {
  const [opBalanceType, setOpBalanceType] = useState("Members");
  const [asOnDate, setAsOnDate] = useState("04-06-2024");
  const [dueDate, setDueDate] = useState("31-03-2021");
  const [billSeriesName, setBillSeriesName] = useState("Maintenance Bill");
  const [netBalance, setNetBalance] = useState(0);
  const [members, setMembers] = useState([]);

  const opBalanceTypes = ["Members", "Creditors", "General Ledger"];
  const [tableRow, setTableRow] = useState([]);
  const [data, setData] = useState([]);
  const [head, setHead] = useState([]);
  const [list, setList] = useState([]);

  const [chkstat2, setChkStat2] = useState({});

  useEffect(() => {
    const chkstat = {};
    data?.forEach((val) => {
      chkstat[val._id] = false;
    });
    setChkStat2(chkstat);
  }, [data]);

  // console.log("chk2");
  // console.log(chkstat2);

  const leadSet = (event) => {
    let c = {};
    Object.keys(chkstat2).forEach((key) => {
      console.log(key);
      c[key] = event.target.checked;
    });
    console.log(`c:`);
    console.log(c);
    setChkStat2(c);
  };

  const setTick = (contact, event) => {
    chkstat2[contact._id] = event.target.checked;
    console.log(contact);
    console.log(chkstat2);
    const c = {
      ...chkstat2,
    };
    console.log(c);
    setChkStat2(c);
  };

  //asdflkadsf
  let tableHeads = [
    "Name",
    "Mobile No.",
    "Email",
    "Address",
    "Flat No.",
    "Wing No.",
  ];
  let tableHead = [];

  useEffect(() => {
    try {
      fetch("http://localhost:3001/api/member/getOpeningMember")
        .then((response) => response.json())
        .then((data) => setList(data))
        .catch((error) => console.error(error));
    } catch (error) {}

    let arr = data.map((item) => {
      return {
        name: item.name,
        mobileNo: item.registeredMobileNo,
        email: item.email,
        address: item.permanentAddress,
        flatNo: item.flatNo,
        wingNo: item.wingNo,
        head: head.map((row, index) => ({
          heads: row,
          value: item.head?.[index]?.value || 0,
        })),
      };
    });

    setTableRow(arr);
  }, [head, data]);

  useEffect(() => {
    fetch("http://localhost:3001/api/member/getMemberList")
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error(error));

    // fetch maintenance head

    fetch("https://a3.arya-erp.in/api2/socapi/api/master/getHead")
      .then((response) => response.json())
      .then((data) => {
        tableHead = [];

        data.map((item) => {
          tableHead.push(item.Header);
        });
        setHead(tableHead);
      })
      .catch((error) => console.error(error));
  }, []);

  const handleRowValueChange = (item, rowIndex, event) => {
    const newHead = [...item.head];
    newHead[rowIndex].value = event.target.value;
    setTableRow((prevTableRow) =>
      prevTableRow.map((row) =>
        row === item ? { ...row, head: newHead } : row
      )
    );
  };

  const handleSave = async () => {
    console.log(tableRow, "table Head");
    try {
      let res = await axios.post(
        "http://localhost:3001/api/member/postOpeningMember",
        tableRow
      );
      console.log(res);
      toast.success("successfully saved data");
    } catch (error) {
      console.log(error);
      toast.error("error in storing data");
    }
  };

  return (
    <div>
      <h1 className="text-center text-2xl ">Opening Balance</h1>

      <div className="flex items-center space-x-4 pt-10 px-10">
        <div className="flex flex-col gap-3">
          <label>Op. Balance type</label>
          <select
            className="border border-gray-300 rounded py-1 px-2"
            value={opBalanceType}
            onChange={(e) => setOpBalanceType(e.target.value)}
          >
            {opBalanceTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-3">
          <label>As on date</label>

          <input
            type="text"
            className="border border-gray-300 rounded py-1 px-2"
            value={asOnDate}
            onChange={(e) => setAsOnDate(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-3">
          <label>Due date</label>

          <input
            type="date"
            className="border border-gray-300 rounded py-1 px-2"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-3">
          <label>Bill Series Name</label>

          <select
            className="border border-gray-300 rounded py-1 px-2"
            value={billSeriesName}
            onChange={(e) => setBillSeriesName(e.target.value)}
          >
            {" "}
            <option value="">Select Bill Type</option>
            <option value="maintenance bill">Maintenance Bill</option>
          </select>
        </div>
        <div className="flex flex-col gap-3">
          <label>Net Balance</label>

          <input
            type="text"
            className="border border-gray-300 rounded py-1 px-2"
            value={netBalance}
          />
        </div>
        <div>
          <button className="text-black rounded-md ml-24 hover:text-white hover:bg-gray-700 px-4 py-2 border-2 border-gray-700">
            Search
          </button>
        </div>
      </div>
      <div className="mt-10 px-10">
        <button
          onClick={handleSave}
          className="px-4 py-2 border-2 mb-5 rounded-md bg-gray-600 text-white"
        >
          Save
        </button>
        <div className="max-w-max overflow-x-auto shadow-lg m-auto mt-6  rounded-lg ">
          <table className="rounded-md">
            <thead className="bg-gray-700 text-slate-200">
              <tr>
                {tableHeads.map((item) => (
                  <th
                    className="p-4 whitespace-nowrap overflow-hidden text-ellipsis "
                    key={item}
                  >
                    {item}
                  </th>
                ))}
                {head.map((item) => (
                  <th
                    className="p-4 whitespace-nowrap overflow-hidden text-ellipsis "
                    key={item}
                  >
                    {item}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-300">
              {tableRow.map((item, index) => (
                <tr key={index} className="">
                  <td className="p-4 whitespace-nowrap overflow-hidden text-ellipsis">
                    {item.name}
                  </td>
                  <td className="p-4 text-center whitespace-nowrap overflow-hidden text-ellipsis">
                    {item.mobileNo}
                  </td>
                  <td>{item.email}</td>
                  <td className="p-4 whitespace-nowrap overflow-hidden text-ellipsis text-center">
                    {item.address}
                  </td>
                  <td className="p-4 whitespace-nowrap overflow-hidden text-ellipsis text-center">
                    {item.flatNo}
                  </td>
                  <td className="p-4 whitespace-nowrap overflow-hidden text-ellipsis text-center">
                    {item.wingNo}
                  </td>
                  {item.head.map((row, rowIndex) => (
                    <td className=" text-center" key={rowIndex}>
                      <input
                        type="text"
                        value={row.value}
                        onChange={(event) =>
                          handleRowValueChange(item, rowIndex, event)
                        }
                        className="text-center"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OpeningBalance;
