import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const IndividualLedger = () => {
  const location = useLocation();
  const { member } = location.state || {};
  const [indiMember, setIndiMember] = useState({});
  const [head, setHead] = useState([]);
  const [Ledger, setLedger] = useState([]);

  useEffect(() => {
    let obj = {
      tranId: 12345,
      billDate: "15-06-2024",
      payDate: "20-06-2024",
      billNo: "B23434",
      dueDate: "22-06-2024",
      head: head.map((row, index) => ({
        heads: row,
        value: 2,
      })),
      totalAmtDue: "2300",
      billAmt: "2300",
      paidAmt: "2100",
      balance: "200",
    };
    setLedger([obj]);
  }, [head]);

  useEffect(() => {
    console.log(member.name);
    setIndiMember(member);
  }, [member]);

  useEffect(() => {
    // fetch maintenance head

    fetch("https://a3.arya-erp.in/api2/socapi/api/master/getHead")
      .then((response) => response.json())
      .then((data) => {
        let tableHead = [];

        data.map((item) => {
          tableHead.push(item.Header);
        });
        console.log(tableHead);
        setHead(tableHead);
      })
      .catch((error) => console.error(error));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    console.log("invoked handle save", {
      memberId: indiMember._id,
      ledger: Ledger,
    });
    try {
      let res = await axios.post(
        `https://a3.arya-erp.in/api2/socapi/api/member/Ledger/${indiMember._id}`,

        {
          memberId: indiMember._id,
          ledger: Ledger,
        }
      );

      console.log(res);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="px-5">
      <div>
        <button
          onClick={handleSave}
          className="bg-gray-700 px-4 py-2 rounded-md text-white"
        >
          Save
        </button>
      </div>
      <div className="flex justify-end flex-wrap gap-5">
        <div className="flex items-center">
          <span className="font-semibold mr-2">Member ID:</span>
          <span>{indiMember._id}</span>
        </div>
        <div className="flex items-center">
          <span className="font-semibold mr-2">Unit:</span>
          <span>{indiMember.flatNo}</span>
        </div>
      </div>

      <div className="overflow-x-auto mt-5">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3  whitespace-nowrap text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Transaction ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bill Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pay Date
              </th>
              <th className="px-6 py-3  whitespace-nowrap text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bill No.
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Due Date
              </th>
              {head.map((item) => (
                <th className="px-6 py-3  whitespace-nowrap text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {item}
                </th>
              ))}
              <th className="px-6 py-3  whitespace-nowrap text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Amount Due
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bill Amt
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Paid Amt
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Balance
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Ledger.map((transaction) => (
              <tr key={transaction.id}>
                <td className="px-6 border py-4 whitespace-nowrap text-sm text-gray-900">
                  {transaction.tranId}
                </td>
                <td className="px-6 border py-4 whitespace-nowrap text-sm text-gray-500">
                  {transaction.billDate}
                </td>
                <td className="px-6 border py-4 whitespace-nowrap text-sm text-gray-500">
                  {transaction.payDate}
                </td>
                <td className="px-6 border py-4 whitespace-nowrap text-sm text-gray-500">
                  {transaction.billNo}
                </td>
                <td className="px-6 border py-4 whitespace-nowrap text-sm text-gray-500">
                  {transaction.dueDate}
                </td>
                {transaction.head.map((item) => (
                  <td className="px-6 border py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.value}
                  </td>
                ))}
                <td className="px-6 border py-4 whitespace-nowrap text-sm text-gray-500">
                  {transaction.totalAmtDue}
                </td>
                <td className="px-6 border py-4 whitespace-nowrap text-sm text-gray-500">
                  {transaction.billAmt}
                </td>
                <td className="px-6 border py-4 whitespace-nowrap text-sm text-gray-500">
                  {transaction.paidAmt}
                </td>
                <td className="px-6 border py-4 whitespace-nowrap text-sm text-gray-500">
                  {transaction.balance}
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
