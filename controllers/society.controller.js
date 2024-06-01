import Bills from "../Models/Bills.models.js";

export const generateBills = async (req, res) => {
  console.log("Reached inside generateBills controllers", req.body);

  try {
    req.body.map(async (item) => {
      const { wingNo, flatNo } = item;

      // Check if a bill with the same wingNo and flatNo exists
      let existingBill = await Bills.findOne({
        "data.wingNo": wingNo,
        "data.flatNo": flatNo,
      });

      if (existingBill) {
        // If it exists, update the existing bill
        existingBill.data = item;
        await existingBill.save();
      } else {
        // If it does not exist, create a new bill
        let newBill = new Bills({
          data: item,
        });
        await newBill.save();
      }
    });
    res.send("Successfully saved  data to database");
  } catch (error) {
    console.error("Error in generateBills:", error);
    res.status(500).send(error);
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
