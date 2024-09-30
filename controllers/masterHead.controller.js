// import MasterHead from "../Models/MasterHead.models.js";
import { MasterHead } from "./User.controller.js";
// import PartyLedger from "../Models/Ledger.models.js";
import { PartyLedger } from "./User.controller.js";
// import groups from "../Models/Group.models.js";
import { groups } from "./User.controller.js";

import groupList from "../Models/GroupList.models.js";

import { UnitHead } from "../Models/MasterHead.models.js";

// import { AccLedger } from "../Models/Ledger.models.js";
import { AccLedger } from "./User.controller.js";

// import { CashAccLedger } from "../Models/Ledger.models.js";
import { CashAccLedger } from "./User.controller.js";
// import { BankAccLedger } from "../Models/Ledger.models.js";
import { BankAccLedger } from "./User.controller.js";

// maintenance head crud operation

export const postMHead = async (req, res) => {
  console.log("reached inside master head", req.body);

  try {
    req.body.map(async (item) => {
      const { Header } = item;

      const update = {
        Header: item.Header,
        Under: item.Under,
      };

      try {
        await MasterHead.findOneAndUpdate({ Header }, update, {
          upsert: true,
          new: true,
        });
      } catch (error) {
        console.error("Error updating or creating Maintenance Head:", error);
      }
      // const result = new MasterHead({
      //   Header: item.Header,
      //   Under: item.Under,
      // });
      // result.save();
    });

    res.send("successfully sent to database");
  } catch (error) {
    res.send("error in sending data to database");
  }
};

export const getHead = async (req, res) => {
  try {
    let result = await MasterHead.find({});
    // let arr = [];
    // result.map((item) => arr.push(item.Header));
    res.send(result);
  } catch (error) {
    res.send("error in getting heads");
  }
};

export const updateHead = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    console.log("reached inside updateHead controllerssss", req.body, groupId);
    const updateData = {
      Header: req.body.Header,
      Under: req.body.Under,
    };

    const updatedGroup = await MasterHead.findByIdAndUpdate(
      groupId,
      updateData,
      {
        new: true,
      }
    );

    if (!updatedGroup) {
      return res.status(404).send("Head not found");
    }

    res.send("Head updated successfully");
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
};

export const deleteHead = async (req, res) => {
  console.log("reached inside deleteHead controller", req.params);

  try {
    const groupId = req.params.groupId; // Get the group ID from the request parameters

    // Check if the provided ID is a valid MongoDB ObjectId
    if (!groupId) {
      return res.status(400).send("Missing _id in request parameters");
    }

    const deletedHead = await MasterHead.findByIdAndDelete(groupId);

    if (!deletedHead) {
      return res.status(404).send("Head not found");
    }

    res.send("Head deleted successfully");
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
};

// Starting of Account Ledgers controller

export const postAccLedger = async (req, res) => {
  console.log("post Account ledger controller", req.body);

  const { name, ...rest } = req.body; // Extract the name and the rest of the fields

  try {
    // Find if a document with the given name exists
    let accountLedger = await AccLedger.findOne({ name });

    if (accountLedger) {
      // If it exists, update the existing document with the new data
      accountLedger = await AccLedger.findOneAndUpdate({ name }, rest, {
        new: true,
      });
    } else {
      // If it doesn't exist, create a new document
      accountLedger = new AccLedger({ name, ...rest });
      accountLedger = await accountLedger.save();
    }

    res.status(200).json(accountLedger);
  } catch (error) {
    console.error("Error posting account ledger:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request." });
  }
};

export const getAccLedger = async (req, res) => {
  try {
    const accountLedgers = await AccLedger.find();
    res.status(200).json(accountLedgers);
  } catch (error) {
    console.error("Error fetching account ledgers:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the account ledgers." });
  }
};

