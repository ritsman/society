import MasterHead from "../Models/MasterHead.models.js";
import Ledger from "../Models/Ledger.models.js";

export const postMHead = async (req, res) => {
  console.log("reached inside master head", req.body);

  try {
    const result = new MasterHead({
      Header: req.body.headers,
      Under: req.body.under,
    });
    result.save();
    res.send("successfully sent to database");
  } catch (error) {
    res.send("error in sending data to database");
  }
};

export const getHead = async (req, res) => {
  try {
    let result = await MasterHead.find({});
    let arr = [];
    result.map((item) => arr.push(item.Header));
    res.send(arr);
  } catch (error) {
    res.send("error in getting heads");
  }
};

export const postLedger = async (req, res) => {
  console.log("postLedger controller reached", req.body);

  try {
    let result = new Ledger({
      data: req.body,
    });
    result.save();
    res.send("successfully sent data to database");
  } catch (error) {
    res.send(error);
  }
};
