import { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";

const PrintBill = () => {
  const [receiptData, setReceiptData] = useState([]);
    const [selectedItems, setSelectedItems] = useState("");
    const [filteredData , setFilteredData] = useState([])
      const [isLoading, setIsLoading] = useState(true);


   const [filterDetails, setFilterDetails] = useState({
     startDate: "",
     endDate: "",
     memberId: "",
     memberName: "",
   });
     const [isOpen, setIsOpen] = useState(false);


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



     const dropdownRef = useRef(null);
    const toggleDropdown = () => setIsOpen(!isOpen);


      const handleSearch = () => {
        const filtered = receiptData.filter((bill) => {
          const billDate = new Date(bill.date);
          const startDate = new Date(filterDetails.startDate);
          const endDate = new Date(filterDetails.endDate);

          // Check if the bill date is within the selected date range
          const isDateInRange = billDate >= startDate && billDate <= endDate;

          // Check if the member matches (if a member is selected)
          const isMemberMatch = filterDetails.memberId
            ? bill.name === filterDetails.memberName
            : true;

          return isDateInRange && isMemberMatch;
        });
        console.log(filtered);
        setFilteredData(filtered);
      };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilterDetails((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    handleSearch();
  };

  async function fetchData() {
    try {
      let res = await axios.get(
        "http://localhost:3001/api/transaction/getCashReceipt"
      );
      const mappedData = res.data.flatMap((item) =>
        item.paid.map((paidEntry) => ({
          name: item.name,
          code: item.code,
          onBillAmt: (Number(paidEntry.OnBillAmt)+Number(paidEntry.interest)).toFixed(2),
          paid: paidEntry.amount,
          date:paidEntry.date,
          billNo:paidEntry.billNo,
          mode:paidEntry.mode,
          billDate:paidEntry.billDate,
          interest:paidEntry.interest
        }))
      );
      setReceiptData(mappedData);
      console.log(mappedData)
    } catch (error) {
      console.log(error);
    }
  }



const generatePDF = (receipt) => {
  const doc = new jsPDF();

  // Set the font size and default font
  doc.setFontSize(12);
  doc.setFont("times", "bold");

  // Title and Society Info
  doc.text("SHREENATH AVENUE CO-OP. HOUSING SOCIETY LTD", 50, 20);
  doc.setFontSize(10);
  doc.text("Regn.No: TNA / TNA / HSG / TC / 32551", 70, 26);
  doc.text("Sai Krupa Complex, Kashi Village, Mira Road", 65, 32);

  // CASH RECEIPT Title
  doc.setFontSize(12);
  doc.text("CASH RECEIPT", 90, 42);

  // Receipt Number and Date
  doc.setFontSize(10);
  doc.setFont("times", "normal");
  doc.text("No.", 20, 52);
  doc.setFont("times", "bold");
  doc.text("CR/24/000001", 50, 52);

  doc.setFont("times", "normal");
  doc.text("Date", 140, 52);
  doc.setFont("times", "bold");
  doc.text(`${receipt.date}`, 160, 52);

  // Received From
  doc.setFont("times", "normal");
  doc.text("Received with thanks from", 20, 62);
  doc.setFont("times", "bold");
  doc.text(`${receipt.name}`, 90, 62);

  // Sum in words
  doc.setFont("times", "normal");
  doc.text("the sum of Rupees (In Words)", 20, 72);
  doc.setFont("times", "bold");
  doc.text("*", 90, 72);

  // Vide Cash Receipt No and Date
  doc.setFont("times", "normal");
  doc.text("Vide Cash Receipt No.", 20, 82);
  doc.text("...........................", 70, 82);
  doc.text("Dated", 140, 82);
  doc.text("...........................", 160, 82);

  // Drawn On
  doc.text("Drawn On", 20, 92);
  doc.text(
    "...........................................................................",
    50,
    92
  );

  // Towards Maintenance Charges
  doc.text("Towards Maintenance Charges", 20, 102);
  doc.setFont("times", "bold");
  doc.text(`${receipt.onBillAmt}`, 120, 102);
  doc.setFont("times", "normal");
  doc.text("of Flat No", 130, 102);
  doc.setFont("times", "bold");
  doc.text(`${receipt.code}`, 160, 102);

  // Rs amount and Footer
  doc.setFont("times", "normal");
  doc.text("Rs.", 20, 112);
  doc.setFont("times", "bold");
  doc.text(`${receipt.paid} /-`, 50, 112);
  doc.setFont("times", "normal");
  doc.text("For SHREENATH AVENUE CO-OP. HOUSING SOCIETY", 100, 112);

  // Footer for cheque/draft realization
  doc.setFontSize(9);
  doc.text("Payments by Cheque/Draft Subject to the realization", 20, 125);

  // Line for Note
  doc.line(20, 140, 190, 140); // Horizontal line

  // Save the document
    window.open(doc.output("bloburl"), "_blank");
};

// Call the function


  // Call the function


  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-4">
        Member Receipt Bill
      </h1>

      {/* header */}
      <div className="text-right px-5">
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-gray-600 text-white rounded-md"
        >
          Search
        </button>
      </div>
      <div className="flex space-x-4 mb-4">
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
                            toggleItem(item.data.memberId, item.data.ownerName)
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

      {/* header */}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Flat No </th>
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Bill No</th>
              <th className="py-3 px-6 text-left">Bill Date</th>

              <th className="py-3 px-6 text-left"> Amount</th>
              <th className="py-3 px-6 text-left">Paid</th>
              <th className="py-3 px-6 text-left">Mode</th>
              <th className="py-3 px-6 text-left">Paid Date</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {filteredData.map((receipt, index) => (
              <tr
                key={index}
                onClick={() => {
                  generatePDF(receipt);
                }}
                className="border-b border-gray-200 cursor-pointer hover:bg-gray-100"
              >
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  {receipt.code}
                </td>
                <td className="py-3 px-6 text-left">{receipt.name}</td>
                <td className="py-3 px-6 text-left">{receipt.billNo}</td>
                <td className="py-3 px-6 text-left">{receipt.billDate}</td>

                <td className="py-3 px-6 text-left">{receipt.onBillAmt}</td>
                <td className="py-3 px-6 text-left">{receipt.paid}</td>
                <td className="py-3 px-6 text-left">{receipt.mode}</td>

                <td className="py-3 px-6 text-left">{receipt.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PrintBill;
