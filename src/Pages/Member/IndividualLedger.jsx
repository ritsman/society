

import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const IndividualLedger = () => {
  const location = useLocation();
  const { member } = location.state || {};
  const [indiMember, setIndiMember] = useState({});
  const [head, setHead] = useState([]);
  const [Ledger, setLedger] = useState({});
  const [filteredLedger, setFilteredLedger] = useState([]); // State for filtered ledger

  const [startDate, setStartDate] = useState(""); // State for start date
  const [endDate, setEndDate] = useState(""); // State for end date

  useEffect(() => {
    setIndiMember(member);
  }, [member]);

  useEffect(() => {
    // fetch maintenance head
    async function fetch() {
      try {
        let res = await axios.get(
          "https://a3.arya-erp.in/api2/socapi/api/master/getBillHeads"
        );
        let tableHead = res.data.map((item) => item);
        setHead(tableHead);
      } catch (error) {
        console.log(error);
      }
    }

    fetch();
  }, []);

  useEffect(() => {
    fetchLedger();
  }, [indiMember]);

  async function fetchLedger() {
    try {
      let res = await axios.get(
        `https://a3.arya-erp.in/api2/socapi/api/member/Ledger/${indiMember._id}`
      );
      setLedger(res.data.data);
      setFilteredLedger(res.data.data.ledger); // Set filtered ledger initially
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    console.log(Ledger);
  }, [Ledger]);

  // Handle filtering based on date range
  const handleFilter = () => {
    if (startDate && endDate) {
      const filtered = Ledger.ledger.filter((transaction) => {
        const transactionDate = new Date(transaction.date);
        return (
          transactionDate >= new Date(startDate) &&
          transactionDate <= new Date(endDate)
        );
      });
      setFilteredLedger(filtered);
    } else {
      setFilteredLedger(Ledger.ledger); // Reset to all transactions if no dates selected
    }
  };

  return (
    <div className="px-5">
      <div className="flex justify-between flex-wrap gap-5">
        <div className="flex items-center">
          <span className="font-semibold mr-2">Member name:</span>
          <span>{indiMember.name}</span>
        </div>
        <div className="flex items-center">
          <span className="font-semibold mr-2">Flat No:</span>
          <span>{indiMember.flatNo}</span>
        </div>
      </div>

      {/* Date range filter */}
      <div className="mt-5 flex gap-4">
        <div>
          <label htmlFor="startDate" className="font-semibold mr-2">
            Start Date:
          </label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border px-2 py-1 rounded"
          />
        </div>
        <div>
          <label htmlFor="endDate" className="font-semibold mr-2">
            End Date:
          </label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border px-2 py-1 rounded"
          />
        </div>
        <button
          onClick={handleFilter}
          className="bg-gray-700 text-white px-3 py-1 rounded"
        >
          Filter
        </button>
      </div>

      <div className="overflow-x-auto mt-5">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 whitespace-nowrap text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reference No
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Net Balance
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredLedger &&
              filteredLedger.map((transaction) => (
                <tr
                  key={transaction.id}
                  className={`${
                    transaction.mode === "bill" ? "text-blue-800" : "text-black"
                  }`}
                >
                  <td className="px-6 border py-4 whitespace-nowrap text-sm ">
                    {transaction.date}
                  </td>
                  <td className="px-6 border py-4 whitespace-nowrap text-sm ">
                    {transaction.tranId}
                  </td>
                  <td className="px-6 border py-4 whitespace-nowrap text-sm ">
                    {Number(transaction.billAmt).toFixed(2)}
                  </td>
                  <td className="px-6 border py-4 whitespace-nowrap text-sm ">
                    {Number(transaction.balance).toFixed(2)}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IndividualLedger;
