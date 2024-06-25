import mongoose from "mongoose";

const ledgerEntrySchema = new mongoose.Schema({
  tranId: {
    type: String,
    unique: true,
    required: true,
  },
  payMode: String,
  date: String,
  billNo: String,
  dueDate: String,
  head: Array,
  totalAmtDue: String,
  billAmt: String,
  paidAmt: String,
  balance: String,
});

const LedgerSchema = new mongoose.Schema({
  memberId: {
    type: String,
  },
  ledger: {
    type: [ledgerEntrySchema],
    default: [],
  },
});

export const MemberLedger = mongoose.model("memberLedger", LedgerSchema);

const profileSchema = new mongoose.Schema(
  {
    name: String,

    head: Array,
    permanentAddress: String,
    registeredMobileNo: String,
    alternateMobileNo: String,
    email: String,
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

const mySchema = new mongoose.Schema(
  {
    data: Object,
  },
  {
    timestams: true,
  }
);

export const OpeningMember = mongoose.model("OpeningMember", mySchema);

export default profile;
