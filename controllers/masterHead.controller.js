import MasterHead from "../Models/MasterHead.models.js";
import Ledger from "../Models/Ledger.models.js";
import groups from "../Models/Group.models.js";
import groupList from "../Models/GroupList.models.js";

export const postMHead = async (req, res) => {
  console.log("reached inside master head", req.body);

  try {
    req.body.map((item) => {
      const result = new MasterHead({
        Header: item.Header,
        Under: item.Under,
      });
      result.save();
    });

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

export const postGroup = async (req, res) => {
  console.log("reached inside postGroup controller", req.body);

  try {
    let result = new groups({
      GroupName: req.body.groupName,
      Under: req.body.under,
    });
    result.save();
    let result2 = new groupList({
      group: req.body.groupName,
    });
    result2.save();
    res.send("data sent successfully");
  } catch (error) {
    res.send(error);
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
