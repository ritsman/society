import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const IndividualLedger = () => {
  const location = useLocation();
  const { member } = location.state || {};
  const [indiMember, setIndiMember] = useState({});
  const [head, setHead] = useState([]);
  const [Ledger, setLedger] = useState({});

  // useEffect(() => {
  //   let obj = {
  //     tranId: 1234566,
  //     billDate: "15-06-2024",
  //     payDate: "20-06-2024",
  //     billNo: "B23434",
  //     dueDate: "22-06-2024",
  //     head: head.map((row, index) => ({
  //       heads: row,
  //       value: 2,
  //     })),
  //     totalAmtDue: "2300",
  //     billAmt: "2300",
  //     paidAmt: "2100",
  //     balance: "200",
  //   };
  //   setLedger([obj]);
  // }, [head]);

  useEffect(() => {
    console.log(member.name);
    setIndiMember(member);
  }, [member]);

  useEffect(() => {
    // fetch maintenance head
    async function fetch() {
      try {
        let res = await axios.get(
          "https://a3.arya-erp.in/api2/socapi/api/master/getBillHeads"
        );
        console.log(res.data);
        let tableHead = [];

        res.data.map((item) => {
          tableHead.push(item);
        });
        console.log(tableHead);
        setHead(tableHead);
      } catch (error) {
        console.log(error);
      }
    }

    fetch();
  }, []);

  useEffect(() => {
    fetch();
  }, [indiMember]);

  async function fetch() {
    try {
      let res = await axios.get(
        `https://a3.arya-erp.in/api2/socapi/api/member/Ledger/${indiMember._id}`
      );
      console.log(res.data);
      setLedger(res.data.data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    console.log(Ledger);
  }, [Ledger]);

  return (
    <div className="px-5">
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
                Date
              </th>

              <th className="px-6 py-3  whitespace-nowrap text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bill No.
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Due Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment Mode
              </th>

              {head.map((item) => (
                <th className="px-6 py-3  whitespace-nowrap text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {item.billHead}
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
            {Ledger &&
              Ledger.ledger &&
              Ledger.ledger.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="px-6 border py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.tranId}
                  </td>
                  <td className="px-6 border py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.date}
                  </td>

                  <td className="px-6 border py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.billNo}
                  </td>
                  <td className="px-6 border py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.dueDate}
                  </td>
                  <td className="px-6 border py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.payMode}
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
