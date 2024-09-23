import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import config from "../../config";

const Approval = () => {
  const [users, setUsers] = useState([]);
  const [roleSelections, setRoleSelections] = useState({}); // Track role for each user

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        `${config.API_URL}/api/auth/getAllUsers`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );
      const filteredActiveUsers = response.data.data.filter(
        (user) => user.user !== "admin@gmail.com"
      );
      setUsers(filteredActiveUsers);
    } catch (error) {
      toast.error("Error in fetching user data");
    }
  };

  const handleApprove = async (userId) => {
    const selectedRole = roleSelections[userId]; // Get the selected role for the specific user

    if (!selectedRole) {
      toast.error("Please select a role before approving.");
      return;
    }

    try {
      await axios.post(
        `${config.API_URL}/api/auth/approve-user/${userId}`,
        { role: selectedRole },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );
      toast.success("User approved successfully with role " + selectedRole);
      fetchUsers();
    } catch (error) {
      toast.error("Error approving user");
    }
  };

  const handleRemove = async (userId) => {
    try {
      await axios.delete(`${config.API_URL}/api/auth/remove-user/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      toast.success("User removed successfully");
      fetchUsers();
    } catch (error) {
      toast.error("Error removing user");
    }
  };

  const handleChangeRole = (userId, event) => {
    const { value } = event.target;
    setRoleSelections((prevRoles) => ({
      ...prevRoles,
      [userId]: value, // Update the selected role for the specific user
    }));
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Username</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-center">Status</th>
              <th className="py-3 px-6 text-center">Role</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {users.length > 0 ? (
              users.map((user) => (
                <tr
                  key={user._id}
                  className="border-b border-gray-200 hover:bg-gray-100"
                >
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-6 text-left">
                    <span>{user.user}</span>
                  </td>
                  <td className="py-3 px-6 text-center">
                    <span
                      className={`${
                        user.status === "pending"
                          ? "bg-gray-400 text-white font-bold"
                          : "bg-green-200 text-green-600 font-bold"
                      } py-1 px-3 rounded-full text-xs`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-center">
                    <div className="flex items-center">
                      <label htmlFor="role" className="mr-2 text-gray-700">
                        Select Role:
                      </label>
                      <select
                        id="role"
                        value={roleSelections[user._id] || ""} // Get the role for the specific user
                        onChange={(e) => handleChangeRole(user._id, e)}
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="" disabled>
                          --Select Role--
                        </option>
                        <option value="admin">Admin</option>
                        <option value="data-entry">Data Entry</option>
                        <option value="view">View</option>
                      </select>
                    </div>
                  </td>
                  <td className="py-3 px-6 text-center">
                    {user.status === "pending" ? (
                      <button
                        onClick={() => handleApprove(user._id)}
                        className="bg-gray-500 text-white px-4 py-2 rounded mr-2 hover:bg-gray-600"
                      >
                        Approve
                      </button>
                    ) : (
                      <button
                        className="bg-gray-500 text-white px-4 py-2 rounded mr-2 cursor-not-allowed opacity-50"
                        disabled
                      >
                        Approved
                      </button>
                    )}
                    <button
                      onClick={() => handleRemove(user._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-3 px-6 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Approval;
