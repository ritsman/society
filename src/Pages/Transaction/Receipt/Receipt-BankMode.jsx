import { toast } from "react-toastify";
import axios from "axios";
import format from "date-fns/format";

const ReceiptBankMode = ({ receiptData, setReceiptdata }) => {
  const handleSave = async () => {
    console.log(receiptData);
    try {
      let res = await axios.post(
        "https://a3.arya-erp.in/api2/socapi/api/transaction/postBankReceipt",
        receiptData
      );
      console.log(res);
      toast.success("successfully saved data");
    } catch (error) {
      console.log(error);
      toast.error("error in storing data");
    }
  };
  const handleKeyDown = (e, index, field) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleCellChange(index, field, e.target.innerText);
      e.target.blur();
    }
  };

  const handleCellChange = (index, field, value) => {
    const updatedData = [...receiptData];
    updatedData[index][field] = value;
    if (setReceiptdata) {
      setReceiptdata(updatedData);
    }
  };
  return (
    <div>
      <button
        onClick={handleSave}
        className="bg-gray-700 text-white font-semibold px-4 py-2 rounded-md mb-5"
      >
        Save
      </button>
      <div className="overflow-x-auto">
        <table className="border-collapse w-full ">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Code</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Balance</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Principal</th>
              <th className="px-4 py-2">Interest</th>

              <th className="px-4 py-2">ChequeNo</th>

              <th className="px-4 py-2">ChqDate</th>

              <th className="px-4 py-2">PrincipalBalance</th>
              <th className="px-4 py-2">InterestBalance</th>
              <th className="px-4 py-2">Micr</th>

              <th className="px-4 py-2">Bank</th>

              <th className="px-4 py-2">Branch</th>

              <th className="px-4 py-2">Narration</th>
            </tr>
          </thead>
          <tbody>
            {receiptData.map((item, index) => (
              <tr key={index} className="bg-white">
                <td className="border px-4 py-2">
                  <input
                    type="date"
                    onChange={(e) =>
                      handleCellChange(index, "date", e.target.value)
                    }
                  />
                </td>
                <td className="border px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis">
                  {item.code}
                </td>
                <td className="border px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis">
                  {item.name}
                </td>
                <td className="border px-4 py-2">{item.balance}</td>
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
                    handleCellChange(index, "chequeNo", e.target.innerText)
                  }
                  onKeyDown={(e) => handleKeyDown(e, index, "chequeNo")}
                >
                  {item.chequeNo}
                </td>

                <td className="border px-4 py-2">
                  <input
                    type="date"
                    value={item.chqDate || format(new Date(), "yyyy-MM-dd")}
                    onChange={(e) =>
                      handleCellChange(index, "chqDate", e.target.value)
                    }
                  />
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
                    handleCellChange(index, "micr", e.target.innerText)
                  }
                  onKeyDown={(e) => handleKeyDown(e, index, "micr")}
                >
                  {item.narration}
                </td>
                <td
                  className="border px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis"
                  contentEditable
                  onBlur={(e) =>
                    handleCellChange(index, "bank", e.target.innerText)
                  }
                  onKeyDown={(e) => handleKeyDown(e, index, "bank")}
                >
                  {item.narration}
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

export default ReceiptBankMode;