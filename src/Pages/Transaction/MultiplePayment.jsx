import React, { useEffect, useState } from "react";
import format from "date-fns/format";
import axios from "axios";

const MultiplePayment = () => {
  const [paymentData, setPaymentData] = useState([
    {
      date: format(new Date(), "dd/MM/yyyy"),
      code: "",
      name: "",
      balance: "",
      amount: "",
      checkNo: "",
      checkDate: format(new Date(), "dd/MM/yyyy"),
      micr: "",
      bank: "",
      branch: "",
      narration: "",
    },
  ]);
  const [data, setData] = useState([]);
  const [showCodeSuggestions, setShowCodeSuggestions] = useState(false);
  const [filteredCodes, setFilteredCodes] = useState([]);
  const [codeNameMap, setCodeNameMap] = useState({});

  useEffect(() => {
    async function fetch() {
      try {
        let result = await axios.get(
          "https://a3.arya-erp.in/api2/socapi/api/master/getUnitHead"
        );
        let obj = {};
        console.log(result.data);
        result.data.map((item) => {
          obj[item.code] = item.unitHead;
        });
        setCodeNameMap(obj);
      } catch (error) {
        console.log(error);
      }
    }
    fetch();
  }, []);

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

  const handleCodeSelection = (e, index, code) => {
    e.preventDefault();
    console.log(index, code, "index and code");
    const updatedData = [...paymentData];
    updatedData[index].code = code;
    updatedData[index].name = codeNameMap[code] || "";
    setPaymentData(updatedData);
    setShowCodeSuggestions(false);
  };

  const handleSave = async () => {
    console.log(paymentData);
  };
  return (
    <div className="py-5 px-10">
      <p className="text-center text-2xl font-bold">Multiple Payment</p>
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
              <th className="px-4 py-2">Name</th>
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
                <td className="border px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis">
                  {item.date}
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
                  onKeyDown={(e) => handleKeyDown(e, index, "name")}
                >
                  {item.name}
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
                    handleCellChange(index, "checkDate", e.target.innerText)
                  }
                  onKeyDown={(e) => handleKeyDown(e, index, "checkDate")}
                >
                  {item.checkDate}
                </td>
                <td
                  className="border px-4 py-2"
                  contentEditable
                  onBlur={(e) =>
                    handleCellChange(
                      index,
                      "principleBalance",
                      e.target.innerText
                    )
                  }
                  onKeyDown={(e) => handleKeyDown(e, index, "principleBalance")}
                >
                  {item.principleBalance}
                </td>
                <td
                  className="border px-4 py-2"
                  contentEditable
                  onBlur={(e) =>
                    handleCellChange(
                      index,
                      "interestBalance",
                      e.target.innerText
                    )
                  }
                  onKeyDown={(e) => handleKeyDown(e, index, "interestBalance")}
                >
                  {item.interestBalance}
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

export default MultiplePayment;
