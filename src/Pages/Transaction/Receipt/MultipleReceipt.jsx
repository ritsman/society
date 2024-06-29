import React, { useEffect, useState } from "react";
import axios from "axios";

import ReceiptBankMode from "./Receipt-BankMode";
import ReceiptCashMode from "./Receipt-CashMode";
import { isEqual } from "date-fns";

const MultipleReceipt = () => {
  const [cashReceiptData, setCashReceiptData] = useState([]);
  const [bankReceiptData, setBankReceiptData] = useState([]);
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  const [account, setAccount] = useState("");
  const [isView, setIsView] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState("cash");

  useEffect(() => {
    async function fetch() {
      try {
        let res = await axios.get("http://localhost:3001/api/society/getBills");
        console.log(res.data);
        const updatedReceiptData = res.data.map((item) => {
          let filteredRec = [];
          filteredRec = data1.filter((row) => row.code == item.data.flatNo);
          console.log(filteredRec);
          return {
            date: filteredRec.length > 0 ? filteredRec[0].date : null,
            code: item.data.flatNo,
            name: item.data.ownerName,
            balance: item.data.total,
            amount: 0,
            principle: filteredRec.length > 0 ? filteredRec[0].principle : 0,
            interest: filteredRec.length > 0 ? filteredRec[0].interest : 0,
            chequeNo: filteredRec.length > 0 ? filteredRec[0].chequeNo : null,
            chqDate: filteredRec.length > 0 ? filteredRec[0].chqDate : null,
            micr: null,
            bank: null,
            branch: null,
            principleBalance:
              filteredRec.length > 0 ? filteredRec[0].principleBalance : 0,
            interestBalance:
              filteredRec.length > 0 ? filteredRec[0].interestBalance : 0,
            narration: filteredRec.length > 0 ? filteredRec[0].narration : null,
          };
        });
        setBankReceiptData(updatedReceiptData);
      } catch (error) {
        console.log(error);
      }
    }
    fetch();
  }, [data1]);

  useEffect(() => {
    async function fetch() {
      try {
        let res = await axios.get("http://localhost:3001/api/society/getBills");
        console.log(res.data);
        const updatedReceiptData = res.data.map((item) => {
          let filteredRec = [];
          filteredRec = data2.filter((row) => row.code == item.data.flatNo);
          console.log(filteredRec);
          return {
            headTotal: item.data.total,
            head: item.data.head,
            memberId: item.data.memberId,
            date: null,
            mode: paymentMethod,
            code: item.data.flatNo,
            name: item.data.ownerName,
            chequeNo: null,
            chequeDate: null,
            bank: null,
            branch: null,
            balance:
              filteredRec.length > 0 ? filteredRec[0].balance : item.data.total,
            amount: 0,
            principle: filteredRec.length > 0 ? filteredRec[0].principle : 0,
            interest: filteredRec.length > 0 ? filteredRec[0].interest : 0,

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
      try {
        let result = await axios.get(
          "http://localhost:3001/api/transaction/getBankReceipt"
        );
        setData1(result.data);
      } catch (error) {
        console.log(error);
      }
      try {
        let result = await axios.get(
          "http://localhost:3001/api/transaction/getCashReceipt"
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
              paymentMethod={paymentMethod}
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
