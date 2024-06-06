import { toast } from "react-toastify";
import axios from "axios";
import format from "date-fns/format";

const ReceiptCashMode = ({ receiptData, setReceiptdata }) => {
  const handleSave = async () => {
    console.log(receiptData);
    try {
      let res = await axios.post(
        "https://a3.arya-erp.in/api2/socapi/api/transaction/postCashReceipt",
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
    setReceiptdata(updatedData);
  };
  return (
    <div>
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
            <th className="px-4 py-2">Principle</th>
            <th className="px-4 py-2">Interest</th>
            <th className="px-4 py-2">PrincipleBalance</th>
            <th className="px-4 py-2">InterestBalance</th>
            <th className="px-4 py-2">Narration</th>
          </tr>
        </thead>
        <tbody>
          {receiptData.map((item, index) => (
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
                  handleCellChange(index, "interestBalance", e.target.innerText)
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReceiptCashMode;
