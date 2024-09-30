import mongoose from "mongoose";

export const mySchemas = new mongoose.Schema(
  {
    name: String,
    id :String,
    mobileNo: String,
    email: String,
    address: String,
    flatNo: String,
    wingNo: String,
    principal:String,
    interest:String,
    total:String
  },
  {
    timestams: true,
  }
);

// const OpeningBalance = mongoose.model("OpeningBalance", mySchemas);

// export default OpeningBalance;
