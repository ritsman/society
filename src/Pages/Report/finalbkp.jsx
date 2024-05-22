import React, { useEffect, useState } from "react";

const App = () => {
  const [names, setNames] = useState([]);
  const [charges, setCharges] = useState([]);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    // Fetch names data
    fetch("https://a2.arya-erp.in/api2/socapi/api/member/getMemberList")
      .then((response) => response.json())
      .then((data) => setNames(data));

    // Fetch charges data
    fetch("https://a2.arya-erp.in/api2/socapi/api/society/getBills")
      .then((response) => response.json())
      .then((data) => setCharges(data));
  }, []);

  useEffect(() => {
    if (names.length > 0 && charges.length > 0) {
      // Create table data
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
  return (
    <div>
      <h1>Names and Charges Table</h1>
      <Table data={tableData} charges={charges} />
    </div>
  );
};

const Table = ({ data, charges }) => {
  return (
    <table border="1">
      <thead>
        <tr>
          <th>Name</th>
          {charges.map((charge, index) => (
            <th key={index}>{charge.Particular}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index}>
            <td>{row.fullName}</td>
            {charges.map((charge, index) => (
              <td key={index}>{row[charge.Particular]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default App;
