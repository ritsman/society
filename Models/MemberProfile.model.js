import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    permanentAddress: String,
    registeredMobileNo: String,
    alternateMobileNo: String,
    flatNo: String,
    wingNo: String,
    area: String,
    societyNocStatus: String,
    occupancy: String,
    maintenance_amt: String,
    noc: String,
    arrears: String,
    rate: String,
    vehicleDetails: String,
    memberSince: String,
    systemId: String,
    photo: Buffer,
    societyShareCertificate: Buffer,
  },
  {
    timestams: true,
  }
);

const profile = mongoose.model("MemberProfile", profileSchema);

export default profile;
