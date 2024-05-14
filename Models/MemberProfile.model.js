import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    data: {
      type: Object,
    },
    photo: {
      type: Buffer,
    },
  },
  {
    timestams: true,
  }
);

const profile = mongoose.model("MemberProfile", profileSchema);

export default profile;
