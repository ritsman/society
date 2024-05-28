import React, { useEffect, useState } from 'react';

const BillTable = () => {
  const [data, setData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [headers, setHeaders] = useState([]);

  useEffect(() => {
    // Fetch data from the API
    const fetchData = async () => {
      // Replace with your API call
      const apiData = [
        { billNo: 1, particularHead: "A", amount: "113" },
        { billNo: 2, particularHead: "A", amount: "173" },
        { billNo: 2, particularHead: "B", amount: "1397" },
        { billNo: 3, particularHead: "D", amount: "09873" },
        // Add more data as needed
      ];
      
      setData(apiData);
      processTableData(apiData);
    };

    fetchData();
  }, []);

  const processTableData = (data) => {
    const uniqueHeads = [...new Set(data.map(item => item.particularHead))];
    setHeaders(uniqueHeads);

    const billMap = new Map();
    data.forEach(item => {
      if (!billMap.has(item.billNo)) {
        billMap.set(item.billNo, {});
      }
      billMap.get(item.billNo)[item.particularHead] = item.amount;
    });

    const formattedData = Array.from(billMap.entries()).map(([billNo, headAmounts]) => {
      const row = { billNo };
      uniqueHeads.forEach(head => {
        row[head] = headAmounts[head] || "";
      });
      return row;
    });

    setTableData(formattedData);
  };

  return (
    <div>
      <table border="1">
        <thead>
          <tr>
            <th>Bill No</th>
            {headers.map((head, index) => (
              <th key={index}>{head}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, index) => (
            <tr key={index}>
              <td>{row.billNo}</td>
              {headers.map((head, index) => (
                <td key={index}>{row[head]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BillTable;
