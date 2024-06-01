import BillHeads from "../Models/BillHeads.model.js";

export const postBillHeads = async (req, res) => {
  console.log("insdie post bill Heads");

  try {
    req.body.map(async (item) => {
      const { billHead, under } = item;

      let update = {
        GhCode: item.GhCode,
        billHead: item.billHead,
        cgst: item.cgst,
        igst: item.igst,
        interestApplied: item.interestApplied,
        sequenceNo: item.sequenceNo,
        sgst: item.sgst,
        under: item.under,
      };
      await BillHeads.findOneAndUpdate({ billHead, under }, update, {
        upsert: true,
        new: true,
      });
    });
    res.send("successfully data stored");
  } catch (error) {}
};
