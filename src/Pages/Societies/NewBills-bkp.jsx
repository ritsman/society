
// import React, { useEffect, useState, useRef } from "react";
// import axios from "axios";
// import { HotTable } from "@handsontable/react";
// import { registerAllModules } from "handsontable/registry";
// import "handsontable/dist/handsontable.full.min.css";
// import config from "../../config";
// import { toast } from "react-toastify";
// import { v4 as uuidv4 } from "uuid";

// registerAllModules();

// const NewBills = () => {
//   const [formData, setFormData] = useState({
//     type: "",
//     billDate: "",
//     billDueDate: "",
//   });
//   const [interestRate, setInterestRate] = useState(0);
//   const [intRebate, setIntRebate] = useState(0);
//   const [intMethod, setIntMethod] = useState("");
//   const [flatInt, setFlatInt] = useState(0);
//   const [isFlatInt, setIsFlatInt] = useState(0);
//   const [billFrequency, setBillFrequency] = useState("");
//   const [interestData, setIntData] = useState({});

//   const [billData, setBillData] = useState([]);
//   const [fetchedBillData, setFetchedBillData] = useState([]);
//   const [heads, setHeads] = useState({});
//   const [intAppliedHeads, setIntAppHeads] = useState({});
//   const [openingBal, setOpeningBal] = useState([]);
//   const [mergedBillData, setMergedBillData] = useState([]);
//   const hotTableRef = useRef(null);
//   const [selectedItems, setSelectedItems] = useState([]);
//   const [objForEmail, setObjForEmail] = useState([]);
//   const [fetchedPaymentCollection, setPaymentCollection] = useState([]);

//   function generateShortUUID(selectedDate) {
//     const year = new Date(selectedDate).getFullYear().toString().slice(-2); // Get last two digits of the selected year
//     const shortUUID = uuidv4().replace(/-/g, "").slice(0, 5); // Generate short UUID with 5 characters
//     return `BL/${year}/${shortUUID}`;
//   }

//   const handleChangeType = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const fetchPreviousCharges = (selectedDate) => {
//     const latestCharge = fetchRecentCharges(selectedDate);
//     const prevCharges = fetchedBillData.map((item) => {
//       let latestObj = latestCharge.find((ele) => ele.memberId == item.memberId);
//       let differenceInTimes =
//         new Date(selectedDate).getTime() -
//         (latestObj.charges.length > 0
//           ? new Date(latestObj.charges[0].date).getTime()
//           : null);

//       let dayDiff =
//         latestObj.charges.length > 0
//           ? Math.ceil(differenceInTimes / (1000 * 3600 * 24))
//           : 31;

//       if (dayDiff < 30) {
//         selectedDate = latestObj.charges[0].date;
//       }
//       let selectedDates = new Date(selectedDate);

//       let arr = [];
//       item.charges.forEach((charge) => {
//         const chargeDate = new Date(charge.date);
//         if (chargeDate < selectedDates) {
//           arr.push(charge);
//         }
//       });

//       return {
//         ...item,
//         charges: arr,
//       };
//     });
//     console.log(prevCharges);
//     return prevCharges;
//   };

//   const fetchRecentCharges = (selectedDate) => {
//     const selectedDates = new Date(selectedDate);

//     const updatedBillData = fetchedBillData.map((item) => {
//       let mostRecentCharge = null;

//       item.charges.forEach((charge) => {
//         const chargeDate = new Date(charge.date);
//         if (chargeDate <= selectedDates) {
//           if (
//             !mostRecentCharge ||
//             chargeDate > new Date(mostRecentCharge.date)
//           ) {
//             mostRecentCharge = charge;
//           }
//         }
//       });

//       return {
//         ...item,
//         charges: mostRecentCharge ? [mostRecentCharge] : [],
//       };
//     });

//     return updatedBillData;
//   };

//   const handleChange = (e) => {
//     // name = "billDate" , value="2024-01-01"
//     const { name, value } = e.target;

//     //to restrict for date year
//     const regex = /^\d{4}-\d{2}-\d{2}$/;

//     if (value === "" || regex.test(value)) {
//       setFormData((prevData) => ({
//         ...prevData,
//         [name]: value,
//       }));

//       if (name === "billDate") {
//         createChargeObject(value);
//       }
//     }
//   };

//   const createChargeObject = (value) => {
//     console.log(openingBal);

//     console.log("invoked handle change");

//     let latestBill = fetchRecentCharges(value);

//     // all previous bills array calculation
//     let allPreviousCharges = fetchPreviousCharges(value);

//     let prevBillSum = allPreviousCharges.map((item) => {
//       console.log(item.charges, "chargessss");
//       let sum1 = item.charges.reduce(
//         (acc, ele) => acc + Number(ele.totalWithoutInt),
//         0
//       );
//       let sum2 = item.charges.reduce(
//         (acc, ele) => acc + Number(ele.intAppliedHeadSum),
//         0
//       );

//       return {
//         memberId: item.memberId,
//         prevSum: sum1,
//         intHeadSum: sum2,
//       };
//     });

//     let filteredLatestBill = billData.map((bill) => {
//       let item = latestBill.find((ele) => ele.memberId == bill.memberId);

//       let openBal = openingBal.filter((ele) => ele.memberId === bill.memberId);

//       console.log(openBal, "opening balance");

//       let prevChargeObj = prevBillSum.find(
//         (ele) => ele.memberId == bill.memberId
//       );

//       console.log(prevChargeObj);

//       let interest = 0;

//       let differenceInDay;

//       if (item && item.charges.length > 0) {
//         const differenceInTimes =
//           new Date(value).getTime() - new Date(item.charges[0].date).getTime();

//         differenceInDay = Math.ceil(differenceInTimes / (1000 * 3600 * 24));
//       } else {
//         const differenceInTimes =
//           new Date(value).getTime() -
//           new Date(openBal.length > 0 ? openBal[0].date : null).getTime();

//         differenceInDay = Math.ceil(differenceInTimes / (1000 * 3600 * 24));
//       }

//       let p1 = Number(prevChargeObj ? Number(prevChargeObj.intHeadSum) : 0);

