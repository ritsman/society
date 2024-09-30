import mongoose from "mongoose";

export const partyLedgerSchema = new mongoose.Schema(
  {
    data: {
      type: Object,
    },
  },
  {
    timestams: true,
  }
);

// const PartyLedger = mongoose.model("Ledger", partyLedgerSchema);

// export default PartyLedger;

export const accountLedger = new mongoose.Schema(
  {
    name: String,
    shortName: String,
    accountType: String,
    narration: String,
  },
  {
    timestams: true,
  }
);

// export const AccLedger = mongoose.model("AccLedger", accountLedger);

export const CashAccountLedger = new mongoose.Schema(
  {
    tranId: String,
    date: String,
    ref: String,
    billAmt: Number,
    paidAmt: Number,
    Balance: Number,
    mode: {
      type: String,
      default: "Cash",
    },
  },
  {
    timestams: true,
  }
);

// export const CashAccLedger = mongoose.model("CashAccLedger", CashAccountLedger);

export const BankAccountLedger = new mongoose.Schema(
  {
    tranId: String,
    date: String,
    ref: String,
    billAmt: Number,
    paidAmt: Number,
    Balance: Number,
    mode: {
      type: String,
      default: "Bank",
    },
  },
  {
    timestams: true,
  }
);

// export const BankAccLedger = mongoose.model("BankAccLedger", BankAccountLedger);
