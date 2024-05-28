import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AllChargeMemberView = () => {
  const [names, setNames] = useState([]);
  const [charges, setCharges] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    fetch("http://103.235.106.18:3001/api/member/getMemberList")
      .then((response) => response.json())
      .then((data) => setNames(data));

    fetch("http://103.235.106.18:3001/api/society/getBills")
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

  console.log(charges);
  return (
    <>
      <div
        className="pt-4 overflow-y-auto gap-6"
        style={{ height: "calc(100vh - 150px)" }}
      >
        <h1 className="text-2xl mb-5"></h1>

        <div className="flex justify-end mr-10">
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
                <th className="p-4 ">OwnerName</th>
                {charges.map((item) => (
                  <th key={item._id} className="p-4">
                    {item.Particular}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-300">
              {tableData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-200">
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={chkstat2[item._id]}
                      onChange={(event) => setTick(item, event)}
                      name={item._id}
                    />
                  </td>
                  <td className="p-4 text-center"></td>
                  <td className="p-4 text-center">{item.fullName}</td>
                  {charges.map((charge) => (
                    <td key={charge._id} className="p-4 text-center">
                      {item[charge.Particular]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AllChargeMemberView;
