// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { NavLink, useNavigate, Link } from "react-router-dom";
// import { toast } from "react-toastify";

// const header = [
//   "GL Code",
//   "Bill Head",
//   "Under",
//   "Sequence no",
//   "Apply Interest",
//   "CGST",
//   "SGST",
//   "IGST",
// ];

// const MaintenanceHead = () => {
//   const navigate = useNavigate();

//   const handleClick = () => {
//     navigate("/master/maintenance-head/new-maintenanceHead");
//   };

//   const [billHeadData, setBillHeadData] = useState([]);

//   useEffect(() => {
//     fetch("http://localhost:3001/api/master/getBillHeads")
//       .then((response) => response.json())
//       .then((data) => {
//         setBillHeadData(data);
//       });
//   }, []);

//   const [mmData, setMMData] = useState([]);

 
// useEffect(() => {
//   // Fetch data for mmData
//   fetch("http://localhost:3001/api/master/getHead")
//     .then((response) => response.json())
//     .then((data) => {
//       const arr = data.map((item, index) => {
//         // Match item with billHeadData by _id or other identifier
//         const matchedBillHead =
//           billHeadData.find((b) => b.billHead === item.Header) || {};

//         console.log(matchedBillHead, "bill head data");

//         return {
//           _id: item._id,
//           GhCode: index,
//           billHead: item.Header,
//           under: item.Under,
//           sequenceNo: matchedBillHead.sequenceNo || index + 1,
//           interestApplied: matchedBillHead.interestApplied || false, // Take from billHeadData if exists
//           cgst: matchedBillHead.cgst || "0",
//           sgst: matchedBillHead.sgst || "0",
//           igst: matchedBillHead.igst || "0",
//           isActive: matchedBillHead.isActive || false, // Take from billHeadData if exists
//         };
//       });
//       setMMData(arr);
//     });
// }, [billHeadData]);

//   const handleInputChange = (index, field, value) => {
//     const updatedData = [...mmData];
//     updatedData[index][field] = value;
//     setMMData(updatedData);
//   };

//   const setTick = (contact, event) => {
//     const updatedData = mmData.map((item) =>
//       item._id === contact._id
//         ? { ...item, isActive: event.target.checked }
//         : item
//     );
//     setMMData(updatedData);
//   };

//   const handleSubmit = async () => {
//     console.log(mmData);
//     try {
//       let res = await axios.post(
//         "http://localhost:3001/api/master/postBillHeads",
//         mmData
//       );
//       toast.success("Successfully saved data");
//     } catch (error) {
//       toast.error("Error storing data");
//     }
//   };

//   return (
//     <div
//       className="md:py-10 px-10 overflow-y-auto gap-6"
//       style={{ height: "calc(100vh - 150px)" }}
//     >
//       <h1 className="text-center font-bold text-2xl">Bills Head</h1>
//       <div className="flex justify-between">
//         <div className="flex gap-5">
//           <button
//             onClick={handleClick}
//             className="bg-gray-800 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
//           >
//             Add New
//           </button>
//           <button
//             onClick={handleSubmit}
//             className="px-4 py-2 bg-gray-500 text-white rounded-md"
//           >
//             Save
//           </button>
//         </div>
//         <Link to="M-headList">
//           <button className="border-2 border-gray-800 text-black px-4 py-2 rounded-md hover:bg-gray-800 hover:text-white font-bold">
//             View Heads
//           </button>
//         </Link>
//       </div>
//       <div className="max-w-screen overflow-x-auto shadow-lg mt-6">
//         <table className="w-full border-collapse">
//           <thead className="bg-gray-700 text-slate-200">
//             <tr>
//               <th className="p-2 text-sm">Is Active</th>
//               {header.map((head, index) => (
//                 <th className="px-2 text-sm border" key={index}>
//                   {head}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-300">
//             {mmData.map((row, index) => (
//               <tr key={index} className="hover:bg-gray-200 cursor-pointer">
//                 <td className="p-4 border text-center">
//                   <input
//                     type="checkbox"
//                     checked={row.isActive}
//                     onChange={(event) => setTick(row, event)}
//                     name={row._id}
//                   />
//                 </td>
//                 <td className="px-8 border">{row.GhCode}</td>
//                 <td className="px-4 border">{row.billHead}</td>
//                 <td className="px-4 border">{row.under}</td>
//                 <td className="px-4 border text-center">
//                   <input
//                     type="text"
//                     value={row.sequenceNo}
//                     onChange={(e) =>
//                       handleInputChange(index, "sequenceNo", e.target.value)
//                     }
//                     className="bg-transparent text-center focus:outline-none w-[40%]"
//                   />
//                 </td>
//                 <td className="px-4 text-center px-2 border">
//                   <input
//                     type="checkbox"
//                     id="isFlatInterest"
//                     name="isFlatInterest"
//                     checked={row.interestApplied}
//                     className="mr-2"
//                     onChange={(e) =>
//                       handleInputChange(
//                         index,
//                         "interestApplied",
//                         e.target.checked
//                       )
//                     }
//                   />
//                 </td>
//                 <td className="px-4 text-center border">
//                   <input
//                     type="text"
//                     value={row.cgst}
//                     onChange={(e) =>
//                       handleInputChange(index, "cgst", e.target.value)
//                     }
//                     className="bg-transparent text-center focus:outline-none w-[40%]"
//                   />
//                 </td>
//                 <td className="px-4 text-center border">
//                   <input
//                     type="text"
//                     value={row.sgst}
//                     onChange={(e) =>
//                       handleInputChange(index, "sgst", e.target.value)
//                     }
//                     className="bg-transparent text-center focus:outline-none w-[40%]"
//                   />
//                 </td>
//                 <td className="px-4 text-center border">
//                   <input
//                     type="text"
//                     value={row.igst}
//                     onChange={(e) =>
//                       handleInputChange(index, "igst", e.target.value)
//                     }
//                     className="bg-transparent text-center focus:outline-none w-[40%]"
//                   />
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default MaintenanceHead;




