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

const unitHeadSchema = new mongoose.Schema(
  {
    unitHead: { type: String, required: true },
    code: { type: String, required: true },
  },
  { strict: false }
);

export const UnitHead = mongoose.model("UnitHead", unitHeadSchema);

export default MasterHead;
