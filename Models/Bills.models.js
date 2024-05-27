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
