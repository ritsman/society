import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

const ViewBills = () => {
  const [names, setNames] = useState([]);
  const [charges, setCharges] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    fetch("https://a2.arya-erp.in/api2/socapi/api/member/getMemberList")
      .then((response) => response.json())
      .then((data) => setNames(data));

    fetch("https://a2.arya-erp.in/api2/socapi/api/society/getBills")
      .then((response) => response.json())
      .then((data) => {
        setCharges(data);
        setFilteredData(data);
      });
  }, []);

  const parseDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      const parts = dateString.split("/");
      if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);
        return new Date(year, month, day);
      }
    }
    return date;
  };

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    if (start && end) {
      const filtered = charges.filter((item) => {
        const itemDate = parseDate(item.From);
        return itemDate >= start && itemDate <= end;
      });
      setFilteredData(filtered);
    } else {
      setFilteredData(charges); // Show all data if no date range is selected
    }
  };
  const [clickedButtonId, setClickedButtonId] = useState([]);

  const handleClick = (id) => {
    setClickedButtonId((prevIds) => [...prevIds, id]);
  };

  useEffect(() => {
    if (names.length > 0 && filteredData.length > 0) {
      const filteredNames = names.filter((name) =>
        filteredData.some((charge) => charge.MemberId === name.data._id)
      );

      const data = filteredNames.map((name) => ({
        fullName: `${name.data.firstName} ${name.data.lastName}`,
        ...filteredData.reduce((acc, charge) => {
          if (charge.MemberId === name.data._id) {
            acc[charge.Particular] = charge.Amount;
          }
          return acc;
        }, {}),
      }));
      setTableData(data);
    } else {
      setTableData([]);
    }
  }, [names, filteredData]);

  const handleExportData = () => {
    let wb = XLSX.utils.book_new(),
      ws = XLSX.utils.json_to_sheet(tableData);
    XLSX.utils.book_append_sheet(wb, ws, "Data");
    XLSX.writeFile(wb, "Bill.xlsx");
  };

  const [chkstat2, setChkStat2] = useState({});

  useEffect(() => {
    const chkstat = {};
    charges?.forEach((val) => {
      chkstat[val._id] = false;
    });
    setChkStat2(chkstat);
  }, [charges]);

  const leadSet = (event) => {
    let c = {};
    Object.keys(chkstat2).forEach((key) => {
      c[key] = event.target.checked;
    });
    setChkStat2(c);
  };

  const setTick = (contact, event) => {
    chkstat2[contact._id] = event.target.checked;
    const c = {
      ...chkstat2,
    };
    setChkStat2(c);
  };

  return (
    <>
      <div
        className="pt-4 overflow-y-auto gap-6"
        style={{ height: "calc(100vh - 150px)" }}
      >
        <h1 className="text-2xl mb-5"></h1>

        <div className="flex justify-end mr-10">
          <DatePicker
            className="border border-gray-700 rounded-md py-2 px-2 mt-2"
            placeholderText="Select Date Range"
            selected={startDate}
            onChange={handleDateChange}
            startDate={startDate}
            endDate={endDate}
            selectsRange
            dateFormat="MM/yyyy"
            showMonthYearPicker
          />

          <button
            onClick={handleExportData}
            className="border border-slate-600 hover:bg-slate-600 hover:text-white px-4 py-2 rounded-md m-2"
          >
            Export
          </button>
        </div>
        <div className="max-w-max overflow-x-auto shadow-lg ml-4 mt-6 rounded-lg ">
          <table className="rounded-md">
            <thead className="bg-gray-700 text-slate-200">
              <tr>
                <th className="p-4 ">
                  <input type="checkbox" onChange={(event) => leadSet(event)} />
                </th>
                <th className="p-4 ">Id</th>
                <th className="p-4 ">Particulars</th>
                <th className="p-4 ">Amount</th>
                <th className="p-4 ">From</th>
                <th className="p-4 ">To</th>
                <th className="p-4 ">Due Date</th>
                <th className="p-4 "></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-300">
              {charges.map((charge) => (
                <tr key={charge._id} className="hover:bg-gray-200">
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={chkstat2[charge._id]}
                      onChange={(event) => setTick(charge, event)}
                      name={charge._id}
                    />
                  </td>

                  <td className="p-4 text-center">{charge.BillNo}</td>
                  <td className="p-4 text-center">{charge.Particular}</td>
                  <td className="p-4 text-center">{charge.Amount}</td>
                  <td className="p-4 text-center">{charge.From}</td>
                  <td className="p-4 text-center">{charge.To}</td>
                  <td className="p-4 text-center">{charge.DueDate}</td>
                  <td className="p-4 text-center">
                    {/* <button className="border border-slate-600 hover:bg-slate-600 hover:text-white px-4 py-2 rounded-md m-2">
                      Apply
                    </button> */}
                    <button
                      key={charge._id}
                      onClick={() => handleClick(charge._id)}
                      className="border border-slate-600 hover:bg-slate-600 hover:text-white px-4 py-2 rounded-md m-2"
                    >
                      {clickedButtonId.includes(charge._id) ? (
                        <FontAwesomeIcon
                          icon={faCheck}
                          style={{ color: "green" }}
                        />
                      ) : (
                        "Apply"
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ViewBills;
