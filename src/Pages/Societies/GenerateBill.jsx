import React, { useEffect, useState } from "react";

import axios from "axios";
import { toast } from "react-toastify";
import GenerateBillForm from "./GenerateBillForm";

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
  const [ selectedItems , setSelectedItems] = useState([]);
  const [allMemberId , setAllMembId] = useState([])
  const [isSave , setIsSave] = useState(false);

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

       const arr = []
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
     
    let arr = []
      Object.keys(c).forEach((key)=>{
        if(c[key]){
            arr.push(key)
        }
          })
          console.log(arr)
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

 useEffect(() => {
   fetch("https://a3.arya-erp.in/api2/socapi/api/member/getMemberList")
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
           flatNo: item.flatNo,
           ownerName: item.name,
           prevDue: billObj && billObj.data ? billObj.data.prevDue : 0,
           // Fixed intAppliedAmt calculation
           intAppliedAmt: 0,
           //  billObj && billObj.data && Array.isArray(billObj.data.head)
           //  ? billObj.data.head.reduce((acc, ele) => {
           //  return ele.interestApplied && ele.value
           // ? acc + parseFloat(ele.value) // Parse value as a float to handle numbers properly
           // : acc;
           // }, 0)
           // : 0,

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
             billObj && billObj.data.total ? calculateTotal(billObj.data) : 0, // Calculate total if bill data exists
         };
         arr.push(obj);
       });
       setGridRow(arr);
       setFilteredData(arr);
     });
 }, [heads, billData]);


  useEffect(() => {
    fetch("https://a3.arya-erp.in/api2/socapi/api/master/getBillHeads")
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

    fetch("https://a3.arya-erp.in/api2/socapi/api/society/getBills")
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

           let intAppliedAmt=
             item.head.reduce((acc, ele) => {
                   return ele.interestApplied ? acc + Number(ele.value) : acc;
                 }, 0)
            
               
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
      const total = item.head.reduce(
        (acc, headItem) => acc + parseFloat(headItem.value || 0),
        0
      );

      // Return updated item with calculated values
          console.log("calculate int applied function",intAppliedAmt);

      return { ...item, intAppliedAmt, total };
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
       "https://a3.arya-erp.in/api2/socapi/api/society/postBills",
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

 

  const calculateTotal = (row) => {
    console.log(row);
    if (row && row.head && Array.isArray(row.head)) {
      let total = row.head.reduce(
        (acc, curr) => acc + parseInt(curr.value || 0),
        0
      );
      console.log(row.prevDue,"previous dueeeee")
      return (total+row.prevDue)
    }
  };

  return (
    <>
      <h1 className="text-center text-2xl mb-2">Generate Maintenance Bills</h1>
      <div>
        <GenerateBillForm allMemberId={allMemberId} selectedItems={selectedItems} isSave={isSave}/>
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
                    <th className="px-10 py-2  sticky z-10 bg-gray-700 left-40 text-start w-48 whitespace-nowrap overflow-hidden text-ellipsis ">
                      Previous Due
                    </th>
                    {heads
                      .filter((item) => item.isActive) // Filter out inactive heads
                      .map((item, index) => (
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
                        <td className="p-4 sticky border-2 z-10 left-0 bg-white">
                          <input
                            type="checkbox"
                            checked={chkstat2[item.memberId]}
                            onChange={(event) => setTick(item, event)}
                            name={item.id}
                            className="text-center"
                          />
                        </td>
                        <td className="px-4 py-2 border-2 sticky z-10 left-10 bg-white">
                          {item.wingNo}
                        </td>
                        <td className="px-4 py-2 border-2  sticky z-10 left-10 bg-white">
                          {item.flatNo}
                        </td>
                        <td className="px-4 py-2 border-2  sticky z-10 left-40 bg-white w-48 whitespace-nowrap overflow-hidden text-ellipsis">
                          {item.ownerName}
                        </td>
                        <td className="px-4 py-2 border-2  sticky z-10 left-40 bg-white w-48 whitespace-nowrap overflow-hidden text-ellipsis">
                          {item.prevDue}
                        </td>

                        {item.head &&
                          item.head
                            .filter((item2) => item2.isActive) // Filter to include only active items
                            .map((item2, index) => (
                              <td
                                key={index}
                                className="w-48 whitespace-nowrap border-2 overflow-hidden text-ellipsis"
                              >
                                <input
                                  type="text"
                                  value={item2.value}
                                  onChange={(e) =>
                                    handleChange2(
                                      item.id,
                                      item2.id,
                                      item2.head,
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-4 py-2 text-center"
                                />
                              </td>
                            ))}

                        <td className="px-4 py-2 border-2">{item.total}</td>
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
    </>
  );
};

export default GenerateBill;
