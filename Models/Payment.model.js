import mongoose from "mongoose";

const bankSchema = new mongoose.Schema({
  amount: {
    type: String,
  },
  balance: {
    type: String,
  },
  code: {
    type: String,
  },
  date: {
    type: String,
  },
  bank: {
    type: String,
  },
  branch: {
    type: String,
  },
  chequeNo: {
    type: String,
  },
  chequeDate: {
    type: String,
  },

  unitNo: {
    type: String,
  },
  narration: {
    type: String,
  },
  micr: {
    type: String,
  },
});

export const BankPayment = mongoose.model("BankPayment", bankSchema);

const cashSchema = new mongoose.Schema({
  amount: {
    type: String,
  },
  balance: {
    type: String,
  },
  code: {
    type: String,
  },
  date: {
    type: String,
  },

  unitNo: {
    type: String,
  },

  narration: {
    type: String,
  },
});

export const CashPayment = mongoose.model("CashPayment", cashSchema);
