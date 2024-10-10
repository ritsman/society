// import React, { useState } from "react";
// import axios from "axios";

// const AdminPage = () => {
//   const [societyId, setSocietyId] = useState("");
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     console.log(societyId, username, password);

//     try {
//       // Send societyId and login details to backend
//       const response = await axios.post("/api/login-society", {
//         societyId,
//         username,
//         password,
//       });

//       console.log("Login successful:", response.data);
//       alert(`Logged into society: ${societyId}`);

//       // Handle redirect or session management after successful login
//       // e.g., save token to localStorage, navigate to dashboard, etc.
//     } catch (error) {
//       console.error("Error logging in:", error);
//       alert("Login failed");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-800">
//       <div className="bg-gray-700 text-gray-100 shadow-md rounded-lg w-full max-w-md p-8">
//         <h1 className="text-3xl font-bold text-center mb-6 text-gray-200">
//           Login to Society
//         </h1>
//         <form onSubmit={handleLogin}>
//           <div className="mb-4">
//             <label className="block text-sm font-semibold text-gray-400 mb-2">
//               Society ID:
//             </label>
//             <input
//               type="text"
//               value={societyId}
//               onChange={(e) => setSocietyId(e.target.value)}
//               required
//               className="w-full px-3 py-2 bg-gray-800 text-gray-200 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-sm font-semibold text-gray-400 mb-2">
//               Username:
//             </label>
//             <input
//               type="text"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               required
//               className="w-full px-3 py-2 bg-gray-800 text-gray-200 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
//             />
//           </div>
//           <div className="mb-6">
//             <label className="block text-sm font-semibold text-gray-400 mb-2">
//               Password:
//             </label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               className="w-full px-3 py-2 bg-gray-800 text-gray-200 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
//             />
//           </div>
//           <button
//             type="submit"
//             className="w-full bg-gray-600 hover:bg-gray-500 text-gray-100 font-bold py-2 rounded-md transition-colors duration-200"
//           >
//             Login
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AdminPage;



import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import config from "../config";

const AdminPage = () => {
  const [societies, setSocieties] = useState([]);
  const [name, setName] = useState("");
  const [societyId, setSocietyId] = useState("");
  const [password, setPassword] = useState("");

    const { userDetails, setUserDetails, setIsAuthenticated } = useAuth();


  const {setIsSocietyOpen} = useAuth();
  const navigate = useNavigate()

  useEffect(() => {
    axios
      .get(`${config.API_URL}/api/superAdmin/getSociety`)
      .then((res) => setSocieties(res.data))
      .catch((err) => console.error(err));
  }, []);

  const createSociety = () => {
    axios
      .post(`${config.API_URL}/api/superAdmin/createSociety`, {
        name,
        societyId,
        
      })
      .then((res) => alert("Society created!"))
      .catch((err) => console.error(err));
  };

 const handleSocietyLogin = (society) => {
   axios
     .post(`${config.API_URL}/api/auth/login`, {
       name: society.name,
       societyId: society.societyId,
       superAdmin: true,
     })
     .then((res) => {
       console.log(res);
       setIsSocietyOpen(true);
       navigate("/");
     })
     .catch((err) => {
      
       if (
         err.response &&
         err.response.status === 404 &&
         err.response.data.error
       ) {
         alert(err.response.data.error); 
       } else {
         console.error(err); // Log other errors
         alert("An error occurred. Please try again."); 
       }
     });
 };

 const handleLogout = (e)=>{
   e.preventDefault();
   console.log("logout button clicked");
   setUserDetails({});
   setIsAuthenticated(false);
   localStorage.removeItem("SocToken");
   toast.success("User Logged Out");
   navigate("/");
 }


  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 p-8">
      <div className="flex justify-between">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">
          Super Admin Dashboard
        </h1>
        <div>
          <button onClick={handleLogout} className=" border-2 px-3 py-2 bg-gray-300 rounded-md font-bold ">
            Log out
          </button>
          <Link to="approval">
            <button className=" border-2 px-3 py-2 bg-gray-300 rounded-md font-bold ">
              Approval
            </button>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Create New Society
        </h2>
        <div className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Society Name"
            className="w-full px-4 py-2 rounded-md border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
          <input
            type="text"
            value={societyId}
            onChange={(e) => setSocietyId(e.target.value)}
            placeholder="Society ID"
            className="w-full px-4 py-2 rounded-md border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
          />

          <button
            onClick={createSociety}
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Create Society
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Select Society
        </h2>
        <ul className="space-y-2">
          {societies.map((society) => (
            <li
              key={society._id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
            >
              <span className="text-gray-700">{society.name}</span>
              <button
                onClick={() => {
                  handleSocietyLogin(society);
                }}
                className="px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Open
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminPage;

