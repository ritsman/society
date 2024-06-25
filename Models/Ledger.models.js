import mongoose from "mongoose";

const partyLedgerSchema = new mongoose.Schema(
  {
    data: {
      type: Object,
    },
  },
  {
    timestams: true,
  }
);

const PartyLedger = mongoose.model("Ledger", partyLedgerSchema);

export default PartyLedger;

const accountLedger = new mongoose.Schema(
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

export const AccLedger = mongoose.model("AccLedger", accountLedger);
