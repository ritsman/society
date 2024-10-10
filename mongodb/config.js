// import mongoose from "mongoose";

// mongoose.connect("mongodb://0.0.0.0:27017/society");

// const db = mongoose.connection;

// db.on("error", console.error.bind(console, "error connecting to db"));

// db.once("open", function () {
//   console.log("successfully connected to the database");
// });

// export default db;




import mongoose from "mongoose";
import { SocietySchema } from "../Models/Society/SocProfile.model.js";
import { BillHeadSchema } from "../Models/BillHeads.model.js";
import { billSchema } from "../Models/Bills.models.js";
import { billMasterSchema } from "../Models/BillMaster.model.js";
import { generateBillSchema } from "../Models/Bills.models.js";
import { GroupSchema } from "../Models/Group.models.js";
import { partyLedgerSchema } from "../Models/Ledger.models.js";
import { accountLedger } from "../Models/Ledger.models.js";
import { CashAccountLedger } from "../Models/Ledger.models.js";
import { BankAccountLedger } from "../Models/Ledger.models.js";
import { HeadSchema } from "../Models/MasterHead.models.js";
import { LedgerSchema } from "../Models/MemberProfile.model.js";
import { profileSchema } from "../Models/MemberProfile.model.js";
import { mySchema } from "../Models/MemberProfile.model.js";
import { mySchemas } from "../Models/OpeningBalance.model.js";
import { bankSchema } from "../Models/Payment.model.js";
import { cashSchema } from "../Models/Payment.model.js";
import { bankSchemas } from "../Models/Receipt.model.js";
import { cashSchemas } from "../Models/Receipt.model.js";
import { transactionSchema } from "../Models/PayTransaction.model.js";

// Function to create a connection to a new society database
export const createSocietyDbConnection = (dbURI,name) => {
  // const dbURI = `mongodb://0.0.0.0:27017/society_${societyId}`;

  // Create a new connection for each society
  const societyDbConnection = mongoose.createConnection(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Handle error and success events
  societyDbConnection.on(
    "error",
    console.error.bind(console, "Error connecting to society DB")
  );

  societyDbConnection.once("open", function () {
    console.log(`Successfully connected to the ${name} database`);
  });

    let SocProfile = societyDbConnection.model(
      "Society_profile",
      SocietySchema
    );

   let BillHeads = societyDbConnection.model("Bill-Heads", BillHeadSchema);

   let BillMaster = societyDbConnection.model(
        "Bill-Master",
        billMasterSchema
      );

    let Bills = societyDbConnection.model("bills", billSchema);

    let billGenerate = societyDbConnection.model(
          "billGenerate",
          generateBillSchema
        );

    let groups = societyDbConnection.model("Groups", GroupSchema);

           

    let PartyLedger = societyDbConnection.model(
                "Ledger",
                partyLedgerSchema
              );

    let AccLedger = societyDbConnection.model(
                  "AccLedger",
                  accountLedger
                );

    let CashAccLedger = societyDbConnection.model(
      "CashAccLedger",
      CashAccountLedger
    );

    let BankAccLedger = societyDbConnection.model(
      "BankAccLedger",
      BankAccountLedger
    );

    let MasterHead = societyDbConnection.model("masterHead", HeadSchema);

    let MemberLedger = societyDbConnection.model("memberLedger", LedgerSchema);

    let profile = societyDbConnection.model("MemberProfile", profileSchema);

    let OpeningMember = societyDbConnection.model("OpeningMember", mySchema);

    let OpeningBalance = societyDbConnection.model("OpeningBalance", mySchemas);

    let BankPayment = societyDbConnection.model("BankPayment", bankSchema);

    let CashPayment = societyDbConnection.model("CashPayment", cashSchema);


    let BankReceipt = societyDbConnection.model("BankReceipt", bankSchemas);


    let CashReceipt = societyDbConnection.model("CashReceipt", cashSchemas);

    let PayTransaction = societyDbConnection.model("paymentTransaction", transactionSchema);



  return {
    SocProfile,
    BillHeads,
    BillMaster,
    Bills,
    billGenerate,
    groups,
    PartyLedger,
    AccLedger,
    CashAccLedger,
    BankAccLedger,
    MasterHead,
    MemberLedger,
    profile,
    OpeningMember,
    OpeningBalance,
    BankPayment,
    CashPayment,
    BankReceipt,
    CashReceipt,
    PayTransaction,
  };
};

// Default connection (e.g., for app-wide configs, logging, etc.)
mongoose.connect("mongodb://0.0.0.0:27017/society", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const mainDb = mongoose.connection;

mainDb.on("error", console.error.bind(console, "Error connecting to main DB"));

mainDb.once("open", function () {
  console.log("Successfully connected to the main database");
});

export default mainDb;

