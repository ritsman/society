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
} from "../controllers/masterHead.controller.js";

router.post("/masterHead", postMHead);
router.get("/getHead", getHead);
router.put("/updateHead/:id", updateHead);
router.delete("/deleteHead/:id", deleteHead);

router.post("/postLedger", postLedger);
router.get("/getLedger", getLedger);
router.put("/updateLedger/:id", updateLedger);
router.delete("/deleteLedger/:id", deleteLedger);

router.post("/postGroup", postGroup);
router.get("/getGroupsList", getGroupsList);
router.get("/getgroup", getGroups);
router.put("/updateGroup/:id", updateGroup);
router.delete("/deleteGroup/:id", deleteGroup);

export default router;
