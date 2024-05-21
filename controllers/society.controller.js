import Bills from "../Models/Bills.models.js";

export const generateBills = async (req, res) => {
  console.log("reached inside gerenateBills controllers", req.body);
  try {
    req.body.map((item) => {
      let result = new Bills({
        Particular: item.particulars[0],
        Amount: item.amnt.value,
        Rate: item.rate.value,
        From: item.dateFieldValues.fromDate,
        To: item.dateFieldValues.toDate,
        DueDate: item.dateFieldValues.dueDate,
        BillNo: item.BillNo,
      });
      result.save();
    });
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
