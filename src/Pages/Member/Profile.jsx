import React, { useState } from "react";

const Profile = () => {
  const [formData, setFormData] = useState({
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
    societyShareCertificate: "",
    memberSince: "",
    societyAddress: "",
    systemId: "",
    photo: null,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, photo: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(formData);
  };

  return (
    <div className="md:py-24 h-screen overflow-y-auto  gap-6">
      <h1 className="text-center text-2xl mb-5">MEMBER PROFILE</h1>

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
            <label htmlFor="alternateMobileNo" className="block font-bold mb-2">
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
            <label htmlFor="permanentAddress" className="block font-bold mb-2">
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
            <label htmlFor="societyNocStatus" className="block font-bold mb-2">
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

          <div className="col-span-2">
            <h2 className="text-xl font-bold mb-4">Vehicle Details</h2>
          </div>

          <div className="col-span-2 mb-4">
            <label
              htmlFor="societyShareCertificate"
              className="block font-bold mb-2"
            >
              Society Share Certificate
            </label>
            <input
              type="text"
              id="societyShareCertificate"
              name="societyShareCertificate"
              value={formData.societyShareCertificate}
              onChange={handleChange}
              className="w-full px-3 py-2 focus:outline-none border border-gray-300 rounded"
            />
          </div>

          <div className="col-span-2 mb-4">
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

          <div className="col-span-2 mb-4">
            <label htmlFor="societyAddress" className="block font-bold mb-2">
              Society Arrears
            </label>
            <textarea
              id="societyAddress"
              name="societyAddress"
              value={formData.societyAddress}
              onChange={handleChange}
              className="w-full px-3 py-2 border focus:outline-none border-gray-300 rounded"
            ></textarea>
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
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default Profile;
