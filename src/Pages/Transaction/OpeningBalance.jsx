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
  const [data, setData] = useState([]);

  const opBalanceTypes = ["Members", "Creditors", "General Ledger"];

  useEffect(() => {
    async function fetch() {
      try {
        let result = await axios.get(
          "https://a3.arya-erp.in/api2/socapi/api/member/getMemberList"
        );
        console.log(result.data);
        let arr = result.data.map((item, index) => {
          let filteredBal = [];
          filteredBal = data.filter((row) => row.unitNo == item.flatNo);
          console.log(filteredBal);
          return {
            seqNo: index + 1,
            ownerName: `${item.firstName} ${item.lastName}`,
            unitNo: item.flatNo,
            principle: filteredBal.length > 0 ? filteredBal[0].principle : 0,
            interest: filteredBal.length > 0 ? filteredBal[0].interest : 0,
            total:
              filteredBal.length > 0
                ? filteredBal[0].principle * (1 + filteredBal[0].interest / 100)
                : 0,
          };
        });
        setMembers(arr);
      } catch (error) {
        console.log(error);
      }
    }
    fetch();
  }, [data]);

  useEffect(() => {
    async function fetch() {
      try {
        let res = await axios.get(
          "https://a3.arya-erp.in/api2/socapi/api/transaction/getOpeningBalance"
        );
        console.log(res.data);
        setData(res.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetch();
  }, []);

  const handleSave = async () => {
    console.log(members);
    try {
      let res = await axios.post(
        "https://a3.arya-erp.in/api2/socapi/api/transaction/postOpeningBalance",
        members
      );
      console.log(res);
      toast.success("successfully saved data");
    } catch (error) {
      toast.error("error in storing data");
    }
  };

  const handleKeyDown = (e, index, field) => {
    console.log("invoked");

    if (e.key === "Enter") {
      e.preventDefault();
      handleCellChange(index, field, e.target.innerText);
      e.target.blur();
    }
  };

  const handleCellChange = (index, field, value) => {
    console.log("invoked", index, field, value);
    const updatedData = [...members];
    updatedData[index][field] = value;
    if (field == "interest") {
      updatedData[index]["total"] = (
        updatedData[index]["principle"] *
        (1 + updatedData[index]["interest"] / 100)
      ).toFixed(2);
    }
    console.log(updatedData);
    setMembers(updatedData);
  };

  return (
    <div>
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
        <table className="border-collapse w-full">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="px-4 py-2">seq no</th>
              <th className="px-4 py-2">owner name</th>
              <th className="px-4 py-2">unit no</th>
              <th className="px-4 py-2">principle</th>
              <th className="px-4 py-2">interest</th>
              <th className="px-4 py-2">total</th>
            </tr>
          </thead>
          <tbody>
            {members.map((item, index) => (
              <tr key={index} className="bg-white">
                <td className="border px-4 py-2">{item.seqNo}</td>

                <td className="border px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis">
                  {item.ownerName}
                </td>
                <td className="border px-4 py-2">{item.unitNo}</td>
                <td
                  className="border px-4 py-2"
                  contentEditable
                  onBlur={(e) =>
                    handleCellChange(index, "principle", e.target.innerText)
                  }
                  onKeyDown={(e) => handleKeyDown(e, index, "principle")}
                >
                  {item.principle}
                </td>
                <td
                  className="border px-4 py-2"
                  contentEditable
                  onBlur={(e) =>
                    handleCellChange(index, "interest", e.target.innerText)
                  }
                  onKeyDown={(e) => handleKeyDown(e, index, "interest")}
                >
                  {item.interest}
                </td>
                <td
                  className="border px-4 py-2"
                  contentEditable
                  onBlur={(e) =>
                    handleCellChange(index, "total", e.target.innerText)
                  }
                  onKeyDown={(e) => handleKeyDown(e, index, "total")}
                >
                  {item.total}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OpeningBalance;
