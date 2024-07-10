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
  interest: {
    type: String,
  },
  interestBalance: {
    type: String,
  },
  name: {
    type: String,
  },
  chequeNo: {
    type: String,
  },
  chqDate: {
    type: String,
  },
  narration: {
    type: String,
  },
  principle: {
    type: String,
  },
  micr: {
    type: String,
  },
  bank: {
    type: String,
  },
  branch: {
    type: String,
  },
  principleBalance: {
    type: String,
  },
});

export const BankReceipt = mongoose.model("BankReceipt", bankSchema);

const cashSchema = new mongoose.Schema({
  paid: {
    type: Array,
  },
  memberId: {
    type: String,
  },
  balance: {
    type: String,
  },
  mode: {
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
  code: {
    type: String,
  },
  date: {
    type: String,
  },
  interest: {
    type: String,
  },

  name: {
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

  narration: {
    type: String,
  },
  principle: {
    type: String,
  },
});

export const CashReceipt = mongoose.model("CashReceipt", cashSchema);
