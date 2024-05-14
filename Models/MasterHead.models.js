import mongoose from "mongoose";

const HeadSchema = new mongoose.Schema(
  {
    Header: {
      type: String,
    },
    Under: {
      type: String,
    },
  },
  {
    timestams: true,
  }
);

const MasterHead = mongoose.model("masterHead", HeadSchema);

export default MasterHead;
