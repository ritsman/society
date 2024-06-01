import React, { useEffect, useState } from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";

const header = [
  "GL Code",
  "Bill Head",
  "Under",
  "Sequence no",
  "Apply Interest",
  "CGST",
  "SGST",
  "IGST",
];
const MaintenanceHead = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/master/maintenance-head/new-maintenanceHead");
  };

  const [mmData, setMMData] = useState([]);
  useEffect(() => {
    fetch("https://a3.arya-erp.in/api2/socapi/api/master/getHead")
      .then((response) => response.json())
      .then((data) => {
        let arr = [];
        data.forEach((item, index) => {
          let obj = {
            GhCode: index,
            billHead: item.Header,
            under: item.Under,
            sequenceNo: index + 1,
            cgst: "0",
            sgst: "0",
            igst: "0",
          };
          arr.push(obj);
        });
        setMMData(arr);
      });
  }, []);

  const [chkstat2, setChkStat2] = useState({});

  useEffect(() => {
    const chkstat = {};
    mmData?.forEach((val) => {
      chkstat[val._id] = false;
    });
    setChkStat2(chkstat);
  }, [mmData]);

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

  const handleInputChange = (index, field, value) => {
    const updatedData = [...mmData];
    updatedData[index][field] = value;
    setMMData(updatedData);
  };

  const handleSubmit = () => {
    console.log(mmData);
  };

  return (
    <div
      className="md:py-10 px-10 overflow-y-auto gap-6"
      style={{ height: "calc(100vh - 150px)" }}
    >
      <h1 className="text-center font-bold text-2xl"> Bills Head</h1>
      <div className="flex justify-between">
        <div className="flex gap-5">
          <button
            onClick={handleClick}
            className="bg-gray-800 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
          >
            Add New
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-gray-500 text-white rounded-md"
          >
            Save
          </button>
        </div>
        <Link to="M-headList">
          <button className="border-2 border-gray-800 text-black px-4 py-2 rounded-md hover:bg-gray-800 hover:text-white font-bold">
            View Heads
          </button>
        </Link>
      </div>
      <div className="max-w-screen overflow-x-auto shadow-lg mt-6">
        <table className="w-full border-collapse ">
          <thead className="bg-gray-700 text-slate-200 ">
            <tr>
              <th className="p-2">
                <input type="checkbox" onChange={(event) => leadSet(event)} />
              </th>
              {header.map((head, index) => (
                <th className="px-2 text-sm border" key={index}>
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-300">
            {mmData.map((row, index) => (
              <tr key={index} className="hover:bg-gray-200 cursor-pointer">
                <td className="p-4 border">
                  <input
                    type="checkbox"
                    checked={chkstat2[row._id]}
                    onChange={(event) => setTick(row, event)}
                    name={row._id}
                  />
                </td>
                <td className="px-8 border ">{row.GhCode}</td>
                <td className="px-4 border">{row.billHead}</td>
                <td className="px-4 border">{row.under}</td>
                <td className="px-4  border text-center">
                  <input
                    type="text"
                    value={row.sequenceNo}
                    onChange={(e) =>
                      handleInputChange(index, "sequenceNo", e.target.value)
                    }
                    className="bg-transparent text-center focus:outline-none w-[40%]"
                  />
                </td>
                <td className="px-4 text-center px-2 border">
                  <input type="checkbox" name={row._id} className="mx-10" />
                </td>
                <td className="px-4 text-center border">
                  <input
                    type="text"
                    value={row.cgst}
                    onChange={(e) =>
                      handleInputChange(index, "cgst", e.target.value)
                    }
                    className="bg-transparent text-center focus:outline-none w-[40%]"
                  />
                </td>
                <td className="px-4 text-center border">
                  <input
                    type="text"
                    value={row.sgst}
                    onChange={(e) =>
                      handleInputChange(index, "sgst", e.target.value)
                    }
                    className="bg-transparent text-center focus:outline-none w-[40%]"
                  />
                </td>
                <td className="px-4 text-center border">
                  <input
                    type="text"
                    value={row.igst}
                    onChange={(e) =>
                      handleInputChange(index, "igst", e.target.value)
                    }
                    className="bg-transparent text-center focus:outline-none w-[40%] "
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MaintenanceHead;
