import axios from "axios";

import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { HotTable } from "@handsontable/react";
import "handsontable/dist/handsontable.full.css";
import { registerAllModules } from "handsontable/registry";
import Handsontable from "handsontable";
import config from "../../config";

const OpeningBalance = () => {
  const [opBalanceType, setOpBalanceType] = useState("Members");
  const [asOnDate, setAsOnDate] = useState("04-06-2024");
  const [dueDate, setDueDate] = useState("31-03-2021");
  const [billSeriesName, setBillSeriesName] = useState("Maintenance Bill");
  const [netBalance, setNetBalance] = useState(0);
  const [members, setMembers] = useState([]);

  const opBalanceTypes = ["Members", "Creditors", "General Ledger"];
  const [tableRow, setTableRow] = useState([]);
  const [data, setData] = useState([]);
  const [head, setHead] = useState([]);
  const [lists, setList] = useState([]);
  const [column, setColumn] = useState([]);

  const [column1, setColumn1] = useState([]);
  const [tableRow1, setTableRow1] = useState([]);
  const [isEdited, setIsEdited] = useState([]);

  const [chkstat2, setChkStat2] = useState({});

  registerAllModules();
  const hotTableRef = useRef(null);

  useEffect(() => {
    const chkstat = {};
    data?.forEach((val) => {
      chkstat[val._id] = false;
    });
    setChkStat2(chkstat);
  }, [data]);

  // console.log("chk2");
  // console.log(chkstat2);

  const leadSet = (event) => {
    let c = {};
    Object.keys(chkstat2).forEach((key) => {
      console.log(key);
      c[key] = event.target.checked;
    });
    console.log(`c:`);
    console.log(c);
    setChkStat2(c);
  };

  const setTick = (contact, event) => {
    chkstat2[contact._id] = event.target.checked;
    console.log(contact);
    console.log(chkstat2);
    const c = {
      ...chkstat2,
    };
    console.log(c);
    setChkStat2(c);
  };

  //asdflkadsf
  const tableHeads = [
    { data: "name", title: "Name", readOnly: true },
    { data: "mobileNo", title: "Mobile No", readOnly: true },
    { data: "email", title: "Email", readOnly: true },
    { data: "address", title: "Address", readOnly: true },
    { data: "flatNo", title: "Flat No", readOnly: true },
    { data: "wingNo", title: "Wing No", readOnly: true },
    { data: "principal", title: "Principal", readOnly: false },
    { data: "interest", title: "Interest", readOnly: false },
    { data: "total", title: "Total", readOnly: true },
  ];

  let tableHead = [];

  useEffect(() => {
    try {
      fetch(
        `${config.API_URL}/api/transaction/getOpeningBalance`
      )
        .then((response) => response.json())
        .then((data) => setList(data))
        .catch((error) => console.error(error));
    } catch (error) {
      console.log(error)
    }

    let arr = data.map((item) => {
      let list = lists.filter(item2=>item2.id == item._id);
      console.log(list)
           
      return {
        name: item.name,
        id:item._id,
        mobileNo: item.registeredMobileNo,
        email: item.email,
        address: item.permanentAddress,
        flatNo: item.flatNo,
        wingNo: item.wingNo,
        principal: list[0]?.principal || 0,
        interest : list[0]?.interest || 0,
        total :list[0]?.total || 0,
        head: head.map((row, index) => ({
          heads: row,
          value: item.head?.[index]?.value || 0,
        })),
      };
    });

    setTableRow(arr);
  }, [head, data]);

  useEffect(() => {
    fetch(`${config.API_URL}/api/member/getMemberList`)
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error(error));

    // fetch maintenance head

    fetch(`${config.API_URL}/api/master/getHead`)
      .then((response) => response.json())
      .then((data) => {
        tableHead = [];

        data.map((item) => {
          tableHead.push(item.Header);
        });
        setHead(tableHead);
        setColumn([...tableHeads]);
      })
      .catch((error) => console.error(error));
  }, []);

  const handleRowValueChange = (item, rowIndex, event) => {
    const newHead = [...item.head];
    newHead[rowIndex].value = event.target.value;
    setTableRow((prevTableRow) =>
      prevTableRow.map((row) =>
        row === item ? { ...row, head: newHead } : row
      )
    );
  };

  const handleSave = async () => {
    console.log(tableRow, "table Head");
    try {
      let res = await axios.post(
        `${config.API_URL}/api/transaction/postOpeningBalance`,
        tableRow
      );
      console.log(res);
      toast.success("successfully saved data");
    } catch (error) {
      console.log(error);
      toast.error("error in storing data");
    }
  };

  let col = [];

  useEffect(() => {
    column.forEach((item) => {
      if(item == "name" || item == "mobileNo" || item == "address" || item == "email" || item == "flatNo" || item == "wingNo"
      ){
      let obj = {
        data: item,
        title: item,
        readOnly: true,
      };
      col.push(obj);
    }else{
       let obj = {
         data: item,
         title: item,
         
       };
       col.push(obj);
    }
    });
    setColumn1(col);
    console.log(col);
  }, [column]);

  let arr = [];
  useEffect(() => {
    tableRow.forEach((item) => {
      let obj = {};
      Object.keys(item).forEach((key) => {
        if (key == "head") {
          item[key].forEach((item2) => {
            obj[item2.heads] = item2.value;
          });
        } else {
          obj[key] = item[key];
        }
      });
      arr.push(obj);
    });
    console.log(arr);
    setTableRow1(arr);
  }, [tableRow]);

  const handleAfterChange = (changes, source) => {
    if (source === "loadData") return; // Skip on data load

    if (changes) {
      // Loop through the changes
      changes.forEach(([rowIndex, prop, oldValue, newValue]) => {
        // Check if the changed property is "principal"

             if (prop === "interest" && oldValue !== newValue) {
               // Get the current row data
               const updatedRow = { ...tableRow[rowIndex] };

               // Calculate the new total
               updatedRow.total =
                 parseFloat(newValue) + parseFloat(updatedRow.principal);

               // Update the table row with the new total
               setTableRow((prevTableRow) =>
                 prevTableRow.map((row, index) =>
                   index === rowIndex ? updatedRow : row
                 )
               );
             }
        if (
          (prop === "principal" && oldValue !== newValue) 
          
        ) {
          // Get the current row data
          const updatedRow = { ...tableRow[rowIndex] };

          // Calculate the new total
          updatedRow.total =
            parseFloat(newValue) + parseFloat(updatedRow.interest);

          // Update the table row with the new total
          setTableRow((prevTableRow) =>
            prevTableRow.map((row, index) =>
              index === rowIndex ? updatedRow : row
            )
          );
        }
      });
    }
  };


    // const handleAfterChange = (changes, source) => {
    //   if (source === "loadData") return; // Skip on data load

    //   // Ensure changes is not empty
    //   if (changes) {
    //     // Only update `isEdited` if there are changes
    //     const hasChanges = changes.some(
    //       ([row, prop, oldValue, newValue]) => oldValue !== newValue
    //     );

    //     // Update `isEdited` if the source is 'edit' or 'paste' and there are changes
    //     if (hasChanges) {
    //       // setIsEdited(tableRow1);
    //       console.log("value changed");
    //     }
    //   }
    // };

  // useEffect(() => {
  //   if (tableRow1.length === 0 || tableRow.length === 0) return; // Ensure arrays are populated

  //   // Create a map for the second array (tableRow1)
  //   console.log("hereeee")
  //   const secondArrayMap = new Map();
  //   tableRow1.forEach((item) => {
  //     const { id, ...heads } = item; // Destructure to extract 'id' and the heads
  //     secondArrayMap.set(id, heads); // Map by 'id'
  //   });

  //   // Function to map heads from the second array into the first array
  //   function mapHeadsFromSecondArray(item) {
  //     console.log(item)
  //     const newHeads = secondArrayMap.get(item.id); // Get matching heads for this item

  //     if (newHeads) {
  //       // If new heads exist for the item
  //       return item.head.map((h) => {
  //         // Replace heads only if there is a value in newHeads
  //         return {
  //           ...h,
  //           value: newHeads[h.heads] || h.value, // Keep the current value if new one doesn't exist
  //         };
  //       });
  //     }
  //     return item.head; // Return existing heads if no match found
  //   }

  //   // Replace heads in the first array with mapped heads from the second array
  //   const updatedFirstArray = tableRow.map((item) => ({
  //     ...item,
  //     head: mapHeadsFromSecondArray(item), // Update the head based on the second array
  //   }));

  //   console.log("Updated First Array:", updatedFirstArray);
  //   setTableRow(updatedFirstArray); // Set the updated first array into state
  // }, [isEdited]); // Add all dependencies

  return (
    <div>
      <h1 className="text-center text-2xl ">Opening Balance</h1>

      <div className="flex items-center space-x-4 pt-10 px-10">
        <div className="flex flex-col gap-3">
          <label>Op. Balance type</label>
          <select
            className="border border-gray-300 rounded py-1 px-2"
            value={opBalanceType}
            onChange={(e) => setOpBalanceType(e.target.value)}
          >
            {opBalanceTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-3">
          <label>As on date</label>

          <input
            type="text"
            className="border border-gray-300 rounded py-1 px-2"
            value={asOnDate}
            onChange={(e) => setAsOnDate(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-3">
          <label>Due date</label>

          <input
            type="date"
            className="border border-gray-300 rounded py-1 px-2"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-3">
          <label>Bill Series Name</label>

          <select
            className="border border-gray-300 rounded py-1 px-2"
            value={billSeriesName}
            onChange={(e) => setBillSeriesName(e.target.value)}
          >
            {" "}
            <option value="">Select Bill Type</option>
            <option value="maintenance bill">Maintenance Bill</option>
          </select>
        </div>
        <div className="flex flex-col gap-3">
          <label>Net Balance</label>

          <input
            type="text"
            className="border border-gray-300 rounded py-1 px-2"
            value={netBalance}
          />
        </div>
        <div>
          <button className="text-black rounded-md ml-24 hover:text-white hover:bg-gray-700 px-4 py-2 border-2 border-gray-700">
            Search
          </button>
        </div>
      </div>
      <div className="mt-10 px-10">
        <button
          onClick={handleSave}
          className="px-4 py-2 border-2 mb-5 rounded-md bg-gray-600 text-white"
        >
          Save
        </button>
        <div className="w-full h-full mt-5">
          {tableRow1.length > 0 && column1.length > 0 ? (
            <HotTable
              ref={hotTableRef}
              data={tableRow}
              columns={column}
              colHeaders={true}
              rowHeaders={true}
              height="400px" // Set a specific height to ensure the table renders visibly
              width="100%"
              licenseKey="non-commercial-and-evaluation"
              multiColumnSorting={true}
              filters={true}
              afterChange={handleAfterChange}
              dropdownMenu={true}
              contextMenu={true}
              autoWrapRow={true}
              autoWrapCol={true}
            />
          ) : (
            "loading.."
          )}
        </div>
      </div>
    </div>
  );
};

export default OpeningBalance;
