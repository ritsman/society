import { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import { toast } from "react-toastify";
import config from "../../config";
import Popup from "reactjs-popup";


const PrintBill = () => {
  const [filteredTableData, setFilteredTableData] = useState([]);
  const [selectedItems, setSelectedItems] = useState("");
  const [selectedMember, setSelectedMember] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const dropdownRef = useRef(null);
  const [items, setItems] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [filterDetails, setFilterDetails] = useState({
    startDate: "",
    endDate: "",
    memberId: "",
    memberName: "",
  });

  const handleEmail = async(bill) => {

    try {
      let res = await axios.post(
        `${config.API_URL}/api/report/send-email`,
        {
          email: bill.email,
          subject: "hello world",
          message: "hello....",
        }
      );
      console.log(res)
      toast.success("email sent")
    } catch (error) {
      console.log(error);
      toast.success("error in sending email")
    }

  }

  const handleSearch = () => {
    const filtered = tableData.filter((bill) => {
      const billDate = new Date(bill.date);
      const startDate = new Date(filterDetails.startDate);
      const endDate = new Date(filterDetails.endDate);

      // Check if the bill date is within the selected date range
      const isDateInRange = billDate >= startDate && billDate <= endDate;

      // Check if the member matches (if a member is selected)
      const isMemberMatch = filterDetails.memberId
        ? bill.member === filterDetails.memberName
        : true;

      return isDateInRange && isMemberMatch;
    });
     console.log(filtered)
    setFilteredTableData(filtered);
  };

  const [societyData , setSocietyData] = useState({})

   useEffect(() => {
     fetchData1();
   }, []);

   const fetchData1 = async () => {
     try {
       const res = await axios.get(
        `${config.API_URL}/api/society/getSocProfile`
       );
          setSocietyData(res.data[0]) 
     } catch (error) {
       console.error(error);
     }
   };

  useEffect(() => {
    handleSearch();
  }, [tableData]);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const toggleItem = useCallback((id, name) => {
    setSelectedItems(id);
    setSelectedMember(name);
    setFilterDetails((prevData) => ({
      ...prevData,
      memberId: id,
      memberName: name,
    }));
    setIsOpen(false);
    handleSearch();
  }, []);

  const SelectAll = () => {
    setSelectedItems("");
    setFilterDetails((prevData) => ({
      ...prevData,
      memberId: null,
      memberName: null,
    }));
    setIsOpen(false);
    handleSearch();
  };

  const formatDate = (date) => date.toISOString().split("T")[0];

  useEffect(() => {
    const today = new Date();

    setFilterDetails((prevData) => ({
      ...prevData,
      startDate: formatDate(today),
      endDate: formatDate(today),
    }));
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.get(
        `${config.API_URL}/api/society/getBills`
      );
      console.log(res.data);
      setItems(res.data);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch bills. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilterDetails((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    handleSearch();
  };

  useEffect(() => {
    fetchGeneratedBill();
  }, [items]);

  async function fetchGeneratedBill() {
    try {
      let res = await axios.get(
        `${config.API_URL}/api/society/getGeneratedBills`
      );
      console.log(res.data.data);
      let arr = res.data.data.flatMap((item) => {
        let arr2 = items.filter((row) => row.data.memberId == item.memberId);
        let heads = arr2[0].data.head.filter((item) => Number(item.value) != 0);

        return item.billDetails.map((item2) => {
          return {
            heads: heads,
            memberId : item.memberId,
            billNo: item2.billNo,
            date: item2.billDate,
            email : arr2[0].data.email,
            flatNo: arr2[0]?.data.flatNo,
            member: item.memberName,
            netAmt: item2.currentBillAmt,
            interest: item2.interest,
            balance: Number(item2.prevBalance) + Number(item2.currentBillAmt),
            prevBalance: Number(item2.prevBalance),
          };
        });
      });
      arr.sort((a, b) => {
        return new Date(a.date) - new Date(b.date);
      });

      setTableData(arr);
      console.log(arr);
    } catch (error) {
      console.log(error);
    }
  }

 const handleSendEmailToAll = async () => {
   const sentEmails = new Set(); 
   let emailsSentCount = 0; 
   let errorOccurred = false;

   for (let bill of filteredTableData) {
     if (!sentEmails.has(bill.email)) {
       try {
         await axios.post(
           `${config.API_URL}/api/report/send-email`,
           {
             email: bill.email,
             subject: "Hello World",
             message: "Hello...",
           }
         );
         sentEmails.add(bill.email); 
         emailsSentCount++;
       } catch (error) {
         console.log(error);
         errorOccurred = true; 
       }
     }
   }

   // Trigger the toast only once after all emails have been processed
   if (emailsSentCount > 0) {
     toast.success(`${emailsSentCount} emails sent successfully.`);
   } else if (errorOccurred) {
     toast.error("Error in sending some emails.");
   } else {
     toast.info("No emails were sent.");
   }
 };



  const handlePrintAllBills = () => {
    const doc = new jsPDF();

    if(filteredTableData.length == 0){
      alert("No bills are present , Select dates")
      return;
    }

    // Set font
    doc.setFont("helvetica");

    filteredTableData.forEach((bill, index) => {
      if (index !== 0) {
        doc.addPage(); // Add a new page for every bill except the first one
      }

      // Header
      doc.setFontSize(16);
      doc.text(`${societyData.societyName}`, 105, 20, {
        align: "center",
      });
      doc.setFontSize(10);
      doc.text(
        `${societyData.address},${societyData.city},${societyData.state}`,
        105,
        30,
        {
          align: "center",
        }
      );

      // Bill details
      doc.setFontSize(10);
      doc.text(`Bill No. : ${bill.billNo}`, 20, 40);
      doc.text(`Date : ${bill.date}`, 100, 40);
      doc.text(`Bill for Period : May-2024`, 160, 40);
      doc.text(`Flat No. : ${bill.flatNo}`, 20, 45);
      doc.text(`Due Date : 20-May-24`, 100, 45);
      doc.text(`Area : 0`, 160, 45);

      // Member name
      doc.text(`To,`, 20, 55);
      doc.text(`${bill.member}`, 20, 60);

      // Table header
      doc.line(20, 65, 190, 65); // Top line of the table
      doc.text("Particulars", 22, 70);
      doc.text("Amount", 170, 70); // Moved to the right side
      doc.line(20, 72, 190, 72); // Bottom line of the header row

      // Table content
      let startY = 77; // Initial Y position for the table content
      bill.heads.forEach((item) => {
        doc.text(item.head, 22, startY);
        doc.text(Number(item.value).toFixed(2), 180, startY, {
          align: "right",
        });
        startY += 5; // Move to the next line
      });

      doc.line(20, startY, 190, startY); // Line after the table content
      startY += 5;
      doc.setFont("helvetica", "bold");
      doc.text("Total", 22, startY);
      doc.text(bill.netAmt.toFixed(2), 180, startY, { align: "right" });
      doc.setFont("helvetica", "normal");

      startY += 5;
      doc.text("Previous Balance ", 22, startY);
      doc.text(bill.prevBalance.toFixed(2), 180, startY, { align: "right" });

      startY += 5;
      doc.line(20, startY, 190, startY); // Line after the previous balance

      startY += 5;
      const grandTotal = bill.netAmt + bill.prevBalance;
      doc.setFont("helvetica", "bold");
      doc.text("Grand total", 22, startY);
      doc.text(grandTotal.toFixed(2), 180, startY, { align: "right" });
      doc.setFont("helvetica", "normal");

      startY += 5;

      // Notes
      startY += 8;
      doc.setFontSize(8);
      doc.text(
        "Note : 1. Members are requested to make payment before 25th of the Month, failing which interest @21% P.A. will be levied.",
        22,
        startY
      );
      startY += 4;
      doc.text(
        "2. Please mention your Flat No. and Mobile No. on reverse of your Cheque. Receipts of the current month bill will be attached with the next bill.",
        29,
        startY
      );

      // Special note
      startY += 10;
      doc.setFontSize(10);

      // Footer
      doc.text(`${societyData.societyName}`, 190, 180, {
        align: "right",
      });
    });

    // Open PDF in new tab
    window.open(doc.output("bloburl"), "_blank");
  };


  //   print pdf implementation start
  const handleRowClick = (bill) => {
    const doc = new jsPDF();

    // Set font
    doc.setFont("helvetica");

    // Header
    doc.setFontSize(16);
    doc.text(`${societyData.societyName}`, 105, 20, {
      align: "center",
    });
    doc.setFontSize(10);
    // doc.text("TNA / TNA / HSG / TC / 32551", 105, 25, { align: "center" });
    doc.text(`${societyData.address},${societyData.city},${societyData.state}`, 105, 30, {
      align: "center",
    });

    // Bill details
    doc.setFontSize(10);
    doc.text(`Bill No. : ${bill.billNo}`, 20, 40);
    doc.text(`Date : ${bill.date}`, 100, 40);
    doc.text(`Bill for Period : May-2024`, 160, 40);
    doc.text(`Flat No. : ${bill.flatNo}`, 20, 45);
    doc.text(`Due Date : 20-May-24`, 100, 45);
    doc.text(`Area : 0`, 160, 45);

    // Member name
    doc.text(`To,`, 20, 55);
    doc.text(`${bill.member}`, 20, 60);

    // Table header
    doc.line(20, 65, 190, 65); // Top line of the table
    doc.text("Particulars", 22, 70);
    doc.text("Amount", 170, 70); // Moved to the right side
    doc.line(20, 72, 190, 72); // Bottom line of the header row

    // Table content
    let startY = 77; // Initial Y position for the table content
    bill.heads.forEach((item) => {
      doc.text(item.head, 22, startY);
      doc.text(Number(item.value).toFixed(2), 180, startY, { align: "right" });
      startY += 5; // Move to the next line
    });

    doc.line(20, startY, 190, startY); // Line after the table content
    startY += 5;
    doc.setFont("helvetica", "bold");
    doc.text("Total", 22, startY);
    doc.text(bill.netAmt.toFixed(2), 180, startY, { align: "right" });
    doc.setFont("helvetica", "normal");

    startY += 5;
    doc.text("Previous Balance ", 22, startY);
    doc.text(bill.prevBalance.toFixed(2), 180, startY, { align: "right" });

    startY += 5;
    doc.line(20, startY, 190, startY); // Line after the previous balance

    startY += 5;
    const grandTotal = bill.netAmt + bill.prevBalance;
    doc.setFont("helvetica", "bold");
    doc.text("Grand total", 22, startY);
    doc.text(grandTotal.toFixed(2), 180, startY, { align: "right" });
    doc.setFont("helvetica", "normal");

    startY += 5;

    // Notes
    startY += 8;
    doc.setFontSize(8);
    doc.text(
      "Note : 1. Members are requested to make payment before 25th of the Month, failing which interest @21% P.A. will be levied.",
      22,
      startY
    );
    startY += 4;
    doc.text(
      "2. Please mention your Flat No. and Mobile No. on reverse of your Cheque. Receipts of the current month bill will be attached with the next bill.",
      29,
      startY
    );

    // Special note
    startY += 10;
    doc.setFontSize(10);

    // Footer
    doc.text(`${societyData.societyName}`, 190, 180, {
      align: "right",
    });

    // Open PDF in new tab
    window.open(doc.output("bloburl"), "_blank");
  };

  // Utility function to convert number to words (simple version)
  const numberToWords = (num) => {
    const a = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];
    const b = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];

    const numberToWordsHelper = (num) => {
      if (num === 0) return "Zero";
      if (num < 20) return a[num];
      if (num < 100) return b[Math.floor(num / 10)] + " " + a[num % 10];
      if (num < 1000)
        return (
          a[Math.floor(num / 100)] +
          " Hundred " +
          numberToWordsHelper(num % 100)
        );
      if (num < 1000000)
        return (
          numberToWordsHelper(Math.floor(num / 1000)) +
          " Thousand " +
          numberToWordsHelper(num % 1000)
        );
      return "Number too large";
    };

    return numberToWordsHelper(num).trim();
  };
  //   print pdf implementation end


  const handleDeleteBill = async(bill)=>{
    try {
       let res = await axios.delete(
         `${config.API_URL}/api/society/delete-GenBill`,
         {
           data: {
             // Use the `data` field to send the payload in DELETE requests
             memberId: bill.memberId,
             billNo: bill.billNo,
           },
         }
       );
       console.log(res);
      toast.success("bill deleted successfully")    
    } catch (error) {
      console.log(error)
      toast.error("error in deleting bill")
    }
  }
  return (
    <div>
      <div className="p-4">
        <div className="text-right px-5">
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-gray-600 text-white rounded-md"
          >
            Search
          </button>
        </div>
        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="block mb-1 text-sm font-medium text-gray-700">
              From Date
            </label>
            <input
              type="date"
              name="startDate"
              value={filterDetails.startDate}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div className="flex-1">
            <label className="block mb-1 text-sm font-medium text-gray-700">
              To Date
            </label>
            <input
              type="date"
              name="endDate"
              value={filterDetails.endDate}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div className="flex-1">
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Customer
            </label>
            <div className="relative w-64" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className="w-full p-2 text-left bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {selectedItems.length === 0 ? "All" : selectedMember}
              </button>
              {isOpen && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                  <div className="max-h-48 overflow-y-auto">
                    {isLoading ? (
                      <p className="p-2">Loading...</p>
                    ) : error ? (
                      <p className="p-2 text-red-500">{error}</p>
                    ) : items.length === 0 ? (
                      <p className="p-2">No items found</p>
                    ) : (
                      <>
                        <div
                          onClick={() => SelectAll()}
                          className={`p-2 hover:bg-gray-300 cursor-pointer`}
                        >
                          All
                        </div>
                        {items.map((item) => (
                          <div
                            key={item.id}
                            onClick={() =>
                              toggleItem(
                                item.data.memberId,
                                item.data.ownerName
                              )
                            }
                            className={`p-2 hover:bg-gray-300 cursor-pointer`}
                          >
                            <span className="inline-block w-8 h-6 mr-2 text-sm text-white bg-gray-500 rounded-md  text-center leading-6">
                              {item.data.flatNo}
                            </span>
                            {item.data.ownerName}
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="mt-2 text-right flex gap-3 justify-end px-5">
          <button
            onClick={handlePrintAllBills}
            className="border-2  border-black px-2 py-1 rounded-md"
          >
            Print Bills
          </button>
          <button
            onClick={handleSendEmailToAll}
            className="border-2  border-black px-2 py-1 rounded-md"
          >
            Send Email
          </button>
        </div>
        {/* table view */}
        <div className="mt-5">
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-center">Bill No</th>
                  <th className="py-3 px-6 text-center">Date</th>
                  <th className="py-3 px-6 text-center">Flat No</th>
                  <th className="py-3 px-6 text-center">Member Name</th>
                  <th className="py-3 px-6 text-center">Outstanding </th>
                  <th className="py-3 px-6 text-center">Interest</th>
                  <th className="py-3 px-6 text-center">Previous Due</th>
                  <th className="py-3 px-6 text-center">Total Amount</th>
                  <th className="py-3 px-6 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {(filteredTableData.length > 0 ? filteredTableData : []).map(
                  (bill) => (
                    <tr
                      onClick={() => handleRowClick(bill)}
                      key={bill.billNo}
                      className="border-b cursor-pointer border-gray-200 hover:bg-gray-100"
                    >
                      <td className="py-3 px-6 text-left whitespace-nowrap">
                        {bill.billNo}
                      </td>
                      <td className="py-3 px-6 text-center">{bill.date}</td>
                      <td className="py-3 px-6 text-center">{bill.flatNo}</td>
                      <td className="py-3 px-6 text-center">{bill.member}</td>
                      <td className="py-3 px-6 text-center">{bill.netAmt}</td>
                      <td className="py-3 px-6 text-center">{bill.interest}</td>
                      <td className="py-3 px-6 text-center">
                        {bill.prevBalance}
                      </td>
                      <td className="py-3 px-6 text-center">{bill.balance}</td>
                      <td className="py-3 px-6 flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEmail(bill);
                          }}
                          className="bg-gray-800 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                        >
                          Send Email
                        </button>
                        <Popup
                          trigger={
                            <button className=" bg-gray-800 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">
                              Delete bill
                            </button>
                          }
                          position="center"
                          contentStyle={{
                            width: "400px",
                            background: "white",
                            borderRadius: "0.5rem",
                            padding: "1rem",
                            boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
                          }}
                          overlayStyle={{
                            background: "rgba(0, 0, 0, 0.5)",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                          modal
                        >
                          {(close) => (
                            <div className="text-center ">
                              <div className="text-xl text-black font-bold mb-4">
                                Are you Sure, You want to Delete ?
                              </div>
                              <div className="flex justify-center space-x-4">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteBill(bill);
                                    close();
                                  }}
                                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                                >
                                  Delete
                                </button>
                                <button
                                  className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400"
                                  onClick={close}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          )}
                        </Popup>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintBill;
