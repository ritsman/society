// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";
// import jsPDF from "jspdf";
// import "jspdf-autotable";
// import config from "../../config";

// const IndividualLedger = () => {
//   const location = useLocation();
//   const { member } = location.state || {};
//   const [indiMember, setIndiMember] = useState({});
//   const [head, setHead] = useState([]);
//   const [Ledger, setLedger] = useState({});
//   const [filteredLedger, setFilteredLedger] = useState([]);
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [openingBal, setOpeningBal] = useState([]);

//   useEffect(() => {
//     console.log(member,"member")
//     setIndiMember(member);
//   }, [member]);

//   useEffect(() => {
//     async function fetch() {
//       try {
//         let res = await axios.get(
//           `${config.API_URL}/api/master/getBillHeads`
//         );
//         let tableHead = res.data.map((item) => item);
//         setHead(tableHead);
//       } catch (error) {
//         console.log(error);
//       }
//     }
//     fetch();
//   }, []);

//      useEffect(() => {
//        try {
//          fetch(`${config.API_URL}/api/transaction/getOpeningBalance`)
//            .then((response) => response.json())
//            .then((data) => {
//              let openBal = data.filter((e) => e.id == indiMember._id);
//              setOpeningBal(openBal);
//            })
//            .catch((error) => console.error(error));
//        } catch (error) {
//          console.log(error);
//        }
//      }, [indiMember._id]);

//      useEffect(()=>{
//        console.log(openingBal)
//      },[openingBal])

//   useEffect(() => {
//     fetchLedger();
//   }, [indiMember]);

//   async function fetchLedger() {
//     try {
//       let res = await axios.get(
//         `${config.API_URL}/api/member/Ledger/${indiMember._id}`
//       );
//       setLedger(res.data.data);
//       setFilteredLedger(res.data.data.ledger);
//     } catch (error) {
//       console.error(error);
//     }
//   }

//   const handleFilter = () => {
//     if (startDate && endDate) {
//       const filtered = Ledger.ledger.filter((transaction) => {
//         const transactionDate = new Date(transaction.date);
//         return (
//           transactionDate >= new Date(startDate) &&
//           transactionDate <= new Date(endDate)
//         );
//       });
//       setFilteredLedger(filtered);
//     } else {
//       setFilteredLedger(Ledger.ledger);
//     }
//   };
// const generateAndOpenPDF = () => {
//   const doc = new jsPDF();
//   doc.setFontSize(18);
//   doc.text("Member Ledger", 14, 22);
//   doc.setFontSize(12);
//   doc.text(`Member Name: ${indiMember.name}`, 14, 32);
//   doc.text(`Flat No: ${indiMember.flatNo}`, 14, 40);

//   // Define the headers for the table
//   const headers = [
//     ["Date", "No", "Ref", "Particulars", "Debit", "Credit", "Net Balance"],
//   ];

//   // Prepare body for the table including the opening balance as the first row
//   const body = [];

//   // Add the opening balance row if available
//   if (openingBal.length > 0) {
//     body.push([
//       "-", // Date
//       "-", // No
//       "-", // Ref
//       "OPENING BALANCE B/F", // Particulars
//       "-", // Debit
//       "-", // Credit
//       Number(openingBal[0].total).toFixed(2), // Net Balance
//     ]);
//   }

//   // Add all filtered ledger transactions to the body
//   filteredLedger.forEach((transaction) => {
//      const adjustedBalance =
//        openingBal.length > 0
//          ? Number(transaction.balance) + Number(openingBal[0].total)
//          : Number(transaction.balance);
//     body.push([
//       new Date(transaction.date).toLocaleDateString(), // Date
//       transaction.tranId, // No
//       transaction.ref, // Ref
//       transaction.particulars, // Particulars
//       transaction.debit, // Debit
//       transaction.credit, // Credit
//       adjustedBalance, // Net Balance
//     ]);
//   });

//   // Generate the table with autoTable
//   doc.autoTable({
//     startY: 50,
//     head: headers,
//     body: body,
//     styles: { fontSize: 8 },
//     headStyles: { fillColor: [200, 200, 200], textColor: 20 },
//     alternateRowStyles: { fillColor: [245, 245, 245] },
//   });

//   // Open the PDF in a new window
//   doc.output("dataurlnewwindow");
// };

//   return (
//     <div className="px-5">
//       <div className="flex justify-between flex-wrap gap-5">
//         <div className="flex items-center">
//           <span className="font-semibold mr-2">Member name:</span>
//           <span>{indiMember.name}</span>
//         </div>
//         <div className="flex items-center">
//           <span className="font-semibold mr-2">Flat No:</span>
//           <span>{indiMember.flatNo}</span>
//         </div>
//       </div>

