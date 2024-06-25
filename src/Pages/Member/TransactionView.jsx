import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const TransactionView = () => {
  const [members, setMembers] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetch() {
      try {
        let res = await axios.get(
          "https://a3.arya-erp.in/api2/socapi/api/member/getMemberList"
        );
        console.log(res);
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
      <div className="overflow-x-auto">
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
