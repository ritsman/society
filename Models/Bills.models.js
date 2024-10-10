import mongoose from "mongoose";

export const billSchema = new mongoose.Schema(
  { 
    
    data: {
      type: Object,
    },
  },
  {
    timestams: true,
  }
);

// const Bills = mongoose.model("bills", billSchema);

// export default Bills;

export const generateBillSchema = new mongoose.Schema(
  {
    memberId: String,
    memberName: String,
    prevDue:String,
    billDetails: Array,
  },
  {
    timestams: true,
  }
);

// export const billGenerate = mongoose.model("billGenerate", generateBillSchema);
