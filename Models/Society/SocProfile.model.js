// models/Society.js
import mongoose from "mongoose";

const SocietySchema = new mongoose.Schema({
  societyName: {
    type: String,
    required: true,
  },
  registrationNumber: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  pincode: {
    type: String,
    required: true,
  },
  chairman: {
    type: String,
    required: true,
  },
  secretary: {
    type: String,
    required: true,
  },
  treasurer: {
    type: String,
    required: true,
  },
});

const SocProfile =  mongoose.model("Society_profile", SocietySchema);

export default SocProfile;
