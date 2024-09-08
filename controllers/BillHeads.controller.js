import BillHeads from "../Models/BillHeads.model.js";

export const postBillHeads = async (req, res) => {
  console.log("insdie post bill Heads",req.body);

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
        isActive :item.isActive
      };
      await BillHeads.findOneAndUpdate({ billHead, under }, update, {
        upsert: true,
        new: true,
      });
    });
    res.send("successfully data stored");
  } catch (error) {
    res.send(error)
    console.log(error)
  }
};


export const getBillHeads = async (req,res)=>{
  try {
    const response = await BillHeads.find();
    res.send(response)
  } catch (error) {
    res.send(error)
    console.log(error);
  }
}