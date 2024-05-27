import Bills from "../Models/Bills.models.js";

export const generateBills = async (req, res) => {
  console.log("reached inside gerenateBills controllers", req.body);
  try {
    let result = new Bills({
      data: req.body,
    });
    await result.save();

    res.send("successfully sent data to database");
  } catch (error) {
    res.send(error);
  }
};

export const getBill = async (req, res) => {
  try {
    let result = await Bills.find({});
    res.send(result);
  } catch (error) {
    res.send("error in getting bills");
  }
};

export const getBillno = async (req, res) => {
  try {
    let result = await Bills.find({});
    let arr = [];
    result.map((item) => {
      arr.push(item.BillNo);
    });
    res.send(arr);
  } catch (error) {}
};
