import React, { useState } from "react";
import AutoComplete from "../../components/Autocomplete";

const Group = () => {
  const options = [
    "Bank Accounts",
    "Current Assets",
    "Bank OD A/c",
    "Loans (Liability)",
    "Cash-in-hand",
    "Current Assets",
    "Deposits (Asset)",
    "Current Assets",
    "Duties & Taxes",
    "Current Liabilities",
    "Loans & Advances (Asset)",
    "Current Assets",
    "Provisions",
    "Current Liabilities",
    " Reserves & Surplus",
    "Capital Account",
    "Secured Loans",
    "Loans (Liability)",
    "Stock-in-hand",
    "Current Assets",
    "Sundry Creditors",
    "Current Liabilities",
    "Sundry Debtors",
    "Current Assets",
    "Unsecured Loans",
    "Loans (Liability)",
  ];

  const [groupName, setGroupName] = useState("");

  const handleChange = (e) => {
    setGroupName(e.target.value);
  };

  const [selectedValue, setSelectedValue] = useState("");
  const handleSelect = (value) => {
    setSelectedValue(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ groupName: groupName, under: selectedValue });
  };

  return (
    <div>
      <div className="md:py-24 h-screen overflow-y-auto  gap-6">
        <h1 className="text-center text-2xl mb-5">ADD YOUR GROUP</h1>

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

export default Group;
