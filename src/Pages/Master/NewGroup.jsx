import React, { useEffect, useState } from "react";
import AutoComplete from "../../components/Autocomplete";
import axios from "axios";
import { toast } from "react-toastify";
import config from "../../config";

const NewGroup = () => {
  const options = [
    "Branch/Divisions",
    "Capital Account",
    "Current Assets",
    "Current Liabilities",
    "Direct Expenses",
    "Direct Incomes",
    "Fixed Assets",
    "Indirect Expenses",
    "Indirect Incomes",
    "Investments",
    "Loans (Liability)",
    "Misc. Expenses(ASSET)",
    "Purchase Accounts",
    "Sales Accounts",
    "Suspense A/C",
    "Bank Account",
    "Bank OD A/C ",
    "Cash-in-hand",
    "Deposits(Asset)",
    "Duties & Taxes",
    "Loans & Advancess (Assets)",
    "provisions",
    "Reserves & Surplus",
    "Secured Loans",
    "Stock-in-hand",
    "Sundry Creditors",
    "Sundry Debtors",
    "Unsecured Loans",
  ];
  const options2 = [
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
    { _id: 8, Code: "H1000", GroupName: "Indirect Expenses", Under: "Primary" },
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
  const [groups, setgroups] = useState([]);
  const [unders, setUnders] = useState([]);

  useEffect(() => {
    async function fetch() {
      try {
        let res = await axios.get(
          "https://a3.arya-erp.in/api2/socapi/api/master/getgroup"
        );
        let a = res.data.map((item) => item.GroupName);

        setUnders([...options, ...a]);
        console.log(a);
        setgroups(res.data);

        console.log(res.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetch();
  }, []);

  const generateCode = (under) => {
    let underOption = options2.find((opt) => opt.GroupName === under);
    if (!underOption) {
      underOption = groups.find((opt) => opt.GroupName === under);
    }
    console.log(underOption, "underoptions");

    const prefix = underOption.Code.charAt(0);

    let similarCodes = options2
      .filter((opt) => opt.Code.startsWith(prefix))
      .map((opt) => opt.Code);

    const arr = groups
      .filter((opt) => opt.Code.startsWith(prefix))
      .map((opt) => opt.Code);

    similarCodes = [...similarCodes, ...arr];

    if (similarCodes.length === 0) {
      return `${prefix}1001`;
    } else {
      const maxCode = similarCodes.reduce((max, code) => {
        const num = parseInt(code.slice(1));
        return num > max ? num : max;
      }, 0);
      return `${prefix}${(maxCode + 1).toString().padStart(3, "0")}`;
    }
  };

  const [groupName, setGroupName] = useState("");

  const handleChange = (e) => {
    setGroupName(e.target.value);
  };

  const [selectedValue, setSelectedValue] = useState("");
  const handleSelect = (value) => {
    setSelectedValue(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(generateCode(selectedValue), "code");

    try {
      let result = await axios.post(
         `${config.API_URL}/api/master/postGroup`,
        {
          code: generateCode(selectedValue),
          groupName: groupName,
          under: selectedValue,
        }
      );
      console.log(result);
      toast.success("New Group Added Successfully");
    } catch (error) {
      console.log(error);
      toast.error("something wrong");
    }
  };

  return (
    <div>
      <div
        className="pt-10   overflow-y-auto  gap-6"
        style={{ height: "calc(100vh - 150px)" }}
      >
        <h1 className="text-center text-2xl mb-5">ADD GROUP</h1>

        <form
          onSubmit={handleSubmit}
          className="flex gap-6 gap-y-2  max-w-7xl mx-auto sm:px-6 lg:px-8  "
        >
          <div className=" grid w-[90%]  grid-cols-2 gap-6 gap-y-2  max-w-7xl mx-auto sm:px-6 lg:px-8  ">
            <div className="mb-4">
              <label htmlFor="groupName" className="block font-bold mb-2">
                Group Name
              </label>
              <input
                type="text"
                id="groupName"
                name="groupName"
                value={groupName}
                onChange={handleChange}
                className="w-full px-3 py-2 border focus:outline-none border-gray-300 rounded"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="under" className="block font-bold mb-2">
                Under
              </label>
              <AutoComplete
                options={unders}
                onSelect={(value) => handleSelect(value)}
              />
            </div>
            <div className="col-span-2">
              <button
                type="submit"
                className="bg-gray-800 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewGroup;
