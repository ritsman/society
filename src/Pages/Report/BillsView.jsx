import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const ViewBills = () => {
  const [names, setNames] = useState([]);
  const [charges, setCharges] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  // const [tableData, setTableData] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // useEffect(() => {
  //   fetch("http://103.235.106.18:3001/api/member/getMemberList")
  //     .then((response) => response.json())
  //     .then((data) => setNames(data));

  //   fetch("http://103.235.106.18:3001/api/society/getBills")
  //     .then((response) => response.json())
  //     .then((data) => {
  //       setCharges(data);
  //       setFilteredData(data);
  //     });
  // }, []);
  // console.log(charges);

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

  const [data, setData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [headers, setHeaders] = useState([]);

  useEffect(() => {
    fetch("https://a3.arya-erp.in/api2/socapi/api/society/getBills")
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        processTableData(data);
      });
  }, []);
  console.log(data);

  const processTableData = (data) => {
    const uniqueHeads = [...new Set(data.map((item) => item.Particular))];
    setHeaders(uniqueHeads);

    const billMap = data.reduce((acc, { BillNo, Particular, Amount }) => {
      if (!acc[BillNo]) {
        acc[BillNo] = { BillNo };
      }
      acc[BillNo][Particular] = Amount;
      return acc;
    }, {});

    const formattedData = Object.values(billMap);
    setTableData(formattedData);
  };
  return (
    <>
      <div
        className="pt-4 overflow-y-auto gap-6"
        style={{ height: "calc(100vh - 150px)" }}
      >
        <h1 className="text-2xl mb-5"></h1>

        <div className="flex justify-end mr-10">
          {/* <button  onClick={handleNavigate}>Done</button > */}
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
        </div>
        <div className="max-w-max overflow-x-auto shadow-lg ml-4 mt-6 rounded-lg ">
          <table className="rounded-md">
            <thead className="bg-gray-700 text-slate-200">
              <tr>
                <th className="p-4 ">
                  <input type="checkbox" onChange={(event) => leadSet(event)} />
                </th>
                <th className="p-4 ">Bill No</th>
                {headers.map((head, index) => (
                  <th className="p-4 " key={index}>
                    {head}
                  </th>
                ))}
                <th></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-300">
              {tableData.map((row, index) => (
                <tr key={index} className="hover:bg-gray-200">
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={chkstat2[row._id]}
                      onChange={(event) => setTick(row, event)}
                      name={row._id}
                    />
                  </td>

                  <td className="p-4">{row.BillNo}</td>
                  {headers.map((head, index) => (
                    <td className="p-4 text-center" key={index}>
                      {row[head] || 0}
                    </td>
                  ))}
                  <td>
                    <button className="border border-slate-600 hover:bg-slate-600 hover:text-white px-4 py-2 rounded-md m-2">
                      Apply
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
