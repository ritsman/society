import MasterHead from "../Models/MasterHead.models.js";
import Ledger from "../Models/Ledger.models.js";
import groups from "../Models/Group.models.js";
import groupList from "../Models/GroupList.models.js";

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

// Ledger crud operations

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

export const getLedger = async (req, res) => {
  console.log("reached inside getLedger controller");

  try {
    let result = await Ledger.find({});
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

    const result = await Ledger.findByIdAndUpdate(id, {
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

    const result = await Ledger.findByIdAndDelete(id);

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
