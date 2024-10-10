import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import config from "../../config";
const TransactionView = () => {
  const [members, setMembers] = useState([]);
  const [gridRow , setGridRow] = useState([])
      const [searchTerm, setSearchTerm] = useState("");


      
     const handleSearch = (event) => {
       const trimmedSearchTerm = event.target.value.toLowerCase();
       setSearchTerm(trimmedSearchTerm);

       if (trimmedSearchTerm) {
         setMembers(
           gridRow.filter(
             (row) =>
               row.name.toLowerCase().includes(trimmedSearchTerm) ||
               row.flatNo.toString().includes(trimmedSearchTerm)
           )
         );
       } else {
         setMembers(gridRow);
       }
     };


  const navigate = useNavigate();

  useEffect(() => {
    async function fetch() {
      try {
        let res = await axios.get(
          `${config.API_URL}/api/member/getMemberList`
        );
        console.log(res);
        setGridRow(res.data)
        setMembers(res.data);
      } catch (error) {
        console.error(error);
      }
    }
    fetch();
  }, []);

  const handleView = (member) => {
    console.log("handle view Clicked");
    navigate(`individualLedger`, { state: { member } });
  };
  return (
    <div>
      <input
        type="text"
        placeholder="Search by Name and flat no"
        value={searchTerm}
        onChange={handleSearch}
        className=" w-[300px] px-4 py-1 border rounded"
      />
      <div className="overflow-x-auto mt-5">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                S.No
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Members
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Flat No
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {members.map((member, index) => (
              <tr
                onClick={() => handleView(member)}
                key={member.id}
                className="hover:bg-gray-50 cursor-pointer"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {member.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {member.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {member.flatNo}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionView;
