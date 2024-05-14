import React, { useEffect, useState } from "react";
import AutoComplete from "../../components/Autocomplete";
import * as XLSX from "xlsx";
import UploadedData from "../../components/UploadedData";
import axios from "axios";

const MaintenanceHeaders = () => {
  const options = [
    "Bank Accounts",
    "Current Assets",
    "Bank OD A/c",
    "Loans (Liability)",
    "Cash-in-hand",
    "Current Assets",
    "Deposits (Asset)",
    "Current Assets",
    "Duties & Taxes",
    "Current Liabilities",
    "Loans & Advances (Asset)",
    "Current Assets",
    "Provisions",
    "Current Liabilities",
    " Reserves & Surplus",
    "Capital Account",
    "Secured Loans",
    "Loans (Liability)",
    "Stock-in-hand",
    "Current Assets",
    "Sundry Creditors",
    "Current Liabilities",
    "Sundry Debtors",
    "Current Assets",
    "Unsecured Loans",
    "Loans (Liability)",
  ];

  const [headers, setHeaders] = useState("");

  const handleChange = (e) => {
    setHeaders(e.target.value);
  };

  const [selectedValue, setSelectedValue] = useState("");
  const handleSelect = (value) => {
    setSelectedValue(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log({ headers: headers, under: selectedValue });

    try {
      let result = await axios.post(
        "https://a2.arya-erp.in/api2/socapi/api/master/masterHead",
        [{ Header: headers, Under: selectedValue }]
      );
      console.log(result);
      setHeaders("");
      setSelectedValue("");
    } catch (error) {
      console.log(error);
    }
  };

  const [upload, setUpload] = useState(false);
  const [excelFile, setExcelFile] = useState(null);
  const [typeError, setTypeError] = useState(null);
  const [excelData, setExcelData] = useState(null);

  const handleUpload = async (e) => {
    setUpload(true);
    e.preventDefault();
    try {
      let result = await axios.post(
        "https://a2.arya-erp.in/api2/socapi/api/master/masterHead",

        excelData
      );
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFile = (e) => {
    let fileTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
    ];
    let selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile && fileTypes.includes(selectedFile.type)) {
        setTypeError(null);
        let reader = new FileReader();
        reader.readAsArrayBuffer(selectedFile);
        reader.onload = (e) => {
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

  const handleFileImport = async () => {
    if (excelFile !== null) {
      const workbook = XLSX.read(excelFile, { type: "buffer" });
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);
      setExcelData(data);
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

          const templateHeaders = ["Header", "Under"];
          if (
            !templateHeaders.every(
              (header, index) => header === firstRow[index]
            )
          ) {
            setTypeError("Invalid Excel file.");
            // alert("Invalid Excel file. Please use the template.");
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

  const downloadFormat = () => {
    const template = ["Header", "Under"];
    const worksheet = XLSX.utils.aoa_to_sheet([template]);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    XLSX.writeFile(workbook, "excel_template.xlsx");
  };

  return (
    <div>
      <div
        className="pt-10   overflow-y-auto  gap-6"
        style={{ height: "calc(100vh - 150px)" }}
      >
        <h1 className="text-center text-2xl mb-5">
          ADD YOUR MAINTENANCE HEADER
        </h1>

        <div className=" flex justify-end mr-10">
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

        <form
          onSubmit={handleSubmit}
          className="flex gap-6 gap-y-2  max-w-7xl mx-auto sm:px-6 lg:px-8  "
        >
          <div className=" grid w-[90%]  grid-cols-2 gap-6 gap-y-2  max-w-7xl mx-auto sm:px-6 lg:px-8  ">
            {upload ? (
              <>
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
                <div className="w-screen m-5">
                  {excelData ? <UploadedData excelData={excelData} /> : null}
                </div>
              </>
            ) : (
              <>
                <div className="mb-4">
                  <label htmlFor="headers" className="block font-bold mb-2">
                    Header
                  </label>
                  <input
                    type="text"
                    id="headers"
                    name="headers"
                    value={headers}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border focus:outline-none border-gray-300 rounded"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="under" className="block font-bold mb-2">
                    Under
                  </label>
                  <AutoComplete
                    options={options}
                    onSelect={(value) => handleSelect(value)}
                  />
                </div>
                <div className="col-span-2">
                  <button
                    type="submit"
                    className="bg-gray-800 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                  >
                    Submit
                  </button>
                </div>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default MaintenanceHeaders;
