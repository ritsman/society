import React, { useEffect, useState } from "react";
import axios from "axios";
import PaymentBankMode from "./Payment-bankMode";
import PaymentCashMode from "./Payment-cashMode";

const MultiplePayment = () => {
  const [paymentBankData, setPaymentBankData] = useState([
    {
      date: null,
      code: "",
      unitNo: "",
      balance: "",
      amount: "",
      chequeNo: "",
      chequeDate: null,
      micr: "",
      bank: "",
      branch: "",
      narration: "",
    },
  ]);
  const [paymentCashData, setPaymentCashData] = useState([
    {
      date: null,
      code: "",
      unitNo: "",
      balance: "",
      amount: "",
      narration: "",
    },
  ]);
  const [data, setData] = useState([]);
  const [filteredCodes, setFilteredCodes] = useState([]);
  const [codeNameMap, setCodeNameMap] = useState({});
  const [account, setAccount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");

  useEffect(() => {
    async function fetch() {
      try {
        let result = await axios.get(
          "http://localhost:3001/api/master/getUnitHead"
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

  const handlePaymentMethodChange = (event) => {
    setAccount("");
    const selectedPaymentMethod = event.target.value;
    setPaymentMethod(selectedPaymentMethod);
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

  return (
    <div className="py-5 px-10">
      <p className="text-center text-2xl font-bold">Multiple Payment</p>
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
      </div>
      {paymentMethod === "bank" && account === "bank account" && (
        <PaymentBankMode
          paymentData={paymentBankData}
          setPaymentData={setPaymentBankData}
          codeNameMap={codeNameMap}
          setFilteredCodes={setFilteredCodes}
          filteredCodes={filteredCodes}
        />
      )}
      {paymentMethod === "cash" && account === "cash in hand" && (
        <PaymentCashMode
          paymentData={paymentCashData}
          setPaymentData={setPaymentCashData}
          codeNameMap={codeNameMap}
          setFilteredCodes={setFilteredCodes}
          filteredCodes={filteredCodes}
        />
      )}
    </div>
  );
};

export default MultiplePayment;
