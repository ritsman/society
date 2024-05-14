import React from "react";

const UploadedData = ({ excelData }) => {
  return (
    <>
      <table className="ml-20 border border-black p-4 text-left mb-4">
        <thead className="bg-gray-200 p-10 text-left mb-4">
          <tr>
            {Object.keys(excelData[0]).map((key) => (
              <th className="p-4" key={key}>
                {key}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {excelData.map((individualExcelData, index) => (
            <tr key={index}>
              {Object.keys(individualExcelData).map((key) => (
                <td className="p-4" key={key}>
                  {individualExcelData[key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default UploadedData;
