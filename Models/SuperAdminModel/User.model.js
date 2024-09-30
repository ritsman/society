import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  
  user: String,
  password: String,
  role :String
 
});

const AdminUser = mongoose.model("AdminUser", userSchema);

export default AdminUser;



const societySchema = new mongoose.Schema({
  name: String,
  societyId: { type: String, unique: true }, // Unique Society ID
  password: String, // Hashed password
  dbConnection: String,
});

export const Society = mongoose.model("societyDetails" , societySchema)
