import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import AutoComplete from "../../components/Autocomplete";

const Bills = () => {
  const [row_id, setRow_id] = useState(1);

  const [rows, setRows] = useState([{ id: 0 }]);
  const handleAddRow = (e) => {
    setRow_id(row_id + 1);
    setRows([...rows, { id: rows.length }]);
    e.preventDefault();
  };

  const handleDelRow = (e, ind) => {
    const updated_rows = [...rows];
    updated_rows.splice(ind, 1);
    setRows(updated_rows);
    e.preventDefault();
  };

  const [heads, setHeads] = useState();

  useEffect(() => {
    fetch("https://a2.arya-erp.in/api2/socapi/api/master/getHead")
      .then((response) => response.json())
      .then((data) => setHeads(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const options = heads;

  const [selectedValue, setSelectedValue] = useState([]);

  const handleSelect = (index, value) => {
    setSelectedValue((prevValues) => ({
      ...prevValues,
      [index]: [...(prevValues[index] || []), value],
    }));
  };

  const [amnt, setAmnt] = useState([]);
  const handleAmntChange = (index, e) => {
    const { value } = e.target;
    setAmnt((prevValues) => {
      const newValues = [...prevValues];
      newValues[index] = { ...newValues[index], value };
      return newValues;
    });
  };

  const [rate, setRate] = useState([]);
  const handleRateChange = (index, e) => {
    const { value } = e.target;
    setRate((prevValues) => {
      const newValues = [...prevValues];
      newValues[index] = { ...newValues[index], value };
      return newValues;
    });
  };

  const [dateFieldValues, setDateFieldValues] = useState([]);

  const handleFromDateChange = (index, e) => {
    const { value } = e.target;
    setDateFieldValues((prevValues) => {
      const newValues = [...prevValues];
      newValues[index] = { ...newValues[index], fromDate: value };
      return newValues;
    });
  };

  const handleToDateChange = (index, e) => {
    const { value } = e.target;
    setDateFieldValues((prevValues) => {
      const newValues = [...prevValues];
      newValues[index] = { ...newValues[index], toDate: value };
      return newValues;
    });
  };

  const handleDueDateChange = (index, e) => {
    const { value } = e.target;
    setDateFieldValues((prevValues) => {
      const newValues = [...prevValues];
      newValues[index] = { ...newValues[index], dueDate: value };
      return newValues;
    });
  };

  const combinedValues = dateFieldValues?.map((_, index) => ({
    selectedValue: selectedValue[index],
    rate: rate[index],
    amnt: amnt[index],
    dateFieldValues: dateFieldValues[index],
  }));

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(combinedValues);
  };
  const handleExportData = () => {
    let wb = XLSX.utils.book_new(),
      ws = XLSX.utils.json_to_sheet(exportData);
    XLSX.utils.book_append_sheet(wb, ws, "Data");
    XLSX.writeFile(wb, "MemberList.xlsx");
  };

  return (
    <div>
      <div className="pt-10 h-screen overflow-y-auto  gap-6">
        <h1 className="text-center text-2xl mb-5">
          Generate Maintenance Bills
        </h1>

        <form
          onSubmit={handleSubmit}
          className="flex gap-6 gap-y-2  max-w-7xl mx-auto sm:px-6 lg:px-8  "
        >
          <div className="  w-[90%]   gap-6 gap-y-2  max-w-7xl mx-auto sm:px-6 lg:px-8  ">
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
                <td className="p-4 pr-20 font-semibold">Amount</td>
                <td className="p-4 pr-24 font-semibold">Rate</td>
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
                    <td className="pt-4">
                      <AutoComplete
                        options={options}
                        onSelect={(value) => handleSelect(index, value)}
                      />
                    </td>
                    <td className="p-4">
                      <input
                        type="text"
                        className="w-full px-3 py-2 border focus:outline-none border-gray-300 rounded"
                        name={`amt${index + 1}`}
                        onChange={(e) => handleAmntChange(index, e)}
                      />
                    </td>
                    <td className="p-4">
                      <input
                        className="w-full px-3 py-2 border focus:outline-none border-gray-300 rounded"
                        name={`rate${index + 1}`}
                        onChange={(e) => handleRateChange(index, e)}
                      />
                    </td>
                    <td className="p-4">
                      <input
                        type="date"
                        className="w-full px-3 py-2 border focus:outline-none border-gray-300 rounded"
                        name={`from${index + 1}`}
                        onChange={(e) => handleFromDateChange(index, e)}
                      />
                    </td>
                    <td className="p-4">
                      <input
                        type="date"
                        className="w-full px-3 py-2 border focus:outline-none border-gray-300 rounded"
                        name={`to${index + 1}`}
                        onChange={(e) => handleToDateChange(index, e)}
                      />
                    </td>
                    <td className="p-4">
                      <input
                        type="date"
                        className="w-full px-3 py-2 border focus:outline-none border-gray-300 rounded"
                        name={`due${index + 1}`}
                        onChange={(e) => handleDueDateChange(index, e)}
                      />
                    </td>
                  </tr>
                );
              })}
            </table>

            <div className="mt-4">
              <button
                type="submit"
                className="bg-gray-800 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Bills;
