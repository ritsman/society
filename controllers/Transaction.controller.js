import { BankReceipt, CashReceipt } from "../Models/Receipt.model.js";
import OpeningBalance from "../Models/OpeningBalance.model.js";
import { BankPayment, CashPayment } from "../Models/Payment.model.js";

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

export const postCashPayment = async (req, res) => {
  console.log("inside post cash payment controller");
  try {
    req.body.map(async (item) => {
      const { unitNo, code } = item;
      const update = {
        amount: item.amount,
        balance: item.balance,
        code: item.code,
        date: item.date,
        unitNo: item.unitNo,
        narration: item.narration,
      };
      await CashPayment.findOneAndUpdate({ unitNo, code }, update, {
        upsert: true,
        new: true,
      });
    });

    res.send("successfully saved data");
  } catch (error) {
    res.send(error);
    console.log(error);
  }
};

export const getCashPayment = async (req, res) => {
  console.log("inside get cash payment");
  try {
    let result = await CashPayment.find({});
    res.send(result);
  } catch (error) {
    res.send(error);
    console.log(error);
  }
};

export const postBankPayment = async (req, res) => {
  console.log("inside post bank payment controller");
  try {
    req.body.map(async (item) => {
      const { unitNo, code } = item;
      const update = {
        amount: item.amount,
        balance: item.balance,
        code: item.code,
        date: item.date,
        bank: item.bank,
        branch: item.branch,
        chequeNo: item.checqueNo,
        chequeDate: item.chequeDate,
        unitNo: item.unitNo,
        narration: item.narration,
        micr: item.micr,
      };
      await BankPayment.findOneAndUpdate({ unitNo, code }, update, {
        upsert: true,
        new: true,
      });
    });

    res.send("successfully saved data");
  } catch (error) {
    res.send(error);
    console.log(error);
  }
};

export const getBankPayment = async (req, res) => {
  console.log("inside get Bank payment");
  try {
    let result = await BankPayment.find({});
    res.send(result);
  } catch (error) {
    res.send(error);
    console.log(error);
  }
};
