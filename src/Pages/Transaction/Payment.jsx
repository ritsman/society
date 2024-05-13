import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faCircleXmark } from "@fortawesome/free-solid-svg-icons";

const Payment = () => {
  const [formData, setFormData] = useState({
    voucher_no: "",
    voucher_date: "",
    type: "",
    reference: "",
    method: "",
    cheque_no: "",
    cheque_date: "",
    payable_amt: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const [selectedMember, setSelectedMember] = useState([]);
  const handleSelectedMember = (value) => {
    setSelectedMember([...selectedMember, value]);
  };
  console.log(selectedMember);

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(formData);
  };

  const [row_id, setRow_id] = useState(1);

  const [rows, setRows] = useState([{ id: 0 }]);
  const handleAddRow = (e) => {
    console.log("add clicked");
    setRow_id(row_id + 1);
    console.log(`row_id:${row_id}`);
    setRows([...rows, { id: rows.length }]);
    console.log(rows);
    e.preventDefault();
  };

  const handleDelRow = (e, ind) => {
    console.log("cross clicked");
    console.log(ind);

    const updated_rows = [...rows];
    console.log(rows);
    console.log(rows.length);
    console.log(updated_rows);

    updated_rows.splice(ind, 1);
    console.log(rows);
    console.log(updated_rows);
    setRows(updated_rows);
    e.preventDefault();
  };

  return (
    <div>
      <div className="md:py-24 h-screen overflow-y-auto  gap-6">
        <h1 className="text-center text-2xl mb-5">Payment</h1>

        <form
          onSubmit={handleSubmit}
          className="lg:flex gap-6 gap-y-2  max-w-7xl mx-auto sm:px-6 lg:px-8  "
        >
          <div className=" grid w-[70%]  grid-cols-2 gap-6 gap-y-2  max-w-7xl mx-auto sm:px-6 lg:px-8  ">
            <div className="mb-4">
              <label htmlFor="voucher_no" className="block font-bold mb-2">
                Payment Voucher No.
              </label>
              <input
                type="text"
                id="voucher_no"
                name="voucher_no"
                value={formData.voucher_no}
                onChange={handleChange}
                className="w-full px-3 py-2 border focus:outline-none border-gray-300 rounded"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="voucher_date" className="block font-bold mb-2">
                Payment Voucher Date
              </label>
              <input
                type="date"
                id="voucher_date"
                name="voucher_date"
                value={formData.voucher_date}
                onChange={handleChange}
                className="w-full px-3 py-2 border focus:outline-none border-gray-300 rounded"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="type" className="block font-bold mb-2">
                Payment Type
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-3 py-2 border focus:outline-none border-gray-300 rounded"
                required
              >
                <option value=""> Payment Type</option>
                <option value="pab">Payment Against Bill</option>
                <option value="advance">Advance</option>
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="reference" className="block font-bold mb-2">
                Reference
              </label>
              <input
                type="text"
                id="reference"
                name="reference"
                value={formData.reference}
                onChange={handleChange}
                className="w-full px-3 py-2 border focus:outline-none border-gray-300 rounded"
                required
              />
            </div>
            <table className="col-span-2 shadow-lg mt-5 ">
              <tr>
                <td className="p-4">
                  <button>
                    <FontAwesomeIcon
                      className="text-gray-700 text-2xl"
                      icon={faCirclePlus}
                      onClick={(e) => handleAddRow(e)}
                    />
                  </button>
                </td>
                <td className="p-4 pr-12 font-semibold">Member</td>
                <td className="p-4 pr-12 font-semibold">Amount</td>
              </tr>

              {rows.map((row, index) => {
                return (
                  <tr key={`R${row.id}`}>
                    <td className="p-4">
                      <button>
                        <FontAwesomeIcon
                          className="text-gray-700 text-2xl"
                          icon={faCircleXmark}
                          onClick={(e) => handleDelRow(e, index)}
                        />
                      </button>
                    </td>
                    <td className="p-4">
                      <input
                        className="w-full px-3 py-2 border focus:outline-none border-gray-300 rounded"
                        name={`member${index + 1}`}
                      />
                    </td>
                    <td className="p-4">
                      <input
                        type="text"
                        className="w-full px-3 py-2 border focus:outline-none border-gray-300 rounded"
                        name={`amt${index + 1}`}
                      />
                    </td>
                  </tr>
                );
              })}
            </table>
            <div className="mt-4 col-span-2">
              <button
                type="submit"
                className="bg-gray-800 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
              >
                Submit
              </button>
            </div>
          </div>
          <div className="lg:border-l-2"></div>
          <div className=" w-[25%] m-auto ">
            <div className="mb-4 mt-2">
              <label htmlFor="method" className="block font-bold mb-2">
                Payment Method
              </label>
              <select
                id="method"
                name="method"
                value={formData.method}
                onChange={handleChange}
                className="w-full px-3 py-2 border focus:outline-none border-gray-300 rounded"
                required
              >
                <option value=""> Method</option>
                <option value="cash">Cash</option>
                <option value="upi">UPI</option>
                <option value="RTGS">RTGS</option>
                <option value="cheque">Cheque</option>
              </select>
            </div>
            <div className="mb-4 mt-2">
              <label htmlFor="cheque_no" className="block font-bold mb-2">
                Cheque Number
              </label>
              <input
                type="text"
                id="cheque_no"
                name="cheque_no"
                value={formData.cheque_no}
                onChange={handleChange}
                className="w-full px-3 py-2 border focus:outline-none border-gray-300 rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="cheque_date" className="block font-bold mb-2">
                Cheque Date
              </label>
              <input
                type="date"
                id="cheque_date"
                name="cheque_date"
                value={formData.cheque_date}
                onChange={handleChange}
                className="w-full px-3 py-2 border focus:outline-none border-gray-300 rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="payable_amt" className="block font-bold mb-2">
                Payable Amount
              </label>
              <input
                id="payable_amt"
                name="payable_amt"
                value={formData.payable_amt}
                onChange={handleChange}
                className="w-full px-3 py-2 border focus:outline-none border-gray-300 rounded"
                required
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Payment;
