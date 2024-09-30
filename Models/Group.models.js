import mongoose from "mongoose";

export const GroupSchema = new mongoose.Schema(
  {
    GroupName: {
      type: String,
    },
    Under: {
      type: String,
    },
    Code: {
      type: String,
    },
  },
  {
    timestams: true,
  }
);

// const groups = mongoose.model("Groups", GroupSchema);

// export default groups;
