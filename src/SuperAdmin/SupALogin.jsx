import React, {  useState } from "react";
import {useNavigate} from "react-router-dom"
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const SupLogin = () => {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

async function handleSubmit(e) {
    e.preventDefault();
    console.log({
      user,
      password,
    });
    try {
      let response = await axios.post(
        "http://localhost:3001/api/superAdmin/login",
        {
          user,
          password,
        }
      );

      console.log(response.data);

       toast.success("successfully Logged In");
       navigate("/adminPage")
    
    } catch (error) {
      console.log("login error", error);
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
    }
  }



  return (
    <div className="flex items-center justify-center w-screen h-screen bg-gray-600">
      <div className="w-full md:pt-24  pb-0 max-w-md">
        <div className="bg-gray-800 shadow-md rounded-xl md:px-8 px-4  pb-10 mb-4">
          <h1 className="text-2xl  py-5 font-extrabold text-gray-100 text-center mb-6 tracking-wide">
            Super Admin Login
          </h1>

          <form onSubmit={handleSubmit}>
            <div className=" flex items-center justify-center pt-2">
              <div className="bg-gray-900 rounded-lg shadow-lg p-8">
                <div className="flex items-center justify-center mb-6">
                  <div className="bg-gray-700 rounded-full w-20 h-20 flex items-center justify-center">
                    <svg
                      className="text-gray-400 w-12 h-12"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                </div>
                <div>
                  <div className="mb-4">
                    <div className="flex items-center bg-gray-800 rounded-md px-3 py-2">
                      <svg
                        className="text-gray-400 w-5 h-5 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <input
                        type="text"
                        placeholder="User "
                        value={user}
                        onChange={(e) => setUser(e.target.value.toLowerCase())}
                        className="bg-gray-800 text-gray-400 placeholder-gray-500 focus:outline-none w-full"
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="flex items-center bg-gray-800 rounded-md px-3 py-2">
                      <svg
                        className="text-gray-400 w-5 h-5 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                      <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-gray-800 text-gray-400 placeholder-gray-500 focus:outline-none w-full"
                      />
                    </div>
                  </div>

                  <button className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded w-full">
                    LOGIN
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SupLogin;
