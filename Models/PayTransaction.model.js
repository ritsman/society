import mongoose
 from "mongoose";
export const transactionSchema = new mongoose.Schema({
  txnid: String,
  mihpayid: String,
  amount: String,
  productinfo: String,
  firstname: String,
  email: String,
  status: String,
  hash: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
