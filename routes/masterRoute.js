import express from "express";

const router = express.Router();
import {
  postMHead,
  postGroup,
  getHead,
  getLedger,
  updateLedger,
  deleteLedger,
  getGroupsList,
  getGroups,
  postLedger,
  updateGroup,
  deleteGroup,
  updateHead,
  deleteHead,
  postUnitHead,
  getUnitHead,
} from "../controllers/masterHead.controller.js";
import {
  getBillMaster,
  postBillMaster,
} from "../controllers/billsMaster.controller.js";
import { postBillHeads } from "../controllers/BillHeads.controller.js";

router.post("/postBillHeads", postBillHeads);

router.post("/masterHead", postMHead);
router.get("/getHead", getHead);
router.put("/updateHead/:groupId", updateHead);
router.delete("/deleteHead/:groupId", deleteHead);

router.post("/postLedger", postLedger);
router.get("/getLedger", getLedger);
router.put("/updateLedger/:id", updateLedger);
router.delete("/deleteLedger/:id", deleteLedger);

router.post("/postGroup", postGroup);
router.get("/getGroupsList", getGroupsList);
router.get("/getgroup", getGroups);
router.put("/updateGroup/:id", updateGroup);
router.delete("/deleteGroup/:id", deleteGroup);

router.post("/postBillMaster", postBillMaster);
router.get("/getBillMaster", getBillMaster);

router.post("/postUnitHead", postUnitHead);
router.get("/getUnitHead", getUnitHead);

export default router;
