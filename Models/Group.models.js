import mongoose from "mongoose";

const GroupSchema = new mongoose.Schema(
  {
    GroupName: {
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

const groups = mongoose.model("Groups", GroupSchema);

export default groups;
