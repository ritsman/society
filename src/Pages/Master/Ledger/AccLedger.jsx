import React, { useEffect, useState } from "react";
import axios from "axios";
import AutoComplete from "../../../components/Autocomplete";
import { Link } from "react-router-dom";
import CashAccLedger from "./CashAccLedger";
import BankAccLedger from "./BankAccLedger";

const AccLedger = () => {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isView, setIsView] = useState(false);
  const [accountType, setAccountType] = useState("");
  const [accountLedger, setAccountLedgers] = useState([]);
  const [filteredType, setFilteredType] = useState([]);
  const [cashLedger, setCashLedger] = useState([]);
  const [bankLedger, setBankLedger] = useState([]);

  useEffect(() => {
    fetch();
    fetchCashACLedger();
    fetchBankACLedger();
  }, []);

  async function fetchCashACLedger() {
    try {
      let res = await axios.get(
        "https://a3.arya-erp.in/api2/socapi/api/master/getCashAccLedger"
      );
      console.log(res);
      setCashLedger(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchBankACLedger() {
    try {
      let res = await axios.get(
        "https://a3.arya-erp.in/api2/socapi/api/master/getBankAccLedger"
      );
      console.log(res);
      setBankLedger(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  async function fetch() {
    try {
      let res = await axios.get(
        "https://a3.arya-erp.in/api2/socapi/api/master/getAccLedger"
      );
      console.log(res);
      setAccountLedgers(res.data);
      setPaymentMethod(res.data[0].name);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    console.log(accountLedger);
  }, [accountLedger]);

  const handlePaymentMethodChange = (event) => {
    setAccountType("");
    const selectedPaymentMethod = event.target.value;
    setPaymentMethod(selectedPaymentMethod);
    console.log(selectedPaymentMethod);
    setIsView(false);
  };

  const handleAccountChange = (event) => {
    const accounts = event.target.value;
    setAccountType(accounts);
  };

  useEffect(() => {
    console.log("helloooooooooooooo", paymentMethod);
    setFilteredType(accountLedger.filter((item) => item.name == paymentMethod));
    console.log(filteredType);
  }, [paymentMethod]);

  useEffect(() => {
    console.log(filteredType);
  }, [filteredType]);

  const toggleView = () => {
    setIsView(true);
  };

  useEffect(() => {
    console.log(isView);
  }, [isView]);

  return (
    <div>
      <div className="px-5 py-5 ">
        <Link to="addAccLedger">
          <button className="border-2 hover:bg-gray-100 px-4 py-2 rounded-md">
            Add Account Ledger
          </button>
        </Link>
      </div>
      <div>
        <div className="my-2 px-5 py-5 flex gap-10">
          <select
            id="payment-method"
            name="payment-method"
            onChange={handlePaymentMethodChange}
            className="  pl-3 pr-10 py-2 text-base border-2 border-gray-300  focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            {accountLedger.map((item) => (
              <option value={item.name}>{item.name}</option>
            ))}
          </select>
          <select
            id="payment-method"
            name="payment-method"
            value={accountType}
            onChange={handleAccountChange}
            className="  pl-3 pr-10 py-2 text-base border-2 border-gray-300  focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">Select Account</option>
            {filteredType.map((item) => (
              <option value={item.accountType}>{item.accountType}</option>
            ))}
          </select>

          <button
            onClick={toggleView}
            className="border-2 px-4 py-2 rounded-md"
          >
            View
          </button>
        </div>
      </div>

      <div>
        {paymentMethod == "Cash" && isView && (
          <CashAccLedger cashLedger={cashLedger} />
        )}

        {paymentMethod == "Bank" && isView && (
          <BankAccLedger bankLedger={bankLedger} />
        )}
      </div>
    </div>
  );
};

export default AccLedger;
