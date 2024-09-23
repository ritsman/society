import { useEffect, useState } from "react";
import axios from "axios";
import config from "../../config";

const AllLedgers = () => {
  const [bankLedger, setBankLedger] = useState([]);
  const [cashLedger, setCashLedger] = useState([]);
  const [comninedLedger, setCombinedLedger] = useState([]);

  let runningBalance = 0;

  useEffect(() => {
    fetchBankACLedger();
    fetchCashACLedger();
  }, []);

  useEffect(() => {
    let arr = [...bankLedger, ...cashLedger];

    arr.sort((a, b) => {
      return new Date(a.date) - new Date(b.date);
    });

    setCombinedLedger(arr);
  }, [bankLedger, cashLedger]);

  async function fetchBankACLedger() {
    try {
      let res = await axios.get(
        `${config.API_URL}/api/master/getBankAccLedger`
      );
      console.log(res);
      setBankLedger(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchCashACLedger() {
    try {
      let res = await axios.get(
        `${config.API_URL}/api/master/getCashAccLedger`
      );
      console.log(res);
      setCashLedger(res.data);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="overflow-x-auto mt-5 px-5">
      <h1 className="text-center text-xl text-black mb-2 font-serif">
        Account Ledger
      </h1>
      <table className="min-w-full  bg-white">
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
          {comninedLedger.map((item) => {
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

export default AllLedgers;
