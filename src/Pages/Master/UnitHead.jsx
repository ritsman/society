import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const UnitHead = () => {
  const [unitHead, setUnitHead] = useState("");
  const [code, setCode] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    let obj = {
      unitHead,
      code,
    };
    console.log(obj);
    try {
      let res = await axios.post(
        "https://a3.arya-erp.in/api2/socapi/api/master/postUnitHead",
        obj
      );
      console.log(res);
      toast.success("succesfully created head");
      setUnitHead("");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <div
        className="pt-10   overflow-y-auto  gap-6"
        style={{ height: "calc(100vh - 150px)" }}
      >
        <h1 className="text-center text-2xl mb-5">ADD Unit Head</h1>

        <form
          onSubmit={handleSubmit}
          className="flex gap-6 gap-y-2  max-w-7xl mx-auto sm:px-6 lg:px-8  "
        >
          <div className=" grid w-[90%]  grid-cols-2 gap-6 gap-y-2  max-w-7xl mx-auto sm:px-6 lg:px-8  ">
            <div className="mb-4">
              <label htmlFor="groupName" className="block font-bold mb-2">
                Unit Head
              </label>
              <input
                type="text"
                id="groupName"
                name="groupName"
                value={unitHead}
                onChange={(e) => setUnitHead(e.target.value)}
                className="w-full px-3 py-2 border focus:outline-none border-gray-300 rounded"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="under" className="block font-bold mb-2">
                Code
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-3 py-2 border focus:outline-none border-gray-300 rounded"
              />
            </div>
            <div className="col-span-2">
              <button
                type="submit"
                className="bg-gray-800 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UnitHead;
