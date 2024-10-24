// import { BankReceipt, CashReceipt } from "../Models/Receipt.model.js";
import { BankReceipt, OpeningBalance,PaymentCollection } from "./User.controller.js";
import { CashReceipt } from "./User.controller.js";

// import OpeningBalance from "../Models/OpeningBalance.model.js";
// import { BankPayment, CashPayment } from "../Models/Payment.model.js";
import { BankPayment } from "./User.controller.js";
import { CashPayment } from "./User.controller.js";
import { BillCollection } from "./User.controller.js";


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

import { billGenerate } from "./User.controller.js";

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
      console.log("newBalance:",newBalance,"new Interest:",newInterest,"remainingAmt:",remainingAmount)

      const obj = {
        date: date , // Assuming you want to set the current date if date is null
        amount: amountNumber, // Use the numeric amount
        mode: mode,
        OnBillAmt: balance,
        chequeNo: chequeNo,
        chequeDate: chequeDate,
        bank: bank,
        branch: branch,
        interest: newInterest.toFixed(2),
        interest1 : Number(interest).toFixed(2),
        intAfterPaid: newInterest,
        billNo: billNo,
        billDate: billDate,
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

      //bill due update 

      const bill = await billGenerate.findOne({ memberId });

      if (bill && bill.billDetails && bill.billDetails.length > 0) {
        // Get the last billDetails object
        const lastBillDetailIndex = bill.billDetails.length - 1;

        // Update the outstandingBal of the last billDetails object
        console.log(bill.billDetails[lastBillDetailIndex].outstandingBal,"outstanding balance");
        bill.billDetails[lastBillDetailIndex].outstandingBal -= remainingAmount;
        bill.billDetails[lastBillDetailIndex].interest = newInterest.toFixed(2);

                console.log(
                  bill.billDetails[lastBillDetailIndex].outstandingBal,
                  "outstanding balance"
                );

          bill.markModified("billDetails");
        // Save the updated billGenerate document
        await bill.save();
        console.log("Updated billDetails with new outstanding balance.");
      }
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
      const { flatNo, name ,intRate} = item;
        let openPint  = (Number(item.principal) * (Number(intRate)/100)).toFixed(2);

          let memberBill = await BillCollection.findOne({memberId : item.id})


        if (memberBill) {
          let interestUpdated = false; // Track if we updated any interest1

          // Update interest1 if it exists
          memberBill.charges.forEach((ele) => {
            if (ele.interest1) {
              ele.interest1 = openPint;
              interestUpdated = true; // Flag that we updated interest1
            }
          });

          // If we updated, mark the array as modified and save
          if (interestUpdated) {
            memberBill.markModified("charges"); // Mark 'charges' as modified
            await memberBill.save(); // Save the updated document
            console.log("Updated interest1 in memberBill");
          } else {
            console.log("No interest1 field found in charges");
          }
        }

      const update = {
        name: item.name,
        date:item.date,
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


// Receipt new Controller 
export const postPaymentCollection = async (req, res) => {
  const { memberId, memberName, ...payments } = req.body;

  let newPayment = {
    ...payments,
  };

  try {
    // Check if member already exists
    let existingMember = await PaymentCollection.findOne({ memberId });

    if (existingMember) {
      // Push new payment into the payments array
      existingMember.payments.push(newPayment);

      // Sort payments by date in ascending order
      existingMember.payments.sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );

      // Save the updated document
      await existingMember.save();

      return res
        .status(200)
        .json({
          message: "Payment added and sorted successfully",
          existingMember,
        });
    } else {
      // Create a new member with the payment
      let newMember = new PaymentCollection({
        memberId,
        memberName,
        payments: [newPayment],
      });

      // Save the new document
      await newMember.save();

      return res
        .status(201)
        .json({ message: "New member added with payment", newMember });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};



export const getPaymentCollection = async (req, res) => {
  try {
    // Get the date from the request body (or query parameter)
    const { filterDate } = req.query; // or use req.query for query params
     console.log(filterDate,"filterDate")
    const filterDateObject = new Date(filterDate);

    if (!filterDateObject) {
      return res.status(400).json({ error: "Invalid date provided" });
    }

    // Fetch all payments
    const payments = await PaymentCollection.find();

    // Array to store summed totals for each member
    const membersTotals = [];

    // Loop through each member's payments
    payments.forEach((paymentDoc) => {
      // Initialize the sums for the fields for each member
      let totalInterestPaid = 0;
      let totalOpeningIntPaid = 0;
      let totalCurrentChargesPaid = 0;
      let totalOpeningBalPaid = 0;
      let totalAmountPaid = 0;

      paymentDoc.payments.forEach((payment) => {
        const paymentDate = new Date(payment.date);

        // Check if payment date is less than the filter date
        if (paymentDate < filterDateObject) {
          totalInterestPaid += payment.interstPaid;
          totalOpeningIntPaid += payment.openingIntPaid;
          totalCurrentChargesPaid += payment.currentChargesPaid;
          totalOpeningBalPaid += payment.openingBalPaid;
          totalAmountPaid += payment.totalAmountPaid;
        }
      });

      // Push the summed totals for this member into the array
      membersTotals.push({
        memberId: paymentDoc.memberId,
        memberName: paymentDoc.memberName,
        totals: {
          totalInterestPaid,
          totalOpeningIntPaid,
          totalCurrentChargesPaid,
          totalOpeningBalPaid,
          totalAmountPaid,
        },
      });
    });

    // Send the array of member totals as the response
    res.status(200).json({
      message: "Payments filtered and summed successfully",
      members: membersTotals,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to filter payments", details: error.message });
  }
};

export const getAllPaymentCollection = async (req,res)=>{
  try {
    const payments = await PaymentCollection.find();

     res.status(200).json({
       message: "Payments filtered and summed successfully",
       payments: payments,
     });
     
  } catch (error) {
     res
       .status(500)
       .json({ error: "Failed to filter payments", details: error.message });
  }
}


//end