import React, { useEffect, useState, useRef } from "react";

import axios from "axios";
import { toast } from "react-toastify";
import GenerateBillForm from "./GenerateBillForm";
import { HotTable } from "@handsontable/react";
import "handsontable/dist/handsontable.full.css";
// import "./BillView.css";
import { registerAllModules } from "handsontable/registry";
import config from "../../config";


// const headers = [
//   { key: "wing No", name: "Wing No" },
//   { key: "ownerName", name: "OwnerName" },
// ];

const GenerateBill = () => {
  const [row_id, setRow_id] = useState(1);
  const [rows, setRows] = useState([{ id: 0 }]);
  const [members, setMembers] = useState([]);
  const [gridRow, setGridRow] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState(gridRow);
  const [heads, setHeads] = useState([]);
  const [billData, setBillData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [allMemberId, setAllMembId] = useState([]);
  const [isSave, setIsSave] = useState(false);
  const [columns, setColumn] = useState([]);
  const [tableRows, setTableRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const hotTableRef = useRef(null);
  registerAllModules();

  useEffect(() => {
    setFilteredData(gridRow);
  }, []);

  useEffect(() => {
    console.log(filteredData);
  }, [filteredData, searchTerm]);

  const handleSearch = (event) => {
    const trimmedSearchTerm = event.target.value.trim().toLowerCase();
    setSearchTerm(trimmedSearchTerm);

    if (trimmedSearchTerm) {
      setFilteredData(
        gridRow.filter(
          (row) =>
            row.ownerName.toLowerCase().includes(trimmedSearchTerm) ||
            row.flatNo.toString().includes(trimmedSearchTerm) ||
            row.wingNo.toLowerCase().includes(trimmedSearchTerm)
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
      chkstat[val.memberId] = false;
    });
    setChkStat2(chkstat);

    const arr = [];
    filteredData?.forEach((val) => {
      arr.push(val.memberId);
    });
    setAllMembId(arr);
  }, [members]);

  const leadSet = (event) => {
    let c = {};
    Object.keys(chkstat2).forEach((key) => {
      c[key] = event.target.checked;
    });
    setChkStat2(c);

    let arr = [];
    Object.keys(c).forEach((key) => {
      if (c[key]) {
        arr.push(key);
      }
    });
    console.log(arr);
    setSelectedItems(arr);
  };

  const setTick = (contact, event) => {
    chkstat2[contact.memberId] = event.target.checked;
    const c = {
      ...chkstat2,
    };
    setChkStat2(c);

    let arr = [];
    Object.keys(c).forEach((key) => {
      if (c[key]) {
        arr.push(key);
      }
    });
    console.log(arr);
    setSelectedItems(arr);
  };
 let headerss = [
   { data: "email", title: "Email", width: 150, readOnly: true },
   { data: "flatNo", title: "Flat No", width: 150, readOnly: true },
   { data: "wingNo", title: "Wing No", width: 150, readOnly: true },
   { data: "ownerName", title: "Owner Name", width: 150, readOnly: true },
   { data: "prevDue", title: "Prev. Due", width: 150, readOnly: true },
 ];

  useEffect(() => {
    let col = [
      { data: "isSelected", title: "Select", type: "checkbox", width: 100 },
    ];
    if (filteredData.length > 0) {
      Object.keys(filteredData[0]).forEach((key) => {
        if (key != "id" && key != "memberId" && key != "intAppliedAmt")
          if (key == "head") {
            filteredData[0][key].forEach((item) => {
              if (item.isActive) {
                let obj = {
                  data: item.head,
                  title: item.head,
                  width: 150,
                  readOnly: false,
                };
                col.push(obj);
              }
            });
          }
           else {
            if(key == "email"){
                 let obj = {
                   data: key,
                   title: "Email",
                   width: 150,
                   readOnly: true,
                 };
                 col.push(obj);
            }else if (key == "wingNo"){
                  let obj = {
                    data: key,
                    title: "Wing No",
                    width: 150,
                    readOnly: true,
                  };
                  col.push(obj);
            }else if(key == "flatNo"){
               let obj = {
                 data: key,
                 title: "Flat No",
                 width: 150,
                 readOnly: true,
               };
               col.push(obj);
            }else if(key == "ownerName"){
                 let obj = {
                   data: key,
                   title: "Owner Name",
                   width: 150,
                   readOnly: true,
                 };
                 col.push(obj);
            }else if(key == "total"){
               let obj = {
                 data: key,
                 title: "Total",
                 width: 150,
                 readOnly: true,
               };
               col.push(obj);
            }else if(key == "prevDue"){
                 let obj = {
                   data: key,
                   title: "Prev. Due",
                   width: 150,
                   readOnly: true,
                 };
                 col.push(obj);
            }
           
          }
      });
    }

    console.log(col);

    setColumn(col);
    let arr = [];
    filteredData.forEach((item) => {
      let obj = { isSelected: false };
      Object.keys(item).forEach((key) => {
        if (key == "head") {
          item[key].forEach((item2) => {
            if (item2.isActive) {
              obj[item2.head] = item2.value;
            }
          });
        } else {
          obj[key] = item[key];
        }
      });
      arr.push(obj);
    });
    console.log(arr);
    setTableRows(arr);
  }, [filteredData]);

  useEffect(() => {
    fetch(`${config.API_URL}/api/member/getMemberList`)
      .then((response) => response.json())
      .then((data) => {
        setMembers(data);
        let arr = [];
        data.forEach((item, index) => {
          let billObj = billData.find(
            (row) =>
              row.data.wingNo == item.wingNo && row.data.flatNo == item.flatNo
          );

          let obj = {
            id: index,
            memberId: item._id,
            wingNo: item.wingNo,
            email: item.email,
            flatNo: item.flatNo,
            ownerName: item.name,
            prevDue: billObj && billObj.data ? billObj.data.prevDue : 0,
            // Fixed intAppliedAmt calculation
            intAppliedAmt: 0,

            head: heads.map((headItem, index) => ({
              head: headItem.head,
              isActive: headItem.isActive,
              interestApplied: headItem.interestApplied,
              id: index + 1,
              value:
                billObj && billObj.data.head
                  ? billObj.data.head.find((h) => h.head === headItem.head)
                      ?.value
                  : "0", // Default to "0" if not found
            })),
            total:
              billObj && billObj.data.total ? calculateTotal2(billObj.data) : 0, // Calculate total if bill data exists
          };
          arr.push(obj);
        });
        setGridRow(arr);
        setFilteredData(arr);
      });
  }, [heads, billData]);

  useEffect(() => {
    fetch(`${config.API_URL}/api/master/getBillHeads`)
      .then((response) => response.json())
      .then((data) => {
        let arr = [];
        data.forEach((item, index) => {
          let obj = {
            id: index,
            head: item.billHead,
            value: "0",
            isActive: item.isActive,
            interestApplied: item.interestApplied,
          };
          arr.push(obj);
        });
        setHeads(arr);
      })
      .catch((error) => console.error("Error fetching data:", error));

    // fetch bills table data

    fetch(`${config.API_URL}/api/society/getBills`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setBillData(data);
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

  const handleChange2 = (id, headIndex, field, value) => {
    setFilteredData(
      filteredData.map((item) => {
        if (item.id === id) {
          const updatedHead = item.head.map((headItem, index) => {
            if (headItem.id === headIndex) {
              return { ...headItem, value: value };
            } else {
              return headItem;
            }
          });

          let intAppliedAmt = item.head.reduce((acc, ele) => {
            return ele.interestApplied ? acc + Number(ele.value) : acc;
          }, 0);

          const total = calculateTotal({ ...item, head: updatedHead });
          return {
            ...item,
            head: updatedHead,
            total: total,
            intAppliedAmt: intAppliedAmt,
          };
        } else {
          return item;
        }
      })
    );
  };



  const calculateIntAppliedAmtAndTotal = () => {
    return new Promise((resolve) => {
      const updatedData = filteredData.map((item) => {
        // Calculate intAppliedAmt based on active heads with interestApplied
        const intAppliedAmt = item.head
          .filter((headItem) => headItem.interestApplied)
          .reduce((acc, headItem) => acc + parseFloat(headItem.value || 0), 0);

        // Calculate total based on all heads' values
        // const total = item.head.reduce(
        //   (acc, headItem) => acc + parseFloat(headItem.value || 0),
        //   0
        // );

        // Return updated item with calculated values
        console.log("calculate int applied function", intAppliedAmt);

        return { ...item, intAppliedAmt };
      });

      // Update the state with the new data
      setFilteredData(updatedData);

      // Resolve the promise once calculations are done
      resolve(updatedData);
    });
  };

  useEffect(() => {
    if (isSave) {
      console.log("Filtered data after state update:", filteredData);
      handleSaveToAPI();
    }
  }, [filteredData, isSave]); // Dependency on both filteredData and isSave

  // Function to handle saving the data
  const handleSave = async () => {
    try {
      await calculateIntAppliedAmtAndTotal();
      setIsSave(true); // This will trigger the useEffect to call the API after state update
    } catch (error) {
      console.error("Error in calculation:", error);
      toast.error("Error in saving data");
    }
  };

  // Function to handle the API call
  const handleSaveToAPI = async () => {
    try {
      let res = await axios.post(
        `${config.API_URL}/api/society/postBills`,
        filteredData
      );
      console.log("API response:", res);
      toast.success("Data Successfully Saved");
      setIsSave(false); // Reset save flag
    } catch (error) {
      console.error("API error:", error);
      toast.error("Error in saving data");
      setIsSave(false); // Reset save flag in case of failure
    }
  };


  const calculateTotal2 = (row) => {
    console.log(row);
    if (row && row.head && Array.isArray(row.head)) {
      let total = row.head.reduce(
        (acc, curr) => acc + parseInt(curr.value || 0),
        0
      );
      console.log(row.prevDue, "previous dueeeee");
      return (Number(total) + Number(row.prevDue)).toFixed(2);
    }
  };

const calculateTotal = (row) => {
  console.log("calculateTotal invoked");
  console.log("Row data:", row);

  const excludeKeys = [
    "isSelected",
    "id",
    "memberId",
    "wingNo",
    "email",
    "flatNo",
    "ownerName",
    "total",
    "intAppliedAmt",
  ];

  let total = Object.keys(row).reduce((accumulatedTotal, key) => {
    if (!excludeKeys.includes(key)) {
      const value = Number(row[key]);
      console.log(
        `Processing key: ${key}, Value: ${row[key]}, Parsed: ${value}`
      ); // Log each key and its value

      // Check if value is a number and not NaN
      if (!isNaN(value)) {
        return accumulatedTotal + value; // Add only valid numbers
      }
    }
    return accumulatedTotal; // Skip excluded keys or invalid numbers
  }, 0);

  const formattedTotal = total.toFixed(2); // Format total to two decimal places
  console.log("Total calculated:", formattedTotal);
  return formattedTotal;
};



  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [bulkEditValue, setBulkEditValue] = useState("");
  const [isEdited, setIsEdited] = useState([]);

  const handleSelection = (r, c, r2, c2) => {
    const rows = [];
    for (let i = Math.min(r, r2); i <= Math.max(r, r2); i++) {
      rows.push(i);
    }
    setSelectedRows(rows);
    setSelectedColumn(c); // Track the selected column index
  };

  const handleBulkEdit = () => {
    if (selectedRows.length === 0 || selectedColumn === null || !bulkEditValue)
      return;

    const newData = tableRows.map((row, index) => {
      if (selectedRows.includes(index)) {
        const key = columns[selectedColumn].data;
        return { ...row, [key]: bulkEditValue }; // Update the correct column
      }
      return row;
    });

    setTableRows(newData);
    setIsEdited(newData);
    console.log(newData);
    setBulkEditValue("");

    // Notify Handsontable of the data change
    if (hotTableRef.current) {
      hotTableRef.current.hotInstance.loadData(newData);
    }
  };

  useEffect(() => {
    const secondArrayMap = new Map();
    tableRows.forEach((item) => {
      const { id, ...heads } = item;
      secondArrayMap.set(id, heads);
    });

    // Function to map heads from the second array
    function mapHeadsFromSecondArray(item) {
      const newHeads = secondArrayMap.get(item.id);
      if (newHeads) {
        return item.head.map((h) => {
          // Replace heads with new values from the second array only if isActive is true and value is not "0"
          if (h.isActive) {
            return {
              ...h,
              value: newHeads[h.head] || h.value, // Use value from second array if available
            };
          }
          return h; // Keep existing head if isActive is false or value is "0"
        });
      }
      return item.head; // Return existing heads if no match found
    }

    const updateSelect = (item) => {
      const newHeads = secondArrayMap.get(item.id);
      if (newHeads) {
        return newHeads.isSelected;
      }
      return item.isSelected;
    };

    const updateTotal = (item) => {
        const newHeads = secondArrayMap.get(item.id);
      if (newHeads) {
        return newHeads.total;
      }
      return item.total;
    }
    // Replace heads in the first array
    const updatedFirstArray = filteredData.map((item) => ({
      ...item,
      isSelected: updateSelect(item),
      total:updateTotal(item),
      head: mapHeadsFromSecondArray(item),
    }));

    console.log(updatedFirstArray);
    setFilteredData(updatedFirstArray);
  }, [isEdited]);


  const handleTick = (rowIndex, isChecked) => {
    const updatedRows = [...tableRows];
    updatedRows[rowIndex].isSelected = isChecked;

    const updatedSelectedItems = isChecked
      ? [...selectedItems, filteredData[rowIndex].memberId]
      : selectedItems.filter((id) => id !== filteredData[rowIndex].memberId);

    setTableRows(updatedRows);
    setSelectedItems(updatedSelectedItems);

    if (hotTableRef.current) {
      hotTableRef.current.hotInstance.loadData(updatedRows);
    }
  };

  const handleAfterChange = (changes, source) => {
    if (source === "loadData") return; // Skip on data load

    if (source === "edit" || source === "paste") {
      changes.forEach(([row, prop, oldValue, newValue]) => {
        if (prop === "isSelected" && oldValue !== newValue) {
          handleTick(row, newValue);
        }
      });
    }
    // Ensure changes is not empty
    if (changes) {
      // Only update `isEdited` if there are changes
      const hasChanges = changes.some(
        ([row, prop, oldValue, newValue]) => oldValue !== newValue
      );

      // Update `isEdited` if the source is 'edit' or 'paste' and there are changes
      if (hasChanges) {
         console.log("value changed", tableRows);
        const updatedRows = tableRows.map((row, index) => {
          // Use rowIndex from changes instead of row
          const changedRow = changes.find(([rowIndex]) => rowIndex === index);
          if (changedRow) {
            return { ...row, total: calculateTotal(row) }; // Recalculate total for the modified row
          }
          return row;
        });
          console.log("calculate total function called",updatedRows)
          setTableRows(updatedRows)
        setIsEdited(tableRows);
       
      }
    }
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll); // Toggle selectAll state

    const updatedRows = tableRows.map((row) => ({
      ...row,
      isSelected: !selectAll, // Set all rows' isSelected to the opposite of selectAll
    }));

    setTableRows(updatedRows);
    setSelectedItems(
      !selectAll
        ? updatedRows.map((row) => row.memberId) // If selectAll is true, select all memberIds
        : [] // If selectAll is false, deselect all
    );

    // If Handsontable is in use, notify the table of the data change
    if (hotTableRef.current) {
      hotTableRef.current.hotInstance.loadData(updatedRows);
    }
  };

  return (
    <>
      <h1 className="text-center text-2xl mb-2">Generate Maintenance Bills</h1>
      <div>
        <GenerateBillForm
          allMemberId={allMemberId}
          selectedItems={selectedItems}
          isSave={isSave}
          handleBillSave = {handleSave}
        />
      </div>
      <div
        className="pt-2 overflow-y-auto  gap-6"
        style={{ height: "calc(100vh - 150px)" }}
      >
        <div className="gap-6 gap-y-2  max-w-7xl mx-auto sm:px-6 lg:px-8"></div>
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
              <button
                onClick={handleSelectAll} // Add Select All button
                className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-600"
              >
                {selectAll ? "Deselect All" : "Select All"}
              </button>
            </div>
            <div className="mt-8">
              <div className="hot-table-container mt-5">
                <HotTable
                  ref={hotTableRef}
                  data={tableRows}
                  columns={columns}
                  colHeaders={true}
                  rowHeaders={true}
                  height="auto"
                  licenseKey="non-commercial-and-evaluation"
                  multiColumnSorting={true}
                  filters={true}
                  dropdownMenu={true}
                  afterChange={handleAfterChange}
                  contextMenu={true}
                  autoWrapRow={true}
                  autoWrapCol={true}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GenerateBill;