//       <div className="mt-5 flex gap-4">
//         <div>
//           <label htmlFor="startDate" className="font-semibold mr-2">
//             Start Date:
//           </label>
//           <input
//             type="date"
//             id="startDate"
//             value={startDate}
//             onChange={(e) => setStartDate(e.target.value)}
//             className="border px-2 py-1 rounded"
//           />
//         </div>
//         <div>
//           <label htmlFor="endDate" className="font-semibold mr-2">
//             End Date:
//           </label>
//           <input
//             type="date"
//             id="endDate"
//             value={endDate}
//             onChange={(e) => setEndDate(e.target.value)}
//             className="border px-2 py-1 rounded"
//           />
//         </div>
//         <button
//           onClick={handleFilter}
//           className="bg-gray-700 text-white px-3 py-1 rounded"
//         >
//           Filter
//         </button>
//         <button
//           onClick={generateAndOpenPDF}
//           className="bg-gray-700 text-white px-3 py-1 rounded"
//         >
//           Print
//         </button>
//       </div>

//       <div className="overflow-x-auto mt-5">
//         <table className="min-w-full bg-white">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Date
//               </th>
//               <th className="px-6 py-3 whitespace-nowrap text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 No
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Ref
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Particulars
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Debit
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Credit
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Balance
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             <tr>
//               <td className="border px-4 py-2">-</td>
//               <td className="border px-4 py-2">-</td>
//               <td className="border px-4 py-2 text-sm">OPENING BALANCE B/F</td>
//               <td className="border px-4 py-2 "></td>
//               <td className="border px-4 py-2"></td>
//               <td className="border px-4 py-2"></td>
//               <td className="border px-4 py-2 text-sm">
//                 {openingBal.length > 0 ? Number(openingBal[0].total) : 0}
//               </td>
//             </tr>
//             {filteredLedger &&
//               filteredLedger.map((transaction) => (
//                 <tr
//                   key={transaction.id}
//                   className={`${
//                     transaction.mode === "bill" ? "text-blue-800" : "text-black"
//                   }`}
//                 >
//                   <td className="px-6 border py-4 whitespace-nowrap text-sm ">
//                     {transaction.date}
//                   </td>
//                   <td className="px-6 border py-4 whitespace-nowrap text-sm ">
//                     {transaction.tranId}
//                   </td>
//                   <td className="px-6 border py-4 whitespace-nowrap text-sm ">
//                     {transaction.ref}
//                   </td>
//                   <td className="px-6 border py-4 whitespace-nowrap text-sm ">
//                     {transaction.particulars}
//                   </td>
//                   <td className="px-6 border py-4 whitespace-nowrap text-sm ">
//                     {transaction.debit}
//                   </td>
//                   <td className="px-6 border py-4 whitespace-nowrap text-sm ">
//                     {transaction.credit}
//                   </td>
//                   <td className="px-6 border py-4 whitespace-nowrap text-sm ">
//                     {openingBal.length > 0
//                       ? Number(transaction.balance) +
//                         Number(openingBal[0].total)
//                       : Number(transaction.balance)}
//                   </td>
//                 </tr>
//               ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default IndividualLedger;

import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import config from "../../config";

