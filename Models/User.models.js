import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  user: String,
  password: String,
  status:String,
  role:String,
  resetPasswordToken: String,
  resetPasswordExpires: String,
});

const User = mongoose.model("Users", userSchema);

export default User;
