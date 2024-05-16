import mongoose from "mongoose";

const billSchema = new mongoose.Schema(
  {
    Particular: {
      type: String,
    },
    Amount: {
      type: String,
    },
    Rate: {
      type: String,
    },
    From: {
      type: String,
    },
    To: {
      type: String,
    },
    DueDate: {
      type: String,
    },
  },
  {
    timestams: true,
  }
);

const Bills = mongoose.model("bills", billSchema);

export default Bills;
