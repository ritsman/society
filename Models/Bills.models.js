import mongoose from "mongoose";

const billSchema = new mongoose.Schema(
  {
    data: {
      type: Object,
    },
  },
  {
    timestams: true,
  }
);

const Bills = mongoose.model("bills", billSchema);

export default Bills;

const generateBillSchema = new mongoose.Schema(
  {
    memberId: String,
    memberName: String,
    billDetails: Array,
  },
  {
    timestams: true,
  }
);

export const billGenerate = mongoose.model("billGenerate", generateBillSchema);
