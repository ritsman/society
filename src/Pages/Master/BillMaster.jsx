import React, { useState,useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import config from "../../config";


const BillMaster = () => {
  const [formData, setFormData] = useState({
   
    billFrequency: "",
    billDate: "",
    billDueDays: "",
    interestRatePerMonth: "",
    interestCalculationMethod: "",
    isFlatInterest: false,
    flatInterestAmount: "",
    interestRebateUptoRs: "",
  });


useEffect(() => {
  async function fetchInt() {
    try {
      let res = await axios.get(
        `${config.API_URL}/api/master/getBillMaster`
      );

      // Check if the response has data and if the first element exists
      if (res.data && res.data.length > 0) {
        const data = res.data[0];

        setFormData((prevData) => ({
          ...prevData,
          interestRatePerMonth: data.interestRatePerMonth || "", // Pre-fill if it exists
          interestRebateUptoRs: data.interestRebateUptoRs,
          interestCalculationMethod: data.interestCalculationMethod,
          flatInterestAmount: data.flatInterestAmount,
          isFlatInterest: data.isFlatInterest,
          billDate: data.billDate,
          billDueDays: data.billDueDays,
          billFrequency: data.billFrequency,
        }));
      } else {
        // Handle blank response case
        console.log("No data found in the API response.");
      }
    } catch (error) {
      console.log(error);
    }
  }

  fetchInt();
}, []);


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log(formData);
    try {
      let res = await axios.post(
        `${config.API_URL}/api/master/postBillMaster`,
        formData
      );
      toast.success("successfully data saved");
      console.log(res);
    } catch (error) {
      console.log(error);
      toast.error("error in storing data ");
    }
  };

  return (
    <div className="py-10">
      <h1 className="text-center font-bold text-2xl mb-10">Interest</h1>
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto grid grid-cols-3 gap-6"
      >
        {/* <div className="mb-4">
          <label htmlFor="type" className="block font-medium mb-2">
            Type
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          >
            <option value=""></option>
            <option value="maintenance bill">Maintenance Bill</option>
            <option value="supplementary bill">Supplementary Bill</option>
          </select>
        </div> */}

        {/* <div className="mb-4">
          <label htmlFor="code" className="block font-medium mb-2">
            Code
          </label>
          <input
            type="text"
            id="code"
            name="code"
            value={formData.code}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div> */}

        {/* <div className="mb-4">
          <label htmlFor="name" className="block font-medium mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div> */}

        <div className="mb-4">
          <label htmlFor="billFrequency" className="block font-medium mb-2">
            Bill Frequency
          </label>
          <select
            id="billFrequency"
            name="billFrequency"
            value={formData.billFrequency}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          >
            <option value=""></option>
            <option value="monthly">Monthly</option>
            <option value="bi-monthly">Bi-Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="half-yearly">Half-Yearly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="billDate" className="block font-medium mb-2">
            Day of the Bill Date
          </label>
          <input
            type="text"
            id="billDate"
            name="billDate"
            value={formData.billDate}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="billDueDays" className="block font-medium mb-2">
            Bill Due Days
          </label>
          <input
            type="text"
            id="billDueDays"
            name="billDueDays"
            value={formData.billDueDays}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="interestRatePerMonth"
            className="block font-medium mb-2"
          >
            Interest Rate Per Month
          </label>
          <input
            type="text"
            id="interestRatePerMonth"
            name="interestRatePerMonth"
            value={formData.interestRatePerMonth}
            onChange={handleChange}
            disabled={formData.isFlatInterest} // Disable when flat interest is enabled
            className={`w-full px-3 py-2 border border-gray-300 rounded ${
              formData.isFlatInterest ? "bg-gray-200 text-gray-500" : ""
            }`}
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="interestCalculationMethod"
            className="block font-medium mb-2"
          >
            Interest Calculation Method
          </label>
          <select
            id="interestCalculationMethod"
            name="interestCalculationMethod"
            value={formData.interestCalculationMethod}
            onChange={handleChange}
            disabled={formData.isFlatInterest} // Disable when flat interest is enabled
            className={`w-full px-3 py-2 border border-gray-300 rounded ${
              formData.isFlatInterest ? "bg-gray-200 text-gray-500" : ""
            }`}
          >
            <option value=""></option>
            <option value="as per bill date">As per bill date</option>
            <option value="as per due date">As per due date</option>
            <option value="as per bill month">As per bill month</option>
          </select>
        </div>

        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            id="isFlatInterest"
            name="isFlatInterest"
            checked={formData.isFlatInterest}
            onChange={handleChange}
            className="mr-2"
          />
          <label htmlFor="isFlatInterest" className="font-medium">
            Is Flat Interest ?
          </label>
        </div>

        <div className="mb-4">
          <label
            htmlFor="flatInterestAmount"
            className="block font-medium mb-2"
          >
            Flat Interest Amount
          </label>
          <input
            type="text"
            id="flatInterestAmount"
            name="flatInterestAmount"
            value={formData.flatInterestAmount}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="interestRebateUptoRs"
            className="block font-medium mb-2"
          >
            Interest Rebate upto Rs.
          </label>
          <input
            type="text"
            id="interestRebateUptoRs"
            name="interestRebateUptoRs"
            value={formData.interestRebateUptoRs}
            onChange={handleChange}
            disabled={formData.isFlatInterest} // Disable when flat interest is enabled
            className={`w-full px-3 py-2 border border-gray-300 rounded ${
              formData.isFlatInterest ? "bg-gray-200 text-gray-500" : ""
            }`}
          />
        </div>

        <div className="col-span-3 flex justify-center">
          <button
            type="submit"
            className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-400"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default BillMaster;
