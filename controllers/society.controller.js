import Bills from "../Models/Bills.models.js";
import SocProfile from "../Models/Society/SocProfile.model.js";

import { billGenerate } from "../Models/Bills.models.js";

// start of society profile
export const postSocProfile = async (req, res) => {
  try {
    const { registrationNumber } = req.body;

    // Check if a society profile already exists
    let existingSociety = await SocProfile.findOne();

    if (existingSociety) {
      // Update the existing society profile
      existingSociety = await SocProfile.findOneAndUpdate(
        { _id: existingSociety._id },
        req.body,
        { new: true } // Return the updated document
      );
      return res.status(200).json({
        message: "Society profile updated successfully.",
        data: existingSociety,
      });
    }

    // Create and save the new society profile
    const newSociety = new SocProfile(req.body);
    await newSociety.save();
    res.status(201).json({
      message: "Society profile created successfully.",
      data: newSociety,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};



export const getSocProfile = async(req,res)=>{
    try {
      const societies = await SocProfile.find();
      res.status(200).json(societies);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
}



export const deleteSocProfile = async (req, res) => {
  try {
    const { registrationNumber } = req.params;

    // Find and delete the society profile by registration number
    const deletedSociety = await SocProfile.findOneAndDelete({
      registrationNumber,
    });

    if (!deletedSociety) {
      return res.status(404).json({ message: "Society not found" });
    }

    res.status(200).json({ message: "Society deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// end of society profile 


export const BillAmounts = async (req, res) => {
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


export const updatePrvDue = async(req,res)=>{
   const { billId, prevDue } = req.body;

   try {
     // Find the bill by ID and update the nested field data.prevDue
     const updatedBill = await Bills.findByIdAndUpdate(
       billId,
       { "data.prevDue": prevDue },
       { new: true }
     );

     if (!updatedBill) {
       return res.status(404).json({ message: "Bill not found" });
     }

     res.status(200).json({
       message: "data.prevDue updated successfully",
       updatedBill,
     });
   } catch (error) {
     res.status(500).json({
       message: "Error updating data.prevDue",
       error: error.message,
     });
   }
}

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

export const generateBills = async (req, res) => {
  console.log("inside generate Bills");
  try {
    const { memberId, memberName, billDetails } = req.body;

    const updateBill = await billGenerate.findOneAndUpdate(
      { memberId, memberName },
      {
        $push: {
          billDetails: { $each: billDetails },
        },
      },
      { new: true, upsert: true }
    );

    if (!updateBill) {
      return res.status(404).json({ message: "Member not found" });
    }

    res
      .status(201)
      .json({ success: true, message: "successfully bill generated " });
  } catch (error) {
    console.error("Error in bill generation:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getGeneratedBills = async (req, res) => {
  try {
    let result = await billGenerate.find({});

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("Error in get generate bills:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


import { MemberLedger } from "../Models/MemberProfile.model.js";

// Controller function to remove a billDetails entry by billNo
export const deleteBill = async (req, res) => {
  console.log("inside delete bills");
  try {
    const { memberId, billNo } = req.body; // get memberId and billNo from the request body
      console.log("inside delete bills",req.body);


    // Find the document with the memberId and remove the billDetails entry
    const result = await billGenerate.updateOne(
      { memberId }, // filter by memberId
      {
        $pull: { billDetails: { billNo } }, // pull the specific billDetails entry with the given billNo
      }
    );

     const result2 = await MemberLedger.updateOne(
       { memberId }, // filter by memberId
       {
         $pull: { ledger: { billNo } }, // pull the specific billDetails entry with the given billNo
       }
     );
           if (result2.matchedCount === 0) {
            console.log("member not found")
           }

           if (result2.modifiedCount === 0) {
            console.log("ledger not found")
           }
    if (result.modifiedCount > 0) {
      return res
        .status(200)
        .json({ message: "Bill details deleted successfully." });
    } else {
      return res
        .status(404)
        .json({ message: "No bill found with the given billNo." });
    }
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};



