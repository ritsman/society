import React from "react";

const UploadedData = ({ excelData }) => {
  return (
    <div>
      <table className="border border-black p-4 text-left mb-4">
        <thead className="bg-gray-200 p-4 text-left mb-4">
          <tr>
            {Object.keys(excelData[0]).map((key) => (
              <th key={key}>{key}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {excelData.map((individualExcelData, index) => (
            <tr key={index}>
              {Object.keys(individualExcelData).map((key) => (
                <td key={key}>{individualExcelData[key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UploadedData;
