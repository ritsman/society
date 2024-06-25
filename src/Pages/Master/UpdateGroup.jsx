import React, { useEffect, useState } from "react";
import AutoComplete from "../../components/Autocomplete";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const UpdateGroup = () => {
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

  const location = useLocation();
  const { row } = location.state || {};
  const navigate = useNavigate();

  const [groupName, setGroupName] = useState(row.GroupName);

  useEffect(() => {
    console.log(row);
  }, [row]);

  const handleChange = (e) => {
    setGroupName(e.target.value);
  };

  const [selectedValue, setSelectedValue] = useState("");
  const handleSelect = (value) => {
    setSelectedValue(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log({ groupName: groupName, under: selectedValue });
    try {
      let result = await axios.put(
        `https://a3.arya-erp.in/api2/socapi/api/master/updateGroup/${row._id}`,
        { groupName: groupName, under: selectedValue }
      );
      console.log(result);
      toast.success("group updated successfully");
      navigate("/master/groups");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div
        className="pt-10   overflow-y-auto  gap-6"
        style={{ height: "calc(100vh - 150px)" }}
      >
        <h1 className="text-center text-2xl mb-5">UPDATE GROUP</h1>

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
                options={options}
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

export default UpdateGroup;