//       let p2 = Number(openBal.length > 0 ? openBal[0].principal : 0);
//       interest =
//         differenceInDay > 0
//           ? (((p1 + p2) * (interestRate / 100)) / 30) *
//             (differenceInDay == 31 ? 30 : differenceInDay)
//           : 0;

//       console.log(interest, "interest");

//       return {
//         memberId: bill.memberId,
//         dayDiff: differenceInDay,
//         prevBillsSum: prevChargeObj ? Number(prevChargeObj.prevSum) : 0,
//         heads: item && item.charges.length > 0 ? item.charges[0].heads : heads,
//         totalWithoutInt:
//           item && item.charges.length > 0 ? item.charges[0].totalWithoutInt : 0,
//         currentInt: Number(interest).toFixed(2),
//         interest:
//           item && item.charges.length > 0 ? item.charges[0].interest : 0,
//         prevSum: item && item.charges.length > 0 ? item.charges[0].prevSum : 0,
//       };
//     });

//     let mergedBillData = filteredLatestBill.map((item) => {
//       let openBal = openingBal.filter((ele) => ele.memberId === item.memberId);
//       const sumOfValues = Object.values(item.heads)
//         .map(Number)
//         .reduce((acc, curr) => acc + curr, 0);

//       let total;
//       console.log(Number(item.currentInt), item.dayDiff);
//       if (item.dayDiff > 30) {
//         total =
//           Number(sumOfValues) +
//           Number(item.currentInt) +
//           Number(openBal.length > 0 ? openBal[0].principal : 0) +
//           Number(openBal.length > 0 ? openBal[0].interest : 0) +
//           Number(item.prevBillsSum);
//       } else {
//         total =
//           Number(sumOfValues) +
//           Number(item.interest) +
//           Number(openBal.length > 0 ? openBal[0].principal : 0) +
//           Number(openBal.length > 0 ? openBal[0].interest : 0) +
//           Number(item.prevSum);
//       }

//       return {
//         memberId: item.memberId,
//         heads: item.heads,
//         dayDiff: item.dayDiff,
//         prevBillsSum: item.prevBillsSum,
//         totalWithoutInt: item.totalWithoutInt,
//         openingBalance: openBal[0]?.principal || 0,
//         openingInterest: openBal[0]?.interest || 0,
//         currentInt: item.currentInt,
//         headTotal: total,
//         interest: item.interest,
//         prevSum: item.prevSum,
//       };
//     });
//     console.log(mergedBillData);
//     setMergedBillData([...mergedBillData]);
//   };

//   useEffect(() => {
//     if (formData.billDate) {
//       createChargeObject(formData.billDate);
//     }
//   }, [formData.billDate, openingBal]);

//   const handleSave = async () => {
//     if (!formData.billDate) {
//       return toast.error("Please select a bill date");
//     }

//     console.log(billData);

//     const requests = billData
//       .filter((item) => selectedItems.includes(item.memberId)) // Only include selected items
//       .map((item) => {
//         // Create the axios post request for each selected item
//         return axios.post(`${config.API_URL}/api/society/postBillCollection`, [
//           item,
//         ]);
//       });

//     try {
//       // Run all the requests concurrently
//       await Promise.all(requests);

//       // Only show success notification once
//       toast.success("Successfully saved bill data");
//     } catch (error) {
//       console.log("Error in saving bill data ", error);

//       // Only show error notification once
//       toast.error("Error in saving bill data");
//     }
//   };

//   const formatDate = (date) => {
//     const day = date.getDate().toString().padStart(2, "0");
//     const month = (date.getMonth() + 1).toString().padStart(2, "0"); // getMonth is 0-indexed
//     const year = date.getFullYear();
//     return `${year}-${month}-${day}`;
//   };

//   useEffect(() => {
//     const currentDate = new Date();
//     const year = currentDate.getFullYear();
//     const month = currentDate.getMonth();

//     if (interestData?.billDate) {
//       const billDay = parseInt(interestData.billDate);
//       const customDate = new Date(year, month, billDay);

//       setFormData((prevData) => ({
//         ...prevData,
//         billDate: formatDate(customDate),
//       }));
//     }

//     //  fetchBills();
//   }, [interestData?.billDate]);

//   useEffect(() => {
//     if (formData.billDate && interestData?.billDueDays) {
//       const billDate = new Date(formData.billDate);
//       const dueDate = new Date(billDate);
//       dueDate.setDate(billDate.getDate() + Number(interestData.billDueDays));

//       setFormData((prevData) => ({
//         ...prevData,
//         billDueDate: formatDate(dueDate),
//       }));
//     }
//   }, [formData.billDate, interestData?.billDueDays]);

//   useEffect(() => {
//     fetch(`${config.API_URL}/api/master/getBillHeads`)
//       .then((response) => response.json())
//       .then((data) => {
//         let obj = data.reduce((acc, item) => {
//           acc[item.billHead] = "0";
//           return acc;
//         }, {});

//         let intAppliedhead = data.reduce((acc, item) => {
//           if (item.interestApplied) {
//             acc[item.billHead] = "0";
//           }
//           return acc;
//         }, {});
//         setIntAppHeads(intAppliedhead);
//         setHeads(obj);
//       })
//       .catch((error) => console.error("Error in fetching heads:", error));
//   }, []);

//   useEffect(() => {
//     async function fetchInt() {
//       try {
//         let res = await axios.get(`${config.API_URL}/api/master/getBillMaster`);
//         setIntData(res.data[0]);
//         setInterestRate(res.data[0].interestRatePerMonth);
//         setIntRebate(res.data[0].interestRebateUptoRs);
//         setIntMethod(res.data[0].interestCalculationMethod);
//         setFlatInt(res.data[0].flatInterestAmount);
//         setIsFlatInt(res.data[0].isFlatInterest);
//         setBillFrequency(res.data[0].billFrequency);
//       } catch (error) {
//         console.log(error);
//       }
//     }
//     fetchInt();
//   }, []);

//   useEffect(() => {
//     fetch(`${config.API_URL}/api/society/getBillCollection`)
//       .then((response) => response.json())
//       .then((data) => {
//         setFetchedBillData(data.bills);
//       })
//       .catch((error) => console.error("Error in fetching Bills:", error));
//   }, []);

