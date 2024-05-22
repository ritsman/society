import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import * as XLSX from "xlsx";
import UploadedData from "../../components/UploadedData";

const ViewBills = () => {
  const [upload, setUpload] = useState(false);
  const [excelFile, setExcelFile] = useState(null);
  const [typeError, setTypeError] = useState(null);
  const [excelData, setExcelData] = useState(null);

  const [names, setNames] = useState([]);
  const [charges, setCharges] = useState([]);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    fetch("https://a2.arya-erp.in/api2/socapi/api/member/getMemberList")
      .then((response) => response.json())
      .then((data) => setNames(data));

    fetch("https://a2.arya-erp.in/api2/socapi/api/society/getBills")
      .then((response) => response.json())
      .then((data) => setCharges(data));
  }, []);

  // const uniqueParticulars = [...new Set(charges.map(charge => charge.Particular))];

  useEffect(() => {
    if (names.length > 0 && charges.length > 0) {
      const data = names.map((name) => ({
        fullName: `${name.data.firstName} ${name.data.lastName}`,
        ...charges.reduce((acc, charge) => {
          acc[charge.Particular] = charge.Amount;
          return acc;
        }, {}),
      }));
      setTableData(data);
    }
  }, [names, charges]);
  console.log(tableData);

  // const exportData = charges.map((item) => item.data);
  // console.log(exportData);

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

  // console.log("chk2");
  // console.log(chkstat2);

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
      <div className="pt-4 h-screen overflow-y-auto  gap-6">
        <h1 className="text-2xl mb-5"></h1>
        <div className="flex justify-end mr-10">
          <button
            onClick={handleExportData}
            className="border border-slate-600 hover:bg-slate-600 hover:text-white px-4 py-2 rounded-md m-2"
          >
            Export
          </button>
        </div>
        {upload ? (
          <div className=" border border-2 rounded-md m-10 overflow-y-auto">
            <form className="flex gap-6 gap-y-2  max-w-7xl mx-auto sm:px-6 lg:px-8  ">
              <div className="mb-4">
                <label
                  htmlFor="uploadType"
                  className="block font-bold mb-2 mt-4"
                >
                  Upload Type
                </label>
                <select className="w-full px-5 py-3 border focus:outline-none border-gray-300 rounded">
                  <option value="select type" selected disabled>
                    Select Type
                  </option>
                  <option value="member master">Member Master</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block font-bold mb-2 mt-4">Select File</label>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="w-full px-5 py-2 border focus:outline-none border-gray-300 rounded"
                />
              </div>
              <div className="mt-10">
                <button
                  onClick={handleFileImport}
                  className="border border-slate-600 hover:bg-slate-600 hover:text-white px-4 py-2 rounded-md m-2"
                >
                  Import
                </button>
              </div>
              {typeError && (
                <div className="h-10 mt-12  bg-red-100 rounded-md px-6  border border-red-500 text-center">
                  {typeError}
                </div>
              )}
            </form>
          </div>
        ) : (
          <>
            <div className="max-w-max overflow-x-auto shadow-lg ml-4 mt-6 rounded-lg ">
              <table className="rounded-md">
                <thead className="bg-gray-700 text-slate-200">
                  <tr>
                    <th className="p-4 ">
                      <input
                        type="checkbox"
                        onChange={(event) => leadSet(event)}
                      />
                    </th>
                    <th className="p-4 ">Id</th>
                    <th className="p-4 ">OwnerName</th>
                    {charges.map((item) => (
                      <th className="p-4">{item.Particular}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-300">
                  {tableData.map((item, index) => (
                    <>
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
                        {/* <td className="p-4">{item.Particular}</td>
                        <td className="p-4 text-center"> {item.Amount}</td>
                        <td className="p-4 text-center">{item.From}</td>
                        <td className="p-4 text-center">{item.To}</td>
                        <td className="p-4 text-center">{item.DueDate}</td> */}
                        {charges.map((charge, index) => (
                          <td key={index} className="p-4 text-center">
                            {item[charge.Particular]}
                          </td>
                        ))}
                      </tr>
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
        <div className="w-screen m-5">
          {excelData ? <UploadedData excelData={excelData} /> : null}
        </div>
      </div>
    </>
  );
};

export default ViewBills;