import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import Handsontable from "handsontable";
import { HotTable } from "@handsontable/react";
import "handsontable/dist/handsontable.full.css";
import { registerAllModules } from "handsontable/registry";

// Define headers for Handsontable
const header = [
  "GL Code",
  "Bill Head",
  "Under",
  "Sequence no",
  "Apply Interest",
  "CGST",
  "SGST",
  "IGST",
];

const MaintenanceHead = () => {
  const navigate = useNavigate();
  const hotTableRef = useRef(null);

  const handleClick = () => {
    navigate("/master/maintenance-head/new-maintenanceHead");
  };

  // Register Handsontable modules
  registerAllModules();

  const [billHeadData, setBillHeadData] = useState([]);
  const [mmData, setMMData] = useState([]);

  // Fetch bill heads data
  useEffect(() => {
    fetch("https://a3.arya-erp.in/api2/socapi/api/master/getBillHeads")
      .then((response) => response.json())
      .then((data) => setBillHeadData(data));
  }, []);

  // Fetch mmData and map to appropriate format
  useEffect(() => {
    fetch("https://a3.arya-erp.in/api2/socapi/api/master/getHead")
      .then((response) => response.json())
      .then((data) => {
        const arr = data.map((item, index) => {
          const matchedBillHead =
            billHeadData.find((b) => b.billHead === item.Header) || {};

          return {
            _id: item._id,
            GhCode: index,
            billHead: item.Header,
            under: item.Under,
            sequenceNo: matchedBillHead.sequenceNo || index + 1,
            interestApplied: matchedBillHead.interestApplied || false,
            cgst: matchedBillHead.cgst || "0",
            sgst: matchedBillHead.sgst || "0",
            igst: matchedBillHead.igst || "0",
            isActive: matchedBillHead.isActive || false,
          };
        });
        setMMData(arr);
      });
  }, [billHeadData]);

  // Handle input changes in Handsontable
  const handleInputChange = (changes) => {
    if (changes) {
      const updatedData = [...mmData];
      changes.forEach(([row, prop, oldValue, newValue]) => {
        updatedData[row][prop] = newValue;
      });
      setMMData(updatedData);
    }
  };

  // Handle after change event in Handsontable
  const handleAfterChange = (changes, source) => {
    if (source === "loadData") return; // Skip on data load
    handleInputChange(changes);
  };

  // Handle checkbox change
  const setTick = (contact, event) => {
    const updatedData = mmData.map((item) =>
      item._id === contact._id
        ? { ...item, isActive: event.target.checked }
        : item
    );
    setMMData(updatedData);
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      await axios.post(
        "https://a3.arya-erp.in/api2/socapi/api/master/postBillHeads",
        mmData
      );
      toast.success("Successfully saved data");
    } catch (error) {
      toast.error("Error storing data");
    }
  };

  // Define columns for Handsontable
  const columns = [
    { data: "isActive", title: "is Active", type: "checkbox", width: 100 },
    {
      data: "GhCode",
      title: "Gh Code",
      type: "text",
      readOnly: true,
      width: 100,
    },
    { data: "billHead", title: "Bill Head", type: "text", width: 150 },
    { data: "under", title: "Under", type: "text", width: 150 },
    { data: "sequenceNo", title: "Sequence No", type: "numeric", width: 100 },
    {
      data: "interestApplied",
      title: "Apply interest",
      type: "checkbox",
      width: 150,
    },
    { data: "cgst", title: "Cgst", type: "numeric", width: 100 },
    { data: "sgst", title: "Sgst", type: "numeric", width: 100 },
    { data: "igst", title: "Igst", type: "numeric", width: 100 },
  ];

  return (
    <div
      className="md:py-10 px-10 overflow-y-auto gap-6"
      style={{ height: "calc(100vh - 150px)" }}
    >
      <h1 className="text-center font-bold text-2xl">Bills Head</h1>
      <div className="flex justify-between">
        <div className="flex gap-5">
          <button
            onClick={handleClick}
            className="bg-gray-800 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
          >
            Add New
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-gray-500 text-white rounded-md"
          >
            Save
          </button>
        </div>
        <Link to="M-headList">
          <button className="border-2 border-gray-800 text-black px-4 py-2 rounded-md hover:bg-gray-800 hover:text-white font-bold">
            View Heads
          </button>
        </Link>
      </div>

      <div
        className="max-w-screen overflow-x-auto shadow-lg mt-6"
        style={{ height: "500px" }}
      >
        {mmData.length > 0 ? (
          <HotTable
            data={mmData}
            columns={columns}
            colHeaders={true}
            rowHeaders={true}
            licenseKey="non-commercial-and-evaluation"
            afterChange={handleAfterChange}
            ref={hotTableRef}
            dropdownMenu={true}
            contextMenu={true}
          />
        ) : (
          <p>Loading data...</p>
        )}
      </div>
    </div>
  );
};

export default MaintenanceHead;





