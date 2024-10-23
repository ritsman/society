import mongoose from "mongoose";

export const bankSchemas = new mongoose.Schema({
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

// export const BankReceipt = mongoose.model("BankReceipt", bankSchemas);

export const cashSchemas = new mongoose.Schema({
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
  interest1: {
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

// export const CashReceipt = mongoose.model("CashReceipt", cashSchemas);


export const receiptSchema = new mongoose.Schema({

  memberId : String,
  memberName : String,
  payments : Array
  
})