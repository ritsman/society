// import BillMaster from "../Models/BillMaster.model.js";
import { BillMaster } from "./User.controller.js";

export const postBillMaster = async (req, res) => {
  console.log("Inside postBillMaster controller");

  const { code, name } = req.body; // Extracting code and name from the request body

  const update = {
    type: req.body.type,
    code: req.body.code,
    name: req.body.name,
    billFrequency: req.body.billFrequency,
    billDate: req.body.billDate,
    billDueDays: req.body.billDueDays,
    interestRatePerMonth: req.body.interestRatePerMonth,
    interestCalculationMethod: req.body.interestCalculationMethod,
    isFlatInterest: req.body.isFlatInterest,
    flatInterestAmount: req.body.flatInterestAmount,
    interestRebateUptoRs: req.body.interestRebateUptoRs,
  };

  try {
    // Update the document if it exists, or insert it if it doesn't
    const billMaster = await BillMaster.findOneAndUpdate(
      { code, name }, // Query filter for finding a matching document
      update, // Fields to update
      { upsert: true, new: true } // Options: upsert = true to create if not found, new = true to return the updated document
    );

    res.status(200).send("Successfully stored or updated Bill Master data");
  } catch (error) {
    console.error("Error updating or creating Bill Master:", error);
    res.status(500).send("Error saving Bill Master");
  }
};


export const getBillMaster = async (req, res) => {
  try {
    let result = await BillMaster.find({});
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
    console.log(error);
  }
};
