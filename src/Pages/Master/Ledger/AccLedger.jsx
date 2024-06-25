import React, { useEffect, useState } from "react";
import axios from "axios";
import AutoComplete from "../../../components/Autocomplete";

const AccLedger = () => {
  const [formData, setFormData] = useState({
    name: "",
    shortName: "",
    accountType: "",
    narration: "",
  });

  const primary = [
    { _id: 1, Code: "A1000", GroupName: "Branch/Divisions", Under: "Primary" },
    { _id: 2, Code: "B1000", GroupName: "Capital Account", Under: "Primary" },
    { _id: 3, Code: "C1000", GroupName: "Current Assets", Under: "Primary" },
    {
      _id: 4,
      Code: "D1000",
      GroupName: "Current Liabilities",
      Under: "Primary",
    },
    { _id: 5, Code: "E1000", GroupName: "Direct Expenses", Under: "Primary" },
    { _id: 6, Code: "F1000", GroupName: "Direct Incomes", Under: "Primary" },
    { _id: 7, Code: "G1000", GroupName: "Fixed Assets", Under: "Primary" },
    {
      _id: 8,
      Code: "H1000",
      GroupName: "Indirect Expenses",
      Under: "Primary",
    },
    { _id: 9, Code: "I1000", GroupName: "Indirect Incomes", Under: "Primary" },
    { _id: 10, Code: "J1000", GroupName: "Investments", Under: "Primary" },
    {
      _id: 11,
      Code: "K1000",
      GroupName: "Loans (Liability)",
      Under: "Primary",
    },
    {
      _id: 12,
      Code: "L1000",
      GroupName: "Misc. Expenses(ASSET)",
      Under: "Primary",
    },
    {
      _id: 13,
      Code: "M1000",
      GroupName: "Purchase Accounts",
      Under: "Primary",
    },
    { _id: 14, Code: "N1000", GroupName: "Sales Accounts", Under: "Primary" },
    { _id: 15, Code: "P1000", GroupName: "Suspense A/C", Under: "Primary" },
    {
      _id: 16,
      Code: "C1001",
      GroupName: "Bank Account",
      Under: "Current Assets",
    },
    {
      _id: 17,
      Code: "K1001",
      GroupName: "Bank OD A/C ",
      Under: "Loans(Liability)",
    },
    {
      _id: 18,
      Code: "C1002",
      GroupName: "Cash-in-hand",
      Under: "Current Assets",
    },
    {
      _id: 19,
      Code: "C1003",
      GroupName: "Deposits(Asset)",
      Under: "Current Assets",
    },
    {
      _id: 20,
      Code: "D1001",
      GroupName: "Duties & Taxes",
      Under: "Current Liabilities",
    },
    {
      _id: 21,
      Code: "C1004",
      GroupName: "Loans & Advancess (Assets)",
      Under: "Current Assets",
    },
    {
      _id: 22,
      Code: "D1002",
      GroupName: "provisions",
      Under: "Current Liabilities",
    },
    {
      _id: 23,
      Code: "B1001",
      GroupName: "Reserves & Surplus",
      Under: "Capital Account",
    },
    {
      _id: 24,
      Code: "K1002",
      GroupName: "Secured Loans",
      Under: "Loans(Liability)",
    },
    {
      _id: 25,
      Code: "C0005",
      GroupName: "Stock-in-hand",
      Under: "Current Assets",
    },
    {
      _id: 26,
      Code: "D1003",
      GroupName: "Sundry Creditors",
      Under: "Current Liabilities",
    },
    {
      _id: 27,
      Code: "C1006",
      GroupName: "Sundry Debtors",
      Under: "Current Assets",
    },
    {
      _id: 28,
      Code: "K1003",
      GroupName: "Unsecured Loans",
      Under: "Loans(Liability)",
    },
  ];

  const [heads, setHeads] = useState([]);
  const [headstring, setHeadString] = useState([]);

  useEffect(() => {
    async function fetch() {
      try {
        let res = await axios.get(
          "https://a3.arya-erp.in/api2/socapi/api/master/getgroup"
        );
        setHeads([...primary, ...res.data]);
      } catch (error) {
        console.log(error);
      }
    }
    fetch();
  }, []);

  useEffect(() => {
    console.log(heads);
    if (heads.length > 0) {
      let arr = heads.map((item) => {
        return `${item.Code} - ${item.GroupName}`;
      });
      setHeadString(arr);
    }
    console.log(headstring);
  }, [heads]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSelect = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      accountType: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);

    try {
      let res = await axios.post(
        "https://a3.arya-erp.in/api2/socapi/api/master/postAccLedger",
        formData
      );
      console.log(res);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 px-10">
      <div className="flex flex-wrap gap-4 items-end">
        <div className=" min-w-[200px] ">
          <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className=" min-w-[200px] ">
          <label
            htmlFor="shortName"
            className="block text-gray-700 font-bold mb-2"
          >
            Short Name
          </label>
          <input
            type="text"
            id="shortName"
            name="shortName"
            value={formData.shortName}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className=" min-w-[200px] ">
          <label
            htmlFor="accountType"
            className="block text-gray-700 font-bold mb-2"
          >
            Account Type
          </label>
          <div className="z-10">
            <AutoComplete
              options={headstring}
              onSelect={(value) => handleSelect(value)}
            />
          </div>
        </div>

        <div className=" min-w-[200px] ">
          <label
            htmlFor="narration"
            className="block text-gray-700 font-bold mb-2"
          >
            Narration
          </label>
          <input
            type="text"
            id="narration"
            name="narration"
            value={formData.narration}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="bg-gray-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-600 transition duration-300"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default AccLedger;
