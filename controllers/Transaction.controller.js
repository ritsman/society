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

// export const postCashReceipt = async (req, res) => {
//   console.log("inside postReceipt controller");
//   try {
//     req.body.map(async (item) => {
//       const { code, name } = item;
//       const update = {
//         amount: item.amount,
//         balance: item.balance,
//         code: item.code,
//         date: item.date,
//         interest: item.interest,

//         interestBalance: item.interestBalance,
//         name: item.name,
//         narration: item.narration,
//         principle: item.principle,
//         principleBalance: item.principleBalance,
//       };
//       await CashReceipt.findOneAndUpdate({ code, name }, update, {
//         upsert: true,
//         new: true,
//       });
//     });

//     res.send("successfully saved data");
//   } catch (error) {
//     res.send(error);
//   }
// };
export const postCashReceipt = async (req, res) => {
  console.log("inside postReceipt controller");

  // Log the entire request body
  console.log("Request Body:", req.body);

  try {
    for (const item of req.body) {
      const {
        code,
        name,
        date,
        amount,
        balance,
        interest,
        mode,
        narration,
        principle,
        chequeNo,
        memberId,
        billNo,
        chequeDate,
        billDate,
        
        bank,
        branch,
      } = item;

      // Convert amount to a number and log it
      const amountNumber = Number(amount);
      console.log("Amount:", amountNumber);

      // Check if amount is zero
      if (amountNumber === 0) {
        console.log("Skipping item with zero amount");
        continue;
      }


      let remainingAmount = amountNumber;
      let newInterest = Number(interest);
      let newBalance = Number(balance);

      // Subtract from interest first
      if (remainingAmount <= newInterest) {
        newInterest -= remainingAmount;
        remainingAmount = 0;
      } else {
        remainingAmount -= newInterest;
        newInterest = 0;
      }

      // Subtract the remaining amount from balance
      newBalance -= remainingAmount;

      const obj = {
        date: date || new Date(), // Assuming you want to set the current date if date is null
        amount: amountNumber, // Use the numeric amount
        mode: mode,
        OnBillAmt:balance,
        chequeNo: chequeNo,
        chequeDate: chequeDate,
        bank: bank,
        branch: branch,
        interest:interest,
        intAfterPaid : newInterest,
        billNo:billNo,
        billDate:billDate
      };

      const update = {
        $set: {
          code: code,
          name: name,
          balance: newBalance,
          memberId: memberId,
          narration: narration,
          principle: principle,
        },
        $push: {
          paid: obj,
        },
      };

      await CashReceipt.findOneAndUpdate({ code, name }, update, {
        upsert: true,
        new: true,
      });
    }

    res.send("Successfully saved data");
  } catch (error) {
    res.status(500).send(error);
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
      const { flatNo, name } = item;
      const update = {
        name: item.name,
        id:item.id,
        mobileNo: item.mobileNo,
        email: item.email,
        address: item.address,
        flatNo: item.flatNo,
        wingNo: item.wingNo,
        principal: item.principal,
        interest: item.interest,
        total: item.total,
      };
      await OpeningBalance.findOneAndUpdate({ flatNo, name }, update, {
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
