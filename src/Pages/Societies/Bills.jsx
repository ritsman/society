import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import AutoComplete from "../../components/Autocomplete";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { redirect, useNavigate } from "react-router-dom";

const Bills = () => {
  const [row_id, setRow_id] = useState(1);
  let [counter, setCounter] = useState(1);
  const [rows, setRows] = useState([{ id: 0 }]);
  const [BillNo, setBillNo] = useState([]);

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

  useEffect(() => {
    async function fetch() {
      const response = await axios.get(
        "https://a3.arya-erp.in/api2/socapi/api/society/getBillNo"
      );
      console.log(response.data);
      setBillNo(response.data);
    }
    fetch();
  }, []);

  const [heads, setHeads] = useState();

  useEffect(() => {
    fetch("https://a3.arya-erp.in/api2/socapi/api/master/getHead")
      .then((response) => response.json())
      .then((data) => setHeads(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  // console.log(heads);
  const options = heads;

  const [selectedValue, setSelectedValue] = useState([]);

  const handleSelect = (index, value) => {
    setSelectedValue((prevValues) => ({
      ...prevValues,
      [index]: [...(prevValues[index] || []), value],
    }));
  };

  const generateWOUniqueID = () => {
    let uniqueID;
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    let year1, year2;

    if (currentMonth < 3) {
      year1 = (currentYear - 1).toString().slice(-2);
      year2 = currentYear.toString().slice(-2);
    } else {
      year1 = currentYear.toString().slice(-2);
      year2 = (currentYear + 1).toString().slice(-2);
    }

    while (true) {
      uniqueID = `${year1}${year2}BN${String(counter).padStart(4, "0")}`;
      if (!BillNo.includes(uniqueID)) {
        return uniqueID;
      }
      console.log("ID exists, generating new ID...");
      counter++;
      setCounter(counter);
    }
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
    const parsedDate = new Date(value);
    const formattedDate = `${parsedDate.getDate()}/${
      parsedDate.getMonth() + 1
    }/${parsedDate.getFullYear()}`;

    setDateFieldValues((prevValues) => {
      const newValues = [...prevValues];
      newValues[index] = { ...newValues[index], fromDate: formattedDate };
      return newValues;
    });
  };
  const handleToDateChange = (index, e) => {
    const { value } = e.target;
    const parsedDate = new Date(value);
    const formattedDate = `${parsedDate.getDate()}/${
      parsedDate.getMonth() + 1
    }/${parsedDate.getFullYear()}`;

    setDateFieldValues((prevValues) => {
      const newValues = [...prevValues];
      newValues[index] = { ...newValues[index], toDate: formattedDate };
      return newValues;
    });
  };

  const handleDueDateChange = (index, e) => {
    const { value } = e.target;
    const parsedDate = new Date(value);
    const formattedDate = `${parsedDate.getDate()}/${
      parsedDate.getMonth() + 1
    }/${parsedDate.getFullYear()}`;

    setDateFieldValues((prevValues) => {
      const newValues = [...prevValues];
      newValues[index] = { ...newValues[index], dueDate: formattedDate };
      return newValues;
    });
  };

  // const combinedValues = dateFieldValues?.map((_, index) => ({
  // BillNo: generateWOUniqueID(),
  // [selectedValue[index]]: amnt[index],
  //}));

  const billNo = generateWOUniqueID();

  // const combinedValues = {
  //   BillNo: billNo,
  //   dateFieldValues: dateFieldValues,
  //   particulars: dateFieldValues.reduce((acc, _, index) => {
  //     acc[selectedValue[index]] = amnt[index];
  //     return acc;
  //   }, {}),
  // };
  const combinedValues = {
    BillNo: billNo,
    fromDate: dateFieldValues.map((item) => item.fromDate),
    toDate: dateFieldValues.map((item) => item.toDate),
    dueDate: dateFieldValues.map((item) => item.dueDate),
    rate: rate,
    particulars: dateFieldValues.reduce((acc, _, index) => {
      acc[selectedValue[index]] = amnt[index];
      return acc;
    }, {}),
  };
  // const combinedValues = {
  //   BillNo: billNo,
  //   fromDate: dateFieldValues[0]?.fromDate,
  //   toDate: dateFieldValues[0]?.toDate,
  //   dueDate: dateFieldValues[0]?.dueDate,
  //   particulars: dateFieldValues.reduce((acc, _, index) => {
  //     acc[selectedValue[index]] = amnt[index];
  //     return acc;
  //   }, {}),
  // };
  // // const combinedValues = dateFieldValues?.map((_, index) => ({
  //   particulars: selectedValue[index],
  //   rate: rate[index],
  //   amnt: amnt[index],
  //   dateFieldValues: dateFieldValues[index],
  //   BillNo: generateWOUniqueID(),
  // }));

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(combinedValues);
    // try {
    //   let result = await axios.post(
    //     "https://a2.arya-erp.in/api2/socapi/api/society/postBills",
    //     combinedValues
    //   );
    //   console.log(result);
    //   if (result.status == 200) {
    //     toast.success("Added Successfully");
    //     navigate("/report/bills-view");
    //   } else {
    //     toast.error("Error");
    //     return null;
    //   }
    // } catch (error) {
    //   console.log(error);
    // }
  };

  return (
    <div>
      <div
        className="pt-10  overflow-y-auto  gap-6"
        style={{ height: "calc(100vh - 150px)" }}
      >
        <h1 className="text-center text-2xl mb-5">
          Generate Maintenance Bills
        </h1>

        <form
          onSubmit={handleSubmit}
          className="flex gap-6 gap-y-2  max-w-7xl mx-auto sm:px-6 lg:px-8  "
        >
          <div className="w-[90%] gap-6 gap-y-2 max-w-7xl mx-auto sm:px-6 lg:px-8  ">
            <table className="shadow-lg mt-5 ">
              <thead>
                <tr>
                  <th className="p-4">
                    <button>
                      <FontAwesomeIcon
                        className="text-gray-700 text-2xl"
                        icon={faCirclePlus}
                        onClick={(e) => handleAddRow(e)}
                      />
                    </button>
                  </th>
                  <th className="p-4 pr-24 ">Particulars</th>
                  <th className="p-4 pr-20 ">Amount</th>
                  <th className="p-4 pr-24 ">Rate</th>
                  <th className="p-4 ">From</th>
                  <th className="p-4 ">To</th>
                  <th className="p-4 ">Due Date</th>
                </tr>
              </thead>
              <tbody>
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
                          required
                        />
                      </td>
                      <td className="p-4">
                        <input
                          className="w-full px-3 py-2 border focus:outline-none border-gray-300 rounded"
                          name={`rate${index + 1}`}
                          onChange={(e) => handleRateChange(index, e)}
                          required
                        />
                      </td>
                      <td className="p-4">
                        <input
                          type="date"
                          className="w-full px-3 py-2 border focus:outline-none border-gray-300 rounded"
                          name={`from${index + 1}`}
                          onChange={(e) => handleFromDateChange(index, e)}
                          required
                        />
                      </td>
                      <td className="p-4">
                        <input
                          type="date"
                          className="w-full px-3 py-2 border focus:outline-none border-gray-300 rounded"
                          name={`to${index + 1}`}
                          onChange={(e) => handleToDateChange(index, e)}
                          required
                        />
                      </td>
                      <td className="p-4">
                        <input
                          type="date"
                          className="w-full px-3 py-2 border focus:outline-none border-gray-300 rounded"
                          name={`due${index + 1}`}
                          onChange={(e) => handleDueDateChange(index, e)}
                          required
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
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
