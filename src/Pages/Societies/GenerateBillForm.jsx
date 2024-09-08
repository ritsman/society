import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

const GenerateBillForm = ({ selectedItems }) => {
  const [receiptData, setReceiptData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    type: "",
    billDate: "",
    billDueDate: "",
    
  });

  function generateShortUUID() {
    return uuidv4().replace(/-/g, "").slice(0, 8);
  }

  useEffect(() => {
    // Set the bill date to today's date when the component loads
    const today = new Date();
    setFormData((prevData) => ({
      ...prevData,
      billDate: formatDate(today), // Set default bill date as current date
    }));
    fetchBills();
  }, []);

  useEffect(() => {
    // Automatically set the billDueDate to 20 days after billDate
    if (formData.billDate) {
      const billDate = new Date(formData.billDate);
      const dueDate = new Date(billDate);
      dueDate.setDate(billDate.getDate() + 20); // Add 20 days
      setFormData((prevData) => ({
        ...prevData,
        billDueDate: formatDate(dueDate),
      }));
    }
  }, [formData.billDate]);

  const toggleDropdown = () => setIsOpen(!isOpen);

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
      console.log(error);
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

    selectedItems.map(async (row) => {
      let arr = items.filter((item) => item.data.memberId == row);
      let filterReceipt = receiptData.filter((a) => a.memberId == row);
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
                interestAfter: formData.interestAfter,
                prevBalance:
                  filterReceipt.length > 0 ? filterReceipt[0].balance : 0,
              },
            ],
          }
        );
        toast.success("successfully bills generated");
      } catch (error) {
        toast.error("error in generating bills");
      }

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
      } catch (error) {
        console.log(error);
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
      <div className="text-right mb-5 px-10">
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
          <label className="block mb-1 text-sm font-medium ">
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

     
      </div>
    </div>
  );
};

export default GenerateBillForm;
