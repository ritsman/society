import mongoose from "mongoose";

export const GroupSchema = new mongoose.Schema(
  {
    group: {
      type: String,
    },
  },
  {
    timestams: true,
  }
);

const groupList = mongoose.model("groupList", GroupSchema);

export default groupList;
