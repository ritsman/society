import React, { useEffect, useState } from "react";
import AutoComplete from "../../components/Autocomplete";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const UpdateLedger = () => {
  const location = useLocation();
  const { row } = location.state || {};
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: row.data.companyName,
    name: row.data.name,
    email: row.data.email,
    address: row.data.address,
    city: row.data.city,
    mobile: row.data.mobile,
    acc_no: row.data.acc_no,
    ifsc: row.data.ifsc,
    state: row.data.state,
    pan: row.data.pan,
    pin: row.data.pin,
    bank: row.data.bank,
    role: row.data.role,
    gst: row.data.gst,
  });

  useEffect(() => {
    console.log("row", row);
  }, [row]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [selectedValue, setSelectedValue] = useState("");
  const handleSelect = (value) => {
    setSelectedValue(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log({ ...formData, under: selectedValue });

    try {
      let result = await axios.put(
        `https://a3.arya-erp.in/api2/socapi/api/master/updateLedger/${row._id}`,
        { ...formData, under: selectedValue }
      );
      console.log(result);
      toast.success("Ledger Updated Successfully");
      navigate("/master/ledger");
    } catch (error) {
      toast.error("error in updating Ledger");
      console.log(error);
    }
  };

  const options = [
    "Bank Accounts",
    "Current Assets",
    "Bank OD A/c",
    "Loans (Liability)",
    "Cash-in-hand",
    "Current Assets",
    "Deposits (Asset)",
    "Current Assets",
    "Duties & Taxes",
    "Current Liabilities",
    "Loans & Advances (Asset)",
    "Current Assets",
    "Provisions",
    "Current Liabilities",
    " Reserves & Surplus",
    "Capital Account",
    "Secured Loans",
    "Loans (Liability)",
    "Stock-in-hand",
    "Current Assets",
    "Sundry Creditors",
    "Current Liabilities",
    "Sundry Debtors",
    "Current Assets",
    "Unsecured Loans",
    "Loans (Liability)",
  ];

  return (
    <div
      className="py-10  overflow-y-auto  gap-6"
      style={{ height: "calc(100vh - 150px)" }}
    >
      <h1 className="text-center text-2xl mb-5">update Ledger</h1>

      <form
        onSubmit={handleSubmit}
        className="flex gap-6 gap-y-2  max-w-7xl mx-auto sm:px-6 lg:px-8  "
      >
        <div className=" grid w-[90%]  grid-cols-2 gap-6 gap-y-2  max-w-7xl mx-auto sm:px-6 lg:px-8  ">
          <div className="mb-4">
            <label htmlFor="companyname" className="block font-bold mb-2">
              Company Name
            </label>
            <input
              type="text"
              id="companyname"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className="w-full px-3 py-2 border focus:outline-none border-gray-300 rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="name" className="block font-bold mb-2">
              Contact Person Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border focus:outline-none border-gray-300 rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border focus:outline-none border-gray-300 rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="lastName" className="block font-bold mb-2">
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-3 py-2 border focus:outline-none border-gray-300 rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="city" className="block font-bold mb-2">
              City
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full px-3 py-2 border focus:outline-none border-gray-300 rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="state" className="block font-bold mb-2">
              State
            </label>
            <input
              type="tel"
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="w-full px-3 py-2 border focus:outline-none border-gray-300 rounded"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="pin" className="block font-bold mb-2">
              PIN
            </label>
            <input
              id="pin"
              name="pin"
              value={formData.pin}
              onChange={handleChange}
              className="w-full px-3 py-2 border focus:outline-none border-gray-300 rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="bank" className="block font-bold mb-2">
              Bank
            </label>
            <input
              type="text"
              id="bank"
              name="bank"
              value={formData.bank}
              onChange={handleChange}
              className="w-full px-3 py-2 border focus:outline-none border-gray-300 rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="acc_no" className="block font-bold mb-2">
              A/c No.
            </label>
            <input
              type="text"
              id="acc_no"
              name="acc_no"
              value={formData.acc_no}
              onChange={handleChange}
              className="w-full px-3 py-2 border focus:outline-none border-gray-300 rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="ifsc" className="block font-bold mb-2">
              IFSC
            </label>
            <input
              type="text"
              id="ifsc"
              name="ifsc"
              value={formData.ifsc}
              onChange={handleChange}
              className="w-full px-3 py-2 border focus:outline-none border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="gst" className="block font-bold mb-2">
              GST
            </label>
            <input
              id="gst"
              name="gst"
              value={formData.gst}
              onChange={handleChange}
              className="w-full px-3 py-2 border focus:outline-none border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="pan" className="block font-bold mb-2">
              PAN
            </label>
            <input
              id="pan"
              name="pan"
              value={formData.pan}
              onChange={handleChange}
              className="w-full px-3 py-2 border focus:outline-none border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="mobile" className="block font-bold mb-2">
              Mobile
            </label>
            <input
              id="mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              className="w-full px-3 py-2 border focus:outline-none border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="role" className="block font-bold mb-2">
              Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-3 py-2 border focus:outline-none border-gray-300 rounded"
              required
            >
              <option value="">Role</option>
              <option value="supplier"> Supplier</option>
              <option value="owner">Owner</option>
            </select>
          </div>
          <div className="col-span-2">
            <button
              type="submit"
              className="bg-gray-800 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
            >
              Submit
            </button>
          </div>
        </div>
        <div className=" w-[25%]">
          <div className="mb-4">
            <label htmlFor="under" className="block font-bold mb-2">
              Under
            </label>
            <AutoComplete
              options={options}
              onSelect={(value) => handleSelect(value)}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default UpdateLedger;