//   useEffect(() => {
//     async function fetchPayment() {
//       console.log("date", formData.billDate);
//       try {
//         let res = await axios.get(
//           `${config.API_URL}/api/transaction/getPaymentCollection`,
//           {
//             params: { filterDate: formData.billDate }, // Send filterDate as query parameter
//           }
//         );
//         console.log(res.data.members);
//         setPaymentCollection(res.data.members);
//       } catch (error) {
//         console.log(error);
//       }
//     }
//     fetchPayment();
//   }, [formData.billDate]);

//   useEffect(() => {
//     try {
//       fetch(`${config.API_URL}/api/transaction/getOpeningBalance`)
//         .then((response) => response.json())
//         .then((data) => {
//           let arr = data.map((item) => {
//             return {
//               memberId: item.id,
//               principal: item.principal,
//               interest: item.interest,
//               date: item.date,
//             };
//           });
//           console.log(arr);
//           setOpeningBal(arr);
//         })
//         .catch((error) => console.error(error));
//     } catch (error) {
//       console.log(error);
//     }
//   }, []);

//   useEffect(() => {
//     const fetchMember = async () => {
//       try {
//         let res = await axios.get(`${config.API_URL}/api/member/getMemberList`);
//         // create obj for email sending
//         let emailArr = res.data.map((item) => {
//           return {
//             memberId: item._id,
//             email: item.email,
//           };
//         });
//         console.log(emailArr);
//         setObjForEmail(emailArr);

//         // end
//         let arr = res.data.map((item, index) => {
//           let openBal = openingBal.find((e) => e.memberId === item._id);
//           let filteredBillData = fetchedBillData.find(
//             (item2) => item2.memberId === item._id
//           );
//           let filteredHeads = mergedBillData.filter(
//             (ele) => ele.memberId == item._id
//           );
//           let billId = generateShortUUID(formData.billDate);

//           return {
//             memberId: item._id,
//             memberName: item.name,
//             flatNo: item.flatNo,
//             openBalPrinciple: openBal?.principal || 0,
//             openInterest: openBal?.interest || 0,
//             charges: [
//               {
//                 BillNo: billId,
//                 date: formData.billDate,
//                 dueDate: formData.dueDate,
//                 prevDue: 0,
//                 prevSum: 0,
//                 heads:
//                   filteredHeads.length > 0 &&
//                   Object.keys(filteredHeads[0].heads).length > 0
//                     ? filteredHeads[0].heads
//                     : heads,
//                 headTotal: 0,
//                 total: 0,
//                 intAppliedHeadSum: 0,
//                 interest:
//                   filteredBillData?.charges[filteredBillData.charges.length - 1]
//                     ?.interest || 0,
//                 totalWithoutInt:
//                   filteredBillData?.charges[filteredBillData.charges.length - 1]
//                     ?.totalWithoutInt || 0,
//                 totalWithInt:
//                   filteredBillData?.charges[filteredBillData.charges.length - 1]
//                     ?.totalWithInt || 0,
//               },
//             ],
//           };
//         });
//         setBillData(arr);
//       } catch (error) {
//         console.log("Error in fetching member list ", error);
//       }
//     };
//     fetchMember();
//   }, [heads, formData.billDate, openingBal, fetchedBillData]);

//   const handleHeadValueChange = (memberIndex, billHead, value) => {
//     console.log(mergedBillData);
//     setMergedBillData((prevMerged) => {
//       const newMerged = [...prevMerged];
//       if (memberIndex < newMerged.length) {
//         const bill = { ...newMerged[memberIndex] };
//         const heads = { ...bill.heads };
//         heads[billHead] = value; // Update the specific head value

//         // Recalculate headTotal after updating the head value
//         const headTotal = Object.values(heads).reduce(
//           (sum, headValue) => sum + Number(headValue),
//           0
//         );

//         // Calculate the new total, including previous sums, opening balance, etc.

//         console.log(bill.openInterest);
//         const newTotal =
//           bill.dayDiff > 29
//             ? Number(headTotal) +
//               Number(bill.currentInt) +
//               Number(bill.openingBalance || 0) +
//               Number(bill.openingInterest || 0) +
//               Number(bill.prevBillsSum)
//             : Number(headTotal) +
//               Number(bill.interest) +
//               Number(bill.openingBalance || 0) +
//               Number(bill.openingInterest || 0) +
//               Number(bill.prevSum);

//         console.log(Number(bill.openingInterest || 0));

//         newMerged[memberIndex] = {
//           ...bill,
//           heads,
//           headTotal: newTotal, // Update the total after recalculating it
//         };
//       }
//       return newMerged;
//     });

//     setBillData((prevBillData) => {
//       console.log(prevBillData);
//       const newBillData = [...prevBillData];
//       console.log(newBillData);
//       const member = { ...newBillData[memberIndex] };
//       const charges = [...member.charges];
//       const heads = { ...charges[0].heads };
//       console.log(heads);

//       heads[billHead] = value;

//       let sumOfInterestHeads = Object.entries(heads).reduce(
//         (sum, [key, value]) => {
//           return sum + (key in intAppliedHeads ? Number(value) : 0);
//         },
//         0
//       );

//       charges[0] = {
//         ...charges[0],
//         heads,
//         total:
//           Number(
//             Object.values(heads).reduce(
//               (sum, headValue) => sum + Number(headValue),
//               0
//             )
//           ) +
//           Number(charges[0].prevDue) +
//           Number(charges[0].interest),
//         intAppliedHeadSum: sumOfInterestHeads,
//         headTotal: Number(
//           Object.values(heads).reduce(
//             (sum, headValue) => sum + Number(headValue),
//             0
//           )
//         ),
//       };

//       newBillData[memberIndex] = { ...member, charges };
//       return newBillData;
//     });
//   };

//   const prepareTableData = () => {
//     return billData.map((member, index) => {
//       console.log(mergedBillData);

//       const charge =
//         mergedBillData && mergedBillData.length > 0
//           ? mergedBillData.find((ele) => {
//               if (!ele.memberId) {
//                 return null;
//               }
//               return ele.memberId === member.memberId;
//             })
//           : 0;

