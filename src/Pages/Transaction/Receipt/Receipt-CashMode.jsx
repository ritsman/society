

import { toast } from "react-toastify";
import axios from "axios";
import format from "date-fns/format";
import { useState, useEffect ,useRef} from "react";
import { v4 as uuidv4 } from "uuid";
import { HotTable } from "@handsontable/react";
import "handsontable/dist/handsontable.full.css";
import { registerAllModules } from "handsontable/registry";
import config from "../../../config";

const ReceiptCashMode = ({ receiptData, setReceiptData, paymentMethod, pay}) => {
  const [head, setHead] = useState([]);
  const [headValues, setHeadValues] = useState([]);
  const [tableRow , setTableRow] = useState([]);
  const [openingBal, setOpeningBal] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [gridRow, setGridRow] = useState([]);



    const handleSearch = (event) => {
      const trimmedSearchTerm = event.target.value.toLowerCase();
      setSearchTerm(trimmedSearchTerm);

      if (trimmedSearchTerm) {
        setTableRow(
          gridRow.filter(
            (row) =>
              row.name.toLowerCase().includes(trimmedSearchTerm) ||
              row.code.toString().includes(trimmedSearchTerm)
          )
        );
      } else {
        setTableRow(gridRow);
      }
    };



  function generateShortUUID() {
    return uuidv4().replace(/-/g, "").slice(0, 8);
  }

  const hotTableRef = useRef(null);
  registerAllModules();

  // Calculate interest
  const calculateInterest = (data) => {
    return data.map((item) => {
      console.log(item.date)
       let openBal = openingBal.filter(e=>e.id == item.memberId);

       console.log(item.interestAfter);
      if (item.interestAfter) {
        console.log(item.billDate, "billDate");

        const date = item.date ? new Date(item.date) : new Date();
        const interestAfter = new Date(item.interestAfter);
        const billDate = new Date(item.billDate)
        const differenceInTime = date.getTime() - interestAfter.getTime();
        const differenceInTimes = date.getTime() - billDate.getTime();
        const differenceInDays = Math.ceil(
          differenceInTime / (1000 * 3600 * 24)
        );
       const differenceInDay = Math.ceil(
         differenceInTimes / (1000 * 3600 * 24)
       );
        const differenceInMonths =
          (date.getFullYear() - interestAfter.getFullYear()) * 12 +
          (date.getMonth() - interestAfter.getMonth());
        let interest = 0;
        if (item.isFlatInt && item.flatInt > 0) {
                             

          interest = differenceInDays > 0 ? Number(item.flatInt) : 0;
        } else if (
          item.intMethod == "as per due date" &&
          !item.isFlatInt &&
          Number(item.intRebate) < Number(item.balance)
        ) {
             interest = differenceInDays > 0 ? differenceInDays * item.intPerDay : 0;
            
        }else if (
          item.intMethod == "as per bill date" &&
          !item.isFlatInt &&
          Number(item.intRebate) < Number(item.balance)
        ) {
           interest =
             differenceInDay > 0 ? differenceInDay * item.intPerDay : 0;
        } else {
          interest =
            differenceInMonths > 0 ? item.intPerMonth * differenceInMonths : 0;
        }
          console.log(interest)
        return {
          ...item,
          interest:Number(interest) +Number(item.billInterest)
             
        };
      } else {
        console.log("due date not exist")
        return { ...item, interest: openBal.length > 0
              ? Number(openBal[0].interest) :0 };
      }
    });
  };

  useEffect(() => {
    if (receiptData.length > 0) {
      const updatedData = calculateInterest(receiptData);
      setReceiptData(updatedData);
    }
  }, [openingBal]);

  useEffect(() => {
    // fetch maintenance head
    async function fetch() {
      try {
        let res = await axios.get(
         `${config.API_URL}/api/master/getHead`
        );
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
        `${config.API_URL}/api/transaction/postCashReceipt`,
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

          let remainingAmount = Number(row.amount);
          let newInterest = Number(row.interest);
          let newBalance = Number(row.balance) - (Number(row.openingPrincipal)+Number(row.openingInterest));

          // Subtract from interest first
          if (remainingAmount <= newInterest) {
            newInterest -= remainingAmount;
            remainingAmount = 0;
          } else {
            remainingAmount -= newInterest;
            newInterest = 0;
          }

          // Subtract the remaining amount from balance
          newBalance -= remainingAmount;

          // Function to generate tranId based on payment method
          const generateTranId = (pay, uniqueId) => {
            if (pay === "cash") {
              return `CR/24/${uniqueId}`; // Cash transaction
            } else if (pay === "bank") {
              return `BR/24/${uniqueId}`; // Bank transaction
            }
            return `TR/24/${uniqueId}`; // Default (if pay isn't cash or bank)
          };

          try {
            let res = await axios.post(
              `${config.API_URL}/api/member/Ledger/${row.memberId}`,
              {
                memberId: row.memberId,
                ledger: [
                  {
                    tranId: generateTranId(pay, uniqueId),
                    ref: paymentMethod,
                    date: row.date,
                    particulars: "",
                    debit: "-",
                    credit: row.amount,
                    billNo: "",
                    mode: "pay",
                    interest: row.interest,

                    billAmt: row.amount,

                    balance: newBalance,
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
                `${config.API_URL}/api/master/postCashAccLedger`,
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
                `${config.API_URL}/api/master/postBankAccLedger`,
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

  // const handleCellChange = (index, field, value) => {
  //   const updatedData = [...receiptData];
  //   updatedData[index][field] = value;
  //   // if (setReceiptdata) {

  //   setReceiptData(updatedData);
  //   const a = calculateInterest(receiptData);
  //   setReceiptData(a);

  //   // }
  // };

  useEffect(() => {
    console.log(receiptData);
  }, [receiptData]);

  const handleAfterChange = (changes)=>{
 if (changes) {
   const updatedData = [...receiptData];
   changes.forEach(([row, prop, oldValue, newValue]) => {
     updatedData[row][prop] = newValue;
   });
   setReceiptData(updatedData)
   console.log(updatedData)
   let a = calculateInterest(updatedData);
   console.log(a)
   setReceiptData(a);
 }
  }

    useEffect(() => {
      try {
        fetch(`${config.API_URL}/api/transaction/getOpeningBalance`)
          .then((response) => response.json())
          .then((data) => setOpeningBal(data))
          .catch((error) => console.error(error));
      } catch (error) {
        console.log(error);
      }
    }, []);

  useEffect(()=>{
      let arr = []

      receiptData.forEach((item)=>{

        let obj = {
          date: item.date,
          code: item.code,
          name: item.name,
          balance: item.balance,
          intApplOn: item.isBillGenerated ? item.intApplOn : 0,
          pWithoutInterest:
            item.isBillGenerated
              ? (parseFloat(item.balance) - parseFloat(item.intApplOn)).toFixed(
                  2
                )
              : 0,
          interest: item.interest.toFixed(2),
          total: (Number(item.balance) + Number(item.interest)).toFixed(2),
          amount: item.amount,
          narration: item.narration,
        };
        arr.push(obj);
      })
        console.log(arr)
        setGridRow(arr)
       setTableRow(arr);
  },[receiptData])

  return (
    <div>
      <div className="flex gap-5">
        <div>
          <button
            onClick={handleSave}
            className="bg-gray-700 text-white font-semibold px-4 py-2 rounded-md mb-5"
          >
            Save
          </button>
        </div>
        <div>
          <input
            type="text"
            placeholder="Search by Name and flat no"
            value={searchTerm}
            onChange={handleSearch}
            className=" w-[300px] px-4 py-1 border rounded"
          />
        </div>
      </div>
      <HotTable
        data={tableRow}
        colHeaders={[
          "Date",
          "Flat No",
          "Name",
          "Total Arrears",
          "Principal with Interest",
          "Principal without Interest",
          "Interest",
          "Total",
          "Amount",
          "Narration",
        ]}
        columns={[
          {
            data: "date",
            type: "date",
            dateFormat: "YYYY-MM-DD",
            correctFormat: true,
            allowInvalid: false,
          },
          { data: "code", width: 100 },
          { data: "name", width: 150 },
          { data: "balance", readOnly: true, width: 100 },
          { data: "intApplOn", readOnly: true, width: 150 },
          { data: "pWithoutInterest", readOnly: true, width: 170 },
          { data: "interest", readOnly: true, width: 100 },
          { data: "total", readOnly: true, width: 150 },
          { data: "amount", type: "numeric", width: 100 },
          { data: "narration", width: 100 },
        ]}
        afterChange={handleAfterChange}
        licenseKey="non-commercial-and-evaluation" // for Handsontable license
        contextMenu={true}
        autoWrapRow={true}
        autoWrapCol={true}
        multiColumnSorting={true}
        filters={true}
        dropdownMenu={true}
      />
    </div>
  );
};

export default ReceiptCashMode;

