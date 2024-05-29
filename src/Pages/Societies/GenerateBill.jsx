import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import AutoComplete from "../../components/Autocomplete";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

const headers = ["Arrears", "Interest", "Total"];
const GenerateBill = () => {
  const [row_id, setRow_id] = useState(1);
  const [rows, setRows] = useState([{ id: 0 }]);
  const [members, setMembers] = useState([]);
  const handleAddRow = (e) => {
    setRow_id(row_id + 1);
    setRows([...rows, { id: rows.length }]);
    e.preventDefault();
  };
  const [interestRates, setInterestRates] = useState({});

  const handleDelRow = (e, ind) => {
    const updated_rows = [...rows];
    updated_rows.splice(ind, 1);
    setRows(updated_rows);
    e.preventDefault();
  };
  const [chkstat2, setChkStat2] = useState({});

  useEffect(() => {
    const chkstat = {};
    members?.forEach((val) => {
      chkstat[val._id] = false;
    });
    setChkStat2(chkstat);
  }, [members]);

  const leadSet = (event) => {
    let c = {};
    Object.keys(chkstat2).forEach((key) => {
      c[key] = event.target.checked;
    });
    setChkStat2(c);
  };

  const setTick = (contact, event) => {
    chkstat2[contact._id] = event.target.checked;
    const c = {
      ...chkstat2,
    };
    setChkStat2(c);
  };

  useEffect(() => {
    fetch("https://a3.arya-erp.in/api2/socapi/api/member/getMemberList")
      .then((response) => response.json())
      .then((data) => setMembers(data));
  }, []);
  console.log(members);

  const [heads, setHeads] = useState([]);

  useEffect(() => {
    fetch("https://a3.arya-erp.in/api2/socapi/api/master/getHead")
      .then((response) => response.json())
      .then((data) => setHeads(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  console.log(heads);
  const [options, setOptions] = useState([]);
  useEffect(() => {
    setOptions(heads.map((item) => item.Header));
  }, [heads]);

  useEffect(() => {
    console.log(options);
  }, [options]);

  const [selectedValue, setSelectedValue] = useState([]);

  const handleSelect = (index, value) => {
    setSelectedValue((prevValues) => ({
      ...prevValues,
      [index]: [...(prevValues[index] || []), value],
    }));
  };

  const [billDate, setBillDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [dayDifference, setDayDifference] = useState("");
  const [rate, setRate] = useState("");

  const handleBillDateChange = (e) => {
    setBillDate(e.target.value);
    calculateDayDifference(e.target.value, dueDate);
  };

  const handleDueDateChange = (e) => {
    setDueDate(e.target.value);
    calculateDayDifference(billDate, e.target.value);
  };

  const calculateDayDifference = (bill, due) => {
    if (bill && due) {
      const billDateObj = new Date(bill);
      const dueDateObj = new Date(due);

      const diffTime = dueDateObj - billDateObj;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      setDayDifference(diffDays);
    } else {
      setDayDifference("");
    }
  };
  const [head, setHead] = useState([]); // State to store heads
  const [isClicked, setIsClicked] = useState(false);
  const [rates, setRates] = useState({});
  const [appliedRows, setAppliedRows] = useState([]);
  const [amounts, setAmounts] = useState({});
  const handleAmountChange = (index, value) => {
    setAmounts((prevAmounts) => ({
      ...prevAmounts,
      [index]: value,
    }));
  };

  const handleRateChange = (index, value) => {
    setRates((prevRates) => ({
      ...prevRates,
      [index]: value,
    }));
  };
  const handleClick = (index) => {
    setIsClicked(true);
    const selectedHead = selectedValue[index]?.[0] || "";
    const amount = amounts[index] || "";
    const rate = rates[index] || "";

    setAppliedRows((prevRows) => [
      ...prevRows,
      { head: selectedHead, amount, rate },
    ]);

    setIsClicked({ ...isClicked, [index]: true });
  };
  console.log(appliedRows);
  // const handleClick = (index) => {
  //   setIsClicked(true);
  //   const selectedHead = selectedValue[index];
  //   const selectedamount = amt[index];
  //   console.log(selectedamount);
  //   if (selectedHead) {
  //     setHead([...head, selectedHead]);
  //     setIsClicked({ ...isClicked, [index]: true });
  //   }
  // };
  // console.log(head);
  return (
    <>
      <div
        className="pt-10 overflow-y-auto  gap-6"
        style={{ height: "calc(100vh - 150px)" }}
      >
        <h1 className="text-center text-2xl mb-5">
          Generate Maintenance Bills
        </h1>
        <div className="gap-6 gap-y-2  max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="mt-10 w-[90%] flex gap-6 gap-y-2 max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="mb-4">
              <label className="block font-bold mb-2">
                Bill Generation Date
              </label>
              <input
                type="date"
                value={billDate}
                onChange={handleBillDateChange}
                className="px-3 py-2 border focus:outline-none border-gray-300 rounded"
              />
            </div>

            <div className="mb-4">
              <label className="block font-bold mb-2">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={handleDueDateChange}
                className="px-3 py-2 border focus:outline-none border-gray-300 rounded"
              />
            </div>
          </div>
          <div className="md:ml-20 my-10 max-h-[200px] overflow-y-auto ">
            <table>
              <thead>
                <tr>
                  <th className="">
                    <button>
                      <FontAwesomeIcon
                        className="text-gray-700 text-2xl"
                        icon={faCirclePlus}
                        onClick={(e) => handleAddRow(e)}
                      />
                    </button>
                  </th>
                  <th className="text-left p-2">Heads</th>
                  <th className="text-left p-2">From</th>
                  <th className="text-left p-2">To</th>
                  <th className="text-left p-2">Amount</th>
                  <th className="text-left p-2">Rate</th>
                  {/* <th className="text-left p-2 pl-8">Apply</th> */}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => {
                  return (
                    <tr key={`R${row.id}`}>
                      <td className="p-4">
                        <button>
                          <FontAwesomeIcon
                            className="text-gray-700 text-2xl"
                            icon={faCircleXmark}
                            onClick={(e) => handleDelRow(e, index)}
                          />
                        </button>
                      </td>
                      <td className="pt-4">
                        <AutoComplete
                          options={options}
                          onSelect={(value) => handleSelect(index, value)}
                        />
                      </td>

                      <td className="p-4">
                        <input
                          type="date"
                          className="w-full px-3 py-2 border focus:outline-none border-gray-300 rounded"
                          name={`from${index + 1}`}
                          required
                        />
                      </td>
                      <td className="p-4">
                        <input
                          type="date"
                          className="w-full px-3 py-2 border focus:outline-none border-gray-300 rounded"
                          name={`to${index + 1}`}
                          onChange={(e) =>
                            handleRateChange(index, e.target.value)
                          }
                          required
                        />
                      </td>
                      <td className="p-4">
                        <input
                          type="text"
                          className="w-full px-3 py-2 border focus:outline-none border-gray-300 rounded"
                          name={`amt${index + 1}`}
                          onChange={(e) =>
                            handleAmountChange(index, e.target.value)
                          }
                          required
                        />
                      </td>
                      <td className="p-4">
                        <input
                          className="w-full px-3 py-2 border focus:outline-none border-gray-300 rounded"
                          name={`rate${index + 1}`}
                          required
                        />
                      </td>
                      <td className="flex items-center justify-start">
                        <button
                          className="border border-gray-400 px-8 py-2 mt-4 rounded-md "
                          onClick={() => handleClick(index)}
                        >
                          {isClicked[index] ? (
                            <FontAwesomeIcon icon={faCheck} />
                          ) : (
                            "Apply"
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="shadow-xl ml-20 my-6">
            <table className="rounded-xl w-full">
              <thead className="bg-gray-700 text-slate-200">
                <tr>
                  <th className="p-4">
                    <input
                      type="checkbox"
                      onChange={(event) => leadSet(event)}
                    />
                  </th>
                  <th>OwnerName</th>
                  {appliedRows.map((head, index) => (
                    <th>{head.head}</th>
                  ))}
                  {headers.map((head, index) => (
                    <th className="p-4 " key={index}>
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-300">
                {members.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-200">
                    <td className="p-4 text-center">
                      <input
                        type="checkbox"
                        checked={chkstat2[row._id]}
                        onChange={(event) => setTick(row, event)}
                        name={row._id}
                      />
                    </td>

                    <td className="p-4 text-center">
                      {row.firstName}
                      {row.lastName}
                    </td>
                    {appliedRows.map((head, index) => (
                      <td className="p-4 text-center">{head.amount}</td>
                    ))}
                    <td className="p-4 text-center">{row.arrears}</td>
                    <td className="p-4 text-center">
                      {/* {row.data.arrears * dayDifference * rate} */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default GenerateBill;
