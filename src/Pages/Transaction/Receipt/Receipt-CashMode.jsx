import { toast } from "react-toastify";
import axios from "axios";
import format from "date-fns/format";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

const ReceiptCashMode = ({ receiptData, setReceiptData, paymentMethod }) => {
  const [head, setHead] = useState([]);
  const [headValues, setHeadValues] = useState([]);

  function generateShortUUID() {
    return uuidv4().replace(/-/g, "").slice(0, 8);
  }


 // Calculate interest
 const calculateInterest = (data) => {
   return data.map((item) => {
    if (item.interestAfter && item.intRebate < item.balance) {
      const date = item.date ? new Date(item.date) : new Date();
      const interestAfter = new Date(item.interestAfter);
      const differenceInTime = date.getTime() - interestAfter.getTime();
      const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
      const differenceInMonths =
     (date.getFullYear() - interestAfter.getFullYear()) * 12 +
     (date.getMonth() - interestAfter.getMonth());      
     let interest = 0
     if (item.flatInt > 0) {
        interest = differenceInDays > 0 ? Number(item.flatInt) : 0;
        
     } else if (item.intMethod == "as per bill days" && !item.flatInt > 0) {
       interest = differenceInDays > 0 ? differenceInDays * item.intPerDay : 0;
     } else {
       interest =
         differenceInDays > 0 ? item.intPerMonth * differenceInMonths : 0;
     }

      return { ...item, interest };
    } else {
      return { ...item, interest: 0 };
    }
   });
 };

 useEffect(() => {
   if (receiptData.length > 0) {
     const updatedData = calculateInterest(receiptData);
     setReceiptData(updatedData);
   }
 }, []);

  useEffect(() => {
    // fetch maintenance head
    async function fetch() {
      try {
        let res = await axios.get("http://localhost:3001/api/master/getHead");
        console.log(res.data);
        let tableHead = [];

        res.data.map((item) => {
          tableHead.push(item.Header);
        });
        console.log(tableHead);
        setHead(tableHead);
        setHeadValues(
          tableHead.map((row, index) => ({
            heads: row,
            value: 2,
          }))
        );
      } catch (error) {
        console.log(error);
      }
    }

    fetch();
  }, []);

  useEffect(() => {
    console.log(headValues);
  }, [headValues]);

  const handleSave = async () => {
    console.log(receiptData);
    try {
      let res = await axios.post(
        "http://localhost:3001/api/transaction/postCashReceipt",
        receiptData
      );
      console.log(res);
      toast.success("successfully saved data");
    } catch (error) {
      console.log(error);
      toast.error("error in storing data");
    }
    // update member ledger
    const processReceipts = async (receiptData) => {
      for (const row of receiptData) {
        if (Number(row.amount) !== 0) {
          let uniqueId = generateShortUUID();
          try {
            let res = await axios.post(
              `http://localhost:3001/api/member/Ledger/${row.memberId}`,
              {
                memberId: row.memberId,
                ledger: [
                  {
                    tranId: uniqueId,
                    payMode: paymentMethod,
                    date: row.date,
                    billNo: "",
                    dueDate: "",
                    head: row.head,
                    totalAmtDue: Number(row.balance),
                    billAmt: Number(row.headTotal),
                    paidAmt: row.amount,
                    balance: row.balance - row.amount,
                  },
                ],
              }
            );

            console.log(res);
          } catch (error) {
            console.error(error);
          }

          // for society ledger

          console.log(paymentMethod, "method");
          if (paymentMethod == "cash") {
            console.log("inside cash ledger condition");
            try {
              let res = await axios.post(
                "http://localhost:3001/api/master/postCashAccLedger",
                {
                  tranId: uniqueId,
                  date: row.date,
                  ref: row.name,
                  billAmt: Number(row.headTotal) + Number(row.balance),
                  paidAmt: row.amount,
                  Balance: 0,
                }
              );

              console.log(res);
            } catch (error) {
              console.log(error);
            }
          }

          if (paymentMethod == "bank") {
            try {
              let res = await axios.post(
                "http://localhost:3001/api/master/postBankAccLedger",
                {
                  tranId: uniqueId,
                  date: row.date,
                  ref: row.name,
                  billAmt: Number(row.headTotal) + Number(row.balance),
                  paidAmt: row.amount,
                  Balance: 0,
                }
              );

              console.log(res);
            } catch (error) {
              console.log(error);
            }
          }
        }
      }
    };

    processReceipts(receiptData);
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
    // if (setReceiptdata) {
    
    
    setReceiptData(updatedData);
    const a = calculateInterest(receiptData);
    setReceiptData(a);
   
    // }
  };

  useEffect(()=>{
    console.log(receiptData)
  },[receiptData])

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
            <th className="px-4 py-2">Outstanding</th>
            <th className="px-4 py-2">Interst applied on</th>
            <th className="px-4 py-2">Interest</th>
            <th className="px-4 py-2">Total to be paid</th>
            <th className="px-4 py-2">Amount</th>

            {paymentMethod == "bank" && <th className="px-4 py-2">ChequeNo</th>}
            {paymentMethod == "bank" && <th className="px-4 py-2">ChqDate</th>}

            {paymentMethod == "bank" && <th className="px-4 py-2">Bank</th>}

            {paymentMethod == "bank" && <th className="px-4 py-2">Branch</th>}

            <th className="px-4 py-2">Narration</th>
          </tr>
        </thead>
        <tbody>
          {receiptData.map((item, index) => (
            <tr key={index} className="bg-white">
              <td className="border px-4 py-2">
                <input
                  type="date"
                  required
                  name="date"
                  value={item.date}
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
              <td className="border px-4 py-2">{item.interest > 0 ? item.intApplOn : 0}</td>
              <td className="border px-4 py-2">{(item.interest).toFixed(2)}</td>
              <td className="border px-4 py-2">{(Number(item.balance) + Number(item.interest)).toFixed(2)}</td>

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

              {paymentMethod == "bank" && (
                <td
                  className="border px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis"
                  contentEditable
                  onBlur={(e) =>
                    handleCellChange(index, "chequeNo", e.target.innerText)
                  }
                  onKeyDown={(e) => handleKeyDown(e, index, "chequeNo")}
                >
                  {item.chequeNo}
                </td>
              )}
              {paymentMethod == "bank" && (
                <td className="border px-4 py-2">
                  <input
                    type="date"
                    required
                    onChange={(e) =>
                      handleCellChange(index, "chequeDate", e.target.value)
                    }
                  />
                </td>
              )}

              {paymentMethod == "bank" && (
                <td
                  className="border px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis"
                  contentEditable
                  onBlur={(e) =>
                    handleCellChange(index, "bank", e.target.innerText)
                  }
                  onKeyDown={(e) => handleKeyDown(e, index, "bank")}
                >
                  {item.bank}
                </td>
              )}

              {paymentMethod == "bank" && (
                <td
                  className="border px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis"
                  contentEditable
                  onBlur={(e) =>
                    handleCellChange(index, "branch", e.target.innerText)
                  }
                  onKeyDown={(e) => handleKeyDown(e, index, "branch")}
                >
                  {item.branch}
                </td>
              )}

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
