import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCirclePlus,
  faCircleXmark,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import AutoComplete from "../../components/Autocomplete";

const headers = [
  { key: "wing No", name: "Wing No" },
  { key: "ownerName", name: "OwnerName" },
];

const GenerateBill = () => {
  const [row_id, setRow_id] = useState(1);
  const [rows, setRows] = useState([{ id: 0 }]);
  const [members, setMembers] = useState([]);
  const [gridRow, setGridRow] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState(gridRow);
  const [heads, setHeads] = useState([]);

  useEffect(() => {
    setFilteredData(gridRow);
  }, []);

  useEffect(() => {
    console.log(filteredData);
  }, [filteredData, searchTerm]);

  const handleSearch = (event) => {
    const trimmedSearchTerm = event.target.value.trim();
    setSearchTerm(trimmedSearchTerm);

    if (trimmedSearchTerm) {
      setFilteredData(
        gridRow.filter((row) =>
          row.ownerName.toLowerCase().includes(trimmedSearchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredData(gridRow);
    }
  };

  const handleAddRow = (e) => {
    setRow_id(row_id + 1);
    setRows([...rows, { id: rows.length }]);
    e.preventDefault();
  };

  const handleDelRow = (e, ind) => {
    const updated_rows = [...rows];
    updated_rows.splice(ind, 1);
    setRows(updated_rows);
    e.preventDefault();
  };

  const [chkstat2, setChkStat2] = useState({});

  useEffect(() => {
    const chkstat = {};
    filteredData?.forEach((val) => {
      chkstat[val.id] = false;
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
    chkstat2[contact.id] = event.target.checked;
    const c = {
      ...chkstat2,
    };
    setChkStat2(c);
  };

  useEffect(() => {
    fetch("https://a3.arya-erp.in/api2/socapi/api/member/getMemberList")
      .then((response) => response.json())
      .then((data) => {
        setMembers(data);
        let arr = [];
        data.forEach((item, index) => {
          let obj = {
            id: index,
            wingNo: item.wingNo,
            flatNo: item.flatNo,
            ownerName: `${item.firstName} ${item.lastName}`,
            head: heads,
            total: "0",
          };
          arr.push(obj);
        });
        setGridRow([...arr]);
        setFilteredData([...arr]);
      });
  }, [heads]);

  useEffect(() => {
    fetch("https://a3.arya-erp.in/api2/socapi/api/master/getHead")
      .then((response) => response.json())
      .then((data) => {
        let arr = [];
        data.forEach((item, index) => {
          let obj = {
            id: index,
            head: item.Header,
            value: "0",
          };
          arr.push(obj);
        });
        setHeads(arr);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const [options, setOptions] = useState([]);
  useEffect(() => {
    setOptions(heads.map((item) => item.Header));
  }, [heads]);

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

  const handleChange = (id, field, value) => {
    setFilteredData(
      filteredData.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };
  const handleChange2 = (id, headIndex, field, value) => {
    setFilteredData(
      filteredData.map((item) =>
        item.id === id
          ? {
              ...item,
              head: item.head.map((headItem, index) =>
                index === headIndex ? { ...headItem, value: value } : headItem
              ),
            }
          : item
      )
    );
  };

  const handleSave = () => {
    console.log(filteredData);
  };

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
          {/* <div className="mt-10 w-[90%] flex gap-6 gap-y-2 max-w-7xl mx-auto sm:px-6 lg:px-8">
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
          </div> */}
          <div className="md:ml-20  max-h-[200px] overflow-y-auto ">
            {/* <table>
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
            </table> */}
          </div>
          <div>
            <div className="container mx-auto p-4">
              <div className="mb-4 flex gap-20">
                <input
                  type="text"
                  placeholder="Search by Owner Name"
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-[40%] px-4 py-1 border rounded"
                />
                <button
                  onClick={handleSave}
                  className=" px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-600"
                >
                  Save
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="table-auto w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-700 text-white w-screen">
                      <th className="p-4 sticky left-0 bg-gray-700 z-10">
                        <input
                          type="checkbox"
                          onChange={(event) => leadSet(event)}
                        />
                      </th>
                      <th className="px-10 py-2 sticky z-12 bg-gray-700 w-40 left-10 text-start whitespace-nowrap overflow-hidden text-ellipsis ">
                        Wing No
                      </th>
                      <th className="px-10 py-2 sticky z-12 bg-gray-700 w-40 left-10 text-start whitespace-nowrap overflow-hidden text-ellipsis">
                        Flat No
                      </th>
                      <th className="px-10 py-2  sticky z-10 bg-gray-700 left-40 text-start w-48 whitespace-nowrap overflow-hidden text-ellipsis ">
                        Owner Name
                      </th>
                      {heads.map((item, index) => (
                        <th
                          key={index}
                          className="px-10 py-2 text-start w-48 whitespace-nowrap overflow-hidden text-ellipsis"
                        >
                          {item.head}
                        </th>
                      ))}
                      <th className="px-4 py-2 text-start ">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.length > 0 ? (
                      filteredData.map((item) => (
                        <tr key={item.id} className="text-center">
                          <td className="p-4 sticky z-10 left-0 bg-white">
                            <input
                              type="checkbox"
                              checked={chkstat2[item.id]}
                              onChange={(event) => setTick(item, event)}
                              name={item.id}
                              className="text-center"
                            />
                          </td>
                          <td className="px-4 py-2  sticky z-10 left-10 bg-white">
                            {item.wingNo}
                          </td>
                          <td className="px-4 py-2  sticky z-10 left-10 bg-white">
                            {item.flatNo}
                          </td>
                          <td className="px-4 py-2  sticky z-10 left-40 bg-white w-48 whitespace-nowrap overflow-hidden text-ellipsis">
                            {item.ownerName}
                          </td>
                          {item.head.map((item2, index) => (
                            <td
                              key={index}
                              className="w-48 whitespace-nowrap overflow-hidden text-ellipsis"
                            >
                              <input
                                type="text"
                                value={item2.value}
                                onChange={(e) =>
                                  handleChange2(
                                    item.id,
                                    index,
                                    item2.head,
                                    e.target.value
                                  )
                                }
                                className="w-full px-4 py-2 text-center"
                              />
                            </td>
                          ))}
                          <td className="px-4 py-2 ">
                            <input
                              type="text"
                              value={item.total}
                              onChange={(e) =>
                                handleChange(item.id, "total", e.target.value)
                              }
                              className="w-full px-2 py-1 text-center"
                            />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={heads.length + 4}
                          className="px-5 text-xl font-bold text-center"
                        >
                          Data not found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GenerateBill;