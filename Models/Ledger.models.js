import mongoose from "mongoose";

const LedgerSchema = new mongoose.Schema(
  {
    data: {
      type: Object,
    },
  },
  {
    timestams: true,
  }
);

const Ledger = mongoose.model("Ledger", LedgerSchema);

export default Ledger;
