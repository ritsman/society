import { BankReceipt, CashReceipt } from "../Models/Receipt.model.js";
import OpeningBalance from "../Models/OpeningBalance.model.js";

// Bank controller

export const postBankReceipt = async (req, res) => {
  console.log("inside postReceipt controller");
  try {
    req.body.map(async (item) => {
      const { code, name } = item;
      const update = {
        amount: item.amount,
        balance: item.balance,
        code: item.code,
        date: item.date,
        interest: item.interest,
        chequeNo: item.chequeNo,
        chqDate: item.chqDate,
        interestBalance: item.interestBalance,
        name: item.name,
        narration: item.narration,
        principle: item.principle,
        principleBalance: item.principleBalance,
        micr: item.micr,
        bank: item.bank,
        branch: item.branch,
      };
      await BankReceipt.findOneAndUpdate({ code, name }, update, {
        upsert: true,
        new: true,
      });
    });

    res.send("successfully saved data");
  } catch (error) {
    res.send(error);
  }
};

export const getBankReceipt = async (req, res) => {
  console.log("inside get Receipt");
  try {
    let result = await BankReceipt.find({});
    res.send(result);
  } catch (error) {
    res.send(error);
    console.log(error);
  }
};

// cash controller

export const postCashReceipt = async (req, res) => {
  console.log("inside postReceipt controller");
  try {
    req.body.map(async (item) => {
      const { code, name } = item;
      const update = {
        amount: item.amount,
        balance: item.balance,
        code: item.code,
        date: item.date,
        interest: item.interest,

        interestBalance: item.interestBalance,
        name: item.name,
        narration: item.narration,
        principle: item.principle,
        principleBalance: item.principleBalance,
      };
      await CashReceipt.findOneAndUpdate({ code, name }, update, {
        upsert: true,
        new: true,
      });
    });

    res.send("successfully saved data");
  } catch (error) {
    res.send(error);
  }
};

export const getCashReceipt = async (req, res) => {
  console.log("inside get Receipt");
  try {
    let result = await CashReceipt.find({});
    res.send(result);
  } catch (error) {
    res.send(error);
    console.log(error);
  }
};

export const postOpeningBalance = async (req, res) => {
  console.log("inside post Opening Balance controller");
  try {
    req.body.map(async (item) => {
      const { unitNo, ownerName } = item;
      const update = {
        seqNo: item.seqNo,
        ownerName: item.ownerName,
        unitNo: item.unitNo,
        principle: item.principle,
        interest: item.interest,
        total: item.total,
      };
      await OpeningBalance.findOneAndUpdate({ unitNo, ownerName }, update, {
        upsert: true,
        new: true,
      });
    });

    res.send("successfully saved data");
  } catch (error) {
    res.send(error);
  }
};

export const getOpeningBalance = async (req, res) => {
  console.log("inside opening Balance");
  try {
    let result = await OpeningBalance.find({});
    res.send(result);
  } catch (error) {
    res.send(error);
    console.log(error);
  }
};
