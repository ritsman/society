import { useEffect, useState } from "react";
import axios from "axios";

const CashAccLedger = () => {
  const [cashLedger, setCashLedger] = useState([]);

  let runningBalance = 0;

  useEffect(() => {
    fetchCashACLedger();
  }, []);

  async function fetchCashACLedger() {
    try {
      let res = await axios.get(
        "http://localhost:3001/api/master/getCashAccLedger"
      );
      console.log(res);
      setCashLedger(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="overflow-x-auto mt-5 px-5">
      <h1 className="text-center text-xl font-serif mb-2">
        Cash Account Ledger
      </h1>
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
              Ref
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Bill Amt
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Paid Amt
            </th>

            <th className="px-6 py-3  whitespace-nowrap text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              balance
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {cashLedger.map((item) => {
            runningBalance += parseFloat(item.paidAmt);
            return (
              <tr>
                <td className="px-6 border py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.tranId}
                </td>
                <td className="px-6 border py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.date}
                </td>

                <td className="px-6 border py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.ref}
                </td>
                <td className="px-6 border py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.billAmt}
                </td>
                <td className="px-6 border py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.paidAmt}
                </td>

                <td className="px-6 border py-4 whitespace-nowrap text-sm text-gray-500">
                  {runningBalance.toFixed(2)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CashAccLedger;
