import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const MHeadList = () => {
  const [chkstat2, setChkStat2] = useState({});

  const [HeadData, setHeadData] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetch(" https://a3.arya-erp.in/api2/socapi/api/master/getHead")
      .then((response) => response.json())
      .then((data) => setHeadData(data));
  }, []);

  useEffect(() => {
    const chkstat = {};
    HeadData?.forEach((val) => {
      chkstat[val._id] = false;
    });
    setChkStat2(chkstat);
  }, [HeadData]);

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

  const show_record = (row) => {
    const { _id } = row;
    console.log(`id:${_id}`);

    navigate(`${_id}`, { state: { row } });
  };

  return (
    <div className="overflow-x-auto py-10 px-24">
      <table className="table-auto w-full">
        <thead>
          <tr className="bg-gray-600 text-white">
            <th className="p-4 border ">
              <input type="checkbox" onChange={(event) => leadSet(event)} />
            </th>
            <th className="px-4 py-2 border">Maintenance Head</th>
            <th className="px-4 py-2 border">Under</th>
          </tr>
        </thead>
        <tbody>
          {HeadData.map((row, index) => (
            <tr
              onClick={() => show_record(row)}
              key={index}
              className="hover:bg-gray-100 cursor-pointer"
            >
              <td className="p-4 text-center border">
                <input
                  type="checkbox"
                  checked={chkstat2[row._id]}
                  onChange={(event) => setTick(row, event)}
                  name={row._id}
                />
              </td>
              <td className="border px-4 py-2">{row.Header}</td>
              <td className="border px-4 py-2">{row.Under}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MHeadList;
