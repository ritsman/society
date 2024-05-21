import axios from "axios";
import React, { useState } from "react";

const Profile = () => {
  const [formData, setFormData] = useState([
    {
      firstName: "",
      lastName: "",
      permanentAddress: "",
      registeredMobileNo: "",
      alternateMobileNo: "",
      flatNo: "",
      wingNo: "",
      area: "",
      societyNocStatus: "",
      occupancy: "",
      maintenance_amt: "",
      noc: "",
      arrears: "",
      rate: "",
      vehicleDetails: "",
      societyShareCertificate: null,
      memberSince: "",
      systemId: "",
      photo: null,
    },
  ]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    setFormData({ ...formData, photo: e.target.files[0] });
  };
  const handleCertificateChange = (e) => {
    setFormData({ ...formData, societyShareCertificate: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // console.log(formData);
    try {
      let result = await axios.post(
        "https://a2.arya-erp.in/api2/socapi/api/member/postProfile",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div
        className="pt-10  overflow-y-auto  gap-6"
        style={{ height: "calc(100vh - 150px)" }}
      >
        <h1 className="pb-5 text-center text-2xl mb-5">MEMBER PROFILE</h1>
        <form
          onSubmit={handleSubmit}
          className="flex gap-6 gap-y-2  max-w-7xl mx-auto sm:px-6 lg:px-8  "
        >
          <div className=" grid w-[90%]  grid-cols-2 gap-6 gap-y-2  max-w-7xl mx-auto sm:px-6 lg:px-8  ">
            <div className="mb-4">
              <label htmlFor="firstName" className="block font-bold mb-2">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-3 py-2 border focus:outline-none border-gray-300 rounded"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="lastName" className="block font-bold mb-2">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-3 py-2 border focus:outline-none border-gray-300 rounded"
                required
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="registeredMobileNo"
                className="block font-bold mb-2"
              >
                Registered Mobile No.
              </label>
              <input
                type="tel"
                id="registeredMobileNo"
                name="registeredMobileNo"
                value={formData.registeredMobileNo}
                onChange={handleChange}
                className="w-full px-3 py-2 border focus:outline-none border-gray-300 rounded"
                required
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="alternateMobileNo"
                className="block font-bold mb-2"
              >
                Alternate Mobile No.
              </label>
              <input
                type="tel"
                id="alternateMobileNo"
                name="alternateMobileNo"
                value={formData.alternateMobileNo}
                onChange={handleChange}
                className="w-full px-3 py-2 border focus:outline-none border-gray-300 rounded"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="permanentAddress"
                className="block font-bold mb-2"
              >
                Permanent Address
              </label>
              <textarea
                id="permanentAddress"
                name="permanentAddress"
                value={formData.permanentAddress}
                onChange={handleChange}
                className="w-full px-3 py-2 border focus:outline-none border-gray-300 rounded"
                required
              ></textarea>
            </div>

            <div className="mb-4">
              <label htmlFor="area" className="block font-bold mb-2">
                Area
              </label>
              <input
                type="text"
                id="area"
                name="area"
                value={formData.area}
                onChange={handleChange}
                className="w-full px-3 py-2 border focus:outline-none border-gray-300 rounded"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="flatNo" className="block font-bold mb-2">
                Flat No.
              </label>
              <input
                type="text"
                id="flatNo"
                name="flatNo"
                value={formData.flatNo}
                onChange={handleChange}
                className="w-full px-3 py-2 border focus:outline-none border-gray-300 rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="wingNo" className="block font-bold mb-2">
                Wing No.
              </label>
              <input
                type="text"
                id="wingNo"
                name="wingNo"
                value={formData.wingNo}
                onChange={handleChange}
                className="w-full px-3 py-2 border focus:outline-none border-gray-300 rounded"
                required
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="societyNocStatus"
                className="block font-bold mb-2"
              >
                Society NOC Status
              </label>
              <select
                id="societyNocStatus"
                name="societyNocStatus"
                value={formData.societyNocStatus}
                onChange={handleChange}
                className="w-full px-3 py-2 border focus:outline-none border-gray-300 rounded"
                required
              >
                <option value=""> NOC Status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="occupancy" className="block font-bold mb-2">
                Occupancy
              </label>
              <select
                id="occupancy"
                name="occupancy"
                value={formData.occupancy}
                onChange={handleChange}
                className="w-full px-3 py-2 border  border-gray-300 rounded"
                required
              >
                <option value=""> Occupancy</option>
                <option value="self">Self</option>
                <option value="rented">Rented</option>
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="maintenance_amt" className="block font-bold mb-2">
                Maintenance Amount
              </label>
              <input
                type="text"
                id="maintenance_amt"
                name="maintenance_amt"
                value={formData.maintenance_amt}
                onChange={handleChange}
                className="w-full px-3 py-2 border focus:outline-none border-gray-300 rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="arrears" className="block font-bold mb-2">
                Arrears
              </label>
              <input
                type="text"
                id="arrears"
                name="arrears"
                value={formData.arrears}
                onChange={handleChange}
                className="w-full px-3 py-2 border focus:outline-none border-gray-300 rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="rate" className="block font-bold mb-2">
                Interest Rate
              </label>
              <input
                type="text"
                id="rate"
                name="rate"
                value={formData.rate}
                onChange={handleChange}
                className="w-full px-3 py-2 border focus:outline-none border-gray-300 rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="noc" className="block font-bold mb-2">
                Non Occupancy Charges
              </label>
              <input
                type="text"
                id="noc"
                name="noc"
                value={formData.noc}
                onChange={handleChange}
                className="w-full px-3 py-2 border focus:outline-none border-gray-300 rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="vehicleDetails" className="block font-bold mb-2">
                Vehicle Details
              </label>
              <input
                type="text"
                id="vehicleDetails"
                name="vehicleDetails"
                value={formData.vehicleDetails}
                onChange={handleChange}
                className="w-full px-3 py-2 border focus:outline-none border-gray-300 rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="memberSince" className="block font-bold mb-2">
                Member Since
              </label>
              <input
                type="date"
                id="memberSince"
                name="memberSince"
                value={formData.memberSince}
                onChange={handleChange}
                className="w-full px-3 py-2 focus:outline-none border border-gray-300 rounded"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="photo" className="block font-bold mb-2">
                Society Share Certificate
              </label>
              <input
                type="file"
                id="societyShareCertificate"
                name="societyShareCertificate"
                accept="image/*"
                onChange={handleCertificateChange}
                className="w-full px-3 py-2 border border-gray-300 rounded"
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
          <div className=" w-[15%]">
            <div className="mb-4">
              <label htmlFor="systemId" className="block font-bold mb-2">
                System ID
              </label>
              <input
                type="text"
                id="systemId"
                name="systemId"
                value={formData.systemId}
                onChange={handleChange}
                className="w-full px-3 py-2 border focus:outline-none border-gray-300 rounded"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="photo" className="block font-bold mb-2">
                Photo
              </label>
              <input
                type="file"
                id="photo"
                name="photo"
                accept="image/*"
                onChange={handlePhotoChange}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default Profile;