export const deleteAccLedger = async (req, res) => {
  const { ids } = req.body;
  console.log("inside Delete Account Ledger ", ids);
  try {
    ids.map(async (item) => {
      let result = await AccLedger.findByIdAndDelete(item);
      if (!result) {
        console.log("account not found", result);
      } else {
        console.log("account deleted successfully");
      }
    });

    res.send("Successfully deleted account from database");
  } catch (error) {
    res.status(500).send(error);
  }
};
import mongoose from "mongoose";
export const updateAccLedger = async (req, res) => {
  console.log("inside update account ledger");
  try {
    const { id } = req.params;
    const { shortName, accountType, narration } = req.body;

    // Validate the ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid account ledger ID" });
    }

    // Find the account ledger by ID and update it
    const updatedLedger = await AccLedger.findByIdAndUpdate(
      id,
      {
        shortName,
        accountType,
        narration,
      },
      { new: true, runValidators: true }
    );

    if (!updatedLedger) {
      return res.status(404).json({ message: "Account ledger not found" });
    }

    res.json(updatedLedger);
  } catch (error) {
    console.error("Error updating account ledger:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//Ending of  Account Ledgers controller

// Ledger crud operations

export const postLedger = async (req, res) => {
  console.log("postLedger controller reached", req.body);

  try {
    let result = new PartyLedger({
      data: req.body,
    });
    result.save();
    res.send("successfully sent data to database");
  } catch (error) {
    res.send(error);
  }
};

export const getLedger = async (req, res) => {
  console.log("reached inside getLedger controller");

  try {
    let result = await PartyLedger.find({});
    res.send(result);
  } catch (error) {
    res.send(error);
    console.log(error);
  }
};

export const updateLedger = async (req, res) => {
  try {
    const id = req.params.id;
    console.log("updateLedger controller reached", req.body, id);

    if (!id) {
      return res.status(400).send("Missing _id in request body");
    }

    const result = await PartyLedger.findByIdAndUpdate(id, {
      $set: { data: req.body },
    });

    if (!result) {
      return res.status(404).send("Ledger not found");
    } else {
      console.log(result);
      res.send("Successfully updated data in database");
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

export const deleteLedger = async (req, res) => {
  try {
    const id = req.params.id;

    console.log("deleteLedger controller reached", id);

    if (!id) {
      return res.status(400).send("Missing _id in request parameters");
    }

    const result = await PartyLedger.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).send("Ledger not found");
    } else {
      console.log("Deleted document:", result);
      res.send("Successfully deleted document from database");
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

// Group crud operations

export const postGroup = async (req, res) => {
  console.log("reached inside postGroup controller", req.body);

  try {
    let existing = await groups.findOne({ GroupName: req.body.groupName });

    if (!existing) {
      console.log("not found");
      let result = new groups({
        Code: req.body.code,
        GroupName: req.body.groupName,
        Under: req.body.under,
      });
      await result.save();
    } else {
      console.log(" found");

      existing.Under = req.body.under;
      await existing.save(); // Save the changes to the existing document
    }

    // Ensuring groupList is updated or created
    // await groupList.findOneAndUpdate(
    //   { group: req.body.groupName },
    //   { group: req.body.groupName },
    //   { new: true, upsert: true }
    // );

    res.send("Data sent successfully");
  } catch (error) {
    res.status(500).send(error); // Return appropriate error status
    console.log(error);
  }
};

export const getGroupsList = async (req, res) => {
  try {
    let result = await groupList.find({});

    res.send(result);
  } catch (error) {
    res.send(error);
    console.log(error);
  }
};

export const getGroups = async (req, res) => {
  try {
    let result = await groups.find({});
    res.send(result);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

export const updateGroup = async (req, res) => {
  console.log("reached inside updateGroup controller", req.body);

  try {
    const groupId = req.params.id;
    const updateData = {
      Code: req.body.code,
      GroupName: req.body.groupName,
      Under: req.body.under,
    };

    const updatedGroup = await groups.findByIdAndUpdate(groupId, updateData, {
      new: true,
    });

    if (!updatedGroup) {
      return res.status(404).send("Group not found");
    }

    res.send("Group updated successfully");
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
};

export const deleteGroup = async (req, res) => {
  console.log("reached inside deleteGroup controller", req.params);

  try {
    const groupId = req.params.id; // Get the group ID from the request parameters

    // Check if the provided ID is a valid MongoDB ObjectId
    if (!groupId) {
      return res.status(400).send("Missing _id in request parameters");
    }

    const deletedGroup = await groups.findByIdAndDelete(groupId);

    if (!deletedGroup) {
      return res.status(404).send("Group not found");
    }

    res.send("Group deleted successfully");
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
};

export const postUnitHead = async (req, res) => {
  console.log("inside postUnit Head");
  const { unitHead, code } = req.body;

  const update = {
    unitHead,
    code,
  };

  try {
    await UnitHead.findOneAndUpdate({ unitHead }, update, {
      upsert: true,
      new: true,
    });
    res.send("successfully created Unit Head");
  } catch (error) {
    console.error("Error updating or creating Unit Head:", error);
  }
};

export const getUnitHead = async (req, res) => {
  try {
    let result = await UnitHead.find({});
    res.send(result);
  } catch (error) {
    res.send(error);
    console.log(error);
  }
};

// starting of Cash Account Ledger
export const postCashAccLedger = async (req, res) => {
  try {
    const newLedger = new CashAccLedger(req.body);
    const savedLedger = await newLedger.save();
    res.status(201).json(savedLedger);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET controller
export const getCashAccLedgers = async (req, res) => {
  try {
    // Fetch ledgers and sort by date in ascending order
    const ledgers = await CashAccLedger.find().sort({ date: 1 });

    res.status(200).json(ledgers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ending of Cash Account Ledger

//starting of Bank Account Ledger
export const postBankAccLedger = async (req, res) => {
  try {
    const newLedger = new BankAccLedger(req.body);
    const savedLedger = await newLedger.save();
    res.status(201).json(savedLedger);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET controller
export const getBankAccLedger = async (req, res) => {
  try {
    // Fetch ledgers and sort by date in ascending order
    const ledgers = await BankAccLedger.find().sort({ date: 1 });

    res.status(200).json(ledgers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// ending of Bank Account Ledger
