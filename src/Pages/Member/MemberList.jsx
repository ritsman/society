import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import * as XLSX from "xlsx";
import UploadedData from "../../components/UploadedData";
import "./memberlist.css";
import { toast } from "react-toastify";

const template = [
  "name",
  "email",
  "permanentAddress",
  "registeredMobileNo",
  "alternateMobileNo",
  "flatNo",
  "wingNo",
  "area",
  "societyNocStatus",
  "occupancy",
  "maintenance_amt",
  "noc",
  "arrears",
  "rate",
  "vehicleDetails",
  "societyShareCertificate",
  "memberSince",
  "systemId",
];
let tableHeads = [
  "Name",
  "Mobile No.",
  "Email",
  "Address",
  "Flat No.",
  "Wing No.",
];
let tableHead = [];

const MemberList = () => {
  const [upload, setUpload] = useState(false);
  const [excelFile, setExcelFile] = useState(null);
  const [typeError, setTypeError] = useState(null);
  const [excelData, setExcelData] = useState(null);

  const handleUpload = () => {
    setUpload(true);
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

  const handleFileImport = async (e) => {
    e.preventDefault();
    if (excelFile !== null) {
      const workbook = XLSX.read(excelFile, { type: "buffer" });
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);
      setExcelData(data);
      e.preventDefault();
      try {
        let result = await axios.post(
          "https://a3.arya-erp.in/api2/socapi/api/member/postProfile",

          excelData
        );
        console.log(result);
        toast.success("successfully data saved");
      } catch (error) {
        console.log(error);
        toast.error("error in stroring data");
      }
    }
  };
  console.log(excelData);
  const [tableRow, setTableRow] = useState([]);
  const [data, setData] = useState([]);
  const [head, setHead] = useState([]);
  const [list, setList] = useState([]);

  useEffect(() => {
    let arr = data.map((item) => {
      return {
        name: item.name,

        registeredMobileNo: item.registeredMobileNo,
        email: item.email,
        permanentAddress: item.permanentAddress,
        flatNo: item.flatNo,
        wingNo: item.wingNo,
        head: head.map((row, index) => ({
          heads: row,
          value: item.head?.[index]?.value || 0,
        })),
      };
    });

    setTableRow(arr);
  }, [head, data]);

  useEffect(() => {
    fetch("https://a3.arya-erp.in/api2/socapi/api/member/getMemberList")
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error(error));

    // fetch maintenance head

    fetch("https://a3.arya-erp.in/api2/socapi/api/master/getHead")
      .then((response) => response.json())
      .then((data) => {
        tableHead = [];

        data.map((item) => {
          tableHead.push(item.Header);
        });
        setHead(tableHead);
      })
      .catch((error) => console.error(error));
  }, []);
  console.log(data);
  console.log(head);

  const exportData = data.map((item) => item);

  const handleExportData = () => {
    let wb = XLSX.utils.book_new(),
      ws = XLSX.utils.json_to_sheet(exportData);
    XLSX.utils.book_append_sheet(wb, ws, "Data");
    XLSX.writeFile(wb, "MemberList.xlsx");
  };

  const downloadFormat = () => {
    const worksheet = XLSX.utils.aoa_to_sheet([template]);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    XLSX.writeFile(workbook, "memberList_template.xlsx");
  };

  const [chkstat2, setChkStat2] = useState({});

  useEffect(() => {
    const chkstat = {};
    data?.forEach((val) => {
      chkstat[val._id] = false;
    });
    setChkStat2(chkstat);
  }, [data]);

  // console.log("chk2");
  // console.log(chkstat2);

  const leadSet = (event) => {
    let c = {};
    Object.keys(chkstat2).forEach((key) => {
      console.log(key);
      c[key] = event.target.checked;
    });
    console.log(`c:`);
    console.log(c);
    setChkStat2(c);
  };

  const setTick = (contact, event) => {
    chkstat2[contact._id] = event.target.checked;
    console.log(contact);
    console.log(chkstat2);
    const c = {
      ...chkstat2,
    };
    console.log(c);
    setChkStat2(c);
  };

  const handleFieldChange = (index, field, value) => {
    const updateRow = [...tableRow];
    updateRow[index][field] = value;
    setTableRow(updateRow);
  };

  const handleRowValueChange = (item, rowIndex, event) => {
    const newHead = [...item.head];
    newHead[rowIndex].value = event.target.value;
    setTableRow((prevTableRow) =>
      prevTableRow.map((row) =>
        row === item ? { ...row, head: newHead } : row
      )
    );
  };

  const handleSave = async () => {
    console.log(tableRow, "table Head");
    try {
      let res = await axios.post(
        "https://a3.arya-erp.in/api2/socapi/api/member/postOpeningMember",
        tableRow
      );
      console.log(res);
      toast.success("successfully saved data");
    } catch (error) {
      console.log(error);
      toast.error("error in storing data");
    }
  };

  return (
    <>
      <div
        className="pt-4  overflow-y-auto  gap-6"
        style={{ height: "calc(100vh - 150px)" }}
      >
        <h1 className="text-2xl text-center mb-5">Member List</h1>
        <div className="flex justify-end mr-10">
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
            <div className="px-10">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-gray-600 rounded-md text-white mb-3"
              >
                Save
              </button>
              <div className="max-w-max overflow-x-auto shadow-lg m-auto mt-6  rounded-lg ">
                <table className="rounded-md">
                  <thead className="bg-gray-700 text-slate-200">
                    <tr>
                      {tableHeads.map((item) => (
                        <th
                          className="p-4 whitespace-nowrap overflow-hidden text-ellipsis "
                          key={item}
                        >
                          {item}
                        </th>
                      ))}
                      {head.map((item) => (
                        <th
                          className="p-4 whitespace-nowrap overflow-hidden text-ellipsis "
                          key={item}
                        >
                          {item}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-300">
                    {tableRow.map((item, index) => (
                      <tr key={index} className="">
                        <td className="p-4 whitespace-nowrap overflow-hidden text-ellipsis">
                          <input
                            type="text"
                            value={item.name}
                            onChange={(event) =>
                              handleFieldChange(
                                index,
                                "name",
                                event.target.value
                              )
                            }
                            className="text-center"
                          />
                        </td>
                        <td className="p-4 text-center whitespace-nowrap overflow-hidden text-ellipsis">
                          <input
                            type="text"
                            value={item.registeredMobileNo}
                            onChange={(event) =>
                              handleFieldChange(
                                index,
                                "registeredMobileNo",
                                event.target.value
                              )
                            }
                            className="text-center"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={item.email}
                            onChange={(event) =>
                              handleFieldChange(
                                index,
                                "email",
                                event.target.value
                              )
                            }
                            className="text-center"
                          />
                        </td>
                        <td className="p-4 whitespace-nowrap overflow-hidden text-ellipsis text-center">
                          <input
                            type="text"
                            value={item.permanentAddress}
                            onChange={(event) =>
                              handleFieldChange(
                                index,
                                "permanentAddress",
                                event.target.value
                              )
                            }
                            className="text-center"
                          />
                        </td>
                        <td className="p-4 whitespace-nowrap overflow-hidden text-ellipsis text-center">
                          {item.flatNo}
                        </td>
                        <td className="p-4 whitespace-nowrap overflow-hidden text-ellipsis text-center">
                          {item.wingNo}
                        </td>
                        {item.head.map((row, rowIndex) => (
                          <td className=" text-center" key={rowIndex}>
                            <input
                              type="text"
                              value={row.value}
                              onChange={(event) =>
                                handleRowValueChange(item, rowIndex, event)
                              }
                              className="text-center"
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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

export default MemberList;