const IndividualLedger = () => {
  const location = useLocation();
  const { member } = location.state || {};
  const [indiMember, setIndiMember] = useState({});
  const [head, setHead] = useState([]);
  const [ledger, setLedger] = useState({});
  const [filteredLedger, setFilteredLedger] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [openingBal, setOpeningBal] = useState([]);

  useEffect(() => {
    setIndiMember(member);
  }, [member]);

  // useEffect(() => {
  //   async function fetchHeads() {
  //     try {
  //       let res = await axios.get(`${config.API_URL}/api/master/getBillHeads`);
  //       setHead(res.data);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  //   fetchHeads();
  // }, []);

  useEffect(() => {
    async function fetchOpeningBalance() {
      try {
        const response = await axios.get(
          `${config.API_URL}/api/transaction/getOpeningBalance`
        );
        let openBal = response.data.filter((e) => e.id === indiMember._id);
        setOpeningBal(openBal);
      } catch (error) {
        console.log(error);
      }
    }
    if (indiMember._id) {
      fetchOpeningBalance();
    }
  }, [indiMember._id]);

  useEffect(() => {
    fetchLedger();
  }, [indiMember]);

  async function fetchLedger() {
    try {
      let res = await axios.get(
        `${config.API_URL}/api/member/Ledger/${indiMember._id}`
      );
      setLedger(res.data.data);
      const sortedLedger = res.data.data.ledger.sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );
      setFilteredLedger(sortedLedger);
    } catch (error) {
      console.error(error);
    }
  }

  const handleFilter = () => {
    let filtered = ledger.ledger;
    if (startDate && endDate) {
      filtered = filtered.filter((transaction) => {
        const transactionDate = new Date(transaction.date);
        return (
          transactionDate >= new Date(startDate) &&
          transactionDate <= new Date(endDate)
        );
      });
    }
    const sortedFiltered = filtered.sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
    setFilteredLedger(sortedFiltered);
  };

  const calculateRunningBalance = (transactions) => {
    let balance = openingBal.length > 0 ? Number(openingBal[0].total) : 0;
    return transactions.map((transaction) => {
      if (transaction.debit !== "-") {
        balance += Number(transaction.debit);
      }
      if (transaction.credit !== "-") {
        balance -= Number(transaction.credit);
      }
      return { ...transaction, runningBalance: balance };
    });
  };

  const generateAndOpenPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Member Ledger", 14, 22);
    doc.setFontSize(12);
    doc.text(`Member Name: ${indiMember.name}`, 14, 32);
    doc.text(`Flat No: ${indiMember.flatNo}`, 14, 40);

    const headers = [
      ["Date", "No", "Ref", "Particulars", "Debit", "Credit", "Balance"],
    ];
    const body = [];

    if (openingBal.length > 0) {
      body.push([
        openingBal[0].date,
        "-",
        "-",
        "OPENING BALANCE B/F",
        "-",
        "-",
        Number(openingBal[0].total).toFixed(2),
      ]);
    }

    calculateRunningBalance(filteredLedger).forEach((transaction) => {
      body.push([
        transaction.date,
        transaction.tranId,
        transaction.ref,
        transaction.particulars,
        transaction.debit !== "-" ? Number(transaction.debit).toFixed(2) : "-",
        transaction.credit !== "-"
          ? Number(transaction.credit).toFixed(2)
          : "-",
        transaction.runningBalance.toFixed(2),
      ]);
    });

    doc.autoTable({
      startY: 50,
      head: headers,
      body: body,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [200, 200, 200], textColor: 20 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    doc.output("dataurlnewwindow");
  };

  return (
    <div className="px-5">
      <div className="flex justify-between flex-wrap gap-5">
        <div className="flex items-center">
          <span className="font-semibold mr-2">Member name:</span>
          <span>{indiMember.name}</span>
        </div>
        <div className="flex items-center">
          <span className="font-semibold mr-2">Flat No:</span>
          <span>{indiMember.flatNo}</span>
        </div>
      </div>

      <div className="mt-5 flex gap-4">
        <div>
          <label htmlFor="startDate" className="font-semibold mr-2">
            Start Date:
          </label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border px-2 py-1 rounded"
          />
        </div>
        <div>
          <label htmlFor="endDate" className="font-semibold mr-2">
            End Date:
          </label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border px-2 py-1 rounded"
          />
        </div>
        <button
          onClick={handleFilter}
          className="bg-gray-700 text-white px-3 py-1 rounded"
        >
          Filter
        </button>
        <button
          onClick={generateAndOpenPDF}
          className="bg-gray-700 text-white px-3 py-1 rounded"
        >
          Print
        </button>
      </div>

      <div className="overflow-x-auto mt-5">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 whitespace-nowrap text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                No
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ref
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Particulars
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Debit
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Credit
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Balance
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td className="px-6 border py-4 whitespace-nowrap text-sm">
                {openingBal.length > 0 ? openingBal[0].date : "-"}
              </td>
              <td className="border px-4 py-2">-</td>
              <td className="border px-4 py-2">-</td>
              <td className="border px-4 py-2 text-sm">OPENING BALANCE B/F</td>
              <td className="border px-4 py-2">-</td>
              <td className="border px-4 py-2">-</td>
              <td className="border px-4 py-2 text-sm">
                {openingBal.length > 0
                  ? Number(openingBal[0].total).toFixed(2)
                  : "0.00"}
              </td>
            </tr>
            {calculateRunningBalance(filteredLedger).map((transaction) => (
              <tr
                key={transaction._id}
                className={
                  transaction.mode === "bill" ? "text-blue-800" : "text-black"
                }
              >
                <td className="px-6 border py-4 whitespace-nowrap text-sm">
                  {transaction.date}
                </td>
                <td className="px-6 border py-4 whitespace-nowrap text-sm">
                  {transaction.tranId}
                </td>
                <td className="px-6 border py-4 whitespace-nowrap text-sm">
                  {transaction.ref}
                </td>
                <td className="px-6 border py-4 whitespace-nowrap text-sm">
                  {transaction.particulars}
                </td>
                <td className="px-6 border py-4 whitespace-nowrap text-sm">
                  {transaction.debit !== "-"
                    ? Number(transaction.debit).toFixed(2)
                    : "-"}
                </td>
                <td className="px-6 border py-4 whitespace-nowrap text-sm">
                  {transaction.credit !== "-"
                    ? Number(transaction.credit).toFixed(2)
                    : "-"}
                </td>
                <td className="px-6 border py-4 whitespace-nowrap text-sm">
                  {transaction.runningBalance.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IndividualLedger;
