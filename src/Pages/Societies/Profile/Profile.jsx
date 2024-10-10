import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import AutoComplete from "../../../components/Autocomplete";
import config from "../../../config";

const SocietyForm = () => {
  const [formData, setFormData] = useState({
    societyName: "",
    registrationNumber: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    chairman: "",
    secretary: "",
    treasurer: "",
  });
  
 const [selectedChairman, setSelectedChairman] = useState("");
 const handleSelectCm = (value) => {
   setSelectedChairman(value);
 };

 const [selectedSecretary, setSelectedSecretary] = useState("");
 const handleSelectSc = (value) => {
   setSelectedSecretary(value);
 }; 

 const [selectedTreasurer, setSelectedTreasurer] = useState("");
 const handleSelectTr = (value) => {
   setSelectedTreasurer(value);
 };

 useEffect(()=>{
  console.log(selectedChairman);
  console.log(selectedSecretary);
  console.log(selectedTreasurer)
  console.log(formData)

 },[selectedChairman,selectedSecretary,selectedTreasurer,formData])


  const [isEditing, setIsEditing] = useState(false);
  const [items,setItems] = useState([]);

    const fetchMembers = async () => {
    
      try {
        const res = await axios.get(
          `${config.API_URL}/api/society/getBills`
        );
        let filtered = res.data.map((item) => item.data.ownerName);
        setItems(filtered);
        console.log("memberss list " , filtered)

      } catch (error) {
        console.error(error);
        setError("Failed to fetch members data. Please try again later.");
      } 
    };

  useEffect(() => {
    fetchData();
    fetchMembers();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(
       `${config.API_URL}/api/society/getSocProfile`
      );
      if (res.data.length > 0) {
        const { _id, __v, ...filteredData } = res.data[0];
        setFormData(filteredData);
      } else {
        setIsEditing(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  // const handleChange1 = (name,value) =>{
  //   console.log(name , value ,"hellooo")
  //   setFormData({...formData , [name]:value})
  // }

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
   const updatedFormData = {
     ...formData,
     chairman: selectedChairman,
     secretary: selectedSecretary,
     treasurer: selectedTreasurer,
   };
    console.log(formData)
    try {
      const res = await axios.post(
        `${config.API_URL}/api/society/postSocProfile`,
        updatedFormData
      );
      console.log(res);
      toast.success("Profile successfully saved");
    } catch (error) {
      console.log(error);
      toast.error("Error in saving profile");
    }
    setIsEditing(false);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `${config.API_URL}/api/society/deleteSocProfile/${formData.registrationNumber}`
      );
      console.log("Profile Deleted");
      setFormData({
        societyName: "",
        registrationNumber: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        chairman: "",
        secretary: "",
        treasurer: "",
      });
      setIsEditing(true);
      toast.success("Profile deleted successfully");
    } catch (error) {
      console.log(error);
      toast.error("Error in deleting profile");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {isEditing ? "Edit Society Profile" : "Society Profile"}
      </h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="mb-4">
          <label htmlFor="societyName" className="block text-gray-700 mb-2">
            Society Name
          </label>
          <input
            type="text"
            id="societyName"
            name="societyName"
            value={formData.societyName}
            onChange={handleChange}
            disabled={!isEditing}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              !isEditing ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="registrationNumber"
            className="block text-gray-700 mb-2"
          >
            Registration Number
          </label>
          <input
            type="text"
            id="registrationNumber"
            name="registrationNumber"
            value={formData.registrationNumber}
            onChange={handleChange}
            disabled={!isEditing}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              !isEditing ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="address" className="block text-gray-700 mb-2">
            Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            disabled={!isEditing}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              !isEditing ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="city" className="block text-gray-700 mb-2">
            City
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            disabled={!isEditing}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              !isEditing ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="state" className="block text-gray-700 mb-2">
            State
          </label>
          <input
            type="text"
            id="state"
            name="state"
            value={formData.state}
            onChange={handleChange}
            disabled={!isEditing}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              !isEditing ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="pincode" className="block text-gray-700 mb-2">
            Pincode
          </label>
          <input
            type="text"
            id="pincode"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            disabled={!isEditing}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              !isEditing ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="chairman" className="block text-gray-700 mb-2">
            Chairman
          </label>
          {/* <input
            type="text"
            id="chairman"
            name="chairman"
            value={formData.chairman}
            onChange={handleChange}
            disabled={!isEditing}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              !isEditing ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
          /> */}
          <AutoComplete
            options={items}
            value={isEditing ? "" : formData.chairman}
            onSelect={(value) => {
              handleSelectCm(value);
            }}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="secretary" className="block text-gray-700 mb-2">
            Secretary
          </label>
          {/* <input
            type="text"
            id="secretary"
            name="secretary"
            value={formData.secretary}
            onChange={handleChange}
            disabled={!isEditing}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              !isEditing ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
          /> */}
          <AutoComplete
            options={items}
            value={isEditing ? "" : formData.secretary}
            onSelect={(value) => {
              handleSelectSc(value);
            }}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="treasurer" className="block text-gray-700 mb-2">
            Treasurer
          </label>
          {/* <input
            type="text"
            id="treasurer"
            name="treasurer"
            value={formData.treasurer}
            onChange={handleChange}
            disabled={!isEditing}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              !isEditing ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
          /> */}
          <AutoComplete
            options={items}
            value={isEditing ? "" : formData.treasurer}
            onSelect={(value) => {
              handleSelectTr(value);
            }}
          />
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={handleSave}
            disabled={!isEditing}
            className={`${
              !isEditing
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-gray-500 hover:bg-blue-600"
            } text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            Save
          </button>

          <button
            type="button"
            onClick={handleEdit}
            disabled={isEditing}
            className={`${
              isEditing
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-gray-500 hover:bg-yellow-600 cursor-pointer"
            } text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500`}
          >
            Edit
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="bg-gray-500 hover:bg-red-600 cursor-pointer text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Delete
          </button>
        </div>
      </form>
    </div>
  );
};

export default SocietyForm;
