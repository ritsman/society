import axios from "axios";
import { useEffect, useState, useRef, useCallback } from "react";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

const GenerateBillForm = () => {
  const [receiptData, setReceiptData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    type: "",
    billDate: "",
    billDueDate: "",
    interestRate: "",
    dueDays: "",
  });

  function generateShortUUID() {
    return uuidv4().replace(/-/g, "").slice(0, 8);
  }

  useEffect(() => {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 2);
    const dueDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 21);

    setFormData((prevData) => ({
      ...prevData,
      billDate: formatDate(firstDayOfMonth),
      billDueDate: formatDate(dueDayOfMonth),
    }));

    fetchBills();
  }, []);

  useEffect(() => {
    const dueDate = new Date(formData.billDueDate);
    const billDate = new Date(formData.billDate);
    const diffTime = Math.abs(dueDate - billDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    setFormData((prevData) => ({
      ...prevData,
      dueDays: diffDays.toString(),
    }));
  }, [formData.billDate, formData.billDueDate]);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const toggleItem = useCallback((id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }, []);

  const selectAll = () =>
    setSelectedItems(items.map((item) => item.data.memberId));
  const deselectAll = () => setSelectedItems([]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatDate = (date) => date.toISOString().split("T")[0];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const fetchBills = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.get(
        "https://a3.arya-erp.in/api2/socapi/api/society/getBills"
      );
      setItems(res.data);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch bills. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerate = () => {
    const billData = {
      ...formData,
      member: selectedItems,
    };
    console.log(billData);
    selectedItems.map(async (row) => {
      let arr = items.filter((item) => item.data.memberId == row);

      //start of post generate bill
      console.log({
        memberId: row,
        memberName: arr[0].data.ownerName,
        billDetails: [
          {
            type: formData.type,
            billDate: formData.billDate,
            dueDate: formData.dueDate,
            currentBillAmt: arr[0].data.total,
            interestRate: formData.interestRate,
          },
        ],
      });

      let filterReceipt = receiptData.filter((a) => a.memberId == row);
      console.log(filterReceipt);

      let uniqueBill = generateShortUUID();

      try {
        let res = await axios.post(
          "https://a3.arya-erp.in/api2/socapi/api/society/generateBill",
          {
            memberId: row,
            memberName: arr[0].data.ownerName,
            billDetails: [
              {
                billNo: `BL/24/${uniqueBill}`,
                type: formData.type,
                billDate: formData.billDate,
                dueDate: billData.billDueDate,
                currentBillAmt: arr[0].data.total,
                interestRate: formData.interestRate,
                prevBalance:
                  filterReceipt.length > 0 ? filterReceipt[0].balance : 0,
              },
            ],
          }
        );
        console.log(res);
        toast.success("successfully bills generated");
      } catch (error) {
        console.error(error);
        toast.error("error in generating bills");
      }

      // end of post generate bill

      let uniqueId = generateShortUUID();

      try {
        let res = await axios.post(
          `https://a3.arya-erp.in/api2/socapi/api/member/Ledger/${row}`,
          {
            memberId: row,
            ledger: [
              {
                tranId: uniqueId,
                payMode: "",
                date: billData.billDate,
                billNo: "",
                dueDate: billData.billDueDate,
                head: arr[0].data.head,
                totalAmtDue: filterReceipt[0]?.balance,
                billAmt: arr[0].data.total,
                paidAmt: "",
                balance:
                  filterReceipt.length > 0
                    ? Number(filterReceipt[0].balance) +
                      Number(arr[0].data.total)
                    : arr[0].data.total,
              },
            ],
          }
        );

        console.log(res);
      } catch (error) {
        console.error(error);
      }
    });
  };

  useEffect(() => {
    fetchReciept();
  }, []);

  async function fetchReciept() {
    try {
      let result = await axios.get(
        "https://a3.arya-erp.in/api2/socapi/api/transaction/getCashReceipt"
      );
      setReceiptData(result.data);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="p-4">
      <div className="text-right mb-5 px-10 ">
        <button
          onClick={handleGenerate}
          className="px-4 py-2 bg-white text-gray-700 border-black border-2 rounded-md hover:text-white hover:bg-gray-600"
        >
          Generate Bills
        </button>
      </div>

      <div className="grid grid-cols-4 px-5 gap-4 mb-4">
        <div>
          <label className="block mb-1 text-sm font-medium">Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Type</option>
            <option value="maintenance bill">Maintenance Bill</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium ">Bill Date</label>
          <input
            type="date"
            name="billDate"
            value={formData.billDate}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium ">
            Bill Due Date
          </label>
          <input
            type="date"
            name="billDueDate"
            value={formData.billDueDate}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium ">Due Days</label>
          <input
            type="text"
            name="dueDays"
            value={formData.dueDays}
            className="w-full p-2 bg-gray-100 rounded"
            readOnly
          />
        </div>
      </div>

      <div className="grid grid-cols-4 px-5 gap-4">
        <div>
          <label className="block mb-1 text-sm font-medium ">
            Select Members
          </label>
          <div className="relative w-64" ref={dropdownRef}>
            <button
              onClick={toggleDropdown}
              className="w-full p-2 text-left bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {selectedItems.length === 0
                ? "Select Members"
                : `${selectedItems.length} items selected`}
            </button>
            {isOpen && (
              <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                <div className="flex justify-between p-2 bg-gray-100">
                  <button
                    onClick={selectAll}
                    className="px-3 py-1 text-sm bg-white border border-gray-300 rounded"
                  >
                    Select All
                  </button>
                  <button
                    onClick={deselectAll}
                    className="px-3 py-1 text-sm bg-white border border-gray-300 rounded"
                  >
                    Deselect All
                  </button>
                </div>
                <div className="max-h-48 overflow-y-auto">
                  {isLoading ? (
                    <p className="p-2">Loading...</p>
                  ) : error ? (
                    <p className="p-2 text-red-500">{error}</p>
                  ) : items.length === 0 ? (
                    <p className="p-2">No items found</p>
                  ) : (
                    items.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => toggleItem(item.data.memberId)}
                        className={`p-2 hover:bg-gray-300 cursor-pointer ${
                          selectedItems.includes(item.data.memberId)
                            ? "bg-purple-100"
                            : ""
                        }`}
                      >
                        <span className="inline-block w-8 h-6 mr-2 text-sm text-white bg-gray-500 rounded-md  text-center leading-6">
                          {item.data.flatNo}
                        </span>
                        {item.data.ownerName}
                      </div>
                    ))
                  )}
                </div>
                <div className="p-2 bg-gray-100 border-t border-gray-300">
                  {selectedItems.length === 0
                    ? "All"
                    : `${selectedItems.length} items selected`}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-end gap-2">
          <div>
            <label className="block mb-1 text-sm font-medium">
              Interest Rate
            </label>
            <input
              type="text"
              name="interestRate"
              value={formData.interestRate}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateBillForm;
