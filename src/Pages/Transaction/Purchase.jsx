import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faCircleXmark } from "@fortawesome/free-solid-svg-icons";

const Purchase = () => {
  const [formData, setFormData] = useState({
    voucher_no: "",
    voucher_date: "",
    purchase_acc: "",
    supplier: "",
    type: "",
    reference: "",
    subtotal: "",
    discount: "",
    freight: "",
    insurance: "",
    cgst: "",
    sgst: "",
    igst: "",
    roundoff: "",
    payable_amt: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
        <h1 className="text-center text-2xl mb-5">Purchase</h1>

        <form
          onSubmit={handleSubmit}
          className="lg:flex gap-6 gap-y-2  max-w-7xl mx-auto sm:px-6 lg:px-8  "
        >
          <div className=" grid w-[70%]  grid-cols-2 gap-6 gap-y-2  max-w-7xl mx-auto sm:px-6 lg:px-8  ">
            <div className="mb-4">
              <label htmlFor="voucher_no" className="block font-bold mb-2">
                Purchase Voucher No.
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
                Purchase Voucher Date
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
              <label htmlFor="puchase_acc" className="block font-bold mb-2">
                Purchase A/c
              </label>
              <input
                type="text"
                id="puchase_acc"
                name="puchase_acc"
                value={formData.puchase_acc}
                onChange={handleChange}
                className="w-full px-3 py-2 border focus:outline-none border-gray-300 rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="supplier" className="block font-bold mb-2">
                Supplier
              </label>
              <input
                type="text"
                id="supplier"
                name="supplier"
                value={formData.supplier}
                onChange={handleChange}
                className="w-full px-3 py-2 border focus:outline-none border-gray-300 rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="type" className="block font-bold mb-2">
                Purchase Type
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-3 py-2 border focus:outline-none border-gray-300 rounded"
                required
              >
                <option value=""> Purchase Type</option>
                <option value="pwg">Puchase with GRN</option>
                <option value="pwog">Puchase without GRN</option>
                <option value="saso">Services Against sales order</option>
                <option value="services">Sevices</option>
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
                        name="member"
                      />
                    </td>
                    <td className="p-4">
                      <input
                        type="text"
                        className="w-full px-3 py-2 border focus:outline-none border-gray-300 rounded"
                        name="amt"
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
              <label htmlFor="subtotal" className="block font-bold mb-2">
                Subtotal
              </label>
              <input
                type="text"
                id="subtotal"
                name="subtotal"
                value={formData.subtotal}
                onChange={handleChange}
                className="w-full px-3 py-2 border focus:outline-none border-gray-300 rounded"
                required
              />
            </div>
            <div className="mb-4 mt-2">
              <label htmlFor="discount" className="block font-bold mb-2">
                Discount
              </label>
              <input
                type="text"
                id="discount"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                className="w-full px-3 py-2 border focus:outline-none border-gray-300 rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="freight" className="block font-bold mb-2">
                Freight
              </label>
              <input
                id="freight"
                name="freight"
                value={formData.freight}
                onChange={handleChange}
                className="w-full px-3 py-2 border focus:outline-none border-gray-300 rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="insurance" className="block font-bold mb-2">
                Insurance
              </label>
              <input
                id="insurance"
                name="insurance"
                value={formData.insurance}
                onChange={handleChange}
                className="w-full px-3 py-2 border focus:outline-none border-gray-300 rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="cgst" className="block font-bold mb-2">
                CGST
              </label>
              <input
                id="cgst"
                name="cgst"
                value={formData.cgst}
                onChange={handleChange}
                className="w-full px-3 py-2 border focus:outline-none border-gray-300 rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="sgst" className="block font-bold mb-2">
                SGST
              </label>
              <input
                id="sgst"
                name="sgst"
                value={formData.sgst}
                onChange={handleChange}
                className="w-full px-3 py-2 border focus:outline-none border-gray-300 rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="igst" className="block font-bold mb-2">
                IGST
              </label>
              <input
                id="igst"
                name="igst"
                value={formData.igst}
                onChange={handleChange}
                className="w-full px-3 py-2 border focus:outline-none border-gray-300 rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="roundoff" className="block font-bold mb-2">
                Round Off
              </label>
              <input
                id="roundoff"
                name="roundoff"
                value={formData.roundoff}
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

export default Purchase;
