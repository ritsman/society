import React, { useEffect } from "react";
import { useState } from "react";
import * as XLSX from "xlsx";
import UploadedData from "../../components/UploadedData";
import "./memberlist.css";
import axios from "axios";

const template = [
  "First Name",
  "Last Name",
  "Registered Mobile No.",
  "Alternate Mobile No.",
  "Permanent Address",
  "Area",
  "Flat No.",
  "Wing No.",
  "Society NOC Status",
  "Occupancy",
  "Maintence Amount",
  "Society Arrears",
  "Interest Rate",
  "Non Occupancy Charges",
  "Society Certificate",
  "Member Since",
];

const MemberList = () => {
  const [upload, setUpload] = useState(false);
  const [excelFile, setExcelFile] = useState(null);
  const [typeError, setTypeError] = useState(null);
  const [excelData, setExcelData] = useState(null);

  const handleUpload = async (e) => {
    setUpload(true);
    e.preventDefault();
    try {
      let result = await axios.post(
        "https://a2.arya-erp.in/api2/socapi/api/member/postProfile",

        excelData
      );
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFileUpload = (event) => {
    let fileTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
    ];
    let selectedFile = event.target.files[0];
    if (selectedFile) {
      if (selectedFile && fileTypes.includes(selectedFile.type)) {
        setTypeError(null);
        let reader = new FileReader();
        reader.readAsArrayBuffer(selectedFile);
        reader.onload = (e) => {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const firstRow = XLSX.utils.sheet_to_json(sheet, { header: 1 })[0];

          if (!template.every((header, index) => header === firstRow[index])) {
            setTypeError("Invalid Excel file.");
            return;
          }

          setExcelFile(e.target.result);
        };
      } else {
        setTypeError("Please select only excel file types");
        setExcelFile(null);
      }
    } else {
      console.log("Please select your file");
    }
  };
  console.log(excelData);

  const handleFileImport = async (e) => {
    e.preventDefault();
    if (excelFile !== null) {
      const workbook = XLSX.read(excelFile, { type: "buffer" });
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);
      setExcelData(data);
    }
  };
  console.log(excelData);

  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleExportData = () => {
    console.log(users);
    let wb = XLSX.utils.book_new(),
      ws = XLSX.utils.json_to_sheet(users);
    XLSX.utils.book_append_sheet(wb, ws, "Data");

    XLSX.writeFile(wb, "MyExcel.xlsx");
  };

  const downloadFormat = () => {
    const worksheet = XLSX.utils.aoa_to_sheet([template]);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    XLSX.writeFile(workbook, "memberList_template.xlsx");
  };

  return (
    <>
      <div
        className="pt-10  overflow-y-auto  gap-6"
        style={{ height: "calc(100vh - 150px)" }}
      >
        <h1 className="text-2xl mb-5"></h1>
        <div className=" flex justify-end mr-10">
          <button
            onClick={handleExportData}
            className="border border-slate-600 hover:bg-slate-600 hover:text-white px-4 py-2 rounded-md m-2"
          >
            Export
          </button>
          <button
            onClick={downloadFormat}
            className=" border border-slate-600 hover:bg-slate-600 hover:text-white  px-4 py-2 rounded-md m-2"
          >
            Download Format
          </button>
          <button
            onClick={handleUpload}
            className="border border-slate-600 hover:bg-slate-600 hover:text-white px-4 py-2 rounded-md m-2"
          >
            Upload
          </button>
        </div>
        {upload ? (
          <div className=" border border-2 rounded-md m-10 overflow-y-auto">
            <form className="flex gap-6 gap-y-2  max-w-7xl mx-auto sm:px-6 lg:px-8  ">
              <div className="mb-4">
                <label
                  htmlFor="firstName"
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
                <label
                  htmlFor="firstName"
                  className="block font-bold mb-2 mt-4"
                >
                  Select File
                </label>
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
        ) : null}
        <div className="w-screen m-5">
          {excelData ? <UploadedData excelData={excelData} /> : null}
        </div>
      </div>
    </>
  );
};

export default MemberList;
