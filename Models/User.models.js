import mongoose from "mongoose";

export const userSchema = new mongoose.Schema({
  name: String,
  user: String,
  societyName: String,
  societyId: String,
  password: String,
  dbConnection: String,
  status: String,
  role: String,
  resetPasswordToken: String,
  resetPasswordExpires: String,
});

const User = mongoose.model("Users", userSchema);

export default User;

