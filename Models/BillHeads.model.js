import mongoose from "mongoose";

const BillHeadSchema = new mongoose.Schema(
  {
    GhCode: {
      type: String,
    },
    billHead: {
      type: String,
    },
    under: {
      type: String,
    },
    sequenceNo: {
      type: String,
    },
    interestApplied: {
      type: Boolean,
      default: false,
    },
    cgst: {
      type: String,
    },
    sgst: {
      type: String,
    },
    igst: {
      type: String,
    },
  },
  {
    timestams: true,
  }
);

const BillHeads = mongoose.model("Bill-Heads", BillHeadSchema);

export default BillHeads;