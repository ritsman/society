import mongoose from "mongoose";

export const billMasterSchema = new mongoose.Schema(
  {
    type: { type: String, default: "maintenance bill" },
    code: { type: String },
    name: { type: String },
    billFrequency: { type: String },
    billDate: { type: String },
    billDueDays: { type: String },
    interestRatePerMonth: { type: String },
    interestCalculationMethod: { type: String },
    isFlatInterest: { type: Boolean, default: true },
    flatInterestAmount: { type: String },
    interestRebateUptoRs: { type: String },
  },
  {
    timestams: true,
  }
);

// const BillMaster = mongoose.model("Bill-Master", billMasterSchema);

// export default BillMaster;
