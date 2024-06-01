import BillMaster from "../Models/BillMaster.model.js";

export const postBillMaster = async (req, res) => {
  console.log("inside postBillMaster controller");
  const { code, name } = req.body;
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
    await BillMaster.findOneAndUpdate({ code, name }, update, {
      upsert: true,
      new: true,
    });
    res.send("successfully data stored");
  } catch (error) {
    res.send(error);
    console.error("Error updating or creating Bill Master:", error);
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