//       let payments = fetchedPaymentCollection.find(
//         (ele) => ele.memberId == member.memberId
//       );

//       console.log(charge);

//       let sumOfInterestHeads;
//       let headT;

//       if (charge) {
//         sumOfInterestHeads = Object.entries(charge.heads).reduce(
//           (sum, [key, value]) => {
//             return sum + (key in intAppliedHeads ? Number(value) : 0);
//           },
//           0
//         );

//         headT = Number(
//           Object.values(charge.heads).reduce(
//             (sum, headValue) => sum + Number(headValue),
//             0
//           )
//         );
//       }

//       member.charges[0].prevDue = charge ? Number(charge.prevBillsSum) : 0;

//       member.charges[0].interest = charge ? Number(charge.currentInt) : 0;

//       member.charges[0].prevSum = charge ? Number(charge.prevBillsSum) : 0;

//       member.charges[0].heads = charge ? charge.heads : heads;

//       member.charges[0].intAppliedHeadSum = charge ? sumOfInterestHeads : 0;

//       member.charges[0].headTotal = charge ? headT : 0;

//       const isChecked = selectedItems.includes(member.memberId);

//       const row = [
//         isChecked,
//         index + 1,
//         member.memberName,
//         member.flatNo,
//         charge
//           ? charge.dayDiff > 29
//             ? Number(charge.openingBalance) -
//               (payments ? payments.totals.totalOpeningBalPaid : 0) +
//               (Number(charge.prevBillsSum) -
//                 (payments ? payments.totals.totalCurrentChargesPaid : 0))
//             : Number(charge.openingBalance) -
//               (payments ? payments.totals.totalOpeningBalPaid : 0) +
//               (Number(charge.prevSum) -
//                 (payments ? payments.totals.totalCurrentChargesPaid : 0))
//           : Number(member.openBalPrinciple),
//         charge
//           ? charge.dayDiff > 29
//             ? Number(charge.openingInterest) -
//               (payments ? payments.totals.totalOpeningIntPaid : 0) +
//               (Number(charge.currentInt) -
//                 (payments ? payments.totals.totalInterestPaid : 0))
//             : Number(charge.openingInterest) -
//               (payments ? payments.totals.totalOpeningIntPaid : 0) +
//               (Number(charge.interest) -
//                 (payments ? payments.totals.totalInterestPaid : 0))
//           : Number(member.openInterest),
//       ];

//       if (charge && charge.heads) {
//         Object.keys(charge.heads).forEach((billHead) => {
//           row.push(charge.heads[billHead]);
//         });
//       } else {
//         Object.keys(member.charges[0].heads).forEach((billHead) => {
//           row.push(member.charges[0].heads[billHead]);
//         });
//       }

//       row.push(charge ? charge.headTotal : member.charges[0].total);

//       return row;
//     });
//   };

//   const getColumnHeaders = () => {
//     return [
//       "select",
//       "S.No",
//       "Name",
//       "Flat No",
//       "Prev Due",
//       "Interest",
//       ...Object.keys(heads),
//       "Total",
//     ];
//   };

//   const handleTick = (rowIndex, isChecked) => {
//     const updatedRows = [...billData];
//     const memberId = updatedRows[rowIndex].memberId;

//     console.log(isChecked);

//     setSelectedItems((prevSelectedItems) => {
//       const updatedSelectedItems = isChecked
//         ? [...prevSelectedItems, memberId]
//         : prevSelectedItems.filter((id) => id !== memberId);

//       return updatedSelectedItems;
//     });

//     // Optionally update Handsontable's data
//     if (hotTableRef.current) {
//       hotTableRef.current.hotInstance.loadData(updatedRows);
//     }
//   };

//   useEffect(() => {
//     console.log(selectedItems);
//   }, [selectedItems]);

//   const handleAfterChange = (changes, source) => {
//     if (source === "edit") {
//       changes.forEach(([row, prop, oldValue, newValue]) => {
//         if (Number(prop) == 0) {
//           console.log("here", newValue);
//           handleTick(row, newValue);
//         }

//         const headIndex = Number(prop) - 6; // Adjust for initial columns

//         if (headIndex >= 0 && headIndex < Object.keys(heads).length) {
//           const billHead = Object.keys(heads)[headIndex];
//           const memberIndex = row;
//           handleHeadValueChange(memberIndex, billHead, newValue);
//         }
//       });
//     }
//   };
//   const handleSendEmail = async () => {
//     const sentEmails = new Set();
//     let emailsSentCount = 0,
//       errorOccurred = false;

//     for (let item of objForEmail) {
//       if (
//         selectedItems.includes(item.memberId) &&
//         !sentEmails.has(item.email)
//       ) {
//         try {
//           await axios.post(`${config.API_URL}/api/report/send-email`, {
//             email: item.email,
//             subject: "Hello World",
//             message: "Hello...",
//           });
//           sentEmails.add(item.email);
//           emailsSentCount++;
//         } catch (error) {
//           errorOccurred = true;
//         }
//       }
//     }

//     toast[errorOccurred ? "error" : emailsSentCount ? "success" : "info"](
//       errorOccurred
//         ? "Some emails failed to send."
//         : emailsSentCount
//         ? `${emailsSentCount} emails sent successfully!`
//         : "No emails were sent."
//     );
//   };

//   return (
//     <div className="container mx-auto p-6">
//       <h1 className="text-center text-xl font-semibold mb-5">Bills</h1>
//       <div className="flex items-center justify-evenly px-5 gap-4 mb-4">
//         <div>
//           <label className="block mb-1 text-sm font-medium">Type</label>
//           <select
//             name="type"
//             value={formData.type}
//             onChange={handleChangeType}
//             className="w-full p-2 border rounded"
//           >
//             <option value="">Select Type</option>
//             <option value="maintenance bill">Maintenance Bill</option>
//           </select>
//         </div>
//         <div>
//           <label className="block mb-1 text-sm font-medium">Bill Date</label>
//           <input
//             type="date"
//             name="billDate"
//             value={formData.billDate}
//             onChange={handleChange}
//             className="w-full p-2 border rounded"
//           />
//         </div>
//         <div>
//           <label className="block mb-1 text-sm font-medium">
//             Bill Due Date
//           </label>
//           <input
//             type="date"
//             name="billDueDate"
//             value={formData.billDueDate}
//             readOnly
//             className="w-full p-2 border rounded bg-gray-100"
//           />
//         </div>
//         <div>
//           <button
//             onClick={handleSave}
//             className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-600"
//           >
//             Save
//           </button>
//         </div>
//         <div className="flex gap-2">
//           <div>
//             <button
//               onClick={handleSendEmail}
//               className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-600"
//             >
//               Email
//             </button>
//           </div>
//           <div>
//             <button className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-600">
//               PDF
//             </button>
//           </div>
//           <div>
//             <button className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-600">
//               Whatsapp
//             </button>
//           </div>
//           <div>
//             <button className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-600">
//               SMS
//             </button>
//           </div>
//         </div>
//       </div>

