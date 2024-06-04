import mongoose from "mongoose";

const mySchema = new mongoose.Schema(
  {
    seqNo: String,
    ownerName: String,
    unitNo: String,
    principle: String,
    interest: String,
    total: String,
  },
  {
    timestams: true,
  }
);

const OpeningBalance = mongoose.model("OpeningBalance", mySchema);

export default OpeningBalance;
