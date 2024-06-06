import React, { useState } from "react";
import format from "date-fns/format";
import { toast } from "react-toastify";
import axios from "axios";

const PaymentBankMode = ({
  paymentData,
  setPaymentData,
  codeNameMap,
  setFilteredCodes,
  filteredCodes,
}) => {
  const [showCodeSuggestions, setShowCodeSuggestions] = useState(false);

  const handleSave = async () => {
    console.log(paymentData);
    try {
      let res = await axios.post(
        "http://localhost:3001/api/transaction/postBankpayment",
        paymentData
      );
      console.log(res);
      toast.success("successfully saved data");
    } catch (error) {
      console.log(error);
      toast.error("error in storing data");
    }
  };

  const handleCodeSelection = (e, index, code) => {
    e.preventDefault();
    console.log(index, code, "index and code");
    const updatedData = [...paymentData];
    updatedData[index].code = code;
    updatedData[index].unitNo = codeNameMap[code] || "";
    setPaymentData(updatedData);
    setShowCodeSuggestions(false);
  };

  const handleCodeChange = (index, value) => {
    const updatedData = [...paymentData];
    updatedData[index].code = value;
    setPaymentData(updatedData);

    // Filter the codes based on the input value
    const filtered = Object.keys(codeNameMap).filter((code) =>
      code.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredCodes(filtered);
    setShowCodeSuggestions(true);
  };

  const handleCellChange = (index, field, value) => {
    const updatedData = [...paymentData];
    updatedData[index][field] = value;
    setPaymentData(updatedData);
  };
  return (
    <div>
      <div className="overflow-x-auto pt-5">
        <button
          onClick={handleSave}
          className="bg-gray-700 text-white font-semibold px-4 py-2 rounded-md mb-5"
        >
          Save
        </button>
        <table className="border-collapse w-full">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Code</th>
              <th className="px-4 py-2">UnitNo</th>
              <th className="px-4 py-2">Balance</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">ChequeNo</th>
              <th className="px-4 py-2">ChequeDate</th>
              <th className="px-4 py-2">Micr</th>
              <th className="px-4 py-2">Bank</th>
              <th className="px-4 py-2">Branch</th>
              <th className="px-4 py-2">Narration</th>
            </tr>
          </thead>
          <tbody>
            {paymentData.map((item, index) => (
              <tr key={index} className="bg-white">
                <td className="border px-4 py-2">
                  <input
                    type="date"
                    value={item.date || format(new Date(), "yyyy-MM-dd")}
                    onChange={(e) =>
                      handleCellChange(index, "date", e.target.value)
                    }
                  />
                </td>
                <td className="border px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis">
                  <input
                    type="text"
                    value={item.code}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    // onBlur={() => setShowCodeSuggestions(false)}
                  />
                  {showCodeSuggestions && (
                    <div className="bg-white z-10 absolute border rounded-md shadow-md">
                      {filteredCodes.map((code) => (
                        <div
                          key={code}
                          className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                          onClick={(e) => handleCodeSelection(e, index, code)}
                        >
                          {code}
                        </div>
                      ))}
                    </div>
                  )}
                </td>
                <td
                  className="border px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis"
                  contentEditable
                  onKeyDown={(e) => handleKeyDown(e, index, "unitNo")}
                >
                  {item.unitNo}
                </td>
                <td
                  className="border px-4 py-2"
                  contentEditable
                  onBlur={(e) =>
                    handleCellChange(index, "balance", e.target.innerText)
                  }
                  onKeyDown={(e) => handleKeyDown(e, index, "balance")}
                >
                  {item.balance}
                </td>
                <td
                  className="border px-4 py-2"
                  contentEditable
                  onBlur={(e) =>
                    handleCellChange(index, "amount", e.target.innerText)
                  }
                  onKeyDown={(e) => handleKeyDown(e, index, "amount")}
                >
                  {item.amount}
                </td>
                <td
                  className="border px-4 py-2"
                  contentEditable
                  onBlur={(e) =>
                    handleCellChange(index, "chequeNo", e.target.innerText)
                  }
                  onKeyDown={(e) => handleKeyDown(e, index, "chequeNo")}
                >
                  {item.principle}
                </td>
                <td className="border px-4 py-2">
                  <input
                    type="date"
                    value={item.chequeDate || format(new Date(), "yyyy-MM-dd")}
                    onChange={(e) =>
                      handleCellChange(index, "chequeDate", e.target.value)
                    }
                  />
                </td>
                <td
                  className="border px-4 py-2"
                  contentEditable
                  onBlur={(e) =>
                    handleCellChange(index, "micr", e.target.innerText)
                  }
                  onKeyDown={(e) => handleKeyDown(e, index, "micr")}
                >
                  {item.principleBalance}
                </td>
                <td
                  className="border px-4 py-2"
                  contentEditable
                  onBlur={(e) =>
                    handleCellChange(index, "bank", e.target.innerText)
                  }
                  onKeyDown={(e) => handleKeyDown(e, index, "bank")}
                >
                  {item.interestBalance}
                </td>
                <td
                  className="border px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis"
                  contentEditable
                  onBlur={(e) =>
                    handleCellChange(index, "branch", e.target.innerText)
                  }
                  onKeyDown={(e) => handleKeyDown(e, index, "branch")}
                >
                  {item.narration}
                </td>
                <td
                  className="border px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis"
                  contentEditable
                  onBlur={(e) =>
                    handleCellChange(index, "narration", e.target.innerText)
                  }
                  onKeyDown={(e) => handleKeyDown(e, index, "narration")}
                >
                  {item.narration}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentBankMode;
