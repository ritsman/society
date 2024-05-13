import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faCircleXmark } from "@fortawesome/free-solid-svg-icons";

const Bills = () => {
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

  const handleInputChange = (e, data) => {
    console.log(`e:`);
    // console.log(e);
    console.log(`data:`);
    console.log(data);
    // setModalOpen(true);

    // List
    const value = e.target.value;
  };

  return (
    <div>
      <div className="md:py-24 h-screen overflow-y-auto  gap-6">
        <h1 className="text-center text-2xl mb-5">
          Generate Maintenance Bills
        </h1>

        <form className="flex gap-6 gap-y-2  max-w-7xl mx-auto sm:px-6 lg:px-8  ">
          <div className=" grid w-[90%]  grid-cols-2 gap-6 gap-y-2  max-w-7xl mx-auto sm:px-6 lg:px-8  ">
            <table className="shadow-lg mt-5 ">
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
                <td className="p-4 pr-12 font-semibold">Particulars</td>
                <td className="p-4 pr-12 font-semibold">Amount</td>
                <td className="p-4 pr-12 font-semibold">Rate</td>
                <td className="p-4 font-semibold">From</td>
                <td className="p-4 font-semibold">To</td>
                <td className="p-4 font-semibold">Due Date</td>
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
                        placeholder="Particulars*"
                        name="particulars"
                        onChange={(e, data) => handleInputChange(e, data)}
                      />
                    </td>
                    <td className="p-4">
                      <input
                        type="text"
                        className="w-full px-3 py-2 border focus:outline-none border-gray-300 rounded"
                        placeholder="Amount*"
                        name="amt"
                      />
                    </td>
                    <td className="p-4">
                      <input
                        className="w-full px-3 py-2 border focus:outline-none border-gray-300 rounded"
                        placeholder="Rate*"
                        name="rate"
                        // onChange={(e, data) => handleInputChange(e, data)}
                      />
                    </td>
                    <td className="p-4">
                      <input
                        type="date"
                        className="w-full px-3 py-2 border focus:outline-none border-gray-300 rounded"
                        placeholder="From*"
                        name="from"
                      />
                    </td>
                    <td className="p-4">
                      <input
                        type="date"
                        className="w-full px-3 py-2 border focus:outline-none border-gray-300 rounded"
                        placeholder="To*"
                        name="to"
                      />
                    </td>
                    <td className="p-4">
                      <input
                        type="date"
                        className="w-full px-3 py-2 border focus:outline-none border-gray-300 rounded"
                        placeholder="Due Date*"
                        name="due_date"
                      />
                    </td>
                  </tr>
                );
              })}
            </table>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Bills;
