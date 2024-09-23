import React, { useEffect, useState } from "react";
import axios from "axios";

import ReceiptBankMode from "./Receipt-BankMode";
import ReceiptCashMode from "./Receipt-CashMode";
import { isEqual } from "date-fns";
import config from "../../../config";

const MultipleReceipt = () => {
  const [cashReceiptData, setCashReceiptData] = useState([]);
  const [bankReceiptData, setBankReceiptData] = useState([]);
  // const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  const [account, setAccount] = useState("");
  const [isView, setIsView] = useState(false);
  const [billGenerated, setBillGenerated] = useState([]);
  const [interstRate,setInterstRate] = useState(0);
  const [intRebate , setIntRebate] = useState(0);
  const [intMethod , setIntMethod] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [flatInt , setFlatInt] = useState(0);
  const [isFlatInt , setIsFlatInt] = useState(0);
 
   useEffect(()=>{
       async function fetchInt(){
            try {
                let res = await axios.get(
                  `${config.API_URL}/api/master/getBillMaster`
                );
                setInterstRate(res.data[0].interestRatePerMonth);
                setIntRebate(res.data[0].interestRebateUptoRs)
                setIntMethod(res.data[0].interestCalculationMethod)
                setFlatInt(res.data[0].flatInterestAmount);
                setIsFlatInt(res.data[0].isFlatInterest)
                
            } catch (error) {
              console.log(error);
            }

            // calculate interest amount 
             

       }
       fetchInt();
   },[])

   useEffect(()=>{console.log(interstRate)},[interstRate])

    const formatDate = (date) => date.toISOString().split("T")[0];

    function calculateOutstanding(filteredRec, filteredBillGenerated) {
     if (
       !filteredBillGenerated ||
       Object.keys(filteredBillGenerated).length === 0
     ) {
       return 0;
     }

      const bill =
        filteredBillGenerated.billDetails[
          filteredBillGenerated.billDetails.length - 1
        ];
      const billDate = new Date(bill.billDate);

      // If filteredRec is empty, return the current bill amount
      if (!filteredRec || !filteredRec.paid || filteredRec.paid.length === 0) {
        return bill.currentBillAmt;
      }

      // Filter payments made after the bill date
      // const paymentsAfterBillDate = filteredRec.paid.filter(
      //   (payment) => new Date(payment.date) > billDate
      // );

      // Calculate the total paid amount after the bill date
      // const totalPaid = paymentsAfterBillDate.reduce(
      //   (sum, payment) => sum + payment.amount,
      //   0
      // );

      // Calculate the outstanding amount
      // const outstandingAmount = bill.currentBillAmt - totalPaid;

      return (Number(filteredRec.balance)).toFixed(2);
    }


  useEffect(() => {
        const today = new Date();

    async function fetch() {
      try {
        let res = await axios.get(
          `${config.API_URL}/api/society/getBills`
        );
        console.log(res.data);
        const updatedReceiptData = res.data.map((item) => {
          let filteredRec = [];
          filteredRec = data2.filter((row) => row.code == item.data.flatNo);

          let filteredBillGenerated = billGenerated.filter(
            (a) => a.memberId == item.data.memberId
          );
          console.log(filteredBillGenerated);

          // update previous due 
           
          async function updateDue(){
               try {
                let res = await axios.put(
                  `${config.API_URL}/api/society/update-prev-due`,
                  {
                    billId: item._id,
                    prevDue: calculateOutstanding(
                      filteredRec[0],
                      filteredBillGenerated[0]
                    ),
                  }
                );
                console.log(res)
               } catch (error) {
                console.log(error);
               }
          }
          updateDue();

          // end of update previous due

          console.log(filteredRec);
          return {
            headTotal: item.data.total,
            head: item.data.head,
            memberId: item.data.memberId,
            date: formatDate(today),
            mode: paymentMethod,
            code: item.data.flatNo,
            name: item.data.ownerName,
            chequeNo: null,
            chequeDate: null,
            bank: null,
            branch: null,
            intRebate: intRebate,
            intPerDay: (item.data.intAppliedAmt * (interstRate / 100)) / 30,
            intPerMonth: item.data.intAppliedAmt * (interstRate / 100),
            intMethod: intMethod,
            flatInt: flatInt,
            isFlatInt: isFlatInt,
           intAfterPaid: filteredRec?.[0]?.paid?.length 
  ? filteredRec[0].paid[filteredRec[0].paid.length - 1].intAfterPaid 
  : 0,

            billDate:
              filteredBillGenerated[0]?.billDetails.length > 0
                ? filteredBillGenerated[0].billDetails[
                    filteredBillGenerated[0].billDetails.length - 1
                  ].billDate
                : null,
            billNo:
              filteredBillGenerated[0]?.billDetails.length > 0
                ? filteredBillGenerated[0].billDetails[
                    filteredBillGenerated[0].billDetails.length - 1
                  ].billNo
                : null,
            // interestAfter:
            //   filteredBillGenerated[0]?.billDetails.length > 0
            //     ? filteredBillGenerated[0].billDetails[
            //         filteredBillGenerated[0].billDetails.length - 1
            //       ].dueDate
            //     : null,
      interestAfter:
  filteredRec?.[0]?.paid?.length
    ? filteredRec[0].paid[filteredRec[0].paid.length - 1].date >
      filteredBillGenerated?.[0]?.billDetails?.[filteredBillGenerated[0].billDetails.length - 1]?.dueDate
      ? filteredRec[0].paid[filteredRec[0].paid.length - 1].date
      : filteredBillGenerated[0].billDetails[filteredBillGenerated[0].billDetails.length - 1].dueDate
    : filteredBillGenerated?.[0]?.billDetails?.[filteredBillGenerated[0].billDetails.length - 1]?.dueDate || null,



            intApplOn: item.data.intAppliedAmt,
            balance: calculateOutstanding(
              filteredRec[0],
              filteredBillGenerated[0]
            ),
            // filteredRec.length > 0
            //   ? filteredRec[0].balance
            //   : filteredBillGenerated[0]
            //   ? filteredBillGenerated[0].billDetails[
            //       filteredBillGenerated[0].billDetails.length - 1
            //     ].currentBillAmt
            //   : 0,
            amount: 0,

            interest: 0,

            narration: null,
          };
        });
        setCashReceiptData(updatedReceiptData);
      } catch (error) {
        console.log(error);
      }
    }
    fetch();
  }, [data2]);

  useEffect(() => {
    async function fetch() {
      // try {
      //   let result = await axios.get(
      //     "http://localhost:3001/api/transaction/getBankReceipt"
      //   );
      //   setData1(result.data);
      // } catch (error) {
      //   console.log(error);
      // }
      try {
        let result = await axios.get(
          `${config.API_URL}/api/society/getGeneratedBills`
        );
        console.log(result);
        setBillGenerated(result.data.data);
      } catch (error) {
        console.log(error);
      }

      try {
        let result = await axios.get(
          `${config.API_URL}/api/transaction/getCashReceipt`
        );
        setData2(result.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetch();
  }, []);

  useEffect(() => {
    console.log(bankReceiptData);
  }, [bankReceiptData]);

  useEffect(() => {
    console.log(cashReceiptData);
  }, [cashReceiptData]);

  const handlePaymentMethodChange = (event) => {
    setAccount("");
    const selectedPaymentMethod = event.target.value;
    setPaymentMethod(selectedPaymentMethod);
    setIsView(false);
  };

  useEffect(() => {
    console.log(paymentMethod);
  }, [paymentMethod]);
  useEffect(() => {
    console.log(account);
  }, [account]);

  const handleAccountChange = (event) => {
    const accounts = event.target.value;
    setAccount(accounts);
  };

  const toggleView = () => {
    setIsView(true);
  };

  useEffect(() => {
    console.log(isView);
  }, [isView]);

  return (
    <div className="py-5 px-10">
      <p className="text-center text-2xl font-bold">Multiple Receipt</p>
      <div className="overflow-x-auto pt-5">
        <div className="my-2 flex gap-10">
          <select
            id="payment-method"
            name="payment-method"
            onChange={handlePaymentMethodChange}
            className="  pl-3 pr-10 py-2 text-base border-2 border-gray-300  focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="cash">Cash</option>
            <option value="bank">Bank</option>
          </select>
          <select
            id="payment-method"
            name="payment-method"
            value={account}
            onChange={handleAccountChange}
            className="  pl-3 pr-10 py-2 text-base border-2 border-gray-300  focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">Select Account</option>
            {paymentMethod === "bank" ? (
              <option value="bank account">Bank Account</option>
            ) : (
              <option value="cash in hand">Cash In Hand</option>
            )}
          </select>

          <button
            onClick={toggleView}
            className="border-2 px-4 py-2 rounded-md"
          >
            View
          </button>
        </div>
        <div>
          {/* {paymentMethod === "bank" && account === "bank account" && (
            <ReceiptBankMode
              receiptData={bankReceiptData}
              setReceiptData={setBankReceiptData}
            />
          )} */}

          {isView && (
            <ReceiptCashMode
              receiptData={cashReceiptData}
              setReceiptData={setCashReceiptData}
              paymentMethod={account}
              pay = {paymentMethod}
            />
          )}

          {/* {paymentMethod === "cash" && account === "cash in hand" && (
            <ReceiptCashMode
              receiptData={cashReceiptData}
              setReceiptData={setCashReceiptData}
            />
          )} */}
        </div>
      </div>
    </div>
  );
};

export default MultipleReceipt;









  