//       <HotTable
//         ref={hotTableRef}
//         data={prepareTableData()}
//         colHeaders={getColumnHeaders()}
//         rowHeaders={true}
//         height="auto"
//         licenseKey="non-commercial-and-evaluation"
//         afterChange={handleAfterChange}
//         columns={getColumnHeaders().map((header, index) => {
//           if (index === 0) {
//             return {
//               data: index,
//               type: "checkbox",
//               className: "htCenter",
//               width: 50,
//             };
//           }
//           return {
//             data: index,
//             width: 100,
//             type:
//               index < 5 || index === getColumnHeaders().length - 1
//                 ? "numeric"
//                 : "text",
//             readOnly: index < 6 || index === getColumnHeaders().length - 1,
//           };
//         })}
//       />
//     </div>
//   );
// };

// export default NewBills;




import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { HotTable } from "@handsontable/react";
import { registerAllModules } from "handsontable/registry";
import "handsontable/dist/handsontable.full.min.css";
import config from "../../config";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

registerAllModules();

const NewBills = () => {
  const [formData, setFormData] = useState({
    type: "",
    billDate: "",
    billDueDate: "",
  });
  const [interestRate, setInterestRate] = useState(0);
  const [intRebate, setIntRebate] = useState(0);
  const [intMethod, setIntMethod] = useState("");
  const [flatInt, setFlatInt] = useState(0);
  const [isFlatInt, setIsFlatInt] = useState(0);
  const [billFrequency, setBillFrequency] = useState("");
  const [interestData, setIntData] = useState({});

  const [billData, setBillData] = useState([]);
  const [fetchedBillData, setFetchedBillData] = useState([]);
  const [heads, setHeads] = useState({});
  const [intAppliedHeads, setIntAppHeads] = useState({});
  const [openingBal, setOpeningBal] = useState([]);
  const [mergedBillData, setMergedBillData] = useState([]);
  const hotTableRef = useRef(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [objForEmail, setObjForEmail] = useState([]);
  const [fetchedPaymentCollection, setPaymentCollection] = useState([]);

  function generateShortUUID(selectedDate) {
    const year = new Date(selectedDate).getFullYear().toString().slice(-2); // Get last two digits of the selected year
    const shortUUID = uuidv4().replace(/-/g, "").slice(0, 5); // Generate short UUID with 5 characters
    return `BL/${year}/${shortUUID}`;
  }

  const handleChangeType = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const fetchPreviousCharges = (selectedDate) => {
    const latestCharge = fetchRecentCharges(selectedDate);
    const prevCharges = fetchedBillData.map((item) => {
      let latestObj = latestCharge.find((ele) => ele.memberId == item.memberId);
      let differenceInTimes =
        new Date(selectedDate).getTime() -
        (latestObj.charges.length > 0
          ? new Date(latestObj.charges[0].date).getTime()
          : null);

      let dayDiff =
        latestObj.charges.length > 0
          ? Math.ceil(differenceInTimes / (1000 * 3600 * 24))
          : 31;

      if (dayDiff < 30) {
        selectedDate = latestObj.charges[0].date;
      }
      let selectedDates = new Date(selectedDate);

      let arr = [];
      item.charges.forEach((charge) => {
        const chargeDate = new Date(charge.date);
        if (chargeDate < selectedDates) {
          arr.push(charge);
        }
      });

      return {
        ...item,
        charges: arr,
      };
    });
    console.log(prevCharges);
    return prevCharges;
  };

  const fetchRecentCharges = (selectedDate) => {
    const selectedDates = new Date(selectedDate);

    const updatedBillData = fetchedBillData.map((item) => {
      let mostRecentCharge = null;

      item.charges.forEach((charge) => {
        const chargeDate = new Date(charge.date);
        if (chargeDate <= selectedDates) {
          if (
            !mostRecentCharge ||
            chargeDate > new Date(mostRecentCharge.date)
          ) {
            mostRecentCharge = charge;
          }
        }
      });

      return {
        ...item,
        charges: mostRecentCharge ? [mostRecentCharge] : [],
      };
    });

    return updatedBillData;
  };

  const handleChange = (e) => {
    // name = "billDate" , value="2024-01-01"
    const { name, value } = e.target;

    //to restrict for date year
    const regex = /^\d{4}-\d{2}-\d{2}$/;

    if (value === "" || regex.test(value)) {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));

      if (name === "billDate") {
        createChargeObject(value);
      }
    }
  };

  const createChargeObject = (value) => {
    console.log(openingBal);

    console.log("invoked handle change");

    let latestBill = fetchRecentCharges(value);

    // all previous bills array calculation
    let allPreviousCharges = fetchPreviousCharges(value);

    let prevBillSum = allPreviousCharges.map((item) => {
      console.log(item.charges, "chargessss");
      let sum1 = item.charges.reduce(
        (acc, ele) => acc + Number(ele.totalWithoutInt),
        0
      );
      let sum2 = item.charges.reduce(
        (acc, ele) => acc + Number(ele.intAppliedHeadSum),
        0
      );

      return {
        memberId: item.memberId,
        prevSum: sum1,
        intHeadSum: sum2,
      };
    });

    let filteredLatestBill = billData.map((bill) => {
      let item = latestBill.find((ele) => ele.memberId == bill.memberId);

      let openBal = openingBal.filter((ele) => ele.memberId === bill.memberId);

      console.log(openBal, "opening balance");

      let prevChargeObj = prevBillSum.find(
        (ele) => ele.memberId == bill.memberId
      );

      console.log(prevChargeObj);

      let interest = 0;

      let differenceInDay;

      if (item && item.charges.length > 0) {
        const differenceInTimes =
          new Date(value).getTime() - new Date(item.charges[0].date).getTime();

        differenceInDay = Math.ceil(differenceInTimes / (1000 * 3600 * 24));
      } else {
        const differenceInTimes =
          new Date(value).getTime() -
          new Date(openBal.length > 0 ? openBal[0].date : null).getTime();

        differenceInDay = Math.ceil(differenceInTimes / (1000 * 3600 * 24));
      }

      let p1 = Number(prevChargeObj ? Number(prevChargeObj.intHeadSum) : 0);

      let p2 = Number(openBal.length > 0 ? openBal[0].principal : 0);
      interest =
        differenceInDay > 0
          ? (((p1 + p2) * (interestRate / 100)) / 30) *
            (differenceInDay == 31 ? 30 : differenceInDay)
          : 0;

      console.log(interest, "interest");

      return {
        memberId: bill.memberId,
        dayDiff: differenceInDay,
        prevBillsSum: prevChargeObj ? Number(prevChargeObj.prevSum) : 0,
        heads: item && item.charges.length > 0 ? item.charges[0].heads : heads,
        totalWithoutInt:
          item && item.charges.length > 0 ? item.charges[0].totalWithoutInt : 0,
        currentInt: Number(interest).toFixed(2),
        interest:
          item && item.charges.length > 0 ? item.charges[0].interest : 0,
        prevSum: item && item.charges.length > 0 ? item.charges[0].prevSum : 0,
      };
    });

    let mergedBillData = filteredLatestBill.map((item) => {
      let openBal = openingBal.filter((ele) => ele.memberId === item.memberId);
      const sumOfValues = Object.values(item.heads)
        .map(Number)
        .reduce((acc, curr) => acc + curr, 0);

      let total;
      console.log(Number(item.currentInt), item.dayDiff);
      if (item.dayDiff > 30) {
        total =
          Number(sumOfValues) +
          Number(item.currentInt) +
          Number(openBal.length > 0 ? openBal[0].principal : 0) +
          Number(openBal.length > 0 ? openBal[0].interest : 0) +
          Number(item.prevBillsSum);
      } else {
        total =
          Number(sumOfValues) +
          Number(item.interest) +
          Number(openBal.length > 0 ? openBal[0].principal : 0) +
          Number(openBal.length > 0 ? openBal[0].interest : 0) +
          Number(item.prevBillsSum);
      }

      return {
        memberId: item.memberId,
        heads: item.heads,
        dayDiff: item.dayDiff,
        prevBillsSum: item.prevBillsSum,
        totalWithoutInt: item.totalWithoutInt,
        openingBalance: openBal[0]?.principal || 0,
        openingInterest: openBal[0]?.interest || 0,
        currentInt: item.currentInt,
        headTotal: total,
        interest: item.interest,
        prevSum: item.prevSum,
      };
    });
    console.log(mergedBillData);
    setMergedBillData([...mergedBillData]);
  };

  useEffect(() => {
    if (formData.billDate) {
      createChargeObject(formData.billDate);
    }
  }, [formData.billDate, openingBal]);

  const handleSave = async () => {
    if (!formData.billDate) {
      return toast.error("Please select a bill date");
    }

    console.log(billData);

    const requests = billData
      .filter((item) => selectedItems.includes(item.memberId)) // Only include selected items
      .map((item) => {
        // Create the axios post request for each selected item
        return axios.post(`${config.API_URL}/api/society/postBillCollection`, [
          item,
        ]);
      });

    try {
      // Run all the requests concurrently
      await Promise.all(requests);

      // Only show success notification once
      toast.success("Successfully saved bill data");
    } catch (error) {
      console.log("Error in saving bill data ", error);

      // Only show error notification once
      toast.error("Error in saving bill data");
    }
  };

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // getMonth is 0-indexed
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    if (interestData?.billDate) {
      const billDay = parseInt(interestData.billDate);
      const customDate = new Date(year, month, billDay);

      setFormData((prevData) => ({
        ...prevData,
        billDate: formatDate(customDate),
      }));
    }

    //  fetchBills();
  }, [interestData?.billDate]);

  useEffect(() => {
    if (formData.billDate && interestData?.billDueDays) {
      const billDate = new Date(formData.billDate);
      const dueDate = new Date(billDate);
      dueDate.setDate(billDate.getDate() + Number(interestData.billDueDays));

      setFormData((prevData) => ({
        ...prevData,
        billDueDate: formatDate(dueDate),
      }));
    }
  }, [formData.billDate, interestData?.billDueDays]);

  useEffect(() => {
    fetch(`${config.API_URL}/api/master/getBillHeads`)
      .then((response) => response.json())
      .then((data) => {
        let obj = data.reduce((acc, item) => {
          acc[item.billHead] = "0";
          return acc;
        }, {});

        let intAppliedhead = data.reduce((acc, item) => {
          if (item.interestApplied) {
            acc[item.billHead] = "0";
          }
          return acc;
        }, {});
        setIntAppHeads(intAppliedhead);
        setHeads(obj);
      })
      .catch((error) => console.error("Error in fetching heads:", error));
  }, []);

  useEffect(() => {
    async function fetchInt() {
      try {
        let res = await axios.get(`${config.API_URL}/api/master/getBillMaster`);
        setIntData(res.data[0]);
        setInterestRate(res.data[0].interestRatePerMonth);
        setIntRebate(res.data[0].interestRebateUptoRs);
        setIntMethod(res.data[0].interestCalculationMethod);
        setFlatInt(res.data[0].flatInterestAmount);
        setIsFlatInt(res.data[0].isFlatInterest);
        setBillFrequency(res.data[0].billFrequency);
      } catch (error) {
        console.log(error);
      }
    }
    fetchInt();
  }, []);

  useEffect(() => {
    fetch(`${config.API_URL}/api/society/getBillCollection`)
      .then((response) => response.json())
      .then((data) => {
        setFetchedBillData(data.bills);
      })
      .catch((error) => console.error("Error in fetching Bills:", error));
  }, []);

  useEffect(() => {
    async function fetchPayment() {
      console.log("date", formData.billDate);
      try {
        let res = await axios.get(
          `${config.API_URL}/api/transaction/getPaymentCollection`,
          {
            params: { filterDate: formData.billDate }, // Send filterDate as query parameter
          }
        );
        console.log(res.data.members);
        setPaymentCollection(res.data.members);
      } catch (error) {
        console.log(error);
      }
    }
    fetchPayment();
  }, [formData.billDate]);

  useEffect(() => {
    try {
      fetch(`${config.API_URL}/api/transaction/getOpeningBalance`)
        .then((response) => response.json())
        .then((data) => {
          let arr = data.map((item) => {
            return {
              memberId: item.id,
              principal: item.principal,
              interest: item.interest,
              date: item.date,
            };
          });
          console.log(arr);
          setOpeningBal(arr);
        })
        .catch((error) => console.error(error));
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    const fetchMember = async () => {
      try {
        let res = await axios.get(`${config.API_URL}/api/member/getMemberList`);
        // create obj for email sending
        let emailArr = res.data.map((item) => {
          return {
            memberId: item._id,
            email: item.email,
          };
        });
        console.log(emailArr);
        setObjForEmail(emailArr);

        // end
        let arr = res.data.map((item, index) => {
          let openBal = openingBal.find((e) => e.memberId === item._id);
          let filteredBillData = fetchedBillData.find(
            (item2) => item2.memberId === item._id
          );
          let filteredHeads = mergedBillData.filter(
            (ele) => ele.memberId == item._id
          );
          let billId = generateShortUUID(formData.billDate);

          return {
            memberId: item._id,
            memberName: item.name,
            flatNo: item.flatNo,
            openBalPrinciple: openBal?.principal || 0,
            openInterest: openBal?.interest || 0,
            charges: [
              {
                BillNo: billId,
                date: formData.billDate,
                dueDate: formData.dueDate,
                prevDue: 0,
                prevSum: 0,
                heads:
                  filteredHeads.length > 0 &&
                  Object.keys(filteredHeads[0].heads).length > 0
                    ? filteredHeads[0].heads
                    : heads,
                headTotal: 0,
                total: 0,
                intAppliedHeadSum: 0,
                interest:
                  filteredBillData?.charges[filteredBillData.charges.length - 1]
                    ?.interest || 0,
                totalWithoutInt:
                  filteredBillData?.charges[filteredBillData.charges.length - 1]
                    ?.totalWithoutInt || 0,
                totalWithInt:
                  filteredBillData?.charges[filteredBillData.charges.length - 1]
                    ?.totalWithInt || 0,
              },
            ],
          };
        });
        setBillData(arr);
      } catch (error) {
        console.log("Error in fetching member list ", error);
      }
    };
    fetchMember();
  }, [heads, formData.billDate, openingBal, fetchedBillData]);

  const handleHeadValueChange = (memberIndex, billHead, value) => {
    console.log(mergedBillData);
    setMergedBillData((prevMerged) => {
      const newMerged = [...prevMerged];
      if (memberIndex < newMerged.length) {
        const bill = { ...newMerged[memberIndex] };
        const heads = { ...bill.heads };
        heads[billHead] = value; // Update the specific head value

        // Recalculate headTotal after updating the head value
        const headTotal = Object.values(heads).reduce(
          (sum, headValue) => sum + Number(headValue),
          0
        );

        // Calculate the new total, including previous sums, opening balance, etc.

        console.log(bill.openInterest);
        const newTotal =
          bill.dayDiff > 29
            ? Number(headTotal) +
              Number(bill.currentInt) +
              Number(bill.openingBalance || 0) +
              Number(bill.openingInterest || 0) +
              Number(bill.prevBillsSum)
            : Number(headTotal) +
              Number(bill.interest) +
              Number(bill.openingBalance || 0) +
              Number(bill.openingInterest || 0) +
              Number(bill.prevSum);

        console.log(Number(bill.openingInterest || 0));

        newMerged[memberIndex] = {
          ...bill,
          heads,
          headTotal: newTotal, // Update the total after recalculating it
        };
      }
      return newMerged;
    });

    setBillData((prevBillData) => {
      console.log(prevBillData);
      const newBillData = [...prevBillData];
      console.log(newBillData);
      const member = { ...newBillData[memberIndex] };
      const charges = [...member.charges];
      const heads = { ...charges[0].heads };
      console.log(heads);

      heads[billHead] = value;

      let sumOfInterestHeads = Object.entries(heads).reduce(
        (sum, [key, value]) => {
          return sum + (key in intAppliedHeads ? Number(value) : 0);
        },
        0
      );

      charges[0] = {
        ...charges[0],
        heads,
        total:
          Number(
            Object.values(heads).reduce(
              (sum, headValue) => sum + Number(headValue),
              0
            )
          ) +
          Number(charges[0].prevDue) +
          Number(charges[0].interest),
        intAppliedHeadSum: sumOfInterestHeads,
        headTotal: Number(
          Object.values(heads).reduce(
            (sum, headValue) => sum + Number(headValue),
            0
          )
        ),
      };

      newBillData[memberIndex] = { ...member, charges };
      return newBillData;
    });
  };

  const prepareTableData = () => {
    return billData.map((member, index) => {
      console.log(mergedBillData);

      const charge =
        mergedBillData && mergedBillData.length > 0
          ? mergedBillData.find((ele) => {
              if (!ele.memberId) {
                return null;
              }
              return ele.memberId === member.memberId;
            })
          : 0;

      let payments = fetchedPaymentCollection.find(
        (ele) => ele.memberId == member.memberId
      );

      console.log(charge);

      let sumOfInterestHeads;
      let headT;

      if (charge) {
        sumOfInterestHeads = Object.entries(charge.heads).reduce(
          (sum, [key, value]) => {
            return sum + (key in intAppliedHeads ? Number(value) : 0);
          },
          0
        );

        headT = Number(
          Object.values(charge.heads).reduce(
            (sum, headValue) => sum + Number(headValue),
            0
          )
        );
      }

      member.charges[0].prevDue = charge ? Number(charge.prevBillsSum) : 0;

      member.charges[0].interest = charge ? Number(charge.currentInt) : 0;

      member.charges[0].prevSum = charge ? Number(charge.prevBillsSum) : 0;

      member.charges[0].heads = charge ? charge.heads : heads;

      member.charges[0].intAppliedHeadSum = charge ? sumOfInterestHeads : 0;

      member.charges[0].headTotal = charge ? headT : 0;

      const isChecked = selectedItems.includes(member.memberId);

      const row = [
        isChecked,
        index + 1,
        member.memberName,
        member.flatNo,
        charge
          ? Number(charge.openingBalance) -
            (payments ? payments.totals.totalOpeningBalPaid : 0) +
            (Number(charge.prevBillsSum) -
              (payments ? payments.totals.totalCurrentChargesPaid : 0))
          : Number(member.openBalPrinciple),
        charge
          ? charge.dayDiff > 29
            ? Number(charge.openingInterest) -
              (payments ? payments.totals.totalOpeningIntPaid : 0) +
              (Number(charge.currentInt) -
                (payments ? payments.totals.totalInterestPaid : 0))
            : Number(charge.openingInterest) -
              (payments ? payments.totals.totalOpeningIntPaid : 0) +
              (Number(charge.interest) -
                (payments ? payments.totals.totalInterestPaid : 0))
          : Number(member.openInterest),
      ];

      if (charge && charge.heads) {
        Object.keys(charge.heads).forEach((billHead) => {
          row.push(charge.heads[billHead]);
        });
      } else {
        Object.keys(member.charges[0].heads).forEach((billHead) => {
          row.push(member.charges[0].heads[billHead]);
        });
      }

      console.log(payments ? payments.totals.totalAmountPaid : 0);
      row.push(
        charge
          ? charge.headTotal - (payments ? payments.totals.totalAmountPaid : 0)
          : member.charges[0].total
      );

      return row;
    });
  };

  const getColumnHeaders = () => {
    return [
      "select",
      "S.No",
      "Name",
      "Flat No",
      "Prev Due",
      "Interest",
      ...Object.keys(heads),
      "Total",
    ];
  };

  const handleTick = (rowIndex, isChecked) => {
    const updatedRows = [...billData];
    const memberId = updatedRows[rowIndex].memberId;

    console.log(isChecked);

    setSelectedItems((prevSelectedItems) => {
      const updatedSelectedItems = isChecked
        ? [...prevSelectedItems, memberId]
        : prevSelectedItems.filter((id) => id !== memberId);

      return updatedSelectedItems;
    });

    // Optionally update Handsontable's data
    if (hotTableRef.current) {
      hotTableRef.current.hotInstance.loadData(updatedRows);
    }
  };

  useEffect(() => {
    console.log(selectedItems);
  }, [selectedItems]);

  const handleAfterChange = (changes, source) => {
    if (source === "edit") {
      changes.forEach(([row, prop, oldValue, newValue]) => {
        if (Number(prop) == 0) {
          console.log("here", newValue);
          handleTick(row, newValue);
        }

        const headIndex = Number(prop) - 6; // Adjust for initial columns

        if (headIndex >= 0 && headIndex < Object.keys(heads).length) {
          const billHead = Object.keys(heads)[headIndex];
          const memberIndex = row;
          handleHeadValueChange(memberIndex, billHead, newValue);
        }
      });
    }
  };
  const handleSendEmail = async () => {
    const sentEmails = new Set();
    let emailsSentCount = 0,
      errorOccurred = false;

    for (let item of objForEmail) {
      if (
        selectedItems.includes(item.memberId) &&
        !sentEmails.has(item.email)
      ) {
        try {
          await axios.post(`${config.API_URL}/api/report/send-email`, {
            email: item.email,
            subject: "Hello World",
            message: "Hello...",
          });
          sentEmails.add(item.email);
          emailsSentCount++;
        } catch (error) {
          errorOccurred = true;
        }
      }
    }

    toast[errorOccurred ? "error" : emailsSentCount ? "success" : "info"](
      errorOccurred
        ? "Some emails failed to send."
        : emailsSentCount
        ? `${emailsSentCount} emails sent successfully!`
        : "No emails were sent."
    );
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-center text-xl font-semibold mb-5">Generate Bills</h1>
      <div className="flex items-center justify-evenly px-5 gap-4 mb-4">
        <div>
          <label className="block mb-1 text-sm font-medium">Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChangeType}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Type</option>
            <option value="maintenance bill">Maintenance Bill</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">Bill Date</label>
          <input
            type="date"
            name="billDate"
            value={formData.billDate}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">
            Bill Due Date
          </label>
          <input
            type="date"
            name="billDueDate"
            value={formData.billDueDate}
            readOnly
            className="w-full p-2 border rounded bg-gray-100"
          />
        </div>
        <div>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-600"
          >
            Save
          </button>
        </div>
        <div className="flex gap-2">
          <div>
            <button
              onClick={handleSendEmail}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-600"
            >
              Email
            </button>
          </div>
          <div>
            <button className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-600">
              PDF
            </button>
          </div>
          <div>
            <button className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-600">
              Whatsapp
            </button>
          </div>
          <div>
            <button className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-600">
              SMS
            </button>
          </div>
        </div>
      </div>

      <HotTable
        ref={hotTableRef}
        data={prepareTableData()}
        colHeaders={getColumnHeaders()}
        rowHeaders={true}
        height="auto"
        licenseKey="non-commercial-and-evaluation"
        afterChange={handleAfterChange}
        columns={getColumnHeaders().map((header, index) => {
          if (index === 0) {
            return {
              data: index,
              type: "checkbox",
              className: "htCenter",
              width: 50,
            };
          }
          return {
            data: index,
            width: 100,
            type:
              index < 5 || index === getColumnHeaders().length - 1
                ? "numeric"
                : "text",
            readOnly: index < 6 || index === getColumnHeaders().length - 1,
          };
        })}
      />
    </div>
  );
};

export default NewBills;